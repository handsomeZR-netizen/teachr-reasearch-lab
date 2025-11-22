/**
 * Skeleton Component
 * 
 * Loading placeholder for content that is being fetched
 * Provides visual feedback during async operations
 * 
 * Requirements: 7.5
 */

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton variants for common use cases
 */

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-gray-200 p-4', className)}>
      <Skeleton className="h-6 w-3/4 mb-3" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <Skeleton className={cn('h-10 w-10 rounded-full', className)} />
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn('h-10 w-24 rounded-md', className)} />
  );
}
