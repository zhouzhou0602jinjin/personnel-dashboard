import ReactECharts from 'echarts-for-react';
import type { DepartmentData } from '@/types';

interface TrendChartProps {
  data: DepartmentData | null;
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data) return null;

  const months = data.monthly.map(m => m.month);
  const startCounts = data.monthly.map(m => m.startCount);
  const fullTimes = data.monthly.map(m => m.fullTime);
  const interns = data.monthly.map(m => m.intern);

  const option = {
    title: {
      text: '人数变化趋势',
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
      data: ['总人数', '全职', '实习'],
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
        name: '总人数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: startCounts,
        lineStyle: {
          width: 3,
          color: '#0ea5e9',
        },
        itemStyle: {
          color: '#0ea5e9',
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.2)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.02)' },
            ],
          },
        },
      },
      {
        name: '全职',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: fullTimes,
        lineStyle: {
          width: 2,
          color: '#10b981',
        },
        itemStyle: {
          color: '#10b981',
          borderWidth: 2,
          borderColor: '#fff',
        },
      },
      {
        name: '实习',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: interns,
        lineStyle: {
          width: 2,
          color: '#f59e0b',
        },
        itemStyle: {
          color: '#f59e0b',
          borderWidth: 2,
          borderColor: '#fff',
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '320px' }} />
    </div>
  );
}
