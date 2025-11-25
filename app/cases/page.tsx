'use client';

/**
 * Case Library Page
 * 
 * Displays teaching research cases with subject filtering
 * Requirements: 3.1, 3.2
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { CaseCard } from '@/components/case-card';
import { OnboardingTour } from '@/components/onboarding-tour';
import { casesTourSteps } from '@/lib/onboarding-steps';
import { MOCK_CASES } from '@/lib/mock-cases';

// Subject filter options
const SUBJECTS = [
  { id: 'all', label: '全部' },
  { id: 'math', label: '数学' },
  { id: 'physics', label: '物理' },
  { id: 'chinese', label: '语文' },
  { id: 'english', label: '英语' },
] as const;

type SubjectId = typeof SUBJECTS[number]['id'];

export default function CasesPage() {
  const [activeSubject, setActiveSubject] = useState<SubjectId>('all');

  // Filter cases based on selected subject
  const filteredCases = useMemo(() => {
    if (activeSubject === 'all') {
      return MOCK_CASES;
    }
    return MOCK_CASES.filter(c => c.subjectId === activeSubject);
  }, [activeSubject]);

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      {/* Onboarding Tour */}
      <OnboardingTour steps={casesTourSteps} tourId="cases-page" />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-2 sm:mb-3">
            案例馆
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary">
            浏览多学科教学研究案例，获取灵感和参考范式
          </p>
        </motion.div>

        {/* Subject Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div id="subject-filters" className="flex flex-wrap gap-1 sm:gap-2 border-b border-border overflow-x-auto">
            {SUBJECTS.map((subject, index) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSubject(subject.id)}
                className={`
                  px-4 sm:px-6 py-2 sm:py-3 font-medium transition-all duration-200
                  border-b-2 -mb-px whitespace-nowrap text-sm sm:text-base
                  ${
                    activeSubject === subject.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }
                `}
              >
                {subject.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cases Grid - Single column on mobile, responsive grid on larger screens */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredCases.length > 0 ? (
              filteredCases.map((caseData, index) => (
                <motion.div
                  key={caseData.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="case-card"
                >
                  <CaseCard
                    id={caseData.id}
                    title={caseData.title}
                    description={caseData.description}
                    subject={caseData.subject}
                    grade={caseData.grade}
                    author={caseData.author}
                    likes={caseData.likes}
                    imageUrl={caseData.imageUrl}
                    isFeatured={caseData.isFeatured}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 text-text-secondary"
              >
                暂无案例
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
