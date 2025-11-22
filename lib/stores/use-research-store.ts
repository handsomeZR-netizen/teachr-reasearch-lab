/**
 * Research Store - Manages workshop sessions with localStorage persistence
 * 
 * This store handles:
 * - Creating and managing research sessions
 * - Tracking progress through 4-step workflow
 * - Auto-saving session data to localStorage
 * - Loading and restoring previous sessions
 * 
 * Requirements: 5.5, 11.1, 11.2, 11.3, 11.4, 11.5
 * Performance: 16.2 - Compressed storage for large conversation histories
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResearchSession, ChatMessage, AnalysisResult, StudentProfile } from '../types';
import { STORAGE_KEYS } from '../types';
import { compressedStorage } from '../compressed-storage';

interface ResearchStore {
  // State
  sessions: ResearchSession[];
  currentSession: ResearchSession | null;
  
  // Session Management Actions
  createSession: (initialData?: Partial<ResearchSession['data']>) => string;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearCurrentSession: () => void;
  
  // Session Update Actions
  updateSession: (data: Partial<ResearchSession['data']>) => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  
  // Step-specific Actions
  setTopic: (topic: string, options?: string[]) => void;
  setLiteratureReview: (review: string) => void;
  setLessonPlan: (plan: string) => void;
  setStudentProfile: (profile: StudentProfile) => void;
  addMessage: (message: ChatMessage) => void;
  setConversationHistory: (history: ChatMessage[]) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  markReportGenerated: () => void;
  
  // Utility Actions
  autoSave: () => void;
  cleanupOldSessions: (daysOld?: number) => void;
}

/**
 * Generate a unique session ID
 */
const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Generate a default session title based on timestamp
 */
const generateDefaultTitle = (): string => {
  const now = new Date();
  return `研究会话 ${now.toLocaleDateString('zh-CN')} ${now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
};

/**
 * Research session store with localStorage persistence
 */
export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      currentSession: null,
      
      /**
       * Create a new research session
       * Returns the session ID
       * Can accept initial data for forking cases
       */
      createSession: (initialData?: Partial<ResearchSession['data']>) => {
        const sessionId = generateSessionId();
        const now = new Date();
        
        // Determine initial step based on provided data
        let initialStep: 1 | 2 | 3 | 4 = 1;
        if (initialData?.literatureReview) {
          initialStep = 2;
        } else if (initialData?.topic) {
          initialStep = 1;
        }
        
        // Generate title from topic if available
        const title = initialData?.topic 
          ? `研究: ${initialData.topic.substring(0, 30)}${initialData.topic.length > 30 ? '...' : ''}`
          : generateDefaultTitle();
        
        const newSession: ResearchSession = {
          id: sessionId,
          title,
          createdAt: now,
          updatedAt: now,
          step: initialStep,
          data: initialData || {},
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
        }));
        
        console.log('[Research Store] Created new session:', sessionId);
        return sessionId;
      },
      
      /**
       * Load an existing session by ID
       */
      loadSession: (id: string) => {
        const state = get();
        const session = state.sessions.find((s) => s.id === id);
        
        if (session) {
          set({ currentSession: session });
          console.log('[Research Store] Loaded session:', id);
        } else {
          console.warn('[Research Store] Session not found:', id);
        }
      },
      
      /**
       * Delete a session by ID
       */
      deleteSession: (id: string) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== id);
          const newCurrentSession = state.currentSession?.id === id ? null : state.currentSession;
          
          console.log('[Research Store] Deleted session:', id);
          
          return {
            sessions: newSessions,
            currentSession: newCurrentSession,
          };
        });
      },
      
      /**
       * Clear the current session without deleting it
       */
      clearCurrentSession: () => {
        set({ currentSession: null });
        console.log('[Research Store] Cleared current session');
      },
      
      /**
       * Update current session data
       */
      updateSession: (data: Partial<ResearchSession['data']>) => {
        set((state) => {
          if (!state.currentSession) {
            console.warn('[Research Store] No current session to update');
            return state;
          }
          
          const updatedSession: ResearchSession = {
            ...state.currentSession,
            updatedAt: new Date(),
            data: {
              ...state.currentSession.data,
              ...data,
            },
          };
          
          const updatedSessions = state.sessions.map((s) =>
            s.id === updatedSession.id ? updatedSession : s
          );
          
          return {
            sessions: updatedSessions,
            currentSession: updatedSession,
          };
        });
      },
      
      /**
       * Set the current step in the workflow
       */
      setStep: (step: 1 | 2 | 3 | 4) => {
        set((state) => {
          if (!state.currentSession) {
            console.warn('[Research Store] No current session to update step');
            return state;
          }
          
          const updatedSession: ResearchSession = {
            ...state.currentSession,
            step,
            updatedAt: new Date(),
          };
          
          const updatedSessions = state.sessions.map((s) =>
            s.id === updatedSession.id ? updatedSession : s
          );
          
          return {
            sessions: updatedSessions,
            currentSession: updatedSession,
          };
        });
      },
      
      /**
       * Set topic for Step 1
       */
      setTopic: (topic: string, options?: string[]) => {
        get().updateSession({
          topic,
          topicOptions: options,
        });
        console.log('[Research Store] Topic set');
      },
      
      /**
       * Set literature review for Step 2
       */
      setLiteratureReview: (review: string) => {
        get().updateSession({
          literatureReview: review,
        });
        console.log('[Research Store] Literature review set');
      },
      
      /**
       * Set lesson plan for Step 3
       */
      setLessonPlan: (plan: string) => {
        get().updateSession({
          lessonPlan: plan,
        });
        console.log('[Research Store] Lesson plan set');
      },
      
      /**
       * Set student profile for Step 3
       */
      setStudentProfile: (profile: StudentProfile) => {
        get().updateSession({
          studentProfile: profile,
        });
        console.log('[Research Store] Student profile set:', profile.id);
      },
      
      /**
       * Add a single message to conversation history
       */
      addMessage: (message: ChatMessage) => {
        set((state) => {
          if (!state.currentSession) {
            console.warn('[Research Store] No current session to add message');
            return state;
          }
          
          const currentHistory = state.currentSession.data.conversationHistory || [];
          const updatedHistory = [
            ...currentHistory,
            {
              ...message,
              timestamp: message.timestamp || Date.now(),
            },
          ];
          
          get().updateSession({
            conversationHistory: updatedHistory,
          });
          
          return state;
        });
      },
      
      /**
       * Set entire conversation history (for bulk updates)
       */
      setConversationHistory: (history: ChatMessage[]) => {
        get().updateSession({
          conversationHistory: history,
        });
        console.log('[Research Store] Conversation history updated');
      },
      
      /**
       * Set analysis result for Step 4
       */
      setAnalysisResult: (result: AnalysisResult) => {
        get().updateSession({
          analysisResult: result,
        });
        console.log('[Research Store] Analysis result set');
      },
      
      /**
       * Mark report as generated for Step 4
       */
      markReportGenerated: () => {
        get().updateSession({
          reportGenerated: true,
        });
        console.log('[Research Store] Report marked as generated');
      },
      
      /**
       * Manually trigger auto-save (persist middleware handles this automatically)
       */
      autoSave: () => {
        // The persist middleware automatically saves on state changes
        // This method is here for explicit save calls if needed
        console.log('[Research Store] Auto-save triggered');
      },
      
      /**
       * Clean up sessions older than specified days (default: 30)
       */
      cleanupOldSessions: (daysOld: number = 30) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        set((state) => {
          const filteredSessions = state.sessions.filter((session) => {
            const sessionDate = new Date(session.updatedAt);
            return sessionDate >= cutoffDate;
          });
          
          const deletedCount = state.sessions.length - filteredSessions.length;
          
          if (deletedCount > 0) {
            console.log(`[Research Store] Cleaned up ${deletedCount} old sessions`);
          }
          
          // Clear current session if it was deleted
          const newCurrentSession = state.currentSession && 
            filteredSessions.some((s) => s.id === state.currentSession?.id)
            ? state.currentSession
            : null;
          
          return {
            sessions: filteredSessions,
            currentSession: newCurrentSession,
          };
        });
      },
    }),
    {
      name: STORAGE_KEYS.RESEARCH_SESSIONS,
      
      // Use compressed storage for better performance with large conversation histories
      storage: {
        getItem: (name) => {
          const str = compressedStorage.getItem(name);
          if (!str) return null;
          
          try {
            const { state } = JSON.parse(str);
            
            // Convert date strings back to Date objects
            if (state.sessions) {
              state.sessions = state.sessions.map((session: any) => ({
                ...session,
                createdAt: new Date(session.createdAt),
                updatedAt: new Date(session.updatedAt),
              }));
            }
            
            if (state.currentSession) {
              state.currentSession = {
                ...state.currentSession,
                createdAt: new Date(state.currentSession.createdAt),
                updatedAt: new Date(state.currentSession.updatedAt),
              };
            }
            
            return { state };
          } catch (error) {
            console.error('[Research Store] Failed to parse stored sessions:', error);
            return null;
          }
        },
        
        setItem: (name, value) => {
          try {
            compressedStorage.setItem(name, JSON.stringify(value));
          } catch (error: any) {
            if (error.name === 'QuotaExceededError') {
              console.error('[Research Store] Storage quota exceeded. Consider cleaning up old sessions.');
              
              // Dispatch custom event for quota error
              window.dispatchEvent(new CustomEvent('storage-quota-exceeded', {
                detail: { key: name, error },
              }));
              
              throw error;
            } else {
              console.error('[Research Store] Failed to save sessions:', error);
              throw error;
            }
          }
        },
        
        removeItem: (name) => {
          compressedStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Hook to get all sessions
 */
export const useSessions = () => {
  return useResearchStore((state) => state.sessions);
};

/**
 * Hook to get current session
 */
export const useCurrentSession = () => {
  return useResearchStore((state) => state.currentSession);
};

/**
 * Hook to get current step
 */
export const useCurrentStep = () => {
  return useResearchStore((state) => state.currentSession?.step || 1);
};
