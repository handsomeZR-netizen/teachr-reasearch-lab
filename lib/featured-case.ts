/**
 * Featured Case Data - 精选案例：模拟教学研究故事
 * 完整展示一个教学研究的全过程
 */

export interface ResearchPhase {
  id: string;
  title: string;
  icon: string;
  content: ResearchContent[];
}

export interface ResearchContent {
  type: 'text' | 'prompt' | 'tool' | 'finding' | 'iteration' | 'dialogue';
  title?: string;
  content: string;
  subItems?: string[];
  highlight?: boolean;
}

export interface FeaturedCaseData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subject: string;
  grade: string;
  author: string;
  likes: number;
  researchTopic: string;
  phases: ResearchPhase[];
}

export const FEATURED_CASE: FeaturedCaseData = {
  id: 'featured-001',
  title: 'GenAI驱动下小学数学"认知脚手架"构建与迭代验证',
  subtitle: '基于《圆的认识》的生成式模拟教学研究',
  description: '一个完整的模拟教学研究故事，展示如何利用AI工具完成从选题到成果的科研闭环。',
  subject: '数学',
  grade: '小学五年级',
  author: '研究团队',
  likes: 256,
  researchTopic: 'GenAI驱动下小学数学"认知脚手架"构建与迭代验证——基于《圆的认识》的生成式模拟教学研究',
  phases: [
    {
      id: 'phase-1',
      title: '一、确定主题',
      icon: 'lightbulb',
      content: [
        {
          type: 'text',
          title: '研究主题',
          content: 'GenAI驱动下小学数学"认知脚手架"构建与迭代验证——基于《圆的认识》的生成式模拟教学研究',
          highlight: true
        }
      ]
    },
    {
      id: 'phase-2',
      title: '二、研究过程',
      icon: 'search',
      content: [
        {
          type: 'text',
          title: '1. 文献综述',
          content: '使用多种AI工具进行系统性文献梳理'
        },
        {
          type: 'tool',
          title: '秘塔 — 认知脚手架的理论源流与发展脉络',
          content: '提示词：',
          subItems: [
            '以"认知脚手架"为关键词，写一下文献综述，梳理与其相关的如理论基础、发展历史、主要策略等',
            '以"认知脚手架"或"教学支架"为关键词，写一篇关于认知脚手架的理论源流与发展脉络的文献综述'
          ]
        },
        {
          type: 'tool',
          title: '秘塔 — 生成式AI在教育模拟中的应用现状',
          content: '提示词：',
          subItems: [
            '以"生成式AI"或"GenAI"和"教育"为关键词，写一篇生成式AI在教育模拟中的应用现状的文献综述',
            '以"生成式AI"或"GenAI"和"数学教育"为关键词，写一篇生成式AI在数学教育模拟中的应用现状的文献综述'
          ]
        },
        {
          type: 'tool',
          title: 'Deepseek — 研究空白确认：本研究的立足点与创新空间',
          content: '提示词：结合认知脚手架的理论源流与发展脉络文献综述与生成式AI在教育模拟中的应用现状文献综述写一下关于GenAI驱动下小学数学"认知脚手架"构建与迭代验证——基于《圆的认识》的生成式模拟教学研究的可能立足点与创新空间'
        }
      ]
    },
    {
      id: 'phase-3',
      title: '2. 模拟实施与迭代过程',
      icon: 'iteration',
      content: [
        {
          type: 'tool',
          title: 'Deepseek — 教学设计案例分析',
          content: '通过问题链追问，系统分析15篇《圆的认识》教学案例',
          subItems: [
            '核心概念的教学突破点：找出名师们如何引导学生理解"圆心"、"半径"、"直径"',
            '教学环节的亮点设计：按"情境导入-探究活动-巩固练习-总结拓展"提取创意设计',
            '数学思想方法的渗透：分析归纳思想、极限思想、对称思想等的渗透方式',
            '学习难点的破解策略：总结"一中同长"、半径直径关系等难点的突破策略',
            '教学语言的精妙之处：收集精妙提问语、过渡语和小结语'
          ]
        },
        {
          type: 'iteration',
          title: '教学设计口令迭代',
          content: '经过多轮优化，形成完整的认知脚手架教学设计',
          subItems: [
            '第一版：基础框架设计，明确四大脚手架维度（概念、程序、策略、元认知）',
            '第二版：细化教师活动与学生活动',
            '第三版：按脚手架类型、策略应用、设计意图详细展开',
            '第四版：统一教师活动和学生活动，形成最终版本'
          ]
        }
      ]
    },
    {
      id: 'phase-4',
      title: '3. 三水平学生画像',
      icon: 'users',
      content: [
        {
          type: 'dialogue',
          title: '学生A（高水平）',
          content: '前概念：熟知生活中的圆，已直观理解"圆心定位置"、"半径定大小"。学习风格：善于抽象思考和提问，能主动建构知识联系。深刻问题：会追问本质，如"为什么圆有无数条对称轴？"'
        },
        {
          type: 'dialogue',
          title: '学生B（中等水平）',
          content: '迷思概念：可能混淆半径与直径，认为"直径就是两条半径"；或认为画得不标准的圆不是圆。学习支持：需要通过大量动手操作来澄清概念，教师需提供清晰的步骤指导和对比辨析。'
        },
        {
          type: 'dialogue',
          title: '学生C（困难学生）',
          content: '具体困难：使用圆规存在物理困难，难以理解抽象的圆心、半径概念。情感态度：容易产生挫败感和焦虑，认为"我学不会数学"，需要鼓励和成功体验。'
        }
      ]
    },
    {
      id: 'phase-5',
      title: '4. 模拟课堂生成',
      icon: 'message',
      content: [
        {
          type: 'iteration',
          title: '口令迭代优化过程',
          content: '经过5个版本的迭代，解决了多个关键问题',
          subItems: [
            '第一版：发现问题 — 生成的课堂分解严重，教师对学生回应机械',
            '第二版：教师要求详细版 — 发现问题：师生互动内容简洁，不能生动模拟真实课堂',
            '第三版：禁止分节版 — 尝试让对话更连贯',
            '第四版：500+对话记录版 — 发现问题：AI深度思考显示由于篇幅限制无法生成',
            '第五版（定版）：分环节生成，确保对话自然、连续、有深度'
          ]
        },
        {
          type: 'finding',
          title: '关键发现',
          content: '转折点：互动文本在Deepseek中的多次试验中出现了数据重复或无法深入的状况，转向ChatGPT继续优化教学设计，以便进行二轮模拟教学互动文本数据提取。',
          highlight: true
        }
      ]
    },
    {
      id: 'phase-6',
      title: '5. 教学设计优化与二轮验证',
      icon: 'refresh',
      content: [
        {
          type: 'tool',
          title: 'ChatGPT — 教学设计优化',
          content: '基于第一轮模拟结果，进行系统性优化',
          subItems: [
            '第1遍：评估原教学设计中认知脚手架哪些是无效的，确定动态调整方向',
            '第2遍：生成调整后的教学设计，确保符合《义务教育数学课程标准（2022年版）》',
            '第3遍：按脚手架类型、策略应用、教师活动、学生活动、设计意图详细展开',
            '第4遍：统一教师活动和学生活动，形成最终优化版本'
          ]
        },
        {
          type: 'tool',
          title: 'Deepseek — 二轮模拟教学',
          content: '使用优化后的教学设计，重新进行三水平学生的模拟教学，生成新的互动文本数据'
        }
      ]
    },
    {
      id: 'phase-7',
      title: '6. 对比研究与结论',
      icon: 'chart',
      content: [
        {
          type: 'finding',
          title: '两轮互动文本对比研究',
          content: '从认知负荷、参与度、理解度三个维度对比分析两个教学设计下的学生学习状态',
          subItems: [
            '认知负荷评估：内在认知负荷、外在认知负荷、关联认知负荷',
            '参与度评估：行为参与、情感参与、认知参与',
            '理解度评估：区分"表面理解"与"本质理解"'
          ]
        },
        {
          type: 'finding',
          title: '研究结论',
          content: '通过ABC三类学生的分析，验证了两轮教学设计脚手架整体的有效性，为认知脚手架的动态调整提供了实证依据。',
          highlight: true
        }
      ]
    }
  ]
};
