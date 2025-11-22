/**
 * Toast Component
 * 
 * Non-blocking notification system for errors, warnings, and success messages
 */

'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  
  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      variant: 'default',
      duration: 5000,
      ...toast,
    };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);
  
  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  
  return context;
}

/**
 * Toast Container Component
 */
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/**
 * Individual Toast Item Component
 */
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };
  
  const textStyles = {
    default: 'text-gray-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900',
  };
  
  return (
    <div
      className={cn(
        'pointer-events-auto rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right',
        variantStyles[toast.variant || 'default']
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {toast.title && (
            <div className={cn('font-medium mb-1', textStyles[toast.variant || 'default'])}>
              {toast.title}
            </div>
          )}
          <div className={cn('text-sm', textStyles[toast.variant || 'default'])}>
            {toast.description}
          </div>
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className={cn(
            'flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors',
            textStyles[toast.variant || 'default']
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
