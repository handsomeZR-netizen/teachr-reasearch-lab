/**
 * Compressed Storage Utility
 * 
 * Provides compression for localStorage operations to save space
 * Uses LZ-string for efficient compression of large conversation histories
 * 
 * Requirements: 1.5, 11.1
 * Performance: 16.2 - localStorage compression
 */

import LZString from 'lz-string';

/**
 * Compressed storage interface matching localStorage API
 */
export interface CompressedStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/**
 * Check if compression should be used for a given value
 * Only compress if the value is large enough to benefit from compression
 */
function shouldCompress(value: string): boolean {
  // Only compress if value is larger than 1KB
  return value.length > 1024;
}

/**
 * Compressed storage implementation
 * Automatically compresses/decompresses data when storing/retrieving
 */
export const compressedStorage: CompressedStorage = {
  /**
   * Get item from localStorage with automatic decompression
   */
  getItem: (key: string): string | null => {
    // Check if localStorage is available (not available during SSR)
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    
    try {
      const compressed = localStorage.getItem(key);
      
      if (!compressed) {
        return null;
      }
      
      // Check if data is compressed (starts with compression marker)
      if (compressed.startsWith('LZ:')) {
        const compressedData = compressed.substring(3);
        const decompressed = LZString.decompressFromUTF16(compressedData);
        
        if (decompressed === null) {
          console.warn('[Compressed Storage] Failed to decompress data for key:', key);
          // Return original data as fallback
          return compressed;
        }
        
        return decompressed;
      }
      
      // Data is not compressed, return as-is
      return compressed;
    } catch (error) {
      console.error('[Compressed Storage] Error reading from storage:', error);
      return null;
    }
  },
  
  /**
   * Set item in localStorage with automatic compression
   */
  setItem: (key: string, value: string): void => {
    // Check if localStorage is available (not available during SSR)
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      let dataToStore = value;
      
      // Compress if value is large enough
      if (shouldCompress(value)) {
        const compressed = LZString.compressToUTF16(value);
        
        // Only use compressed version if it's actually smaller
        if (compressed.length < value.length) {
          dataToStore = 'LZ:' + compressed;
          
          const originalSize = value.length;
          const compressedSize = dataToStore.length;
          const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);
          
          console.log(
            `[Compressed Storage] Compressed ${key}: ${originalSize} → ${compressedSize} bytes (${savings}% savings)`
          );
        }
      }
      
      localStorage.setItem(key, dataToStore);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') {
        console.error('[Compressed Storage] Storage quota exceeded for key:', key);
        
        // Dispatch custom event for quota error
        window.dispatchEvent(new CustomEvent('storage-quota-exceeded', {
          detail: { key, error },
        }));
        
        throw error;
      } else {
        console.error('[Compressed Storage] Error writing to storage:', error);
        throw error;
      }
    }
  },
  
  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    // Check if localStorage is available (not available during SSR)
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('[Compressed Storage] Error removing from storage:', error);
    }
  },
};

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  used: number;
  available: number;
  percentage: number;
} {
  try {
    // Calculate total size of localStorage
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    
    // Most browsers have 5-10MB limit, we'll use 5MB as conservative estimate
    const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
    
    return {
      used: totalSize,
      available: estimatedLimit - totalSize,
      percentage: (totalSize / estimatedLimit) * 100,
    };
  } catch (error) {
    console.error('[Compressed Storage] Error calculating storage stats:', error);
    return {
      used: 0,
      available: 0,
      percentage: 0,
    };
  }
}

/**
 * Lazy load session data
 * Returns a lightweight session list without full conversation histories
 */
export function getLazySessionList(storageKey: string): Array<{
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  step: number;
  hasConversation: boolean;
  messageCount: number;
}> {
  try {
    const data = compressedStorage.getItem(storageKey);
    
    if (!data) {
      return [];
    }
    
    const parsed = JSON.parse(data);
    const sessions = parsed.state?.sessions || [];
    
    // Return lightweight session info without full data
    return sessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      step: session.step,
      hasConversation: !!session.data?.conversationHistory,
      messageCount: session.data?.conversationHistory?.length || 0,
    }));
  } catch (error) {
    console.error('[Compressed Storage] Error loading lazy session list:', error);
    return [];
  }
}

/**
 * Load a single session by ID (lazy loading)
 */
export function loadSessionById(storageKey: string, sessionId: string): any | null {
  try {
    const data = compressedStorage.getItem(storageKey);
    
    if (!data) {
      return null;
    }
    
    const parsed = JSON.parse(data);
    const sessions = parsed.state?.sessions || [];
    
    const session = sessions.find((s: any) => s.id === sessionId);
    
    if (!session) {
      return null;
    }
    
    // Convert date strings back to Date objects
    return {
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
    };
  } catch (error) {
    console.error('[Compressed Storage] Error loading session:', error);
    return null;
  }
}
