'use client';

/**
 * Navbar Component
 * 
 * Main navigation bar with logo, menu links, and API configuration access
 * Mobile responsive with hamburger menu
 * Requirements: 2.1, 10.1, 10.4
 */

import { useState } from 'react';
import Link from 'next/link';
import { Settings, BookOpen, FlaskConical, Home, FolderOpen, Menu, X, Cloud, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIConfigDialog } from '@/components/api-config-dialog';
import { SessionManagerDialog } from '@/components/session-manager-dialog';
import { useConfigStore, isCloudAPIAvailable } from '@/lib/stores/use-config-store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isSessionManagerOpen, setIsSessionManagerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { useCloudAPI, apiConfig } = useConfigStore();
  const cloudAvailable = isCloudAPIAvailable();
  
  // Determine current API mode
  const isUsingCloud = cloudAvailable && (useCloudAPI || !apiConfig?.apiKey);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-[70px]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <FlaskConical className="w-6 h-6 text-primary" />
            <span className="text-lg md:text-xl font-semibold text-text-primary truncate">
              模拟教学研究实验室
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <Link
              href="/cases"
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>案例馆</span>
            </Link>
            <Link
              href="/workshop"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              研究工坊
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSessionManagerOpen(true)}
              className="text-text-secondary hover:text-primary hidden sm:flex"
              aria-label="会话管理"
            >
              <FolderOpen className="w-5 h-5" />
            </Button>
            <Button
              id="api-config-button"
              variant="ghost"
              onClick={() => setIsConfigDialogOpen(true)}
              className="text-text-secondary hover:text-primary gap-1.5 px-2"
              aria-label="API 设置"
            >
              {isUsingCloud ? (
                <>
                  <Cloud className="w-4 h-4 text-primary" />
                  <span className="text-xs text-primary hidden sm:inline">云端</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-500 hidden sm:inline">自定义</span>
                </>
              )}
              <Settings className="w-4 h-4" />
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-text-secondary hover:text-primary"
              aria-label="菜单"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={cn(
            'md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg transition-all duration-200 overflow-hidden',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">首页</span>
            </Link>
            <Link
              href="/cases"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">案例馆</span>
            </Link>
            <Link
              href="/workshop"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <FlaskConical className="w-5 h-5" />
              <span className="font-medium">研究工坊</span>
            </Link>
            <button
              onClick={() => {
                setIsSessionManagerOpen(true);
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors sm:hidden"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">会话管理</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[70px]" />

      {/* Session Manager Dialog */}
      <SessionManagerDialog
        open={isSessionManagerOpen}
        onOpenChange={setIsSessionManagerOpen}
      />

      {/* API Configuration Dialog */}
      <APIConfigDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
      />
    </>
  );
}
