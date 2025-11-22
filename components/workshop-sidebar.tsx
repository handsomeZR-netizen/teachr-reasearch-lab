/**
 * Workshop Sidebar Component
 * 
 * Provides step navigation for the 4-step research workflow:
 * 1. Topic Selection
 * 2. Literature Review
 * 3. Simulation
 * 4. Export Results
 * 
 * Mobile responsive: converts to bottom drawer on small screens
 * Requirements: 4.1, 10.4
 */

'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface WorkshopStep {
  id: 1 | 2 | 3 | 4;
  title: string;
  description: string;
}

const WORKSHOP_STEPS: WorkshopStep[] = [
  {
    id: 1,
    title: '选题向导',
    description: '确定研究题目',
  },
  {
    id: 2,
    title: '文献综述',
    description: '生成理论基础',
  },
  {
    id: 3,
    title: '模拟课堂',
    description: '与AI学生互动',
  },
  {
    id: 4,
    title: '成果导出',
    description: '分析与报告',
  },
];

interface WorkshopSidebarProps {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  onStepClick: (step: 1 | 2 | 3 | 4) => void;
}

export function WorkshopSidebar({
  currentStep,
  completedSteps,
  onStepClick,
}: WorkshopSidebarProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const currentStepData = WORKSHOP_STEPS.find(s => s.id === currentStep);

  const handleStepClick = (step: 1 | 2 | 3 | 4) => {
    onStepClick(step);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-border flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">研究工坊</h2>
          <p className="text-sm text-text-secondary mb-6">
            完成四个步骤，生成研究报告
          </p>
          
          <nav className="space-y-2">
            {WORKSHOP_STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isAccessible = step.id <= currentStep || isCompleted;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    'w-full text-left p-4 rounded-lg transition-all',
                    'flex items-start gap-3',
                    'hover:bg-primary-light',
                    isActive && 'bg-primary-light border-2 border-primary',
                    !isActive && !isCompleted && 'border border-border',
                    isCompleted && !isActive && 'border border-success/30 bg-success/5',
                    !isAccessible && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle
                        className={cn(
                          'w-5 h-5',
                          isActive ? 'text-primary' : 'text-text-secondary'
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-text-secondary">
                        步骤 {step.id}
                      </span>
                    </div>
                    <h3
                      className={cn(
                        'font-medium mb-1',
                        isActive ? 'text-primary' : 'text-text-primary'
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Drawer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg">
        {/* Drawer Toggle */}
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary-light transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">
              步骤 {currentStep}/4
            </span>
            <span className="font-semibold text-primary">
              {currentStepData?.title}
            </span>
          </div>
          {isMobileDrawerOpen ? (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        {/* Drawer Content */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            isMobileDrawerOpen ? 'max-h-96' : 'max-h-0'
          )}
        >
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {WORKSHOP_STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isAccessible = step.id <= currentStep || isCompleted;
              
              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all',
                    'flex items-center gap-3',
                    'hover:bg-primary-light',
                    isActive && 'bg-primary-light border-2 border-primary',
                    !isActive && !isCompleted && 'border border-border',
                    isCompleted && !isActive && 'border border-success/30 bg-success/5',
                    !isAccessible && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle
                        className={cn(
                          'w-5 h-5',
                          isActive ? 'text-primary' : 'text-text-secondary'
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-secondary">
                        步骤 {step.id}
                      </span>
                      <h3
                        className={cn(
                          'font-medium text-sm',
                          isActive ? 'text-primary' : 'text-text-primary'
                        )}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-[60px]" />
    </>
  );
}
