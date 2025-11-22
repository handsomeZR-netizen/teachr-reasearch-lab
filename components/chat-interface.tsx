'use client';

/**
 * Chat Interface Component
 * 
 * Real-time chat interface for simulated student conversations
 * Mobile optimized with full-width bubbles and improved readability
 * Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 10.4
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isStreaming = false,
  disabled = false,
  placeholder = '输入您的教学内容...',
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Remove auto-focus to prevent interference with other inputs
  // Users can click the textarea when they're ready to chat

  const handleSend = () => {
    if (!inputValue.trim() || isStreaming || disabled) {
      return;
    }

    onSendMessage(inputValue.trim());
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary px-4">
            <p className="text-center text-sm sm:text-base">
              开始与模拟学生对话<br />
              <span className="text-xs sm:text-sm">输入您的教学内容，学生会根据其认知水平做出回应</span>
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 sm:px-4 sm:py-3',
                    'w-full sm:max-w-[85%] md:max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-[#F5F5DC] text-text-primary font-dialogue'
                  )}
                >
                  {/* Role Label */}
                  <div className="text-xs opacity-70 mb-1">
                    {message.role === 'user' ? '教师' : '学生'}
                  </div>
                  
                  {/* Message Content */}
                  <div className={cn(
                    'whitespace-pre-wrap break-words',
                    'text-sm sm:text-base leading-relaxed'
                  )}>
                    {message.content}
                  </div>
                  
                  {/* Timestamp */}
                  {message.timestamp && (
                    <div className="text-xs opacity-50 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming Indicator */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="w-full sm:max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-[#F5F5DC]">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">学生正在思考...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed above keyboard on mobile */}
      <div className="border-t border-border p-3 sm:p-4 bg-white">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            className="resize-none min-h-[50px] sm:min-h-[60px] max-h-[120px] sm:max-h-[150px] text-sm sm:text-base"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled || isStreaming}
            className="bg-primary hover:bg-primary/90 self-end flex-shrink-0"
            size="icon"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-text-secondary mt-2 hidden sm:block">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
}
