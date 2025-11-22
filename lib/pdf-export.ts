/**
 * PDF Export Utility
 * 
 * Generates PDF reports from research session data
 * Requirements: 9.3, 9.4, 9.5
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResearchSession, AnalysisResult, ChatMessage } from './types';

/**
 * PDF Export Options
 */
interface PDFExportOptions {
  includeFullConversation?: boolean;
  maxConversationExcerpts?: number;
  includeRadarChart?: boolean;
}

const DEFAULT_OPTIONS: PDFExportOptions = {
  includeFullConversation: false,
  maxConversationExcerpts: 10,
  includeRadarChart: true,
};

/**
 * Generate filename for PDF report
 */
function generateFilename(session: ResearchSession): string {
  const date = new Date().toISOString().split('T')[0];
  const topicSlug = session.data.topic
    ?.substring(0, 20)
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') || 'report';
  
  return `研究报告_${topicSlug}_${date}.pdf`;
}

/**
 * Add Chinese font support to jsPDF
 * Note: This is a simplified approach. For production, consider using custom fonts.
 */
function setupChineseFont(doc: jsPDF): void {
  // jsPDF doesn't support Chinese by default
  // We'll use a workaround by setting the font to a system font
  // For better Chinese support, you would need to embed a Chinese font
  
  // This is a placeholder - actual Chinese font embedding would require
  // additional font files and configuration
}

/**
 * Add text with word wrapping
 */
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 7
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  
  lines.forEach((line: string, index: number) => {
    doc.text(line, x, y + (index * lineHeight));
  });
  
  return y + (lines.length * lineHeight);
}

/**
 * Capture radar chart as image
 */
async function captureRadarChart(chartElementId: string): Promise<string | null> {
  const chartElement = document.getElementById(chartElementId);
  
  if (!chartElement) {
    console.warn('[PDF Export] Radar chart element not found');
    return null;
  }
  
  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('[PDF Export] Failed to capture radar chart:', error);
    return null;
  }
}

/**
 * Format conversation excerpt
 */
function formatConversationExcerpt(
  messages: ChatMessage[],
  maxExcerpts: number
): string {
  const excerpts = messages
    .slice(0, maxExcerpts)
    .map((msg, index) => {
      const role = msg.role === 'user' ? '教师' : '学生';
      const content = msg.content.length > 200 
        ? msg.content.substring(0, 200) + '...'
        : msg.content;
      
      return `[${index + 1}] ${role}：${content}`;
    });
  
  return excerpts.join('\n\n');
}

/**
 * Export research session to PDF
 */
export async function exportSessionToPDF(
  session: ResearchSession,
  options: PDFExportOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Validate session data
  if (!session.data.topic) {
    throw new Error('研究题目缺失');
  }
  
  if (!session.data.analysisResult) {
    throw new Error('分析结果缺失，请先生成分析报告');
  }
  
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Setup Chinese font support
  setupChineseFont(doc);
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let currentY = margin;
  
  // ========================================================================
  // Title Page
  // ========================================================================
  
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('模拟教学研究报告', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 15;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `生成日期：${new Date().toLocaleDateString('zh-CN')}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  
  currentY += 20;
  
  // ========================================================================
  // Research Topic
  // ========================================================================
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('研究题目', margin, currentY);
  
  currentY += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  currentY = addWrappedText(
    doc,
    session.data.topic,
    margin,
    currentY,
    contentWidth
  );
  
  currentY += 10;
  
  // ========================================================================
  // Literature Review
  // ========================================================================
  
  if (session.data.literatureReview) {
    // Check if we need a new page
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = margin;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('文献综述', margin, currentY);
    
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    currentY = addWrappedText(
      doc,
      session.data.literatureReview,
      margin,
      currentY,
      contentWidth,
      6
    );
    
    currentY += 10;
  }
  
  // ========================================================================
  // Analysis Results
  // ========================================================================
  
  // New page for analysis
  doc.addPage();
  currentY = margin;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('教学效果分析', margin, currentY);
  
  currentY += 10;
  
  // Metrics
  const { metrics } = session.data.analysisResult;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('评估指标', margin, currentY);
  
  currentY += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`认知负荷：${metrics.cognitiveLoad.toFixed(1)} / 10`, margin + 5, currentY);
  currentY += 6;
  doc.text(`参与度：${metrics.engagement.toFixed(1)} / 10`, margin + 5, currentY);
  currentY += 6;
  doc.text(`理解深度：${metrics.comprehension.toFixed(1)} / 10`, margin + 5, currentY);
  
  currentY += 10;
  
  // Overall Analysis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('整体分析', margin, currentY);
  
  currentY += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  currentY = addWrappedText(
    doc,
    session.data.analysisResult.analysis,
    margin,
    currentY,
    contentWidth,
    6
  );
  
  currentY += 10;
  
  // Suggestions
  if (session.data.analysisResult.suggestions && 
      session.data.analysisResult.suggestions.length > 0) {
    
    // Check if we need a new page
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = margin;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('改进建议', margin, currentY);
    
    currentY += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    session.data.analysisResult.suggestions.forEach((suggestion, index) => {
      // Check if we need a new page
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = margin;
      }
      
      currentY = addWrappedText(
        doc,
        `${index + 1}. ${suggestion}`,
        margin + 5,
        currentY,
        contentWidth - 5,
        6
      );
      
      currentY += 5;
    });
  }
  
  // ========================================================================
  // Conversation Excerpts
  // ========================================================================
  
  if (session.data.conversationHistory && session.data.conversationHistory.length > 0) {
    // New page for conversation
    doc.addPage();
    currentY = margin;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('对话摘录', margin, currentY);
    
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const excerptText = formatConversationExcerpt(
      session.data.conversationHistory,
      opts.maxConversationExcerpts || 10
    );
    
    currentY = addWrappedText(
      doc,
      excerptText,
      margin,
      currentY,
      contentWidth,
      5
    );
  }
  
  // ========================================================================
  // Radar Chart (if available)
  // ========================================================================
  
  if (opts.includeRadarChart) {
    try {
      const chartImage = await captureRadarChart('pdf-radar-chart');
      
      if (chartImage) {
        // New page for chart
        doc.addPage();
        currentY = margin;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('可视化分析', margin, currentY);
        
        currentY += 15;
        
        // Add chart image (centered)
        const imgWidth = contentWidth * 0.8;
        const imgHeight = imgWidth * 0.75; // Maintain aspect ratio
        const imgX = (pageWidth - imgWidth) / 2;
        
        doc.addImage(chartImage, 'PNG', imgX, currentY, imgWidth, imgHeight);
      }
    } catch (error) {
      console.error('[PDF Export] Failed to add radar chart:', error);
    }
  }
  
  // ========================================================================
  // Footer on all pages
  // ========================================================================
  
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text(
      `第 ${i} 页，共 ${pageCount} 页`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      '模拟教学研究实验室',
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }
  
  // ========================================================================
  // Save PDF
  // ========================================================================
  
  const filename = generateFilename(session);
  doc.save(filename);
  
  console.log('[PDF Export] PDF generated successfully:', filename);
}

/**
 * Create a hidden radar chart element for PDF export
 * This should be called before exporting to ensure the chart is rendered
 */
export function createHiddenRadarChartForExport(
  containerId: string,
  metrics: { cognitiveLoad: number; engagement: number; comprehension: number }
): HTMLDivElement {
  // Remove existing hidden chart if any
  const existing = document.getElementById('pdf-radar-chart-container');
  if (existing) {
    existing.remove();
  }
  
  // Create hidden container
  const container = document.createElement('div');
  container.id = 'pdf-radar-chart-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.height = '600px';
  container.style.backgroundColor = 'white';
  
  // Create chart element
  const chartDiv = document.createElement('div');
  chartDiv.id = 'pdf-radar-chart';
  chartDiv.style.width = '100%';
  chartDiv.style.height = '100%';
  
  container.appendChild(chartDiv);
  document.body.appendChild(container);
  
  return container;
}

/**
 * Remove hidden radar chart element
 */
export function removeHiddenRadarChartForExport(): void {
  const container = document.getElementById('pdf-radar-chart-container');
  if (container) {
    container.remove();
  }
}
