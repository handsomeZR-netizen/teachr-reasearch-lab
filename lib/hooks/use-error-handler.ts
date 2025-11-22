/**
 * Error Handler Hook
 * 
 * Provides consistent error handling across the application
 * Integrates with toast notifications and error alerts
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import type { APIError } from '@/lib/api-service';
import { ErrorType } from '@/lib/api-service';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  onError?: (error: APIError) => void;
}

/**
 * Hook for handling errors consistently
 */
export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, onError } = options;
  const { addToast } = useToast();
  
  /**
   * Handle an API error
   */
  const handleError = useCallback((error: APIError) => {
    // Log error for debugging
    console.error('[Error Handler]', {
      type: error.type,
      message: error.message,
      originalError: error.originalError,
    });
    
    // Show toast notification if enabled
    if (showToast) {
      addToast({
        title: getErrorTitle(error.type),
        description: error.message,
        variant: 'error',
        duration: error.retryable ? 5000 : 7000,
      });
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
  }, [showToast, addToast, onError]);
  
  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(<T,>(
    fn: () => Promise<T>,
    customHandler?: (error: APIError) => void
  ): Promise<T | null> => {
    return fn().catch((error) => {
      const apiError = error as APIError;
      
      if (customHandler) {
        customHandler(apiError);
      } else {
        handleError(apiError);
      }
      
      return null;
    });
  }, [handleError]);
  
  return {
    handleError,
    withErrorHandling,
  };
}

/**
 * Get user-friendly error title based on error type
 */
function getErrorTitle(errorType: ErrorType): string {
  switch (errorType) {
    case ErrorType.NETWORK_ERROR:
      return '网络错误';
    case ErrorType.API_KEY_INVALID:
      return '认证失败';
    case ErrorType.RATE_LIMIT:
      return '请求限制';
    case ErrorType.INVALID_RESPONSE:
      return '响应错误';
    case ErrorType.STORAGE_QUOTA:
      return '存储空间不足';
    case ErrorType.ABORT_ERROR:
      return '请求已取消';
    default:
      return '错误';
  }
}

/**
 * Hook for handling storage quota errors
 */
export function useStorageErrorHandler() {
  const { addToast } = useToast();
  
  const handleStorageError = useCallback((error: any) => {
    if (error.name === 'QuotaExceededError') {
      addToast({
        title: '存储空间不足',
        description: '浏览器存储空间已满，请删除一些旧的研究会话或清理浏览器缓存',
        variant: 'error',
        duration: 10000,
      });
      return true;
    }
    return false;
  }, [addToast]);
  
  return { handleStorageError };
}
