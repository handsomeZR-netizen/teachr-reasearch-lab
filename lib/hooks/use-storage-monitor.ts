/**
 * Storage Monitor Hook
 * 
 * Monitors localStorage usage and shows warnings when quota is near
 * Automatically triggers cleanup recommendations
 * 
 * Requirements: 12.5
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';
import {
  getStorageUsage,
  shouldRecommendCleanup,
  cleanupOldSessions,
} from '@/lib/storage-utils';

interface UseStorageMonitorOptions {
  warningThreshold?: number; // Percentage at which to show warning
  autoCleanup?: boolean; // Automatically cleanup old sessions when quota exceeded
  checkInterval?: number; // How often to check storage (ms)
}

/**
 * Hook to monitor localStorage usage
 */
export function useStorageMonitor(options: UseStorageMonitorOptions = {}) {
  const {
    warningThreshold = 80,
    autoCleanup = false,
    checkInterval = 30000, // Check every 30 seconds
  } = options;
  
  const [storageUsage, setStorageUsage] = useState(getStorageUsage());
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const { addToast } = useToast();
  
  /**
   * Check storage usage and show warnings
   */
  const checkStorage = useCallback(() => {
    const usage = getStorageUsage();
    setStorageUsage(usage);
    
    // Check if storage is near quota
    if (usage.percentage >= warningThreshold) {
      const recommendation = shouldRecommendCleanup();
      
      if (recommendation.recommend) {
        addToast({
          title: '存储空间不足',
          description: recommendation.reason,
          variant: 'warning',
          duration: 10000,
        });
        
        // Auto cleanup if enabled
        if (autoCleanup && recommendation.oldSessionCount > 0) {
          const result = cleanupOldSessions(30);
          
          if (result.deletedCount > 0) {
            addToast({
              title: '自动清理完成',
              description: `已删除 ${result.deletedCount} 个旧会话`,
              variant: 'success',
            });
          }
        }
      }
    }
  }, [warningThreshold, autoCleanup, addToast]);
  
  /**
   * Handle quota exceeded event
   */
  const handleQuotaExceeded = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    console.error('[Storage Monitor] Quota exceeded:', customEvent.detail);
    
    addToast({
      title: '存储空间已满',
      description: '无法保存数据，请清理旧的研究会话',
      variant: 'error',
      duration: 0, // Don't auto-dismiss
    });
    
    // Show cleanup dialog
    setShowCleanupDialog(true);
  }, [addToast]);
  
  /**
   * Set up storage monitoring
   */
  useEffect(() => {
    // Initial check
    checkStorage();
    
    // Set up periodic checks
    const interval = setInterval(checkStorage, checkInterval);
    
    // Listen for quota exceeded events
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
    };
  }, [checkStorage, checkInterval, handleQuotaExceeded]);
  
  return {
    storageUsage,
    showCleanupDialog,
    setShowCleanupDialog,
    checkStorage,
  };
}

/**
 * Hook to check if storage is available
 */
export function useStorageAvailable() {
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      setIsAvailable(true);
    } catch (error) {
      console.error('[Storage] localStorage not available:', error);
      setIsAvailable(false);
    }
  }, []);
  
  return isAvailable;
}
