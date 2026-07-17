import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';

interface CompareChartProps {
  data: DepartmentData | null;
}

export default function CompareChart({ data }: CompareChartProps) {
  if (!data) return null;

  const months = data.monthly.map(m => m.month);
  const joinCounts = data.monthly.map(m => m.joinCount);
  const leaveCounts = data.monthly.map(m => m.leaveCount);

  const option = {
    title: {
      text: '入职离职对比',
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
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
    },
    legend: {
      data: ['入职人数', '离职人数'],
      bottom: 0,
      textStyle: {
        color: '#64748b',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
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
      type: 'value',
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
    series: [
      {
        name: '入职人数',
        type: 'bar',
        barWidth: '35%',
        data: joinCounts,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#34d399' },
              { offset: 1, color: '#10b981' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: '离职人数',
        type: 'bar',
        barWidth: '35%',
        data: leaveCounts,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#f87171' },
              { offset: 1, color: '#ef4444' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '320px' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}
