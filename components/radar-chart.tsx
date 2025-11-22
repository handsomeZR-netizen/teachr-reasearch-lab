'use client';

/**
 * Radar Chart Component
 * 
 * Displays analysis metrics in a three-axis radar chart
 * Requirements: 9.1
 */

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  cognitiveLoad: number;    // 1-10 scale
  engagement: number;        // 1-10 scale
  comprehension: number;     // 1-10 scale
}

export function RadarChart({
  cognitiveLoad,
  engagement,
  comprehension,
}: RadarChartProps) {
  // Transform data for recharts
  const data = [
    {
      metric: '认知负荷',
      value: cognitiveLoad,
      fullMark: 10,
    },
    {
      metric: '参与度',
      value: engagement,
      fullMark: 10,
    },
    {
      metric: '理解深度',
      value: comprehension,
      fullMark: 10,
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary">
            {payload[0].payload.metric}
          </p>
          <p className="text-lg font-semibold text-primary">
            {payload[0].value.toFixed(1)} / 10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          {/* Grid */}
          <PolarGrid stroke="#E5E5E5" />
          
          {/* Angle Axis (Metric Names) */}
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#666666', fontSize: 14 }}
          />
          
          {/* Radius Axis (Values) */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#999999', fontSize: 12 }}
          />
          
          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Radar Area */}
          <Radar
            name="分析指标"
            dataKey="value"
            stroke="#006666"
            fill="#006666"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Radar Chart Card - Wrapper with title and description
 */
interface RadarChartCardProps extends RadarChartProps {
  title?: string;
  description?: string;
}

export function RadarChartCard({
  cognitiveLoad,
  engagement,
  comprehension,
  title = '教学效果分析',
  description = '基于模拟对话的三维评估',
}: RadarChartCardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-[400px] bg-white rounded-lg border border-border p-6">
        <RadarChart
          cognitiveLoad={cognitiveLoad}
          engagement={engagement}
          comprehension={comprehension}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-primary-light rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">认知负荷</span>
            <span className="text-lg font-semibold text-primary">
              {cognitiveLoad.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            学生感受到的信息量和理解难度
          </p>
        </div>

        <div className="p-4 bg-primary-light rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">参与度</span>
            <span className="text-lg font-semibold text-primary">
              {engagement.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            学生的主动性和互动积极性
          </p>
        </div>

        <div className="p-4 bg-primary-light rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">理解深度</span>
            <span className="text-lg font-semibold text-primary">
              {comprehension.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            学生对核心概念的掌握程度
          </p>
        </div>
      </div>
    </div>
  );
}
