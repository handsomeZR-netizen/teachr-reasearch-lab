'use client';

/**
 * Case Detail Content Component
 * 
 * Client component for case detail page with Fork functionality
 * Requirements: 3.4, 3.5
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, GitFork, Heart, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResearchStore } from '@/lib/stores/use-research-store';
import type { CaseData } from '@/lib/mock-cases';

interface CaseDetailContentProps {
  caseData: CaseData | undefined;
}

export function CaseDetailContent({ caseData }: CaseDetailContentProps) {
  const router = useRouter();
  const { createSession } = useResearchStore();

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          案例未找到
        </h2>
        <Button onClick={() => router.push('/cases')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回案例馆
        </Button>
      </div>
    );
  }

  const handleFork = () => {
    // Create a new research session pre-filled with case data
    createSession({
      topic: caseData.researchTopic,
      literatureReview: caseData.literatureReview,
    });
    
    // Navigate to workshop with the new session
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

      {/* Case Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
        {/* Image */}
        <div className="relative w-full h-64 bg-primary-light">
          {caseData.imageUrl ? (
            <img
              src={caseData.imageUrl}
              alt={caseData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-primary/30" />
            </div>
          )}
        </div>

        {/* Header Content */}
        <div className="p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
              {caseData.subject}
            </span>
            <span className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full">
              {caseData.grade}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {caseData.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-text-secondary mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{caseData.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>{caseData.likes} 点赞</span>
            </div>
          </div>

          {/* Fork Button */}
          <Button
            onClick={handleFork}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <GitFork className="w-5 h-5 mr-2" />
            Fork 此研究
          </Button>
        </div>
      </div>

      {/* Case Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-8">
        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            研究概述
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {caseData.description}
          </p>
        </section>

        {/* Research Topic */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            研究题目
          </h2>
          <p className="text-text-primary leading-relaxed">
            {caseData.researchTopic}
          </p>
        </section>

        {/* Literature Review */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            文献综述
          </h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
            {caseData.literatureReview}
          </p>
        </section>

        {/* Teaching Approach */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            教学方法
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {caseData.teachingApproach}
          </p>
        </section>

        {/* Findings */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            研究发现
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {caseData.findings}
          </p>
        </section>
      </div>

      {/* Bottom Fork Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={handleFork}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <GitFork className="w-5 h-5 mr-2" />
          Fork 此研究到我的工坊
        </Button>
      </div>
    </>
  );
}
