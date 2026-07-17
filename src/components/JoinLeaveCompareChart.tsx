import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';
import { getLatestMonthData } from '@/utils/data-loader';

interface JoinLeaveCompareChartProps {
  departments: DepartmentData[];
  title?: string;
  height?: number;
}

export default function JoinLeaveCompareChart({ departments, title = '各部门入职离职对比', height = 360 }: JoinLeaveCompareChartProps) {
  if (departments.length === 0) return null;

  const latestData = departments
    .map(d => {
      const latest = getLatestMonthData(d);
      return {
        name: d.name,
        join: latest?.joinCount ?? 0,
        leave: latest?.leaveCount ?? 0,
      };
    })
    .sort((a, b) => (b.join + b.leave) - (a.join + a.leave));

  const names = latestData.map(d => d.name);
  const joins = latestData.map(d => d.join);
  const leaves = latestData.map(d => d.leave);

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
      type: 'category' as const,
      data: names,
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 10,
        interval: 0,
        rotate: names.length > 8 ? 30 : 0,
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
    series: [
      {
        name: '入职人数',
        type: 'bar' as const,
        barWidth: '35%',
        data: joins,
        itemStyle: {
          color: {
            type: 'linear' as const,
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
        type: 'bar' as const,
        barWidth: '35%',
        data: leaves,
        itemStyle: {
          color: {
            type: 'linear' as const,
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
      <ReactECharts option={option} style={{ height: `${height}px` }} opts={{ renderer: "canvas" }} />
    </div>
  );
}
