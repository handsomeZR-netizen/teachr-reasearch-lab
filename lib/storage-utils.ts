/**
 * Storage Utilities
 * 
 * Utilities for managing localStorage with quota handling
 * Includes automatic cleanup of old sessions
 * 
 * Requirements: 12.5
 */

import type { ResearchSession } from './types';
import { STORAGE_KEYS } from './types';

/**
 * Storage quota error
 */
export class StorageQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

/**
 * Get estimated localStorage usage
 */
export function getStorageUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  let used = 0;
  
  // Calculate total size of all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        // Approximate size in bytes (2 bytes per character in UTF-16)
        used += (key.length + value.length) * 2;
      }
    }
  }
  
  // Most browsers have 5-10MB limit, we'll use 5MB as conservative estimate
  const total = 5 * 1024 * 1024; // 5MB in bytes
  const percentage = (used / total) * 100;
  
  return {
    used,
    total,
    percentage,
  };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if storage is near quota
 */
export function isStorageNearQuota(threshold: number = 80): boolean {
  const { percentage } = getStorageUsage();
  return percentage >= threshold;
}

/**
 * Safe localStorage operation with quota handling
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      console.error('[Storage] Quota exceeded:', {
        key,
        valueSize: value.length * 2,
        usage: getStorageUsage(),
      });
      throw new StorageQuotaError('浏览器存储空间已满');
    }
    
    console.error('[Storage] Failed to save:', error);
    throw error;
  }
}

/**
 * Safe localStorage get operation
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('[Storage] Failed to read:', error);
    return null;
  }
}

/**
 * Safe localStorage remove operation
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('[Storage] Failed to remove:', error);
    return false;
  }
}

/**
 * Get all research sessions from localStorage
 */
export function getStoredSessions(): ResearchSession[] {
  try {
    const data = safeLocalStorageGet(STORAGE_KEYS.RESEARCH_SESSIONS);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    const sessions = parsed.state?.sessions || [];
    
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    }));
  } catch (error) {
    console.error('[Storage] Failed to parse sessions:', error);
    return [];
  }
}

/**
 * Clean up old sessions (older than specified days)
 */
export function cleanupOldSessions(daysOld: number = 30): {
  deletedCount: number;
  freedSpace: number;
} {
  const sessions = getStoredSessions();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const oldSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.updatedAt);
    return sessionDate < cutoffDate;
  });
  
  if (oldSessions.length === 0) {
    return { deletedCount: 0, freedSpace: 0 };
  }
  
  // Calculate space before deletion
  const usageBefore = getStorageUsage();
  
  // Keep only recent sessions
  const recentSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.updatedAt);
    return sessionDate >= cutoffDate;
  });
  
  try {
    // Save updated sessions list
    const data = JSON.stringify({
      state: { sessions: recentSessions, currentSession: null },
      version: 0,
    });
    
    safeLocalStorageSet(STORAGE_KEYS.RESEARCH_SESSIONS, data);
    
    // Calculate freed space
    const usageAfter = getStorageUsage();
    const freedSpace = usageBefore.used - usageAfter.used;
    
    console.log('[Storage] Cleanup complete:', {
      deletedCount: oldSessions.length,
      freedSpace: formatBytes(freedSpace),
    });
    
    return {
      deletedCount: oldSessions.length,
      freedSpace,
    };
  } catch (error) {
    console.error('[Storage] Cleanup failed:', error);
    return { deletedCount: 0, freedSpace: 0 };
  }
}

/**
 * Get sessions sorted by size (largest first)
 */
export function getSessionsBySize(): Array<{
  session: ResearchSession;
  size: number;
}> {
  const sessions = getStoredSessions();
  
  return sessions
    .map((session) => ({
      session,
      size: JSON.stringify(session).length * 2, // Approximate size in bytes
    }))
    .sort((a, b) => b.size - a.size);
}

/**
 * Delete specific sessions by IDs
 */
export function deleteSessions(sessionIds: string[]): boolean {
  try {
    const sessions = getStoredSessions();
    const filteredSessions = sessions.filter(
      (session) => !sessionIds.includes(session.id)
    );
    
    const data = JSON.stringify({
      state: { sessions: filteredSessions, currentSession: null },
      version: 0,
    });
    
    safeLocalStorageSet(STORAGE_KEYS.RESEARCH_SESSIONS, data);
    
    console.log('[Storage] Deleted sessions:', sessionIds.length);
    return true;
  } catch (error) {
    console.error('[Storage] Failed to delete sessions:', error);
    return false;
  }
}

/**
 * Compress conversation history to save space
 * (Simple implementation - could be enhanced with actual compression library)
 */
export function compressConversationHistory(
  history: Array<{ role: string; content: string }>
): string {
  // For now, just stringify - could use LZ-string or similar in production
  return JSON.stringify(history);
}

/**
 * Decompress conversation history
 */
export function decompressConversationHistory(
  compressed: string
): Array<{ role: string; content: string }> {
  try {
    return JSON.parse(compressed);
  } catch (error) {
    console.error('[Storage] Failed to decompress history:', error);
    return [];
  }
}

/**
 * Check if cleanup is recommended
 */
export function shouldRecommendCleanup(): {
  recommend: boolean;
  reason: string;
  oldSessionCount: number;
} {
  const usage = getStorageUsage();
  const sessions = getStoredSessions();
  
  // Check if storage is near quota
  if (usage.percentage >= 80) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    const oldSessionCount = sessions.filter((session) => {
      const sessionDate = new Date(session.updatedAt);
      return sessionDate < cutoffDate;
    }).length;
    
    return {
      recommend: true,
      reason: `存储空间使用率已达 ${Math.round(usage.percentage)}%`,
      oldSessionCount,
    };
  }
  
  // Check if there are many old sessions
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  
  const oldSessionCount = sessions.filter((session) => {
    const sessionDate = new Date(session.updatedAt);
    return sessionDate < cutoffDate;
  }).length;
  
  if (oldSessionCount >= 5) {
    return {
      recommend: true,
      reason: `发现 ${oldSessionCount} 个超过 30 天的旧会话`,
      oldSessionCount,
    };
  }
  
  return {
    recommend: false,
    reason: '',
    oldSessionCount: 0,
  };
}
