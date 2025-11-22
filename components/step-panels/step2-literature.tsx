/**
 * Step 2: Literature Review Panel
 * 
 * Displays the selected topic from Step 1 and allows teachers to generate
 * an AI-powered literature review draft (500-800 words).
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface Step2LiteratureProps {
  selectedTopic?: string;
  initialReview?: string;
  onGenerate: (topic: string) => Promise<string>;
  onSave: (review: string) => void;
}

export function Step2Literature({
  selectedTopic = '',
  initialReview = '',
  onGenerate,
  onSave,
}: Step2LiteratureProps) {
  const [review, setReview] = useState(initialReview);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(!!initialReview);
  const [isSaved, setIsSaved] = useState(false);

  // Update review when initialReview changes
  useEffect(() => {
    if (initialReview) {
      setReview(initialReview);
      setHasGenerated(true);
    }
  }, [initialReview]);

  // Auto-save when review changes (debounced)
  useEffect(() => {
    if (!review || review === initialReview) return;

    const timeoutId = setTimeout(() => {
      onSave(review);
      setIsSaved(true);
      
      // Clear saved indicator after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [review, initialReview, onSave]);

  const handleGenerate = async () => {
    if (!selectedTopic) {
      setError('请先在步骤 1 中选择研究题目');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const generatedReview = await onGenerate(selectedTopic);
      setReview(generatedReview);
      setHasGenerated(true);
      onSave(generatedReview);
    } catch (err: any) {
      setError(err.message || '生成文献综述失败，请重试');
      console.error('[Step2] Generate literature review error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = review.length;
  const isOptimalLength = wordCount >= 500 && wordCount <= 800;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          步骤 2：文献综述
        </h2>
        <p className="text-text-secondary">
          基于您的研究题目，生成文献综述草稿
        </p>
      </div>

      {/* Selected Topic Display */}
      <Card className="bg-primary-light border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <Label className="text-sm font-medium text-text-secondary mb-1 block">
                研究题目
              </Label>
              {selectedTopic ? (
                <p className="text-text-primary font-medium">
                  {selectedTopic}
                </p>
              ) : (
                <p className="text-text-secondary italic">
                  请先在步骤 1 中选择研究题目
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      {!hasGenerated && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-text-secondary">
                点击下方按钮，AI 将为您生成 500-800 字的文献综述草稿
              </div>
              
              {error && (
                <div className="text-sm text-error bg-error/10 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedTopic}
                size="lg"
                className="w-full max-w-md"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI 正在生成文献综述...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    生成文献综述
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Literature Review Editor */}
      {hasGenerated && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="review" className="text-base font-medium">
                文献综述内容
              </Label>
              <div className="flex items-center gap-3 text-sm">
                {isSaved && (
                  <span className="text-success flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    已保存
                  </span>
                )}
                <span className={`${isOptimalLength ? 'text-success' : 'text-text-secondary'}`}>
                  {wordCount} 字
                  {isOptimalLength && ' ✓'}
                </span>
              </div>
            </div>

            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="文献综述内容将在这里显示，您可以编辑修改..."
              rows={20}
              className="resize-none font-normal leading-relaxed"
            />

            <div className="flex items-start gap-2 text-sm text-text-secondary bg-primary-light/50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 建议字数：500-800 字</li>
                  <li>• 您可以直接编辑生成的内容</li>
                  <li>• 修改会自动保存到本地</li>
                  <li>• 如需重新生成，请点击下方按钮</li>
                </ul>
              </div>
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedTopic}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  重新生成中...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  重新生成文献综述
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
