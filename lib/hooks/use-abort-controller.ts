/**
 * Abort Controller Hook
 * 
 * Provides automatic request cancellation on component unmount
 * Prevents memory leaks and unnecessary API calls
 * 
 * Performance: 16.3 - Request cancellation
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to manage AbortController for API requests
 * Automatically aborts pending requests when component unmounts
 */
export function useAbortController(): AbortController {
  const abortControllerRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    const controller = abortControllerRef.current;

    // Cleanup: abort any pending requests on unmount
    return () => {
      controller.abort();
      console.log('[Abort Controller] Aborted pending requests on unmount');
    };
  }, []);

  return abortControllerRef.current;
}

/**
 * Hook to create a new AbortController for each request
 * Returns a function to get a fresh controller and abort the previous one
 */
export function useAbortControllerFactory(): {
  getController: () => AbortController;
  abort: () => void;
} {
  const controllerRef = useRef<AbortController | null>(null);

  const getController = (): AbortController => {
    // Abort previous controller if exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new controller
    const newController = new AbortController();
    controllerRef.current = newController;

    return newController;
  };

  const abort = (): void => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, []);

  return { getController, abort };
}

/**
 * Hook for managing multiple concurrent requests
 * Useful when you need to track multiple API calls separately
 */
export function useAbortControllerMap(): {
  getController: (key: string) => AbortController;
  abort: (key: string) => void;
  abortAll: () => void;
} {
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  const getController = (key: string): AbortController => {
    // Abort existing controller for this key
    const existing = controllersRef.current.get(key);
    if (existing) {
      existing.abort();
    }

    // Create new controller
    const newController = new AbortController();
    controllersRef.current.set(key, newController);

    return newController;
  };

  const abort = (key: string): void => {
    const controller = controllersRef.current.get(key);
    if (controller) {
      controller.abort();
      controllersRef.current.delete(key);
    }
  };

  const abortAll = (): void => {
    for (const controller of controllersRef.current.values()) {
      controller.abort();
    }
    controllersRef.current.clear();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortAll();
    };
  }, []);

  return { getController, abort, abortAll };
}
