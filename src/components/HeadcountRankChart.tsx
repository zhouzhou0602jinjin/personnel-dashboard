import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';
import { getLatestMonthData } from '@/utils/data-loader';

interface HeadcountRankChartProps {
  departments: DepartmentData[];
  title?: string;
  height?: number;
  metric?: 'startCount' | 'fullTime';
}

export default function HeadcountRankChart({ departments, title = '各部门在职人数排行', height = 360, metric = 'startCount' }: HeadcountRankChartProps) {
  if (departments.length === 0) return null;

  const latestData = departments
    .map(d => ({ name: d.name, count: getLatestMonthData(d)?.[metric] ?? 0 }))
    .sort((a, b) => a.count - b.count);

  const names = latestData.map(d => d.name);
  const counts = latestData.map(d => d.count);

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
      axisPointer: {
        type: 'shadow' as const,
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
      formatter: (params: any) => {
        const data = params[0];
        return `${data.name}<br/>在职人数：<b>${data.value}</b> 人`;
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
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
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#475569',
        fontSize: 11,
      },
    },
    series: [
      {
        type: 'bar' as const,
        data: counts.map((value, index) => ({
          value,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#7dd3fc' },
                { offset: 1, color: '#0ea5e9' },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right' as const,
          color: '#475569',
          fontSize: 11,
          formatter: '{c}',
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: `${height}px` }} opts={{ renderer: "canvas" }} />
    </div>
  );
}
