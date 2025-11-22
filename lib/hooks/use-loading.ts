/**
 * Loading State Hook
 * 
 * Manages loading states for async operations
 * 
 * Requirements: 7.5
 */

'use client';

import { useState, useCallback } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
}

/**
 * Hook for managing loading states
 */
export function useLoading(options: UseLoadingOptions = {}) {
  const { initialLoading = false } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Start loading
   */
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);
  
  /**
   * Stop loading
   */
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  /**
   * Set error and stop loading
   */
  const setLoadingError = useCallback((err: Error) => {
    setError(err);
    setIsLoading(false);
  }, []);
  
  /**
   * Reset loading state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);
  
  /**
   * Wrap an async function with loading state management
   */
  const withLoading = useCallback(async <T,>(
    fn: () => Promise<T>
  ): Promise<T | null> => {
    startLoading();
    
    try {
      const result = await fn();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err as Error);
      return null;
    }
  }, [startLoading, stopLoading, setLoadingError]);
  
  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
    withLoading,
  };
}

/**
 * Hook for managing multiple loading states
 */
export function useMultipleLoading() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);
  
  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);
  
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some((loading) => loading);
  }, [loadingStates]);
  
  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
  };
}
