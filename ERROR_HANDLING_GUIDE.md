# Error Handling and User Feedback Guide

This guide explains how to use the error handling and user feedback system implemented in the Simulation Teaching Lab application.

## Overview

The error handling system provides:
- **Error Alerts**: Prominent error messages with retry and action buttons
- **Toast Notifications**: Non-blocking notifications for success, warning, and error messages
- **Loading States**: Spinners, skeletons, and progress indicators
- **Storage Management**: Automatic quota detection and cleanup tools

## Components

### 1. Error Alert (`ErrorAlert`)

Display prominent error messages with appropriate actions.

```tsx
import { ErrorAlert } from '@/components/error-alert';
import { ErrorType } from '@/lib/api-service';

function MyComponent() {
  const [error, setError] = useState<APIError | null>(null);
  
  return (
    <>
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            // Retry the failed operation
            setError(null);
            retryOperation();
          }}
          onOpenSettings={() => {
            // Open API settings dialog
            openSettings();
          }}
          onDismiss={() => setError(null)}
        />
      )}
    </>
  );
}
```

### 2. Toast Notifications (`useToast`)

Show non-blocking notifications that auto-dismiss.

```tsx
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const { addToast } = useToast();
  
  const handleSuccess = () => {
    addToast({
      title: '成功',
      description: '操作已完成',
      variant: 'success',
      duration: 5000, // Optional, defaults to 5000ms
    });
  };
  
  const handleError = () => {
    addToast({
      title: '错误',
      description: '操作失败，请重试',
      variant: 'error',
    });
  };
  
  return (
    <Button onClick={handleSuccess}>Show Success</Button>
  );
}
```

Toast variants:
- `default`: Gray background
- `success`: Green background
- `warning`: Yellow background
- `error`: Red background

### 3. Error Handler Hook (`useErrorHandler`)

Consistent error handling across the application.

```tsx
import { useErrorHandler } from '@/lib/hooks/use-error-handler';

function MyComponent() {
  const { handleError, withErrorHandling } = useErrorHandler();
  
  // Option 1: Wrap async function
  const fetchData = async () => {
    const result = await withErrorHandling(async () => {
      const response = await apiService.getData();
      return response;
    });
    
    if (result) {
      // Handle success
    }
  };
  
  // Option 2: Handle error manually
  try {
    await apiService.getData();
  } catch (error) {
    handleError(error as APIError);
  }
  
  return <Button onClick={fetchData}>Fetch Data</Button>;
}
```

### 4. Loading States

#### Spinner

```tsx
import { Spinner, LoadingInline, LoadingOverlay } from '@/components/ui/spinner';

// Small spinner
<Spinner size="sm" />

// Inline loading with message
<LoadingInline message="加载中..." />

// Full-page overlay
{isLoading && <LoadingOverlay message="处理中，请稍候..." />}
```

#### Skeleton Loaders

```tsx
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/skeleton';

// Basic skeleton
<Skeleton className="h-4 w-full" />

// Text skeleton (multiple lines)
<SkeletonText lines={3} />

// Card skeleton
<SkeletonCard />
```

#### Progress Indicators

```tsx
import { Progress, ProgressWithLabel, ProgressIndeterminate } from '@/components/ui/progress';

// Progress bar with label
<ProgressWithLabel 
  value={progress} 
  label="上传进度" 
  showPercentage={true}
/>

// Indeterminate progress (unknown duration)
<ProgressIndeterminate />
```

### 5. Loading Hook (`useLoading`)

Manage loading states for async operations.

```tsx
import { useLoading } from '@/lib/hooks/use-loading';

function MyComponent() {
  const { isLoading, withLoading } = useLoading();
  
  const handleSubmit = async () => {
    await withLoading(async () => {
      await apiService.submitData();
    });
  };
  
  return (
    <Button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          提交中...
        </>
      ) : (
        '提交'
      )}
    </Button>
  );
}
```

### 6. Storage Management

#### Storage Monitor Hook

Automatically monitor localStorage usage and show warnings.

```tsx
import { useStorageMonitor } from '@/lib/hooks/use-storage-monitor';
import { StorageCleanupDialog } from '@/components/storage-cleanup-dialog';

function MyComponent() {
  const { storageUsage, showCleanupDialog, setShowCleanupDialog } = useStorageMonitor({
    warningThreshold: 80, // Show warning at 80% usage
    autoCleanup: false, // Don't auto-cleanup
  });
  
  return (
    <>
      <div>
        Storage: {Math.round(storageUsage.percentage)}%
      </div>
      
      <StorageCleanupDialog
        open={showCleanupDialog}
        onOpenChange={setShowCleanupDialog}
      />
    </>
  );
}
```

#### Storage Utilities

```tsx
import {
  getStorageUsage,
  formatBytes,
  cleanupOldSessions,
  shouldRecommendCleanup,
} from '@/lib/storage-utils';

// Get current storage usage
const usage = getStorageUsage();
console.log(`Used: ${formatBytes(usage.used)} / ${formatBytes(usage.total)}`);

// Check if cleanup is recommended
const recommendation = shouldRecommendCleanup();
if (recommendation.recommend) {
  console.log(recommendation.reason);
}

// Clean up old sessions (30+ days)
const result = cleanupOldSessions(30);
console.log(`Deleted ${result.deletedCount} sessions`);
```

## Error Types

The system defines the following error types:

```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',       // Network connection issues
  API_KEY_INVALID = 'API_KEY_INVALID',   // Invalid or expired API key
  RATE_LIMIT = 'RATE_LIMIT',             // API rate limit exceeded
  INVALID_RESPONSE = 'INVALID_RESPONSE', // Invalid API response format
  STORAGE_QUOTA = 'STORAGE_QUOTA',       // localStorage quota exceeded
  ABORT_ERROR = 'ABORT_ERROR',           // Request was cancelled
}
```

Each error type has:
- `message`: User-friendly error message
- `userAction`: Suggested action for the user
- `retryable`: Whether the operation can be retried

## Best Practices

### 1. Always Wrap API Calls

```tsx
// ✅ Good
const result = await withErrorHandling(() => apiService.chat(messages));

// ❌ Bad
const result = await apiService.chat(messages); // No error handling
```

### 2. Show Loading States

```tsx
// ✅ Good
const { isLoading, withLoading } = useLoading();
await withLoading(() => apiService.generateTopics(input));

// ❌ Bad
await apiService.generateTopics(input); // No loading indicator
```

### 3. Use Appropriate Feedback

- **Errors**: Use `ErrorAlert` for critical errors that block user action
- **Warnings**: Use toast with `warning` variant for non-critical issues
- **Success**: Use toast with `success` variant for confirmations
- **Loading**: Use spinners for short operations, skeletons for content loading

### 4. Handle Storage Quota

```tsx
// Monitor storage in main layout or app component
function AppLayout() {
  const { showCleanupDialog, setShowCleanupDialog } = useStorageMonitor({
    warningThreshold: 80,
  });
  
  return (
    <>
      {children}
      <StorageCleanupDialog
        open={showCleanupDialog}
        onOpenChange={setShowCleanupDialog}
      />
    </>
  );
}
```

### 5. Provide Retry Options

```tsx
// For retryable errors, always provide a retry button
{error && error.retryable && (
  <ErrorAlert
    error={error}
    onRetry={handleRetry}
    onDismiss={() => setError(null)}
  />
)}
```

## Integration Example

Complete example showing all features:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/error-alert';
import { useToast } from '@/components/ui/toast';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import { useLoading } from '@/lib/hooks/use-loading';
import { Spinner } from '@/components/ui/spinner';
import { createAIService } from '@/lib/api-service';
import { useConfigStore } from '@/lib/stores/use-config-store';

export function MyFeature() {
  const [error, setError] = useState<APIError | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { handleError } = useErrorHandler();
  const { addToast } = useToast();
  const apiConfig = useConfigStore((state) => state.apiConfig);
  
  const handleSubmit = async () => {
    setError(null);
    
    const result = await withLoading(async () => {
      try {
        const service = createAIService(apiConfig);
        const response = await service.generateTopics('My input');
        
        addToast({
          title: '成功',
          description: '已生成研究题目',
          variant: 'success',
        });
        
        return response;
      } catch (err) {
        const apiError = err as APIError;
        setError(apiError);
        handleError(apiError);
        return null;
      }
    });
    
    if (result) {
      // Handle success
    }
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={handleSubmit}
          onDismiss={() => setError(null)}
        />
      )}
      
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            处理中...
          </>
        ) : (
          '提交'
        )}
      </Button>
    </div>
  );
}
```

## Testing

To test the error handling system:

1. **Network Errors**: Disconnect network and try API calls
2. **Auth Errors**: Use invalid API key
3. **Rate Limits**: Make many rapid API calls
4. **Storage Quota**: Fill localStorage to test quota handling
5. **Loading States**: Add delays to API calls to see loading indicators

## Troubleshooting

### Toast not showing
- Ensure `ToastProvider` is added to root layout
- Check that `useToast` is called inside a component wrapped by `ToastProvider`

### Storage quota errors
- Open Storage Cleanup Dialog to free space
- Enable auto-cleanup in `useStorageMonitor`
- Reduce conversation history size

### Loading states not updating
- Ensure `withLoading` is used correctly
- Check that loading state is properly reset after errors
- Verify async operations are properly awaited
