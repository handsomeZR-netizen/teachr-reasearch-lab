/**
 * Featured Full Case Page
 * 精选完整案例页面 - 展示案例.md的完整研究过程
 */

import { Navbar } from '@/components/navbar';
import { FullCaseContent } from '@/components/full-case-content';

export default function FeaturedCasePage() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <FullCaseContent />
      </main>
    </div>
  );
}
