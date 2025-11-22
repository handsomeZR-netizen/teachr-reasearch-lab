'use client';

/**
 * Step 4: Export Panel - Analysis visualization and PDF export
 * 
 * This panel provides:
 * - Conversation analysis with metrics visualization
 * - Radar chart showing cognitive load, engagement, comprehension
 * - PDF report generation and download
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 * Performance: 16.1 - Dynamic import for RadarChart
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import type { AnalysisResult, ChatMessage } from '@/lib/types';

// Dynamic import for heavy RadarChart component
const RadarChartCard = dynamic(
  () => import('@/components/radar-chart').then(mod => ({ default: mod.RadarChartCard })),
  {
    loading: () => (
      <div className="space-y-4">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="w-full h-[400px] bg-white rounded-lg border border-border p-6">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

interface Step4ExportProps {
  conversationHistory: ChatMessage[];
  analysisResult?: AnalysisResult;
  onAnalyze: () => Promise<AnalysisResult>;
  onExportPDF: () => Promise<void>;
  isAnalyzing?: boolean;
  isExporting?: boolean;
}

export function Step4Export({
  conversationHistory,
  analysisResult,
  onAnalyze,
  onExportPDF,
  isAnalyzing = false,
  isExporting = false,
}: Step4ExportProps) {
  const [localAnalysisResult, setLocalAnalysisResult] = useState<AnalysisResult | undefined>(
    analysisResult
  );
  const [error, setError] = useState<string>('');

  // Update local state when prop changes
  useEffect(() => {
    setLocalAnalysisResult(analysisResult);
  }, [analysisResult]);

  // Handle analysis generation
  const handleAnalyze = async () => {
    setError('');
    
    try {
      const result = await onAnalyze();
      setLocalAnalysisResult(result);
    } catch (err: any) {
      console.error('[Step4Export] Analysis error:', err);
      setError(err.message || '分析失败，请重试');
    }
  };

  // Handle PDF export
  const handleExport = async () => {
    setError('');
    
    try {
      await onExportPDF();
    } catch (err: any) {
      console.error('[Step4Export] Export error:', err);
      setError(err.message || '导出失败，请重试');
    }
  };

  // Check if conversation exists
  const hasConversation = conversationHistory && conversationHistory.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          步骤 4：成果导出
        </h2>
        <p className="text-text-secondary">
          分析模拟对话效果，生成可视化报告并导出 PDF
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">错误</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* No Conversation Warning */}
      {!hasConversation && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">提示</p>
            <p className="text-sm text-yellow-700 mt-1">
              请先在步骤 3 中完成模拟对话，然后再进行分析
            </p>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {hasConversation && (
        <>
          {/* Generate Analysis Button */}
          {!localAnalysisResult && (
            <div className="text-center py-8">
              <p className="text-text-secondary mb-4">
                点击下方按钮，AI 将分析您的模拟对话并生成可视化报告
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    正在分析...
                  </>
                ) : (
                  '生成分析报告'
                )}
              </Button>
            </div>
          )}

          {/* Analysis Results */}
          {localAnalysisResult && (
            <div className="space-y-6">
              {/* Radar Chart Visualization */}
              <RadarChartCard
                cognitiveLoad={localAnalysisResult.metrics.cognitiveLoad}
                engagement={localAnalysisResult.metrics.engagement}
                comprehension={localAnalysisResult.metrics.comprehension}
                title="教学效果分析"
                description="基于模拟对话的三维评估"
              />

              {/* Overall Analysis */}
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  整体分析
                </h3>
                <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                  {localAnalysisResult.analysis}
                </p>
              </div>

              {/* Improvement Suggestions */}
              {localAnalysisResult.suggestions && localAnalysisResult.suggestions.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    改进建议
                  </h3>
                  <ul className="space-y-2">
                    {localAnalysisResult.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-text-primary"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="flex-1 pt-0.5">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Moments */}
              {localAnalysisResult.keyMoments && localAnalysisResult.keyMoments.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    关键时刻
                  </h3>
                  <div className="space-y-4">
                    {localAnalysisResult.keyMoments.map((moment, index) => (
                      <div
                        key={index}
                        className="p-4 bg-primary-light rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary">
                            第 {moment.turn} 轮对话
                          </span>
                        </div>
                        <p className="text-sm text-text-primary mb-2 italic">
                          "{moment.content}"
                        </p>
                        <p className="text-sm text-text-secondary">
                          💡 {moment.insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex items-center justify-between p-6 bg-primary-light rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    导出研究报告
                  </h3>
                  <p className="text-sm text-text-secondary">
                    下载包含完整分析的 PDF 报告
                  </p>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  size="lg"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      正在生成...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      下载 PDF 报告
                    </>
                  )}
                </Button>
              </div>

              {/* Regenerate Analysis */}
              <div className="text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  variant="outline"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      正在重新分析...
                    </>
                  ) : (
                    '重新生成分析'
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
