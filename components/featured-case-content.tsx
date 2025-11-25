'use client';

/**
 * Featured Case Content Component
 * 精选案例内容组件 - 展示完整的研究过程
 */

import { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FEATURED_CASE, type ResearchPhase, type ResearchContent } from '@/lib/featured-case';
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

function ContentBlock({ item, index }: { item: ResearchContent; index: number }) {
  const getIcon = () => {
    switch (item.type) {
      case 'tool': return <Code className="w-4 h-4 text-blue-500" />;
      case 'prompt': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'finding': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'iteration': return <RefreshCw className="w-4 h-4 text-orange-500" />;
      case 'dialogue': return <MessageSquare className="w-4 h-4 text-primary" />;
      default: return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    if (item.highlight) return 'bg-primary/5 border-primary/20';
    switch (item.type) {
      case 'tool': return 'bg-blue-50 border-blue-100';
      case 'finding': return 'bg-green-50 border-green-100';
      case 'iteration': return 'bg-orange-50 border-orange-100';
      case 'dialogue': return 'bg-primary-light border-primary/10';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl p-4 border ${getBgColor()} mb-4`}
    >
      {item.title && (
        <div className="flex items-center gap-2 mb-2">
          {getIcon()}
          <h4 className="font-semibold text-text-primary">{item.title}</h4>
        </div>
      )}
      <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
        {item.content}
      </p>
      {item.subItems && item.subItems.length > 0 && (
        <ul className="mt-3 space-y-2">
          {item.subItems.map((subItem, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{subItem}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function PhaseSection({ phase, isExpanded, onToggle }: { 
  phase: ResearchPhase; 
  isExpanded: boolean;
  onToggle: () => void;
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
              {phase.content.map((item, index) => (
                <ContentBlock key={index} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FeaturedCaseContent() {
  const router = useRouter();
  const { createSession } = useResearchStore();
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase-1']));
  const [liked, setLiked] = useState(false);

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

  const expandAll = () => {
    setExpandedPhases(new Set(FEATURED_CASE.phases.map(p => p.id)));
  };

  const collapseAll = () => {
    setExpandedPhases(new Set());
  };

  const handleFork = () => {
    createSession({
      topic: FEATURED_CASE.researchTopic,
      literatureReview: '基于认知脚手架理论的教学研究...',
    });
    router.push('/workshop');
  };

  return (
    <>
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
        className="bg-gradient-to-br from-primary via-primary/90 to-teal-500 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/20" />
        </div>
        
        <div className="relative z-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm rounded-full">
              {FEATURED_CASE.subject}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-sm rounded-full">
              {FEATURED_CASE.grade}
            </span>
            <span className="px-3 py-1 bg-yellow-400/90 text-yellow-900 text-sm rounded-full font-medium">
              ⭐ 精选案例
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            {FEATURED_CASE.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            {FEATURED_CASE.subtitle}
          </p>
          <p className="text-white/80 mb-8 max-w-2xl">
            {FEATURED_CASE.description}
          </p>

          {/* Meta & Actions */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <User className="w-5 h-5" />
              <span>{FEATURED_CASE.author}</span>
            </div>
            <button 
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-400 text-red-400' : ''}`} />
              <span>{FEATURED_CASE.likes + (liked ? 1 : 0)} 点赞</span>
            </button>
            <Button
              onClick={handleFork}
              className="bg-white text-primary hover:bg-white/90"
            >
              <GitFork className="w-4 h-4 mr-2" />
              Fork 此研究
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Research Process Timeline */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">研究过程</h2>
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
          {FEATURED_CASE.phases.map((phase, index) => (
            <motion.div
              key={phase.id}
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
    </>
  );
}
