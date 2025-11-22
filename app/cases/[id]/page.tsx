/**
 * Case Detail Page
 * 
 * Displays full case information with Fork functionality
 * Requirements: 3.4, 3.5
 */

import { Navbar } from '@/components/navbar';
import { CaseDetailContent } from '@/components/case-detail-content';
import { MOCK_CASES } from '@/lib/mock-cases';

// Generate static params for all case IDs
export function generateStaticParams() {
  return MOCK_CASES.map((caseData) => ({
    id: caseData.id,
  }));
}

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const caseData = MOCK_CASES.find(c => c.id === params.id);

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <CaseDetailContent caseData={caseData} />
      </main>
    </div>
  );
}
