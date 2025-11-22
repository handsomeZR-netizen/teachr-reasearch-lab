/**
 * Progress Component
 * 
 * Progress indicator for long-running operations
 * 
 * Requirements: 7.5
 */

'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

/**
 * Progress with label
 */
interface ProgressWithLabelProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressWithLabel({
  value,
  label,
  showPercentage = true,
  className,
}: ProgressWithLabelProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        {label && <span className="text-text-secondary">{label}</span>}
        {showPercentage && (
          <span className="font-medium text-text-primary">{Math.round(value)}%</span>
        )}
      </div>
      <Progress value={value} />
    </div>
  );
}

/**
 * Indeterminate progress (for unknown duration)
 */
export function ProgressIndeterminate({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}>
      <div className="h-full w-1/3 bg-primary animate-progress-indeterminate" />
    </div>
  );
}

export { Progress };
