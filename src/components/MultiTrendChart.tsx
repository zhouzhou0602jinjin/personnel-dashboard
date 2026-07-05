import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';

interface MultiTrendChartProps {
  departments: DepartmentData[];
  title?: string;
  height?: number;
}

const COLORS = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#d946ef', '#eab308', '#22c55e', '#3b82f6',
];

export default function MultiTrendChart({ departments, title = '各部门人数变化趋势', height = 360 }: MultiTrendChartProps) {
  if (departments.length === 0) return null;

  const months = departments[0].monthly.map(m => m.month);

  const series = departments.map((dept, index) => ({
    name: dept.name,
    type: 'line' as const,
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    data: dept.monthly.map(m => m.startCount),
    lineStyle: {
      width: 2,
      color: COLORS[index % COLORS.length],
    },
    itemStyle: {
      color: COLORS[index % COLORS.length],
      borderWidth: 2,
      borderColor: '#fff',
    },
  }));

  const option = {
    title: {
      text: title,
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#334155',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      textStyle: {
        color: '#64748b',
        fontSize: 11,
      },
      pageIconColor: '#94a3b8',
      pageTextStyle: {
        color: '#64748b',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: months,
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
    },
    series,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </div>
  );
}
