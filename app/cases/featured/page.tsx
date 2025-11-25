/**
 * Featured Case Detail Page
 * 精选案例详情页 - 展示完整的模拟教学研究故事
 */

import { Navbar } from '@/components/navbar';
import { FeaturedCaseContent } from '@/components/featured-case-content';

export default function FeaturedCasePage() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <FeaturedCaseContent />
      </main>
    </div>
  );
}
