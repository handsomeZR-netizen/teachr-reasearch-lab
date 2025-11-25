/**
 * Mock case data for the case library
 * Requirements: 3.2, 3.3
 */

export interface CaseData {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectId: 'math' | 'physics' | 'chinese' | 'english';
  grade: string;
  author: string;
  likes: number;
  imageUrl?: string;
  content: string;
  researchTopic: string;
  literatureReview: string;
  teachingApproach: string;
  findings: string;
  isFeatured?: boolean; // 是否为精选完整案例
}

export const MOCK_CASES: CaseData[] = [
  // Math Cases
  {
    id: 'math-001',
    title: 'GenAI驱动下小学数学"认知脚手架"构建与迭代验证——基于《圆的认识》的生成式模拟教学研究',
    description: '通过生成式AI模拟不同认知水平学生，探索《圆的认识》教学中认知脚手架的构建与动态调整策略，验证脚手架的有效性。',
    subject: '数学',
    subjectId: 'math',
    grade: '小学五年级',
    author: '陈老师',
    likes: 128,
    content: '本研究聚焦小学五年级学生在学习《圆的认识》时的认知脚手架构建...',
    researchTopic: 'GenAI驱动下小学数学"认知脚手架"构建与迭代验证——基于《圆的认识》的生成式模拟教学研究',
    literatureReview: '认知脚手架理论源于维果茨基的最近发展区理论，Wood等人(1976)首次提出教学支架概念...',
    teachingApproach: '采用"概念脚手架→程序脚手架→策略脚手架→元认知脚手架"的四维教学框架...',
    findings: '研究发现，通过两轮模拟教学迭代，优化后的认知脚手架使B类学生理解度提升45%，C类学生参与度提升60%...',
    isFeatured: true, // 精选完整案例
  },
  {
    id: 'math-002',
    title: '立体几何空间想象力培养实验',
    description: '针对学生空间想象薄弱问题，设计分层教学方案，通过AI模拟验证不同认知水平学生的学习路径。',
    subject: '数学',
    subjectId: 'math',
    grade: '高二',
    author: '李老师',
    likes: 95,
    content: '空间想象力是立体几何学习的关键能力...',
    researchTopic: '基于认知差异的立体几何空间想象力分层培养策略',
    literatureReview: '空间能力的发展具有阶段性特征，Piaget的认知发展理论表明...',
    teachingApproach: '对A类学生采用抽象推理训练，对C类学生使用实物模型辅助...',
    findings: '模拟教学显示，C类学生在使用3D模型后，空间定位准确率从35%提升至72%...',
  },
  {
    id: 'math-003',
    title: '数列递推关系的迷思概念纠正',
    description: '识别学生在数列学习中的典型错误前概念，通过对话式教学引导学生自主纠错。',
    subject: '数学',
    subjectId: 'math',
    grade: '高二',
    author: '王老师',
    likes: 76,
    content: '数列递推关系是学生容易产生迷思概念的知识点...',
    researchTopic: '高中数列教学中学生迷思概念的识别与转化策略',
    literatureReview: '迷思概念（misconception）是指学生在学习前形成的错误认知框架...',
    teachingApproach: '采用苏格拉底式提问法，通过反例引导学生发现矛盾...',
    findings: 'AI模拟的B类学生在第3轮对话后成功识别自身错误，理解度从4分提升至8分...',
  },

  // Physics Cases
  {
    id: 'physics-001',
    title: '牛顿第三定律的前概念转化研究',
    description: '针对"力的作用是单向的"这一典型前概念，设计认知冲突教学方案，通过模拟验证有效性。',
    subject: '物理',
    subjectId: 'physics',
    grade: '初三',
    author: '赵老师',
    likes: 142,
    content: '学生普遍存在"推力大于拉力"的错误认知...',
    researchTopic: '初中物理牛顿第三定律教学中前概念的识别与转化',
    literatureReview: 'Driver等人(1985)的研究表明，学生的前概念具有顽固性...',
    teachingApproach: '通过"预测-观察-解释"(POE)策略制造认知冲突...',
    findings: '模拟教学中，C类学生在经历3次认知冲突后，概念转化成功率达65%...',
  },
  {
    id: 'physics-002',
    title: '电路分析中的系统思维培养',
    description: '探索如何帮助学生从"局部元件"思维转向"整体回路"思维，提升电路分析能力。',
    subject: '物理',
    subjectId: 'physics',
    grade: '初三',
    author: '钱老师',
    likes: 88,
    content: '电路分析需要系统思维，但学生往往只关注单个元件...',
    researchTopic: '初中电路教学中学生系统思维的培养策略研究',
    literatureReview: '系统思维是科学素养的重要组成部分，Hmelo-Silver(2004)指出...',
    teachingApproach: '采用"整体→局部→整体"的螺旋式教学结构...',
    findings: 'A类学生能快速建立系统模型，B类学生需要图示辅助，C类学生需要分步引导...',
  },

  // Chinese Cases
  {
    id: 'chinese-001',
    title: '古诗意象理解的认知层次研究',
    description: '分析不同认知水平学生对古诗意象的理解差异，设计分层教学策略提升鉴赏能力。',
    subject: '语文',
    subjectId: 'chinese',
    grade: '高一',
    author: '孙老师',
    likes: 156,
    content: '古诗意象是古诗鉴赏的核心，但学生理解层次差异显著...',
    researchTopic: '高中古诗教学中学生意象理解的认知层次与教学策略',
    literatureReview: '意象理解涉及文化背景、情感体验和想象能力，叶圣陶先生强调...',
    teachingApproach: 'A类学生引导深层文化解读，B类学生提供背景知识支架，C类学生从具体画面入手...',
    findings: '模拟显示，分层教学后，各层次学生的意象理解深度均提升2-3个等级...',
  },
  {
    id: 'chinese-002',
    title: '议论文论证逻辑的思维训练',
    description: '针对学生论证不严密问题，通过对话式教学培养逻辑思维，AI模拟验证训练效果。',
    subject: '语文',
    subjectId: 'chinese',
    grade: '高二',
    author: '周老师',
    likes: 103,
    content: '议论文写作中，学生常出现论据与论点脱节的问题...',
    researchTopic: '高中议论文教学中学生论证逻辑思维的培养路径',
    literatureReview: '论证能力是批判性思维的核心，Toulmin模型提供了论证结构框架...',
    teachingApproach: '采用"论点拆解→论据筛选→逻辑链构建"三步法...',
    findings: 'B类学生在经过5轮对话训练后，论证完整性从45%提升至78%...',
  },
  {
    id: 'chinese-003',
    title: '文言文断句能力的阶梯培养',
    description: '基于语感和语法双路径，设计文言文断句教学方案，适配不同认知水平学生。',
    subject: '语文',
    subjectId: 'chinese',
    grade: '初三',
    author: '吴老师',
    likes: 91,
    content: '文言文断句是学生的普遍难点，需要语感和语法知识的结合...',
    researchTopic: '初中文言文断句教学的认知路径与分层策略',
    literatureReview: '断句能力涉及语感培养和语法规则掌握，王力先生提出...',
    teachingApproach: 'A类学生侧重语法规则推理，C类学生强化朗读语感训练...',
    findings: '模拟教学表明，双路径教学使C类学生断句准确率提升55%...',
  },

  // English Cases
  {
    id: 'english-001',
    title: '英语时态概念的认知建构研究',
    description: '探索中国学生英语时态学习的认知障碍，设计基于母语迁移理论的教学干预方案。',
    subject: '英语',
    subjectId: 'english',
    grade: '初二',
    author: '郑老师',
    likes: 134,
    content: '英语时态系统与汉语差异显著，学生常出现时态混用问题...',
    researchTopic: '初中英语时态教学中母语负迁移的识别与应对策略',
    literatureReview: 'Lado(1957)的对比分析假说指出，母语与目标语的差异是学习难点...',
    teachingApproach: '采用"对比→理解→应用"模式，显性教学时态的时间概念...',
    findings: 'AI模拟的B类学生在对比教学后，时态准确率从42%提升至73%...',
  },
  {
    id: 'english-002',
    title: '英语阅读理解的提问策略优化',
    description: '研究不同类型提问对学生阅读理解深度的影响，通过模拟对话验证最优提问序列。',
    subject: '英语',
    subjectId: 'english',
    grade: '高一',
    author: '冯老师',
    likes: 118,
    content: '教师提问质量直接影响学生阅读理解的深度...',
    researchTopic: '高中英语阅读教学中教师提问策略的优化研究',
    literatureReview: 'Bloom分类学将认知层次分为记忆、理解、应用、分析、评价、创造...',
    teachingApproach: '设计"事实性→推理性→评价性"的递进式提问链...',
    findings: '模拟显示，递进式提问使A类学生深层理解率提升30%，B类学生提升45%...',
  },
  {
    id: 'english-003',
    title: '英语口语焦虑的对话式缓解策略',
    description: '针对学生口语焦虑问题，设计低压力对话环境，通过AI模拟测试不同鼓励策略的效果。',
    subject: '英语',
    subjectId: 'english',
    grade: '初一',
    author: '陈老师',
    likes: 97,
    content: '口语焦虑是中国学生英语学习的主要情感障碍...',
    researchTopic: '初中英语口语教学中学生焦虑情绪的识别与缓解',
    literatureReview: 'Horwitz(1986)的外语课堂焦虑量表(FLCAS)揭示了焦虑的多维性...',
    teachingApproach: '采用"接纳→鼓励→逐步挑战"的支持性对话策略...',
    findings: 'C类学生在低压力环境下，口语参与度从15%提升至62%，焦虑指数下降40%...',
  },
];
