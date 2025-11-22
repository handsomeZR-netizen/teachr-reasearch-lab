# Integration Example: Adding Error Handling to Step Panels

This document shows how to integrate the error handling system into existing step panels.

## Before: Step 1 Without Error Handling

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createAIService } from '@/lib/api-service';
import { useConfigStore } from '@/lib/stores/use-config-store';

export function Step1Topic() {
  const [topics, setTopics] = useState<string[]>([]);
  const apiConfig = useConfigStore((state) => state.apiConfig);
  
  const handleGenerate = async () => {
    const service = createAIService(apiConfig);
    const result = await service.generateTopics('My input');
    setTopics(result.map(t => t.title));
  };
  
  return (
    <div>
      <Button onClick={handleGenerate}>
        生成题目
      </Button>
      
      {topics.map((topic, i) => (
        <div key={i}>{topic}</div>
      ))}
    </div>
  );
}
```

## After: Step 1 With Complete Error Handling

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/error-alert';
import { useToast } from '@/components/ui/toast';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import { useLoading } from '@/lib/hooks/use-loading';
import { Spinner } from '@/components/ui/spinner';
import { SkeletonCard } from '@/components/ui/skeleton';
import { createAIService } from '@/lib/api-service';
import { useConfigStore } from '@/lib/stores/use-config-store';
import type { APIError } from '@/lib/api-service';

export function Step1Topic() {
  const [topics, setTopics] = useState<string[]>([]);
  const [error, setError] = useState<APIError | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { addToast } = useToast();
  const apiConfig = useConfigStore((state) => state.apiConfig);
  
  const handleGenerate = async () => {
    setError(null);
    
    const result = await withLoading(async () => {
      try {
        const service = createAIService(apiConfig);
        const response = await service.generateTopics('My input');
        
        addToast({
          title: '生成成功',
          description: '已为您推荐 3 个研究题目',
          variant: 'success',
        });
        
        return response;
      } catch (err) {
        const apiError = err as APIError;
        setError(apiError);
        return null;
      }
    });
    
    if (result) {
      setTopics(result.map(t => t.title));
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <ErrorAlert
          error={error}
          onRetry={handleGenerate}
          onOpenSettings={() => {
            // Open API config dialog
          }}
          onDismiss={() => setError(null)}
        />
      )}
      
      {/* Generate Button */}
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            生成中...
          </>
        ) : (
          '生成题目'
        )}
      </Button>
      
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      
      {/* Topics List */}
      {!isLoading && topics.length > 0 && (
        <div className="space-y-2">
          {topics.map((topic, i) => (
            <div key={i} className="p-4 border rounded-lg">
              {topic}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Key Changes

1. **Added Error State**: Track API errors with `useState<APIError | null>`
2. **Added Loading Hook**: Use `useLoading()` to manage loading state
3. **Added Toast**: Show success notifications with `useToast()`
4. **Wrapped API Call**: Use `withLoading()` to handle loading state automatically
5. **Error Handling**: Catch errors and display with `ErrorAlert`
6. **Loading UI**: Show spinner in button and skeleton loaders for content
7. **Retry Logic**: Allow users to retry failed operations

## Step 3 Simulation Example

```tsx
'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat-interface';
import { ErrorAlert } from '@/components/error-alert';
import { useToast } from '@/components/ui/toast';
import { useLoading } from '@/lib/hooks/use-loading';
import { createAIService } from '@/lib/api-service';
import { useConfigStore } from '@/lib/stores/use-config-store';
import { useResearchStore } from '@/lib/stores/use-research-store';
import type { APIError, ChatMessage } from '@/lib/types';

export function Step3Simulation() {
  const [error, setError] = useState<APIError | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { addToast } = useToast();
  const apiConfig = useConfigStore((state) => state.apiConfig);
  const { currentSession, addMessage } = useResearchStore();
  
  const handleSendMessage = async (message: string) => {
    setError(null);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    
    // Get AI response
    await withLoading(async () => {
      try {
        const service = createAIService(apiConfig);
        const history = currentSession?.data.conversationHistory || [];
        
        let assistantContent = '';
        
        await service.chat(
          [...history, userMessage],
          (chunk) => {
            assistantContent += chunk;
            // Update UI with streaming content
          },
          { stream: true }
        );
        
        // Add assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
        };
        addMessage(assistantMessage);
        
      } catch (err) {
        const apiError = err as APIError;
        setError(apiError);
        
        // Show error toast
        addToast({
          title: '发送失败',
          description: apiError.message,
          variant: 'error',
        });
      }
    });
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => {
            // Retry last message
            const lastMessage = currentSession?.data.conversationHistory?.slice(-1)[0];
            if (lastMessage?.role === 'user') {
              handleSendMessage(lastMessage.content);
            }
          }}
          onDismiss={() => setError(null)}
        />
      )}
      
      <ChatInterface
        messages={currentSession?.data.conversationHistory || []}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
```

## Storage Quota Handling Example

Add to main layout or app component:

```tsx
'use client';

import { useStorageMonitor } from '@/lib/hooks/use-storage-monitor';
import { StorageCleanupDialog } from '@/components/storage-cleanup-dialog';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { showCleanupDialog, setShowCleanupDialog } = useStorageMonitor({
    warningThreshold: 80,
    autoCleanup: false,
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

## Testing Checklist

After integration, test:

- [ ] Error alert appears on API failure
- [ ] Retry button works correctly
- [ ] Loading spinner shows during API calls
- [ ] Skeleton loaders display while loading
- [ ] Success toast appears on completion
- [ ] Error toast appears on failure
- [ ] Storage cleanup dialog opens when quota exceeded
- [ ] All buttons are disabled during loading
- [ ] Error messages are user-friendly
- [ ] Settings link opens API config dialog (for auth errors)
