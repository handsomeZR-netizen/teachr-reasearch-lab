'use client';

/**
 * Step 3: Simulation Panel
 * 
 * Allows teachers to:
 * - Input/edit lesson plan
 * - Select student profile
 * - Conduct simulated classroom conversation
 * - Get improvement suggestions
 * 
 * Requirements: 6.1, 6.2, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { useState, useEffect } from 'react';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentProfileSelector } from '@/components/student-profile-selector';
import { ChatInterface } from '@/components/chat-interface';
import type { StudentProfile, ChatMessage } from '@/lib/types';

interface Step3SimulationProps {
  initialLessonPlan?: string;
  initialProfile?: StudentProfile;
  initialMessages?: ChatMessage[];
  onLessonPlanChange: (plan: string) => void;
  onProfileSelect: (profile: StudentProfile) => void;
  onSendMessage: (content: string) => void;
  onRequestImprovement: () => void;
  isStreaming?: boolean;
  improvementSuggestions?: string;
  isLoadingImprovement?: boolean;
}

export function Step3Simulation({
  initialLessonPlan = '',
  initialProfile,
  initialMessages = [],
  onLessonPlanChange,
  onProfileSelect,
  onSendMessage,
  onRequestImprovement,
  isStreaming = false,
  improvementSuggestions,
  isLoadingImprovement = false,
}: Step3SimulationProps) {
  const [lessonPlan, setLessonPlan] = useState(initialLessonPlan);
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | undefined>(
    initialProfile
  );
  const [showImprovementDialog, setShowImprovementDialog] = useState(false);

  // Update lesson plan in parent when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (lessonPlan !== initialLessonPlan) {
        onLessonPlanChange(lessonPlan);
      }
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [lessonPlan, initialLessonPlan, onLessonPlanChange]);

  const handleProfileSelect = (profile: StudentProfile) => {
    setSelectedProfile(profile);
    onProfileSelect(profile);
  };

  const handleRequestImprovement = () => {
    setShowImprovementDialog(true);
    onRequestImprovement();
  };

  const canStartChat = lessonPlan.trim().length > 0 && selectedProfile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          步骤 3：模拟课堂
        </h2>
        <p className="text-text-secondary">
          输入您的教案，选择学生画像，开始模拟课堂对话
        </p>
      </div>

      {/* Lesson Plan Input */}
      <Card>
        <CardHeader>
          <CardTitle>教案内容</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={lessonPlan}
            onChange={(e) => setLessonPlan(e.target.value)}
            placeholder="请输入或粘贴您的教案内容...&#10;&#10;例如：&#10;- 教学目标&#10;- 教学重点难点&#10;- 教学过程&#10;- 预设问题"
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-text-secondary mt-2">
            教案将作为模拟对话的背景，帮助 AI 学生理解课堂情境
          </p>
        </CardContent>
      </Card>

      {/* Student Profile Selector */}
      <Card>
        <CardHeader>
          <CardTitle>学生画像选择</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentProfileSelector
            selectedProfile={selectedProfile}
            onProfileSelect={handleProfileSelect}
          />
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {canStartChat ? (
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>模拟对话</CardTitle>
                <p className="text-sm text-text-secondary mt-1">
                  与 {selectedProfile?.name} 进行课堂对话
                </p>
              </div>
              {initialMessages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestImprovement}
                  disabled={isLoadingImprovement}
                  className="gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  效果不佳？
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ChatInterface
              messages={initialMessages}
              onSendMessage={onSendMessage}
              isStreaming={isStreaming}
              placeholder="输入您的教学内容或问题..."
            />
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            请先输入教案内容并选择学生画像，然后开始模拟对话
          </AlertDescription>
        </Alert>
      )}

      {/* Improvement Suggestions Dialog */}
      <Dialog open={showImprovementDialog} onOpenChange={setShowImprovementDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              教学改进建议
            </DialogTitle>
            <DialogDescription>
              基于当前对话的 AI 分析和改进建议
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isLoadingImprovement ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-text-secondary">正在分析对话...</p>
                </div>
              </div>
            ) : improvementSuggestions ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-text-primary">
                  {improvementSuggestions}
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  暂无改进建议，请先进行一些对话
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
