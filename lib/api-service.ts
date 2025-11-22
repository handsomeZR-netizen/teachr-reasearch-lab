/**
 * AI Service Layer - Handles all API interactions with AI providers
 * 
 * This service provides:
 * - Configurable AI provider support (DeepSeek, OpenAI, custom)
 * - Error handling with retry logic
 * - Streaming chat responses
 * - Specialized methods for different research tasks
 * 
 * Requirements: 1.4, 2.1, 7.2, 7.5, 12.1, 12.2, 12.4
 */

import type { APIConfig, ChatMessage, AnalysisResult } from './types';

// ============================================================================
// Error Types and Handling
// ============================================================================

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_KEY_INVALID = 'API_KEY_INVALID',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  STORAGE_QUOTA = 'STORAGE_QUOTA',
  ABORT_ERROR = 'ABORT_ERROR',
}

export interface APIError {
  type: ErrorType;
  message: string;
  userAction: string;
  retryable: boolean;
  originalError?: any;
}

/**
 * Error handler configurations
 */
const ERROR_HANDLERS: Record<ErrorType, Omit<APIError, 'originalError'>> = {
  NETWORK_ERROR: {
    type: ErrorType.NETWORK_ERROR,
    message: '网络连接失败，请检查您的网络设置',
    userAction: '点击重试或稍后再试',
    retryable: true,
  },
  API_KEY_INVALID: {
    type: ErrorType.API_KEY_INVALID,
    message: 'API Key 无效或已过期',
    userAction: '请前往设置页面检查您的 API 配置',
    retryable: false,
  },
  RATE_LIMIT: {
    type: ErrorType.RATE_LIMIT,
    message: 'API 调用次数已达上限',
    userAction: '请稍后再试，或配置您自己的 API Key 以解除限制',
    retryable: true,
  },
  INVALID_RESPONSE: {
    type: ErrorType.INVALID_RESPONSE,
    message: 'AI 返回了无效的响应格式',
    userAction: '请重试，如果问题持续请联系支持',
    retryable: true,
  },
  STORAGE_QUOTA: {
    type: ErrorType.STORAGE_QUOTA,
    message: '浏览器存储空间不足',
    userAction: '请删除一些旧的研究会话或清理浏览器缓存',
    retryable: false,
  },
  ABORT_ERROR: {
    type: ErrorType.ABORT_ERROR,
    message: '请求已取消',
    userAction: '操作已中止',
    retryable: false,
  },
};

/**
 * Create an APIError from a caught error
 */
function createAPIError(error: any): APIError {
  let errorHandler: Omit<APIError, 'originalError'>;
  
  // Check for abort error
  if (error.name === 'AbortError') {
    errorHandler = ERROR_HANDLERS.ABORT_ERROR;
  }
  // Check for network errors
  else if (error.message?.includes('fetch') || error.message?.includes('network')) {
    errorHandler = ERROR_HANDLERS.NETWORK_ERROR;
  }
  // Check for authentication errors
  else if (error.status === 401 || error.status === 403) {
    errorHandler = ERROR_HANDLERS.API_KEY_INVALID;
  }
  // Check for rate limiting
  else if (error.status === 429) {
    errorHandler = ERROR_HANDLERS.RATE_LIMIT;
  }
  // Default to invalid response
  else {
    errorHandler = ERROR_HANDLERS.INVALID_RESPONSE;
  }
  
  return {
    ...errorHandler,
    originalError: error,
  };
}

// ============================================================================
// Retry Logic
// ============================================================================

interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Retry wrapper for API calls with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxRetries, delayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if error is not retryable
      const apiError = createAPIError(error);
      if (!apiError.retryable || attempt === maxRetries) {
        throw apiError;
      }
      
      // Wait before retrying with exponential backoff
      const delay = delayMs * Math.pow(backoffMultiplier, attempt);
      console.log(`[API Service] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw createAPIError(lastError);
}

// ============================================================================
// API Key Encryption Utilities
// ============================================================================

/**
 * Encode API key for basic obfuscation in localStorage
 */
export function encodeAPIKey(key: string): string {
  try {
    return btoa(key);
  } catch (error) {
    console.error('[API Service] Failed to encode API key:', error);
    return key;
  }
}

/**
 * Decode API key from localStorage
 */
export function decodeAPIKey(encoded: string): string {
  try {
    return atob(encoded);
  } catch (error) {
    console.error('[API Service] Failed to decode API key:', error);
    return encoded;
  }
}

// ============================================================================
// AI Service Class
// ============================================================================

export class AIService {
  private config: APIConfig;
  private abortController: AbortController | null = null;
  
  constructor(config: APIConfig) {
    this.config = config;
  }
  
  /**
   * Update the service configuration
   */
  updateConfig(config: APIConfig): void {
    this.config = config;
  }
  
  /**
   * Get current configuration
   */
  getConfig(): APIConfig {
    return { ...this.config };
  }
  
  /**
   * Cancel any ongoing requests
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Validate configuration before making API calls
   */
  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw createAPIError({
        status: 401,
        message: 'API Key is required',
      });
    }
    
    if (!this.config.baseURL) {
      throw createAPIError({
        message: 'Base URL is required',
      });
    }
  }
  
  /**
   * Make a request to the AI provider API
   */
  private async makeRequest(
    endpoint: string,
    body: any,
    signal?: AbortSignal
  ): Promise<Response> {
    this.validateConfig();
    
    const url = `${this.config.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
    
    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        message: await response.text().catch(() => response.statusText),
      };
    }
    
    return response;
  }
  
  /**
   * Parse streaming response (SSE format)
   */
  private async *parseStreamResponse(
    response: Response
  ): AsyncGenerator<string, void, unknown> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }
    
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          
          // Skip empty lines and comments
          if (!trimmed || trimmed.startsWith(':')) continue;
          
          // Parse SSE data lines
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            
            // Check for stream end
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                yield content;
              }
            } catch (error) {
              console.warn('[API Service] Failed to parse SSE data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  /**
   * Chat with streaming support
   * 
   * @param messages - Conversation history
   * @param onStream - Callback for streaming chunks
   * @param options - Additional options (temperature, max_tokens, etc.)
   * @returns Complete response text
   */
  async chat(
    messages: ChatMessage[],
    onStream?: (chunk: string) => void,
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    // Create new abort controller for this request
    this.abortController = new AbortController();
    
    const {
      temperature = 0.8,
      max_tokens = 2000,
      stream = !!onStream,
    } = options;
    
    try {
      return await withRetry(async () => {
        const response = await this.makeRequest(
          '/chat/completions',
          {
            model: this.config.model,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            temperature,
            max_tokens,
            stream,
          },
          this.abortController?.signal
        );
        
        // Handle streaming response
        if (stream && onStream) {
          let fullContent = '';
          
          for await (const chunk of this.parseStreamResponse(response)) {
            fullContent += chunk;
            onStream(chunk);
          }
          
          return fullContent;
        }
        
        // Handle non-streaming response
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      });
    } finally {
      this.abortController = null;
    }
  }
}

// Import prompt templates from dedicated module
import {
  buildTopicGenerationPrompt,
  buildLiteratureReviewPrompt,
  buildAnalysisPrompt,
  buildImprovementPrompt,
  TOPIC_GENERATION_CONFIG,
  LITERATURE_REVIEW_CONFIG,
  ANALYSIS_CONFIG,
  IMPROVEMENT_CONFIG,
} from './prompts';

// ============================================================================
// Specialized AI Methods
// ============================================================================

/**
 * Extended AIService class with specialized methods
 */
export class AIServiceExtended extends AIService {
  /**
   * Generate research topic recommendations
   * 
   * @param input - Teacher's teaching challenge description
   * @returns Array of topic suggestions with rationales
   */
  async generateTopics(input: string): Promise<Array<{ title: string; rationale: string }>> {
    const prompt = buildTopicGenerationPrompt(input);
    
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      undefined,
      TOPIC_GENERATION_CONFIG
    );
    
    try {
      // Try to parse JSON response
      const topics = JSON.parse(response);
      
      if (Array.isArray(topics) && topics.length > 0) {
        return topics;
      }
      
      // Fallback: extract topics from text
      return this.extractTopicsFromText(response);
    } catch (error) {
      console.warn('[API Service] Failed to parse topics JSON, extracting from text');
      return this.extractTopicsFromText(response);
    }
  }
  
  /**
   * Extract topics from non-JSON text response
   */
  private extractTopicsFromText(text: string): Array<{ title: string; rationale: string }> {
    const topics: Array<{ title: string; rationale: string }> = [];
    const lines = text.split('\n');
    
    let currentTitle = '';
    let currentRationale = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for numbered topics
      if (/^\d+[.、]/.test(trimmed)) {
        if (currentTitle) {
          topics.push({ title: currentTitle, rationale: currentRationale });
        }
        currentTitle = trimmed.replace(/^\d+[.、]\s*/, '');
        currentRationale = '';
      } else if (trimmed && currentTitle) {
        currentRationale += (currentRationale ? ' ' : '') + trimmed;
      }
    }
    
    if (currentTitle) {
      topics.push({ title: currentTitle, rationale: currentRationale });
    }
    
    // Ensure we have at least 3 topics
    while (topics.length < 3) {
      topics.push({
        title: `研究题目 ${topics.length + 1}`,
        rationale: '请重新生成',
      });
    }
    
    return topics.slice(0, 3);
  }
  
  /**
   * Generate literature review for a research topic
   * 
   * @param topic - Research topic
   * @returns Literature review text (500-800 words)
   */
  async generateLiteratureReview(topic: string): Promise<string> {
    const prompt = buildLiteratureReviewPrompt(topic);
    
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      undefined,
      LITERATURE_REVIEW_CONFIG
    );
    
    return response.trim();
  }
  
  /**
   * Analyze conversation and generate metrics
   * 
   * @param history - Complete conversation history
   * @returns Analysis result with metrics and suggestions
   */
  async analyzeConversation(history: ChatMessage[]): Promise<AnalysisResult> {
    const prompt = buildAnalysisPrompt(history);
    
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      undefined,
      ANALYSIS_CONFIG
    );
    
    try {
      // Try to parse JSON response
      const analysis = JSON.parse(response);
      
      return {
        metrics: {
          cognitiveLoad: analysis.metrics?.cognitiveLoad || 5,
          engagement: analysis.metrics?.engagement || 5,
          comprehension: analysis.metrics?.comprehension || 5,
        },
        analysis: analysis.analysis || '分析生成中...',
        suggestions: analysis.suggestions || [],
        keyMoments: analysis.keyMoments || [],
      };
    } catch (error) {
      console.warn('[API Service] Failed to parse analysis JSON');
      
      // Return default analysis
      return {
        metrics: {
          cognitiveLoad: 5,
          engagement: 5,
          comprehension: 5,
        },
        analysis: response,
        suggestions: ['请重新生成分析'],
        keyMoments: [],
      };
    }
  }
  
  /**
   * Generate improvement suggestions based on recent conversation
   * 
   * @param lessonPlan - Current lesson plan
   * @param recentMessages - Recent conversation messages
   * @returns Improvement suggestions text
   */
  async generateImprovementSuggestions(
    lessonPlan: string,
    recentMessages: ChatMessage[]
  ): Promise<string> {
    const prompt = buildImprovementPrompt(lessonPlan, recentMessages);
    
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      undefined,
      IMPROVEMENT_CONFIG
    );
    
    return response.trim();
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create an AI service instance with the given configuration
 */
export function createAIService(config: APIConfig): AIServiceExtended {
  return new AIServiceExtended(config);
}

/**
 * Default export for convenience
 */
export default AIServiceExtended;
