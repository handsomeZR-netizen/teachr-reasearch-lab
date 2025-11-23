'use client';

/**
 * API Configuration Dialog Component
 * 
 * Modal dialog for configuring AI provider settings
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfigStore } from '@/lib/stores/use-config-store';
import type { APIConfig, AIProvider } from '@/lib/types';

interface APIConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function APIConfigDialog({ open, onOpenChange }: APIConfigDialogProps) {
  const { apiConfig, saveConfig } = useConfigStore();
  
  const [formData, setFormData] = useState<APIConfig>({
    provider: 'deepseek',
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: '',
    model: 'deepseek-chat',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof APIConfig, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Check if using default cloud API
  const isUsingDefaultAPI = !apiConfig?.apiKey && process.env.NEXT_PUBLIC_DEFAULT_API_KEY;

  // Load existing config when dialog opens
  useEffect(() => {
    if (open && apiConfig) {
      setFormData(apiConfig);
    }
  }, [open, apiConfig]);

  // Update baseURL and model when provider changes
  const handleProviderChange = (provider: AIProvider) => {
    const presets: Record<AIProvider, { baseURL: string; model: string }> = {
      deepseek: {
        baseURL: 'https://api.deepseek.com/v1',
        model: 'deepseek-chat',
      },
      openai: {
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-4',
      },
      custom: {
        baseURL: '',
        model: '',
      },
    };

    setFormData({
      ...formData,
      provider,
      baseURL: presets[provider].baseURL,
      model: presets[provider].model,
    });
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof APIConfig, string>> = {};

    if (!formData.baseURL.trim()) {
      newErrors.baseURL = 'Base URL 不能为空';
    } else if (!formData.baseURL.startsWith('http')) {
      newErrors.baseURL = 'Base URL 必须以 http:// 或 https:// 开头';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key 不能为空';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model 名称不能为空';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      saveConfig(formData);
      
      // Show success feedback
      setTimeout(() => {
        setIsSaving(false);
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error('[API Config Dialog] Failed to save config:', error);
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API 配置</DialogTitle>
          <DialogDescription>
            配置您的 AI 服务提供商设置。所有信息仅存储在您的浏览器本地。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Default API Info */}
          {isUsingDefaultAPI && (
            <div className="flex gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-primary mb-1">当前使用免费云端 API</p>
                <p>
                  系统正在使用默认的 DeepSeek API（免费额度有限）。
                  您可以配置自己的 API Key 以解除限制并获得更好的性能。
                </p>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="flex gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="font-medium text-warning mb-1">安全提示</p>
              <p>
                您的 API Key 将使用 Base64 编码后存储在浏览器的 localStorage 中，
                不会上传到任何服务器。请确保您的设备安全。
              </p>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">服务提供商</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => handleProviderChange(value as AIProvider)}
            >
              <SelectTrigger id="provider">
                <SelectValue placeholder="选择服务提供商" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Base URL Input */}
          <div className="space-y-2">
            <Label htmlFor="baseURL">
              Base URL <span className="text-error">*</span>
            </Label>
            <Input
              id="baseURL"
              type="url"
              placeholder="https://api.example.com/v1"
              value={formData.baseURL}
              onChange={(e) => setFormData({ ...formData, baseURL: e.target.value })}
              className={errors.baseURL ? 'border-error' : ''}
            />
            {errors.baseURL && (
              <p className="text-sm text-error">{errors.baseURL}</p>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              API Key <span className="text-error">*</span>
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              className={errors.apiKey ? 'border-error' : ''}
            />
            {errors.apiKey && (
              <p className="text-sm text-error">{errors.apiKey}</p>
            )}
          </div>

          {/* Model Input */}
          <div className="space-y-2">
            <Label htmlFor="model">
              Model 名称 <span className="text-error">*</span>
            </Label>
            <Input
              id="model"
              type="text"
              placeholder="deepseek-chat"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className={errors.model ? 'border-error' : ''}
            />
            {errors.model && (
              <p className="text-sm text-error">{errors.model}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
