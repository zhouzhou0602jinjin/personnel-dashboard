import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';
import { getLatestMonthData } from '@/utils/data-loader';

interface NetChangeChartProps {
  departments: DepartmentData[];
  title?: string;
  height?: number;
}

export default function NetChangeChart({ departments, title = '各部门净变动排行', height = 360 }: NetChangeChartProps) {
  if (departments.length === 0) return null;

  const latestData = departments
    .map(d => {
      const latest = getLatestMonthData(d);
      return { name: d.name, value: latest?.netChange ?? 0 };
    })
    .sort((a, b) => a.value - b.value);

  const names = latestData.map(d => d.name);
  const values = latestData.map(d => d.value);

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
        const val = data.value;
        const text = val > 0 ? `+${val}` : val;
        const color = val >= 0 ? '#10b981' : '#ef4444';
        return `${data.name}<br/>净变动：<b style="color:${color}">${text}</b> 人`;
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
        data: values.map(value => ({
          value,
          itemStyle: {
            color: value >= 0
              ? {
                  type: 'linear' as const,
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#6ee7b7' },
                    { offset: 1, color: '#10b981' },
                  ],
                }
              : {
                  type: 'linear' as const,
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: '#fca5a5' },
                    { offset: 1, color: '#ef4444' },
                  ],
                },
            borderRadius: value >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4],
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right' as const,
          color: '#475569',
          fontSize: 11,
          formatter: (params: any) => {
            const val = params.value;
            return val > 0 ? `+${val}` : val;
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </div>
  );
}
