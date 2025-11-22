/**
 * Onboarding Tour Steps Configuration
 * 
 * Defines guided tours for different pages
 */

import { BookOpen, MessageSquare, BarChart3, Download, Settings, Lightbulb } from 'lucide-react';
import type { TourStep } from '@/components/onboarding-tour';

// Workshop page tour
export const workshopTourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '#workshop-sidebar',
    title: '欢迎来到研究工坊！',
    content: '这里是您进行教学研究的完整工作流程。让我们快速了解一下四个步骤。',
    icon: <Lightbulb />,
    position: 'right',
    showSkip: true,
  },
  {
    id: 'step1',
    target: '#step-1',
    title: '步骤 1：选题向导',
    content: '输入您的年级、学科和教学困惑，AI 会为您生成 3 个研究题目供选择。',
    icon: <BookOpen />,
    position: 'right',
  },
  {
    id: 'step2',
    target: '#step-2',
    title: '步骤 2：文献综述',
    content: '选定题目后，AI 会自动生成 500-800 字的文献综述草稿，您可以编辑修改。',
    icon: <BookOpen />,
    position: 'right',
  },
  {
    id: 'step3',
    target: '#step-3',
    title: '步骤 3：模拟课堂',
    content: '输入教案，选择学生画像（A/B/C），与 AI 扮演的学生进行真实对话，测试教学效果。',
    icon: <MessageSquare />,
    position: 'right',
  },
  {
    id: 'step4',
    target: '#step-4',
    title: '步骤 4：成果导出',
    content: '查看雷达图分析，阅读 AI 生成的报告，一键导出完整的 PDF 研究报告。',
    icon: <BarChart3 />,
    position: 'right',
  },
  {
    id: 'api-config',
    target: '#api-config-button',
    title: '配置 API',
    content: '点击这里配置您的 AI API 密钥（推荐使用 DeepSeek，性价比最高）。',
    icon: <Settings />,
    position: 'bottom',
  },
];

// Home page tour
export const homePageSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '#hero-section',
    title: '欢迎使用模拟教学研究实验室！',
    content: '这是一个面向教师的 AI 辅助科研工具，帮助您完成从选题到成果的完整研究流程。',
    icon: <Lightbulb />,
    position: 'bottom',
  },
  {
    id: 'cases',
    target: '#cases-link',
    title: '案例馆',
    content: '浏览其他教师的研究案例，按学科筛选，可以 Fork 到您的工坊继续研究。',
    icon: <BookOpen />,
    position: 'bottom',
  },
  {
    id: 'workshop',
    target: '#workshop-link',
    title: '研究工坊',
    content: '开始您的研究之旅！四步向导帮助您完成选题、文献、模拟、导出的完整流程。',
    icon: <MessageSquare />,
    position: 'bottom',
  },
];

// Cases page tour
export const casesTourSteps: TourStep[] = [
  {
    id: 'filters',
    target: '#subject-filters',
    title: '学科筛选',
    content: '点击学科标签，快速筛选您感兴趣的案例。',
    icon: <BookOpen />,
    position: 'bottom',
  },
  {
    id: 'case-card',
    target: '.case-card:first-child',
    title: '案例卡片',
    content: '每个案例包含标题、学科标签、作者信息。点击查看详情。',
    icon: <BookOpen />,
    position: 'bottom',
  },
];
