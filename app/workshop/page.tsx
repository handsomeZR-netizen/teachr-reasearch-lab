/**
 * Workshop Page - Main research workflow interface
 * 
 * Provides a 4-step guided workflow for teachers to:
 * 1. Select research topic
 * 2. Generate literature review
 * 3. Simulate classroom teaching
 * 4. Export analysis and report
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { WorkshopSidebar } from '@/components/workshop-sidebar';
import { Step1Topic } from '@/components/step-panels/step1-topic';
import { Step2Literature } from '@/components/step-panels/step2-literature';
import { Step3Simulation } from '@/components/step-panels/step3-simulation';
import { Step4Export } from '@/components/step-panels/step4-export';
import { OnboardingTour } from '@/components/onboarding-tour';
import { workshopTourSteps } from '@/lib/onboarding-steps';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Home, HelpCircle } from 'lucide-react';
import { useResearchStore, useCurrentSession } from '@/lib/stores/use-research-store';
import { useConfigStore } from '@/lib/stores/use-config-store';
import { createAIService } from '@/lib/api-service';
import { buildStudentSystemPrompt, getStudentPromptConfig } from '@/lib/prompts';
import { cachedAPICall, CACHE_KEYS, CACHE_TTL } from '@/lib/api-cache';
import { useAbortControllerMap } from '@/lib/hooks/use-abort-controller';
import type { StudentProfile, ChatMessage, AnalysisResult } from '@/lib/types';

export default function WorkshopPage() {
  const router = useRouter();
  const currentSession = useCurrentSession();
  const sessions = useResearchStore((state) => state.sessions);
  const {
    createSession,
    loadSession,
    setTopic,
    setLiteratureReview,
    setLessonPlan,
    setStudentProfile,
    addMessage,
    setStep,
    updateSession,
    setAnalysisResult,
    markReportGenerated,
  } = useResearchStore();
  
  const apiConfig = useConfigStore((state) => state.apiConfig);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [currentStepState, setCurrentStepState] = useState<1 | 2 | 3 | 4>(1);
  
  // Abort controller for managing API request cancellation
  const { getController, abort: abortRequest } = useAbortControllerMap();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string>('');
  const [isLoadingImprovement, setIsLoadingImprovement] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Initialize: Load saved session or create new one
  useEffect(() => {
    if (isInitialized) return;
    
    // Check if there's a current session in the store
    if (!currentSession) {
      // Try to load the most recent session
      if (sessions.length > 0) {
        const mostRecentSession = [...sessions].sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        })[0];
        
        console.log('[Workshop] Loading most recent session:', mostRecentSession.id);
        loadSession(mostRecentSession.id);
      } else {
        // Create a new session if none exists
        console.log('[Workshop] Creating new session');
        createSession();
      }
    }
    
    setIsInitialized(true);
  }, [isInitialized, currentSession, sessions, loadSession, createSession]);

  // Restore session state when current session changes
  useEffect(() => {
    if (!currentSession || !isInitialized) return;
    
    // Restore session state
    setCurrentStepState(currentSession.step);
    
    // Determine completed steps based on session data
    const completed: number[] = [];
    if (currentSession.data.topic) completed.push(1);
    if (currentSession.data.literatureReview) completed.push(2);
    if (currentSession.data.conversationHistory && currentSession.data.conversationHistory.length > 0) {
      completed.push(3);
    }
    if (currentSession.data.analysisResult) completed.push(4);
    
    setCompletedSteps(completed);
    
    console.log('[Workshop] Session state restored:', {
      id: currentSession.id,
      step: currentSession.step,
      completed,
    });
  }, [currentSession, isInitialized]);

  // Auto-save notification (Zustand persist middleware handles actual saving)
  useEffect(() => {
    if (currentSession && isInitialized) {
      console.log('[Workshop] Session auto-saved at step', currentStepState);
    }
  }, [currentStepState, currentSession, isInitialized]);

  // Cleanup: Abort pending API requests on unmount
  useEffect(() => {
    return () => {
      abortRequest('topics');
      abortRequest('literature');
      abortRequest('analysis');
      console.log('[Workshop] Aborted pending API requests on unmount');
    };
  }, [abortRequest]);

  // Handle step navigation
  const handleStepClick = (step: 1 | 2 | 3 | 4) => {
    setCurrentStepState(step);
    setStep(step);
  };

  // Handle topic generation with caching
  const handleGenerateTopics = async (
    grade: string,
    subject: string,
    challenge: string
  ): Promise<Array<{ title: string; rationale: string }>> => {
    if (!apiConfig) {
      throw new Error('请先配置 API 设置');
    }

    const input = `年级：${grade}\n学科：${subject}\n教学困惑：${challenge}`;
    
    try {
      // Use cached API call with abort signal
      const controller = getController('topics');
      const aiService = createAIService(apiConfig);
      
      const topics = await cachedAPICall(
        CACHE_KEYS.TOPICS,
        { grade, subject, challenge },
        async () => {
          // Pass abort signal to AI service if needed
          return await aiService.generateTopics(input);
        },
        CACHE_TTL.TOPICS
      );
      
      // Save input data to session
      updateSession({
        topicOptions: topics.map(t => t.title),
      });
      
      return topics;
    } catch (error: any) {
      console.error('[Workshop] Generate topics error:', error);
      throw new Error(error.message || '生成题目失败');
    }
  };

  // Handle topic selection
  const handleSelectTopic = (topic: string, options: Array<{ title: string; rationale: string }>) => {
    setTopic(topic, options.map(o => o.title));
    
    // Mark step 1 as completed and auto-save
    if (!completedSteps.includes(1)) {
      setCompletedSteps([...completedSteps, 1]);
    }
    
    console.log('[Workshop] Topic selected, session auto-saved');
  };

  // Handle literature review generation with caching
  const handleGenerateLiteratureReview = async (topic: string): Promise<string> => {
    if (!apiConfig) {
      throw new Error('请先配置 API 设置');
    }
    
    try {
      // Use cached API call
      const controller = getController('literature');
      const aiService = createAIService(apiConfig);
      
      const review = await cachedAPICall(
        CACHE_KEYS.LITERATURE,
        { topic },
        async () => {
          return await aiService.generateLiteratureReview(topic);
        },
        CACHE_TTL.LITERATURE
      );
      
      return review;
    } catch (error: any) {
      console.error('[Workshop] Generate literature review error:', error);
      throw new Error(error.message || '生成文献综述失败');
    }
  };

  // Handle literature review save
  const handleSaveLiteratureReview = (review: string) => {
    setLiteratureReview(review);
    
    // Mark step 2 as completed and auto-save
    if (!completedSteps.includes(2)) {
      setCompletedSteps([...completedSteps, 2]);
    }
    
    console.log('[Workshop] Literature review saved, session auto-saved');
  };

  // Handle lesson plan change
  const handleLessonPlanChange = (plan: string) => {
    setLessonPlan(plan);
  };

  // Handle student profile selection
  const handleProfileSelect = (profile: StudentProfile) => {
    setStudentProfile(profile);
  };

  // Handle sending message in simulation
  const handleSendMessage = async (content: string) => {
    if (!apiConfig) {
      console.error('[Workshop] API config not set');
      return;
    }

    if (!currentSession?.data.studentProfile) {
      console.error('[Workshop] No student profile selected');
      return;
    }

    if (!currentSession?.data.lessonPlan) {
      console.error('[Workshop] No lesson plan provided');
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    // Prepare conversation history
    const conversationHistory = currentSession.data.conversationHistory || [];
    
    // Build system prompt
    const systemPrompt = buildStudentSystemPrompt(
      currentSession.data.studentProfile,
      currentSession.data.lessonPlan
    );

    // Prepare messages for API
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      userMessage,
    ];

    // Get prompt config for student profile
    const promptConfig = getStudentPromptConfig(currentSession.data.studentProfile);

    // Create AI service and stream response
    const aiService = createAIService(apiConfig);
    setIsStreaming(true);

    try {
      let assistantContent = '';
      
      await aiService.chat(
        messages,
        (chunk: string) => {
          assistantContent += chunk;
        },
        {
          ...promptConfig,
          stream: true,
        }
      );

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };
      addMessage(assistantMessage);

      // Mark step 3 as completed if not already and auto-save
      if (!completedSteps.includes(3)) {
        setCompletedSteps([...completedSteps, 3]);
      }
      
      console.log('[Workshop] Message sent, session auto-saved');
    } catch (error: any) {
      console.error('[Workshop] Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `抱歉，发生了错误：${error.message || '无法连接到 AI 服务'}`,
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    } finally {
      setIsStreaming(false);
    }
  };

  // Handle improvement suggestions request
  const handleRequestImprovement = async () => {
    if (!apiConfig) {
      console.error('[Workshop] API config not set');
      return;
    }

    if (!currentSession?.data.lessonPlan) {
      console.error('[Workshop] No lesson plan provided');
      return;
    }

    const conversationHistory = currentSession.data.conversationHistory || [];
    
    if (conversationHistory.length === 0) {
      setImprovementSuggestions('请先进行一些对话，然后再请求改进建议。');
      return;
    }

    setIsLoadingImprovement(true);
    setImprovementSuggestions('');

    try {
      const aiService = createAIService(apiConfig);
      
      // Get recent messages (last 6)
      const recentMessages = conversationHistory.slice(-6);
      
      const suggestions = await aiService.generateImprovementSuggestions(
        currentSession.data.lessonPlan,
        recentMessages
      );

      setImprovementSuggestions(suggestions);
    } catch (error: any) {
      console.error('[Workshop] Improvement suggestions error:', error);
      setImprovementSuggestions(`生成建议时出错：${error.message || '未知错误'}`);
    } finally {
      setIsLoadingImprovement(false);
    }
  };

  // Handle conversation analysis with caching
  const handleAnalyzeConversation = async (): Promise<AnalysisResult> => {
    if (!apiConfig) {
      throw new Error('请先配置 API 设置');
    }

    if (!currentSession?.data.conversationHistory || currentSession.data.conversationHistory.length === 0) {
      throw new Error('没有对话记录可供分析');
    }

    setIsAnalyzing(true);

    try {
      const controller = getController('analysis');
      const aiService = createAIService(apiConfig);
      
      // Use cached API call for analysis
      const conversationHistory = currentSession.data.conversationHistory || [];
      const result = await cachedAPICall(
        CACHE_KEYS.ANALYSIS,
        { 
          conversationLength: conversationHistory.length,
          lastMessage: conversationHistory[conversationHistory.length - 1]?.content
        },
        async () => {
          return await aiService.analyzeConversation(conversationHistory);
        },
        CACHE_TTL.ANALYSIS
      );
      
      // Save analysis result to session
      setAnalysisResult(result);
      
      // Mark step 4 as completed and auto-save
      if (!completedSteps.includes(4)) {
        setCompletedSteps([...completedSteps, 4]);
      }
      
      console.log('[Workshop] Analysis completed, session auto-saved');
      
      return result;
    } catch (error: any) {
      console.error('[Workshop] Analysis error:', error);
      throw new Error(error.message || '分析失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle PDF export
  const handleExportPDF = async (): Promise<void> => {
    if (!currentSession) {
      throw new Error('没有当前会话');
    }

    if (!currentSession.data.analysisResult) {
      throw new Error('请先生成分析报告');
    }

    setIsExporting(true);

    try {
      // Dynamic import for PDF export (heavy dependencies: jsPDF, html2canvas)
      const { exportSessionToPDF } = await import('@/lib/pdf-export');
      
      // Export session to PDF
      await exportSessionToPDF(currentSession, {
        includeFullConversation: false,
        maxConversationExcerpts: 10,
        includeRadarChart: true,
      });
      
      // Mark report as generated
      markReportGenerated();
      
      console.log('[Workshop] PDF exported successfully');
    } catch (error: any) {
      console.error('[Workshop] Export error:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  // Handle proceeding to next step
  const handleNextStep = () => {
    if (currentStepState < 4) {
      const nextStep = (currentStepState + 1) as 1 | 2 | 3 | 4;
      setCurrentStepState(nextStep);
      setStep(nextStep);
    }
  };

  // Check if current step is complete and can proceed
  const canProceed = () => {
    if (!currentSession) return false;
    
    switch (currentStepState) {
      case 1:
        return !!currentSession.data.topic;
      case 2:
        return !!currentSession.data.literatureReview;
      case 3:
        return !!currentSession.data.conversationHistory && 
               currentSession.data.conversationHistory.length > 0;
      case 4:
        return false; // Last step, no next step
      default:
        return false;
    }
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">正在初始化工坊...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-main">
      {/* Onboarding Tour */}
      {showTour && (
        <OnboardingTour
          steps={workshopTourSteps}
          tourId="workshop-main"
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div id="workshop-sidebar">
        <WorkshopSidebar
          currentStep={currentStepState}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header with Back Button and Help */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="gap-2 hover:bg-primary/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              返回首页
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTour(true)}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              查看引导
            </Button>
          </motion.div>

          {/* Step Content with Animations */}
          <motion.div
            key={currentStepState}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentStepState === 1 && (
              <div id="step-1">
                <Step1Topic
                  initialGrade=""
                  initialSubject=""
                  initialChallenge=""
                  initialTopics={
                    currentSession.data.topicOptions?.map(title => ({
                      title,
                      rationale: '已生成的题目',
                    })) || []
                  }
                  selectedTopic={currentSession.data.topic}
                  onGenerate={handleGenerateTopics}
                  onSelectTopic={handleSelectTopic}
                />
              </div>
            )}

            {currentStepState === 2 && (
              <div id="step-2">
                <Step2Literature
                  selectedTopic={currentSession.data.topic}
                  initialReview={currentSession.data.literatureReview}
                  onGenerate={handleGenerateLiteratureReview}
                  onSave={handleSaveLiteratureReview}
                />
              </div>
            )}

            {currentStepState === 3 && (
              <div id="step-3">
                <Step3Simulation
                  initialLessonPlan={currentSession.data.lessonPlan}
                  initialProfile={currentSession.data.studentProfile}
                  initialMessages={currentSession.data.conversationHistory || []}
                  onLessonPlanChange={handleLessonPlanChange}
                  onProfileSelect={handleProfileSelect}
                  onSendMessage={handleSendMessage}
                  onRequestImprovement={handleRequestImprovement}
                  isStreaming={isStreaming}
                  improvementSuggestions={improvementSuggestions}
                  isLoadingImprovement={isLoadingImprovement}
                />
              </div>
            )}

            {currentStepState === 4 && (
              <div id="step-4">
                <Step4Export
                  conversationHistory={currentSession.data.conversationHistory || []}
                  analysisResult={currentSession.data.analysisResult}
                  onAnalyze={handleAnalyzeConversation}
                  onExportPDF={handleExportPDF}
                  isAnalyzing={isAnalyzing}
                  isExporting={isExporting}
                />
              </div>
            )}
          </motion.div>

          {/* Navigation Footer */}
          {canProceed() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <div className="flex justify-between items-center">
                {currentStepState > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const prevStep = (currentStepState - 1) as 1 | 2 | 3 | 4;
                      setCurrentStepState(prevStep);
                      setStep(prevStep);
                    }}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    上一步
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  onClick={handleNextStep}
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                >
                  下一步
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
