/**
 * Spinner Component
 * 
 * Loading spinner for API calls and async operations
 * 
 * Requirements: 7.5
 */

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )}
    />
  );
}

/**
 * Full-page loading overlay
 */
interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm',
        className
      )}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {message && (
          <p className="text-sm text-text-secondary">{message}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Inline loading indicator
 */
interface LoadingInlineProps {
  message?: string;
  className?: string;
}

export function LoadingInline({ message, className }: LoadingInlineProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size="sm" />
      {message && (
        <span className="text-sm text-text-secondary">{message}</span>
      )}
    </div>
  );
}

/**
 * Button loading state
 */
interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export function ButtonLoading({
  children,
  isLoading,
  loadingText,
  className,
}: ButtonLoadingProps) {
  if (!isLoading) {
    return <>{children}</>;
  }
  
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Spinner size="sm" />
      {loadingText || children}
    </span>
  );
}
