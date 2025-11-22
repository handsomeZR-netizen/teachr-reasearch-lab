/**
 * Session Manager Dialog Component
 * 
 * Modal dialog for viewing, loading, and deleting research sessions
 * Requirements: 11.2, 11.3, 11.5
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SessionList } from '@/components/session-list';
import { useResearchStore } from '@/lib/stores/use-research-store';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SessionManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionManagerDialog({
  open,
  onOpenChange,
}: SessionManagerDialogProps) {
  const router = useRouter();
  const createSession = useResearchStore((state) => state.createSession);
  const deleteSession = useResearchStore((state) => state.deleteSession);
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleNewSession = () => {
    createSession();
    onOpenChange(false);
    router.push('/workshop');
  };

  const handleSessionSelect = (sessionId: string) => {
    onOpenChange(false);
    router.push('/workshop');
  };

  const handleDeleteRequest = (sessionId: string) => {
    setSessionToDelete(sessionId);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setSessionToDelete(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>研究会话管理</DialogTitle>
            <DialogDescription>
              查看、加载或删除您保存的研究会话
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <SessionList
              onSessionSelect={handleSessionSelect}
              onSessionDelete={handleDeleteRequest}
            />
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleNewSession}
              className="w-full"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建新会话
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={(open: boolean) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个研究会话吗？此操作无法撤销，所有相关数据将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-error hover:bg-error/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
