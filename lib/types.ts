/**
 * Core type definitions for the Simulation Teaching Lab
 */

// ============================================================================
// Student Profile Types
// ============================================================================

export interface StudentProfile {
  id: 'A' | 'B' | 'C';
  name: string;
  grade: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  cognitiveTraits: {
    abstractThinking: number;    // 1-5 scale
    operationalNeed: number;      // 1-5 scale
    questioningAbility: number;   // 1-5 scale
    confidence: number;           // 1-5 scale
  };
  behavioralPatterns: string[];   // e.g., ["追问本质", "善于类比"]
  languageStyle: string;          // e.g., "简洁自然，偶尔反问"
}

/**
 * Predefined student profiles for simulation
 */
export const STUDENT_PROFILES: Record<'A' | 'B' | 'C', StudentProfile> = {
  A: {
    id: 'A',
    name: '学生A',
    grade: '通用',
    level: 'high',
    description: '高认知水平学生，善于抽象思考，喜欢追问本质',
    cognitiveTraits: {
      abstractThinking: 5,
      operationalNeed: 2,
      questioningAbility: 5,
      confidence: 4,
    },
    behavioralPatterns: [
      '主动提出深层问题',
      '尝试建立知识间的联系',
      '对老师的解释进行批判性思考',
      '能够举一反三'
    ],
    languageStyle: '表达清晰，逻辑性强，会用"为什么"、"如果...会怎样"等句式'
  },
  B: {
    id: 'B',
    name: '学生B',
    grade: '通用',
    level: 'medium',
    description: '中等认知水平，存在迷思概念，需要具体操作辅助理解',
    cognitiveTraits: {
      abstractThinking: 3,
      operationalNeed: 4,
      questioningAbility: 3,
      confidence: 3,
    },
    behavioralPatterns: [
      '对抽象概念感到困惑',
      '需要通过实例理解',
      '可能表达出错误的前概念',
      '在引导下能够纠正理解'
    ],
    languageStyle: '表达略显犹豫，会说"我觉得是不是..."、"有点不太明白"'
  },
  C: {
    id: 'C',
    name: '学生C',
    grade: '通用',
    level: 'low',
    description: '学习困难学生，基础薄弱，容易产生挫败感，需要鼓励',
    cognitiveTraits: {
      abstractThinking: 1,
      operationalNeed: 5,
      questioningAbility: 2,
      confidence: 2,
    },
    behavioralPatterns: [
      '对问题感到畏惧',
      '回答简短或沉默',
      '需要多次重复才能理解',
      '对鼓励有积极反应'
    ],
    languageStyle: '语气不自信，常用"我不会"、"这个太难了"，回答简短'
  }
};

// ============================================================================
// API Configuration Types
// ============================================================================

export type AIProvider = 'deepseek' | 'openai' | 'custom';

export interface APIConfig {
  provider: AIProvider;
  baseURL: string;
  apiKey: string;
  model: string;
}

export interface EncryptedAPIConfig {
  provider: AIProvider;
  baseURL: string;
  apiKey: string; // Base64 encoded for basic obfuscation
  model: string;
  timestamp: number;
}

// ============================================================================
// Chat and Conversation Types
// ============================================================================

export type MessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp?: number;
}

// ============================================================================
// Research Session Types
// ============================================================================

export interface AnalysisResult {
  metrics: {
    cognitiveLoad: number;    // 1-10 scale
    engagement: number;        // 1-10 scale
    comprehension: number;     // 1-10 scale
  };
  analysis: string;
  suggestions: string[];
  keyMoments?: Array<{
    turn: number;
    content: string;
    insight: string;
  }>;
}

export interface ResearchSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  step: 1 | 2 | 3 | 4;
  data: {
    // Step 1: Topic Selection
    topic?: string;
    topicOptions?: string[];
    
    // Step 2: Literature Review
    literatureReview?: string;
    
    // Step 3: Simulation
    lessonPlan?: string;
    studentProfile?: StudentProfile;
    conversationHistory?: ChatMessage[];
    
    // Step 4: Analysis and Export
    analysisResult?: AnalysisResult;
    reportGenerated?: boolean;
  };
}

// ============================================================================
// LocalStorage Schema
// ============================================================================

/**
 * Keys used in localStorage for data persistence
 */
export const STORAGE_KEYS = {
  API_CONFIG: 'simulation-lab-api-config',
  RESEARCH_SESSIONS: 'simulation-lab-sessions',
  CURRENT_SESSION_ID: 'simulation-lab-current-session',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
