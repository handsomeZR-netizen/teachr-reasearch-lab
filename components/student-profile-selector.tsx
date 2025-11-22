'use client';

/**
 * Student Profile Selector Component
 * 
 * Radio group for selecting student cognitive profiles (A/B/C)
 * Requirements: 6.1, 6.2, 6.4, 6.5
 */

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { STUDENT_PROFILES, type StudentProfile } from '@/lib/types';

interface StudentProfileSelectorProps {
  selectedProfile?: StudentProfile;
  onProfileSelect: (profile: StudentProfile) => void;
}

export function StudentProfileSelector({
  selectedProfile,
  onProfileSelect,
}: StudentProfileSelectorProps) {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | null>(
    selectedProfile?.id || null
  );

  const handleSelect = (profileId: 'A' | 'B' | 'C') => {
    setSelected(profileId);
    onProfileSelect(STUDENT_PROFILES[profileId]);
  };

  // Border colors based on level
  const getBorderColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'border-success hover:border-success/80';
      case 'medium':
        return 'border-warning hover:border-warning/80';
      case 'low':
        return 'border-error hover:border-error/80';
    }
  };

  // Badge colors based on level
  const getBadgeColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-error/10 text-error border-error/20';
    }
  };

  const getLevelText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return '高水平';
      case 'medium':
        return '中等水平';
      case 'low':
        return '学习困难';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">选择学生画像</h3>
        <p className="text-sm text-text-secondary">
          选择一个学生认知水平画像来模拟课堂对话
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(STUDENT_PROFILES).map((profile) => {
          const isSelected = selected === profile.id;
          const borderColor = getBorderColor(profile.level);
          const badgeColor = getBadgeColor(profile.level);

          return (
            <Card
              key={profile.id}
              className={`cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? `${borderColor} shadow-md`
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => handleSelect(profile.id)}
            >
              <CardContent className="p-4">
                {/* Header with name and checkmark */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">
                      {profile.name}
                    </h4>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded border ${badgeColor}`}
                    >
                      {getLevelText(profile.level)}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary mb-3">
                  {profile.description}
                </p>

                {/* Cognitive Traits */}
                <div className="space-y-2 mb-3">
                  <p className="text-xs font-medium text-text-primary">认知特征：</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                    <div>抽象思维: {profile.cognitiveTraits.abstractThinking}/5</div>
                    <div>操作依赖: {profile.cognitiveTraits.operationalNeed}/5</div>
                    <div>提问能力: {profile.cognitiveTraits.questioningAbility}/5</div>
                    <div>学习自信: {profile.cognitiveTraits.confidence}/5</div>
                  </div>
                </div>

                {/* Key Behavioral Patterns */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-text-primary">行为特点：</p>
                  <ul className="text-xs text-text-secondary space-y-1">
                    {profile.behavioralPatterns.slice(0, 2).map((pattern, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Profile Details */}
      {selected && (
        <Card className="bg-primary-light border-primary/20">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              已选择：{STUDENT_PROFILES[selected].name}
            </h4>
            <p className="text-sm text-text-secondary mb-2">
              <span className="font-medium">语言风格：</span>
              {STUDENT_PROFILES[selected].languageStyle}
            </p>
            <div className="text-sm text-text-secondary">
              <span className="font-medium">完整行为模式：</span>
              <ul className="mt-1 space-y-1">
                {STUDENT_PROFILES[selected].behavioralPatterns.map((pattern, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary">•</span>
                    <span>{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
