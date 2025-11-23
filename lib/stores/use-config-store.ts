/**
 * Configuration Store - Manages API settings with localStorage persistence
 * 
 * This store handles:
 * - API provider configuration (DeepSeek, OpenAI, custom)
 * - Secure storage of API keys (base64 encoded)
 * - Automatic persistence to localStorage
 * 
 * Requirements: 2.3, 2.4
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { APIConfig, EncryptedAPIConfig } from '../types';
import { STORAGE_KEYS } from '../types';

interface ConfigStore {
  // State
  apiConfig: APIConfig | null;
  isConfigured: boolean;
  
  // Actions
  setAPIConfig: (config: APIConfig) => void;
  loadConfig: () => void;
  saveConfig: (config: APIConfig) => void;
  clearConfig: () => void;
  
  // Utility
  getDecryptedConfig: () => APIConfig | null;
}

/**
 * Encode API key for basic obfuscation in localStorage
 */
const encodeKey = (key: string): string => {
  try {
    return btoa(key);
  } catch (error) {
    console.error('[Config Store] Failed to encode API key:', error);
    return key;
  }
};

/**
 * Decode API key from localStorage
 */
const decodeKey = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch (error) {
    console.error('[Config Store] Failed to decode API key:', error);
    return encoded;
  }
};

/**
 * Get default API configuration from environment variables or fallback
 */
const getDefaultConfig = (): APIConfig => {
  // Try to get from environment variables (set by Netlify or other hosting)
  const envApiKey = process.env.NEXT_PUBLIC_DEFAULT_API_KEY;
  const envBaseURL = process.env.NEXT_PUBLIC_DEFAULT_API_BASE_URL;
  const envModel = process.env.NEXT_PUBLIC_DEFAULT_API_MODEL;
  
  return {
    provider: 'deepseek',
    baseURL: envBaseURL || 'https://api.deepseek.com/v1',
    apiKey: envApiKey || '', // Use env API key if available
    model: envModel || 'deepseek-chat',
  };
};

/**
 * Default API configuration (from environment or fallback)
 */
const DEFAULT_CONFIG: APIConfig = getDefaultConfig();

/**
 * Configuration store with localStorage persistence
 */
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // Initial state
      apiConfig: null,
      isConfigured: false,
      
      /**
       * Set API configuration and mark as configured
       */
      setAPIConfig: (config: APIConfig) => {
        set({
          apiConfig: config,
          isConfigured: !!config.apiKey,
        });
      },
      
      /**
       * Load configuration from localStorage
       * This is called automatically by the persist middleware
       */
      loadConfig: () => {
        const state = get();
        if (state.apiConfig) {
          set({
            isConfigured: !!state.apiConfig.apiKey,
          });
        }
      },
      
      /**
       * Save configuration with encrypted API key
       */
      saveConfig: (config: APIConfig) => {
        const encryptedConfig: EncryptedAPIConfig = {
          ...config,
          apiKey: encodeKey(config.apiKey),
          timestamp: Date.now(),
        };
        
        set({
          apiConfig: config,
          isConfigured: !!config.apiKey,
        });
        
        // Persist middleware will handle localStorage save
        console.log('[Config Store] Configuration saved');
      },
      
      /**
       * Clear configuration and reset to default
       */
      clearConfig: () => {
        set({
          apiConfig: null,
          isConfigured: false,
        });
        console.log('[Config Store] Configuration cleared');
      },
      
      /**
       * Get decrypted configuration for API calls
       * Priority: User config > Environment variables > Default
       */
      getDecryptedConfig: () => {
        const state = get();
        const defaultConfig = getDefaultConfig();
        
        // If user has configured their own API, use it
        if (state.apiConfig?.apiKey) {
          return {
            ...state.apiConfig,
            apiKey: state.apiConfig.apiKey, // Already decrypted in memory
          };
        }
        
        // Otherwise, use environment variables or default
        return defaultConfig;
      },
    }),
    {
      name: STORAGE_KEYS.API_CONFIG,
      
      // Custom storage implementation with encryption
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const { state } = JSON.parse(str);
            
            // Decrypt API key when loading from storage
            if (state.apiConfig?.apiKey) {
              state.apiConfig.apiKey = decodeKey(state.apiConfig.apiKey);
            }
            
            return { state };
          } catch (error) {
            console.error('[Config Store] Failed to parse stored config:', error);
            return null;
          }
        },
        
        setItem: (name, value) => {
          try {
            const { state } = value;
            
            // Encrypt API key before storing
            if (state.apiConfig?.apiKey) {
              const encryptedState = {
                ...state,
                apiConfig: {
                  ...state.apiConfig,
                  apiKey: encodeKey(state.apiConfig.apiKey),
                },
              };
              
              localStorage.setItem(name, JSON.stringify({ state: encryptedState }));
            } else {
              localStorage.setItem(name, JSON.stringify(value));
            }
          } catch (error) {
            console.error('[Config Store] Failed to save config:', error);
          }
        },
        
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Hook to check if API is configured
 */
export const useIsConfigured = () => {
  return useConfigStore((state) => state.isConfigured);
};

/**
 * Hook to get current API config
 */
export const useAPIConfig = () => {
  return useConfigStore((state) => state.apiConfig);
};
