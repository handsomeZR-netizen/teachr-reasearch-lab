/**
 * Onboarding Tour Component
 * 
 * Provides an interactive guided tour for first-time users
 * using Framer Motion for smooth animations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  icon?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showSkip?: boolean;
}

interface OnboardingTourProps {
  steps: TourStep[];
  tourId: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ steps, tourId, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Check if tour has been completed before
  useEffect(() => {
    const completed = localStorage.getItem(`tour-completed-${tourId}`);
    if (!completed) {
      // Small delay before showing tour
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [tourId]);

  // Update target element position
  useEffect(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, steps, isVisible]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-completed-${tourId}`, 'true');
    onSkip?.();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-completed-${tourId}`, 'true');
    onComplete?.();
  };

  if (!isVisible || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  const position = step.position || 'bottom';

  // Calculate card position based on target element
  const getCardPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 20;
    const cardWidth = 360;
    const cardHeight = 200;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top - cardHeight - padding;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.left - cardWidth - padding;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.right + padding;
        break;
    }

    // Keep card within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - cardHeight - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - cardWidth - padding));

    return { top: `${top}px`, left: `${left}px` };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with spotlight effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={handleSkip}
          />

          {/* Spotlight on target element */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[9999] pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                boxShadow: '0 0 0 4px rgba(0, 102, 102, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.7)',
                borderRadius: '12px',
              }}
            />
          )}

          {/* Tour card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-[10000] bg-white rounded-2xl shadow-2xl p-6 max-w-sm"
            style={getCardPosition()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {step.icon && (
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-primary text-2xl"
                  >
                    {step.icon}
                  </motion.div>
                )}
                <h3 className="text-lg font-semibold text-text-primary">
                  {step.title}
                </h3>
              </div>
              {step.showSkip !== false && (
                <button
                  onClick={handleSkip}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary mb-6 leading-relaxed"
            >
              {step.content}
            </motion.p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'bg-primary w-6'
                        : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一步
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      下一步
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      完成
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-text-secondary text-center mt-4"
            >
              {currentStep + 1} / {steps.length}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to trigger tour
export function useOnboardingTour(tourId: string) {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`tour-completed-${tourId}`);
    setShouldShowTour(!completed);
  }, [tourId]);

  const resetTour = () => {
    localStorage.removeItem(`tour-completed-${tourId}`);
    setShouldShowTour(true);
  };

  return { shouldShowTour, resetTour };
}
