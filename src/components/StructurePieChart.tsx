import ReactECharts from 'echarts-for-react';
import type { MonthlyData, DepartmentData } from '@/types';
import { getLatestMonthData } from '@/utils/data-loader';

interface StructurePieChartProps {
  departments: DepartmentData[];
  totalData: MonthlyData;
  title?: string;
  height?: number;
  metric?: 'startCount' | 'fullTime';
}

const COLORS = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#d946ef', '#eab308', '#22c55e', '#3b82f6',
];

export default function StructurePieChart({ departments, totalData, title = '各部门人数占比', height = 360, metric = 'startCount' }: StructurePieChartProps) {
  if (departments.length === 0) return null;

  const pieData = departments.map((dept, index) => ({
    name: dept.name,
    value: getLatestMonthData(dept)?.[metric] ?? 0,
    itemStyle: { color: COLORS[index % COLORS.length] },
  }));

  const totalCount = totalData[metric];

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
      trigger: 'item' as const,
      formatter: (params: any) => {
        const percent = totalCount > 0 ? ((params.value / totalCount) * 100).toFixed(1) : '0';
        return `${params.name}<br/>人数：<b>${params.value}</b> 人<br/>占比：<b>${percent}%</b>`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
    },
    legend: {
      type: 'scroll' as const,
      orient: 'vertical' as const,
      right: '3%',
      top: 'center',
      textStyle: {
        color: '#64748b',
        fontSize: 11,
      },
      pageIconColor: '#94a3b8',
      pageTextStyle: {
        color: '#64748b',
      },
    },
    series: [
      {
        name: '人数占比',
        type: 'pie' as const,
        radius: ['45%', '70%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}人 ({d}%)',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
        },
        data: pieData,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: `${height}px` }} opts={{ renderer: "canvas" }} />
    </div>
  );
}
