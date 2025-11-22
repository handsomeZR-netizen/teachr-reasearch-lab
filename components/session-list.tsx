/**
 * Session List Component
 * 
 * Displays saved research sessions with metadata and load functionality
 * Requirements: 11.2, 11.3
 */

'use client';

import { useSessions, useResearchStore } from '@/lib/stores/use-research-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResearchSession } from '@/lib/types';

interface SessionListProps {
  onSessionSelect?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  className?: string;
}

/**
 * Format date to readable string
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get step label
 */
function getStepLabel(step: 1 | 2 | 3 | 4): string {
  const labels = {
    1: '选题向导',
    2: '文献综述',
    3: '模拟课堂',
    4: '成果导出',
  };
  return labels[step];
}

/**
 * Get session progress percentage
 */
function getSessionProgress(session: ResearchSession): number {
  return (session.step / 4) * 100;
}

export function SessionList({
  onSessionSelect,
  onSessionDelete,
  className,
}: SessionListProps) {
  const sessions = useSessions();
  const currentSession = useResearchStore((state) => state.currentSession);
  const loadSession = useResearchStore((state) => state.loadSession);

  // Sort sessions by updatedAt (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleSessionClick = (sessionId: string) => {
    loadSession(sessionId);
    onSessionSelect?.(sessionId);
  };

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    onSessionDelete?.(sessionId);
  };

  if (sessions.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
        <p className="text-text-secondary mb-2">暂无保存的研究会话</p>
        <p className="text-sm text-text-secondary">
          开始一个新的研究工坊，系统会自动保存您的进度
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {sortedSessions.map((session) => {
        const isActive = currentSession?.id === session.id;
        const progress = getSessionProgress(session);

        return (
          <Card
            key={session.id}
            className={cn(
              'p-4 cursor-pointer transition-all hover:shadow-md',
              'border-2',
              isActive ? 'border-primary bg-primary-light' : 'border-border hover:border-primary/50'
            )}
            onClick={() => handleSessionClick(session.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Session Title */}
                <h3 className={cn(
                  'font-medium mb-2 truncate',
                  isActive ? 'text-primary' : 'text-text-primary'
                )}>
                  {session.title}
                </h3>

                {/* Session Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(new Date(session.updatedAt))}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      步骤 {session.step}: {getStepLabel(session.step)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-text-secondary hover:text-error hover:bg-error/10"
                onClick={(e) => handleDeleteClick(e, session.id)}
                aria-label="删除会话"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
