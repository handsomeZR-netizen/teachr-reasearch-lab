'use client';

/**
 * Case Card Component
 * 
 * Displays a teaching research case with image, title, tags, and statistics
 * Mobile optimized with adjusted sizing and spacing
 * Requirements: 3.2, 3.3, 10.4
 */

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, User, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface CaseCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  author: string;
  likes: number;
  imageUrl?: string;
  isFeatured?: boolean;
}

export function CaseCard({
  id,
  title,
  description,
  subject,
  grade,
  author,
  likes,
  imageUrl,
  isFeatured,
}: CaseCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // 精选案例跳转到专门的完整案例页面
    if (isFeatured) {
      router.push('/cases/featured');
    } else {
      router.push(`/cases/${id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl border-2 hover:border-primary/30"
        onClick={handleClick}
      >
        {/* Image Placeholder */}
        <div className="relative w-full h-40 sm:h-48 bg-primary-light overflow-hidden group">
          {imageUrl ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30" />
              </motion.div>
            </div>
          )}
          
          {/* Subject Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1"
          >
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-white text-xs sm:text-sm rounded-full shadow-lg">
              {subject}
            </span>
            {isFeatured && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-yellow-400 text-yellow-900 text-xs sm:text-sm rounded-full shadow-lg font-medium">
                ⭐ 完整案例
              </span>
            )}
          </motion.div>
        </div>

      <CardContent className="p-3 sm:p-4">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1.5 sm:mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-text-secondary mb-2 sm:mb-3 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className="px-2 py-0.5 sm:py-1 bg-primary-light text-primary text-xs rounded">
            {grade}
          </span>
        </div>

        {/* Statistics */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-secondary pt-2 sm:pt-3 border-t border-border">
          <div className="flex items-center gap-1 truncate">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{author}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
            <span>{likes}</span>
          </motion.div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
