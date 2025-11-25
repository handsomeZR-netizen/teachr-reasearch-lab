'use client';

/**
 * Full Case Content Component
 * 完整案例内容展示组件 - 展示案例.md的完整研究过程
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  GitFork, 
  Heart, 
  User, 
  Lightbulb,
  Search,
  RefreshCw,
  Users,
  MessageSquare,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BookOpen,
  Code,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FULL_CASE_DATA, type CasePhase, type SubSection, type ContentSection } from '@/lib/full-case-data';
import { useResearchStore } from '@/lib/stores/use-research-store';

const iconMap: Record<string, React.ReactNode> = {
  lightbulb: <Lightbulb className="w-5 h-5" />,
  search: <Search className="w-5 h-5" />,
  iteration: <RefreshCw className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  message: <MessageSquare className="w-5 h-5" />,
  refresh: <RefreshCw className="w-5 h-5" />,
  chart: <BarChart3 className="w-5 h-5" />,
};

// 复制按钮组件
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
      title="复制"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500" />
      )}
    </button>
  );
}

// 内容块组件
function ContentBlock({ item, index }: { item: ContentSection; index: number }) {
  const getIcon = () => {
    switch (item.type) {
      case 'tool': return <Code className="w-4 h-4 text-blue-500" />;
      case 'prompt': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'finding': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'iteration': return <RefreshCw className="w-4 h-4 text-orange-500" />;
      case 'dialogue': return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'problem': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    if (item.highlight) return 'bg-primary/5 border-primary/20';
    switch (item.type) {
      case 'tool': return 'bg-blue-50 border-blue-100';
      case 'prompt': return 'bg-purple-50 border-purple-100';
      case 'finding': return 'bg-green-50 border-green-100';
      case 'iteration': return 'bg-orange-50 border-orange-100';
      case 'dialogue': return 'bg-primary-light border-primary/10';
      case 'problem': return 'bg-red-50 border-red-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'tool': return '工具';
      case 'prompt': return '提示词';
      case 'finding': return '发现';
      case 'iteration': return '迭代';
      case 'dialogue': return '画像';
      case 'problem': return '问题';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl p-4 border ${getBgColor()} mb-4`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {item.title && (
            <div className="flex items-center gap-2 mb-2">
              {getIcon()}
              <h4 className="font-semibold text-text-primary">{item.title}</h4>
              {getTypeLabel() && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 text-gray-600">
                  {getTypeLabel()}
                </span>
              )}
            </div>
          )}
          {item.content && (
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap text-sm">
              {item.content}
            </p>
          )}
        </div>
        {(item.type === 'prompt' || item.type === 'tool') && item.content && (
          <CopyButton text={item.content} />
        )}
      </div>
      
      {item.subItems && item.subItems.length > 0 && (
        <ul className="mt-3 space-y-2">
          {item.subItems.map((subItem, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="whitespace-pre-wrap">{subItem}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}


// 子章节组件
function SubSectionBlock({ subSection, isExpanded, onToggle }: { 
  subSection: SubSection; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h4 className="text-base font-semibold text-text-primary text-left">
          {subSection.title}
        </h4>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border">
              {subSection.content.map((item, index) => (
                <ContentBlock key={index} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 主章节组件
function PhaseSection({ phase, isExpanded, onToggle, expandedSubSections, toggleSubSection }: { 
  phase: CasePhase; 
  isExpanded: boolean;
  onToggle: () => void;
  expandedSubSections: Set<string>;
  toggleSubSection: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {iconMap[phase.icon] || <BookOpen className="w-5 h-5" />}
          </div>
          <h3 className="text-lg font-bold text-text-primary text-left">
            {phase.title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-border">
              {/* 直接内容 */}
              {phase.content && phase.content.map((item, index) => (
                <ContentBlock key={index} item={item} index={index} />
              ))}
              
              {/* 子章节 */}
              {phase.subSections && phase.subSections.map((subSection) => (
                <SubSectionBlock
                  key={subSection.id}
                  subSection={subSection}
                  isExpanded={expandedSubSections.has(subSection.id)}
                  onToggle={() => toggleSubSection(subSection.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 侧边导航组件
function SideNavigation({ 
  phases, 
  expandedPhases, 
  onPhaseClick,
  isOpen,
  onClose
}: { 
  phases: CasePhase[];
  expandedPhases: Set<string>;
  onPhaseClick: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* 导航面板 */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:hidden overflow-y-auto`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-text-primary">目录导航</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => {
                onPhaseClick(phase.id);
                onClose();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                expandedPhases.has(phase.id) 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-gray-100 text-text-secondary'
              }`}
            >
              <span className="mr-2">{index + 1}.</span>
              {phase.title.replace(/^[一二三四五六七八九十]+、/, '')}
            </button>
          ))}
        </nav>
      </motion.div>
      
      {/* 桌面端固定导航 */}
      <div className="hidden lg:block fixed left-4 top-32 w-56 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
        <div className="p-3 border-b border-border bg-gray-50">
          <h3 className="font-bold text-text-primary text-sm">目录导航</h3>
        </div>
        <nav className="p-2 max-h-[60vh] overflow-y-auto">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              onClick={() => onPhaseClick(phase.id)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-xs transition-colors ${
                expandedPhases.has(phase.id) 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-gray-100 text-text-secondary'
              }`}
            >
              {phase.title}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}


// 主组件
export function FullCaseContent() {
  const router = useRouter();
  const { createSession } = useResearchStore();
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase-1']));
  const [expandedSubSections, setExpandedSubSections] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const toggleSubSection = (subSectionId: string) => {
    setExpandedSubSections(prev => {
      const next = new Set(prev);
      if (next.has(subSectionId)) {
        next.delete(subSectionId);
      } else {
        next.add(subSectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedPhases(new Set(FULL_CASE_DATA.phases.map(p => p.id)));
    const allSubSections = FULL_CASE_DATA.phases.flatMap(p => p.subSections?.map(s => s.id) || []);
    setExpandedSubSections(new Set(allSubSections));
  };

  const collapseAll = () => {
    setExpandedPhases(new Set());
    setExpandedSubSections(new Set());
  };

  const scrollToPhase = (phaseId: string) => {
    // 先展开该章节
    setExpandedPhases(prev => new Set([...prev, phaseId]));
    // 滚动到该章节
    setTimeout(() => {
      phaseRefs.current[phaseId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFork = () => {
    createSession({
      topic: FULL_CASE_DATA.title,
      literatureReview: '基于认知脚手架理论的教学研究...',
    });
    router.push('/workshop');
  };

  return (
    <div className="relative">
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setNavOpen(true)}
        className="fixed left-4 bottom-4 z-30 lg:hidden bg-primary text-white p-3 rounded-full shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 侧边导航 */}
      <SideNavigation
        phases={FULL_CASE_DATA.phases}
        expandedPhases={expandedPhases}
        onPhaseClick={scrollToPhase}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      {/* 主内容区 */}
      <div className="lg:ml-64">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/cases')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回案例馆
        </Button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary via-primary/90 to-teal-500 rounded-3xl p-6 md:p-10 text-white mb-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-4 border-white" />
            <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border-2 border-white" />
          </div>
          
          <div className="relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm rounded-full">
                {FULL_CASE_DATA.subject}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm rounded-full">
                {FULL_CASE_DATA.grade}
              </span>
              <span className="px-3 py-1 bg-yellow-400/90 text-yellow-900 text-sm rounded-full font-medium">
                ⭐ 完整案例
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl font-bold mb-2 leading-tight">
              {FULL_CASE_DATA.title}
            </h1>
            <p className="text-base md:text-lg opacity-90 mb-4">
              {FULL_CASE_DATA.subtitle}
            </p>
            <p className="text-white/80 mb-6 text-sm md:text-base">
              {FULL_CASE_DATA.description}
            </p>

            {/* Meta & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <User className="w-4 h-4" />
                <span>{FULL_CASE_DATA.author}</span>
              </div>
              <button 
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-400 text-red-400' : ''}`} />
                <span>{FULL_CASE_DATA.likes + (liked ? 1 : 0)} 点赞</span>
              </button>
              <Button
                onClick={handleFork}
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
              >
                <GitFork className="w-4 h-4 mr-2" />
                Fork 此研究
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">研究过程详解</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              全部展开
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              全部收起
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />
          
          <div className="space-y-4">
            {FULL_CASE_DATA.phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                ref={el => { phaseRefs.current[phase.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="md:pl-12 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-5 w-[46px] h-[46px] rounded-full bg-white border-4 border-primary hidden md:flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                
                <PhaseSection
                  phase={phase}
                  isExpanded={expandedPhases.has(phase.id)}
                  onToggle={() => togglePhase(phase.id)}
                  expandedSubSections={expandedSubSections}
                  toggleSubSection={toggleSubSection}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-white rounded-2xl shadow-sm border border-border p-8"
        >
          <h3 className="text-xl font-bold text-text-primary mb-3">
            想要开始你自己的教学研究吗？
          </h3>
          <p className="text-text-secondary mb-6">
            Fork 此案例作为起点，或从零开始创建你的研究项目
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleFork}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <GitFork className="w-5 h-5 mr-2" />
              Fork 此研究到我的工坊
            </Button>
            <Button
              onClick={() => router.push('/workshop')}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary-light"
            >
              从零开始研究
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
