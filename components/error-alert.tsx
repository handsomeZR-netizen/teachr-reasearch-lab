/**
 * Error Alert Component
 * 
 * Displays error messages with appropriate styling and actions
 * Supports different error types with retry functionality
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

'use client';

import * as React from 'react';
import { AlertCircle, WifiOff, Key, Clock, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorType, type APIError } from '@/lib/api-service';
import { cn } from '@/lib/utils';

interface ErrorAlertProps {
  error: APIError;
  onRetry?: () => void;
  onOpenSettings?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Get icon for error type
 */
function getErrorIcon(errorType: ErrorType): React.ReactNode {
  switch (errorType) {
    case ErrorType.NETWORK_ERROR:
      return <WifiOff className="h-5 w-5" />;
    case ErrorType.API_KEY_INVALID:
      return <Key className="h-5 w-5" />;
    case ErrorType.RATE_LIMIT:
      return <Clock className="h-5 w-5" />;
    case ErrorType.STORAGE_QUOTA:
      return <AlertCircle className="h-5 w-5" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
}

/**
 * Error Alert Component
 */
export function ErrorAlert({
  error,
  onRetry,
  onOpenSettings,
  onDismiss,
  className,
}: ErrorAlertProps) {
  const showRetryButton = error.retryable && onRetry;
  const showSettingsButton = error.type === ErrorType.API_KEY_INVALID && onOpenSettings;
  
  return (
    <Alert
      variant="destructive"
      className={cn('relative', className)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getErrorIcon(error.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <AlertTitle className="mb-1">
            {error.message}
          </AlertTitle>
          
          <AlertDescription className="text-sm mb-3">
            {error.userAction}
          </AlertDescription>
          
          <div className="flex flex-wrap gap-2">
            {showRetryButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="h-8 bg-white hover:bg-gray-50"
              >
                重试
              </Button>
            )}
            
            {showSettingsButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenSettings}
                className="h-8 bg-white hover:bg-gray-50"
              >
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                打开设置
              </Button>
            )}
            
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-8 text-white hover:bg-white/10"
              >
                关闭
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
}

/**
 * Inline Error Message (for form fields)
 */
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm text-red-600', className)}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Error Boundary Fallback Component
 */
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="mb-2">出现错误</AlertTitle>
          <AlertDescription className="mb-4">
            <p className="mb-2">应用程序遇到了一个错误。请刷新页面重试。</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs">错误详情</summary>
                <pre className="mt-2 text-xs overflow-auto p-2 bg-black/10 rounded">
                  {error.message}
                </pre>
              </details>
            )}
          </AlertDescription>
          {resetErrorBoundary && (
            <Button
              size="sm"
              variant="outline"
              onClick={resetErrorBoundary}
              className="bg-white hover:bg-gray-50"
            >
              重试
            </Button>
          )}
        </Alert>
      </div>
    </div>
  );
}
