/**
 * Error Handling Example Component
 * 
 * Demonstrates how to use the error handling system
 * This file serves as documentation and can be removed in production
 */

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/error-alert';
import { useToast } from '@/components/ui/toast';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import { useLoading } from '@/lib/hooks/use-loading';
import { Spinner, LoadingInline, LoadingOverlay } from '@/components/ui/spinner';
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/skeleton';
import { Progress, ProgressWithLabel, ProgressIndeterminate } from '@/components/ui/progress';
import { ErrorType, type APIError } from '@/lib/api-service';

/**
 * Example 1: Using ErrorAlert component
 */
export function ErrorAlertExample() {
  const [error, setError] = React.useState<APIError | null>(null);
  
  const simulateError = (type: ErrorType) => {
    const errors: Record<ErrorType, APIError> = {
      [ErrorType.NETWORK_ERROR]: {
        type: ErrorType.NETWORK_ERROR,
        message: '网络连接失败，请检查您的网络设置',
        userAction: '点击重试或稍后再试',
        retryable: true,
      },
      [ErrorType.API_KEY_INVALID]: {
        type: ErrorType.API_KEY_INVALID,
        message: 'API Key 无效或已过期',
        userAction: '请前往设置页面检查您的 API 配置',
        retryable: false,
      },
      [ErrorType.RATE_LIMIT]: {
        type: ErrorType.RATE_LIMIT,
        message: 'API 调用次数已达上限',
        userAction: '请稍后再试，或配置您自己的 API Key 以解除限制',
        retryable: true,
      },
      [ErrorType.INVALID_RESPONSE]: {
        type: ErrorType.INVALID_RESPONSE,
        message: 'AI 返回了无效的响应格式',
        userAction: '请重试，如果问题持续请联系支持',
        retryable: true,
      },
      [ErrorType.STORAGE_QUOTA]: {
        type: ErrorType.STORAGE_QUOTA,
        message: '浏览器存储空间不足',
        userAction: '请删除一些旧的研究会话或清理浏览器缓存',
        retryable: false,
      },
      [ErrorType.ABORT_ERROR]: {
        type: ErrorType.ABORT_ERROR,
        message: '请求已取消',
        userAction: '操作已中止',
        retryable: false,
      },
    };
    
    setError(errors[type]);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Error Alert Examples</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => simulateError(ErrorType.NETWORK_ERROR)} size="sm">
          Network Error
        </Button>
        <Button onClick={() => simulateError(ErrorType.API_KEY_INVALID)} size="sm">
          Auth Error
        </Button>
        <Button onClick={() => simulateError(ErrorType.RATE_LIMIT)} size="sm">
          Rate Limit
        </Button>
        <Button onClick={() => simulateError(ErrorType.STORAGE_QUOTA)} size="sm">
          Storage Quota
        </Button>
      </div>
      
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => console.log('Retry clicked')}
          onOpenSettings={() => console.log('Open settings clicked')}
          onDismiss={() => setError(null)}
        />
      )}
    </div>
  );
}

/**
 * Example 2: Using Toast notifications
 */
export function ToastExample() {
  const { addToast } = useToast();
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Toast Notification Examples</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => addToast({
            title: '成功',
            description: '操作已成功完成',
            variant: 'success',
          })}
          size="sm"
        >
          Success Toast
        </Button>
        
        <Button
          onClick={() => addToast({
            title: '警告',
            description: '存储空间使用率已达 80%',
            variant: 'warning',
          })}
          size="sm"
        >
          Warning Toast
        </Button>
        
        <Button
          onClick={() => addToast({
            title: '错误',
            description: 'API 调用失败，请重试',
            variant: 'error',
          })}
          size="sm"
        >
          Error Toast
        </Button>
      </div>
    </div>
  );
}

/**
 * Example 3: Using error handler hook
 */
export function ErrorHandlerExample() {
  const { handleError, withErrorHandling } = useErrorHandler();
  
  const simulateAPICall = async (shouldFail: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (shouldFail) {
      throw {
        type: ErrorType.NETWORK_ERROR,
        message: '网络连接失败',
        userAction: '请检查网络连接',
        retryable: true,
      } as APIError;
    }
    
    return 'Success!';
  };
  
  const handleClick = async () => {
    const result = await withErrorHandling(() => simulateAPICall(true));
    console.log('Result:', result);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Error Handler Hook Example</h3>
      
      <Button onClick={handleClick}>
        Simulate API Error
      </Button>
    </div>
  );
}

/**
 * Example 4: Loading states
 */
export function LoadingExample() {
  const { isLoading, withLoading } = useLoading();
  const [progress, setProgress] = React.useState(0);
  
  const simulateLoading = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };
  
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Loading State Examples</h3>
      
      <div className="space-y-4">
        {/* Spinner */}
        <div>
          <p className="text-sm mb-2">Spinner:</p>
          <div className="flex gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
        
        {/* Inline Loading */}
        <div>
          <p className="text-sm mb-2">Inline Loading:</p>
          <LoadingInline message="加载中..." />
        </div>
        
        {/* Skeleton */}
        <div>
          <p className="text-sm mb-2">Skeleton:</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <SkeletonText lines={3} />
            <SkeletonCard />
          </div>
        </div>
        
        {/* Progress */}
        <div>
          <p className="text-sm mb-2">Progress:</p>
          <ProgressWithLabel value={progress} label="上传进度" />
          <Button onClick={simulateProgress} size="sm" className="mt-2">
            Start Progress
          </Button>
        </div>
        
        {/* Indeterminate Progress */}
        <div>
          <p className="text-sm mb-2">Indeterminate Progress:</p>
          <ProgressIndeterminate />
        </div>
        
        {/* Button with Loading */}
        <div>
          <Button onClick={simulateLoading} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                加载中...
              </>
            ) : (
              '点击加载'
            )}
          </Button>
        </div>
      </div>
      
      {isLoading && <LoadingOverlay message="处理中，请稍候..." />}
    </div>
  );
}
