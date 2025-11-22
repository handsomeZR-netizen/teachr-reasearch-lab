/**
 * Storage Cleanup Dialog
 * 
 * Dialog for managing localStorage quota and cleaning up old sessions
 * 
 * Requirements: 12.5
 */

'use client';

import * as React from 'react';
import { Trash2, HardDrive, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  getStorageUsage,
  formatBytes,
  cleanupOldSessions,
  getSessionsBySize,
  deleteSessions,
  shouldRecommendCleanup,
} from '@/lib/storage-utils';
import { useResearchStore } from '@/lib/stores/use-research-store';
import { useToast } from '@/components/ui/toast';

interface StorageCleanupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StorageCleanupDialog({
  open,
  onOpenChange,
}: StorageCleanupDialogProps) {
  const [isCleaningUp, setIsCleaningUp] = React.useState(false);
  const [storageInfo, setStorageInfo] = React.useState(getStorageUsage());
  const [sessionsBySize, setSessionsBySize] = React.useState(getSessionsBySize());
  const [selectedSessions, setSelectedSessions] = React.useState<string[]>([]);
  
  const { addToast } = useToast();
  const refreshSessions = useResearchStore((state) => state.sessions);
  
  // Refresh storage info when dialog opens
  React.useEffect(() => {
    if (open) {
      setStorageInfo(getStorageUsage());
      setSessionsBySize(getSessionsBySize());
      setSelectedSessions([]);
    }
  }, [open, refreshSessions]);
  
  /**
   * Clean up old sessions (30+ days)
   */
  const handleAutoCleanup = async () => {
    setIsCleaningUp(true);
    
    try {
      const result = cleanupOldSessions(30);
      
      if (result.deletedCount > 0) {
        addToast({
          title: '清理完成',
          description: `已删除 ${result.deletedCount} 个旧会话，释放 ${formatBytes(result.freedSpace)} 空间`,
          variant: 'success',
        });
        
        // Refresh storage info
        setStorageInfo(getStorageUsage());
        setSessionsBySize(getSessionsBySize());
        
        // Trigger store refresh
        window.location.reload();
      } else {
        addToast({
          title: '无需清理',
          description: '没有找到超过 30 天的旧会话',
          variant: 'default',
        });
      }
    } catch (error) {
      addToast({
        title: '清理失败',
        description: '清理过程中出现错误，请重试',
        variant: 'error',
      });
    } finally {
      setIsCleaningUp(false);
    }
  };
  
  /**
   * Delete selected sessions
   */
  const handleDeleteSelected = async () => {
    if (selectedSessions.length === 0) return;
    
    setIsCleaningUp(true);
    
    try {
      const success = deleteSessions(selectedSessions);
      
      if (success) {
        addToast({
          title: '删除成功',
          description: `已删除 ${selectedSessions.length} 个会话`,
          variant: 'success',
        });
        
        // Refresh storage info
        setStorageInfo(getStorageUsage());
        setSessionsBySize(getSessionsBySize());
        setSelectedSessions([]);
        
        // Trigger store refresh
        window.location.reload();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      addToast({
        title: '删除失败',
        description: '删除过程中出现错误，请重试',
        variant: 'error',
      });
    } finally {
      setIsCleaningUp(false);
    }
  };
  
  const isStorageHigh = storageInfo.percentage >= 80;
  const recommendation = shouldRecommendCleanup();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            存储空间管理
          </DialogTitle>
          <DialogDescription>
            管理浏览器本地存储空间，删除不需要的研究会话
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Storage Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">存储空间使用情况</span>
              <span className="text-text-secondary">
                {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
              </span>
            </div>
            
            <Progress
              value={storageInfo.percentage}
              className={isStorageHigh ? 'bg-red-100' : undefined}
            />
            
            <p className="text-xs text-text-secondary">
              已使用 {Math.round(storageInfo.percentage)}% 的可用空间
            </p>
          </div>
          
          {/* Warning Alert */}
          {recommendation.recommend && (
            <Alert variant={isStorageHigh ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>建议清理</AlertTitle>
              <AlertDescription>
                {recommendation.reason}
                {recommendation.oldSessionCount > 0 && (
                  <>，建议删除这些旧会话以释放空间</>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Auto Cleanup */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium mb-1">自动清理</h4>
              <p className="text-sm text-text-secondary">
                删除所有超过 30 天未更新的研究会话
              </p>
            </div>
            
            <Button
              onClick={handleAutoCleanup}
              disabled={isCleaningUp}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              清理旧会话
            </Button>
          </div>
          
          {/* Manual Selection */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium mb-1">手动选择</h4>
              <p className="text-sm text-text-secondary">
                选择要删除的会话（按大小排序）
              </p>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessionsBySize.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-4">
                  没有可删除的会话
                </p>
              ) : (
                sessionsBySize.map(({ session, size }) => (
                  <label
                    key={session.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSessions.includes(session.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSessions([...selectedSessions, session.id]);
                        } else {
                          setSelectedSessions(
                            selectedSessions.filter((id) => id !== session.id)
                          );
                        }
                      }}
                      className="h-4 w-4"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(session.updatedAt).toLocaleDateString('zh-CN')} · {formatBytes(size)}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
            
            {selectedSessions.length > 0 && (
              <Button
                onClick={handleDeleteSelected}
                disabled={isCleaningUp}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除选中的 {selectedSessions.length} 个会话
              </Button>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCleaningUp}
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
