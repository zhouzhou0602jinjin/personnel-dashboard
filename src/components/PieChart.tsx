import ReactECharts from 'echarts-for-react';
import type { MonthlyData } from '@/types';

interface PieChartProps {
  data: MonthlyData | null;
}

export default function PieChart({ data }: PieChartProps) {
  if (!data) return null;

  const option = {
    title: {
      text: '人员构成',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#334155',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#64748b',
      },
    },
    series: [
      {
        name: '人员构成',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['35%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: [
          { 
            value: data.fullTime, 
            name: '全职',
            itemStyle: {
              color: '#0ea5e9',
            },
          },
          { 
            value: data.intern, 
            name: '实习',
            itemStyle: {
              color: '#f59e0b',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '320px' }} />
    </div>
  );
}
