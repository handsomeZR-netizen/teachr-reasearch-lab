/**
 * Step 1: Topic Selection Panel
 * 
 * Allows teachers to input their teaching challenges and receive
 * AI-generated research topic recommendations.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicOption {
  title: string;
  rationale: string;
}

interface Step1TopicProps {
  initialGrade?: string;
  initialSubject?: string;
  initialChallenge?: string;
  initialTopics?: TopicOption[];
  selectedTopic?: string;
  onGenerate: (grade: string, subject: string, challenge: string) => Promise<TopicOption[]>;
  onSelectTopic: (topic: string, options: TopicOption[]) => void;
}

export function Step1Topic({
  initialGrade = '',
  initialSubject = '',
  initialChallenge = '',
  initialTopics = [],
  selectedTopic = '',
  onGenerate,
  onSelectTopic,
}: Step1TopicProps) {
  const [grade, setGrade] = useState(initialGrade);
  const [subject, setSubject] = useState(initialSubject);
  const [challenge, setChallenge] = useState(initialChallenge);
  const [topics, setTopics] = useState<TopicOption[]>(initialTopics);
  const [selected, setSelected] = useState(selectedTopic);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!grade.trim() || !subject.trim() || !challenge.trim()) {
      setError('请填写所有字段');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const input = `年级：${grade}\n学科：${subject}\n教学困惑：${challenge}`;
      const generatedTopics = await onGenerate(grade, subject, challenge);
      setTopics(generatedTopics);
    } catch (err: any) {
      setError(err.message || '生成题目失败，请重试');
      console.error('[Step1] Generate topics error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTopic = (topic: string) => {
    setSelected(topic);
    onSelectTopic(topic, topics);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          步骤 1：选题向导
        </h2>
        <p className="text-text-secondary">
          描述您的教学困惑，AI 将为您推荐 3 个研究题目
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">年级</Label>
              <Input
                id="grade"
                placeholder="例如：小学三年级"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">学科</Label>
              <Input
                id="subject"
                placeholder="例如：数学"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">教学困惑</Label>
            <Textarea
              id="challenge"
              placeholder="描述您在教学中遇到的困惑或想要研究的问题..."
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              disabled={isGenerating}
              rows={4}
              className="resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-error bg-error/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !grade.trim() || !subject.trim() || !challenge.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI 正在生成题目...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成研究题目
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Topics */}
      {topics.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              推荐题目
            </h3>
            <p className="text-sm text-text-secondary">
              选择一个题目继续您的研究
            </p>
          </div>

          <div className="space-y-3">
            {topics.map((topic, index) => (
              <Card
                key={index}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selected === topic.title && 'border-2 border-primary bg-primary-light'
                )}
                onClick={() => handleSelectTopic(topic.title)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {selected === topic.title ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary mb-2">
                        {topic.title}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {topic.rationale}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
