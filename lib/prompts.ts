/**
 * Prompt Engineering Module
 * 
 * This module contains all prompt templates and builders for the AI service.
 * It implements sophisticated prompt engineering to ensure accurate student
 * role-playing and effective research assistance.
 * 
 * Requirements: 4.2, 5.2, 6.3, 7.2, 7.3, 8.2, 8.3
 */

import type { StudentProfile, ChatMessage } from './types';

// ============================================================================
// Student System Prompt Builder
// ============================================================================

/**
 * Configuration for student system prompt generation
 */
export interface StudentPromptConfig {
  temperature: number;
  max_tokens: number;
}

/**
 * Get recommended configuration for student simulation
 */
export function getStudentPromptConfig(profile: StudentProfile): StudentPromptConfig {
  // Higher cognitive level students can have more varied responses
  const baseTemp = profile.level === 'high' ? 0.8 : profile.level === 'medium' ? 0.7 : 0.6;
  
  return {
    temperature: baseTemp,
    max_tokens: 150, // Keep responses concise like real students
  };
}

/**
 * Build system prompt for student role-playing
 * 
 * This is the core function that configures the AI to accurately simulate
 * a student with specific cognitive characteristics and behavioral patterns.
 * 
 * @param profile - Student profile to simulate
 * @param lessonPlan - Current lesson plan context
 * @param context - Optional additional context (e.g., previous conversation summary)
 * @returns Complete system prompt for the AI
 */
export function buildStudentSystemPrompt(
  profile: StudentProfile,
  lessonPlan: string,
  context?: string
): string {
  // Map cognitive level to Chinese description
  const levelDescription = {
    high: '高',
    medium: '中等',
    low: '较低'
  }[profile.level];
  
  // Build behavioral patterns section
  const behavioralPatternsText = profile.behavioralPatterns
    .map(pattern => `- ${pattern}`)
    .join('\n');
  
  // Build level-specific interaction rules
  const levelSpecificRules = getLevelSpecificRules(profile.level);
  
  return `# 角色设定
你现在是一名${profile.grade}的学生，名叫${profile.name}。

## 认知特征
- 认知水平：${levelDescription}
- 抽象思维能力：${profile.cognitiveTraits.abstractThinking}/5
- 具体操作依赖：${profile.cognitiveTraits.operationalNeed}/5
- 提问能力：${profile.cognitiveTraits.questioningAbility}/5
- 学习自信心：${profile.cognitiveTraits.confidence}/5

## 行为模式
${behavioralPatternsText}

## 语言风格
${profile.languageStyle}

## 当前课堂情境
老师正在教授以下内容：
${lessonPlan}

${context ? `## 对话背景\n${context}` : ''}

## 互动规则（重要）
1. **保持角色一致性**：始终以${profile.name}的身份和认知水平回应
2. **自然对话节奏**：不要一次性展示所有理解，要根据老师的引导逐步反应
3. **真实学生表现**：
${levelSpecificRules}
4. **回复长度**：每次回复控制在1-3句话，模拟真实课堂对话
5. **情感表达**：可以用括号描述动作或表情，如"(皱眉思考)"、"(眼睛一亮)"

## 禁止行为
- 不要直接说出标准答案
- 不要使用成人化的学术语言
- 不要一次性理解所有内容
- 不要脱离${profile.name}的认知水平
- 不要表现出超出该认知水平的理解能力`;
}

/**
 * Get level-specific interaction rules
 */
function getLevelSpecificRules(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return `   - 可以主动提出深层问题
   - 尝试挑战老师的解释
   - 展示举一反三的能力
   - 建立知识间的联系`;
    
    case 'medium':
      return `   - 对抽象概念表现出困惑
   - 需要具体例子才能理解
   - 可能表达错误的前概念
   - 在引导下能够纠正理解`;
    
    case 'low':
      return `   - 表现出畏难情绪
   - 回答要简短或沉默
   - 需要老师多次鼓励才参与
   - 对鼓励有积极反应`;
  }
}

// ============================================================================
// Topic Generation Prompt
// ============================================================================

/**
 * Generate prompt for research topic recommendations
 * 
 * @param input - Teacher's description of teaching challenges
 * @returns Prompt for AI to generate topic suggestions
 */
export function buildTopicGenerationPrompt(input: string): string {
  return `你是一位资深的教育研究专家。一位教师向你描述了以下教学困惑：

"${input}"

请基于这个困惑，推荐3个具有学术研究价值的研究题目。要求：
1. 每个题目要具体、可操作
2. 符合教育学术规范
3. 适合一线教师开展实践研究
4. 涵盖不同研究角度（如认知、情感、策略等）

请以JSON数组格式返回，每个题目包含title和rationale字段：
[
  {
    "title": "研究题目1",
    "rationale": "选题理由（50字内）"
  },
  {
    "title": "研究题目2",
    "rationale": "选题理由（50字内）"
  },
  {
    "title": "研究题目3",
    "rationale": "选题理由（50字内）"
  }
]`;
}

/**
 * Configuration for topic generation
 */
export const TOPIC_GENERATION_CONFIG = {
  temperature: 0.7,
  max_tokens: 1500,
  stream: false,
} as const;

// ============================================================================
// Literature Review Prompt
// ============================================================================

/**
 * Generate prompt for literature review creation
 * 
 * @param topic - Research topic
 * @returns Prompt for AI to generate literature review
 */
export function buildLiteratureReviewPrompt(topic: string): string {
  return `你是一位教育学研究者。请针对以下研究题目撰写一篇500-800字的文献综述草稿：

研究题目：${topic}

要求：
1. 包含"理论基础"和"应用现状"两个部分
2. 引用3-5个相关理论或研究（可以是虚构但合理的引用）
3. 语言学术但易懂，适合一线教师阅读
4. 指出当前研究的不足或空白，为本研究提供切入点

请直接输出综述内容，不需要额外格式。`;
}

/**
 * Configuration for literature review generation
 */
export const LITERATURE_REVIEW_CONFIG = {
  temperature: 0.7,
  max_tokens: 1500,
  stream: false,
} as const;

// ============================================================================
// Conversation Analysis Prompt
// ============================================================================

/**
 * Generate prompt for conversation analysis
 * 
 * @param conversationHistory - Complete conversation history
 * @returns Prompt for AI to analyze teaching effectiveness
 */
export function buildAnalysisPrompt(conversationHistory: ChatMessage[]): string {
  const formattedHistory = conversationHistory
    .map(m => `${m.role === 'user' ? '老师' : '学生'}：${m.content}`)
    .join('\n');
  
  return `你是一位教学评估专家。请分析以下模拟课堂对话，评估教学效果：

对话记录：
${formattedHistory}

请从以下三个维度进行评分（1-10分）并给出分析：

1. **认知负荷 (Cognitive Load)**：学生是否感到信息过载或理解困难（分数越低表示负荷越合理）
2. **参与度 (Engagement)**：学生的主动性和互动积极性（分数越高表示参与度越好）
3. **理解深度 (Comprehension)**：学生对核心概念的掌握程度（分数越高表示理解越深入）

请以JSON格式返回：
{
  "metrics": {
    "cognitiveLoad": 7,
    "engagement": 8,
    "comprehension": 6
  },
  "analysis": "整体分析（200字内）",
  "suggestions": [
    "改进建议1",
    "改进建议2",
    "改进建议3"
  ],
  "keyMoments": [
    {
      "turn": 3,
      "content": "学生的某句话",
      "insight": "这里反映了什么问题"
    }
  ]
}`;
}

/**
 * Configuration for conversation analysis
 */
export const ANALYSIS_CONFIG = {
  temperature: 0.3, // Lower temperature for more consistent analysis
  max_tokens: 1000,
  stream: false,
} as const;

// ============================================================================
// Improvement Suggestions Prompt
// ============================================================================

/**
 * Generate prompt for improvement suggestions
 * 
 * @param lessonPlan - Current lesson plan
 * @param recentMessages - Recent conversation messages showing issues
 * @returns Prompt for AI to provide improvement suggestions
 */
export function buildImprovementPrompt(
  lessonPlan: string,
  recentMessages: ChatMessage[]
): string {
  const formattedRecent = recentMessages
    .slice(-6) // Last 6 messages to show context
    .map(m => `${m.role === 'user' ? '老师' : '学生'}：${m.content}`)
    .join('\n');
  
  return `你是一位教学设计顾问。教师在模拟课堂中遇到了困难，请分析并给出改进建议。

当前教案：
${lessonPlan}

最近的对话（显示问题所在）：
${formattedRecent}

请分析：
1. 当前教学策略存在什么问题？
2. 学生的反应说明了什么？
3. 如何调整教案或教学方法？

请给出3条具体的、可操作的改进建议，每条建议包含"问题诊断"和"调整方案"。`;
}

/**
 * Configuration for improvement suggestions
 */
export const IMPROVEMENT_CONFIG = {
  temperature: 0.7,
  max_tokens: 1000,
  stream: false,
} as const;

// ============================================================================
// Prompt Template Constants (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use buildTopicGenerationPrompt instead
 */
export const TOPIC_GENERATION_PROMPT = buildTopicGenerationPrompt;

/**
 * @deprecated Use buildLiteratureReviewPrompt instead
 */
export const LITERATURE_REVIEW_PROMPT = buildLiteratureReviewPrompt;

/**
 * @deprecated Use buildAnalysisPrompt instead
 */
export const ANALYSIS_PROMPT = buildAnalysisPrompt;

/**
 * @deprecated Use buildImprovementPrompt instead
 */
export const IMPROVEMENT_PROMPT = buildImprovementPrompt;
