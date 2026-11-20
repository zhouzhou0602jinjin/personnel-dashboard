import ReactECharts from 'echarts-for-react';
import type { DepartmentData, MonthlyData } from '@/types';

interface MultiTrendChartProps {
  departments: DepartmentData[];
  title?: string;
  height?: number;
  metric?: 'startCount' | 'fullTime';
  globalMonths?: MonthlyData[]; // 全局月份基准（来自 companyTotal）
}

const COLORS = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#d946ef', '#eab308', '#22c55e', '#3b82f6',
];

export default function MultiTrendChart({ departments, title = '各部门人数变化趋势', height = 360, metric = 'startCount', globalMonths }: MultiTrendChartProps) {
  if (departments.length === 0) return null;

  // 用全局月份作为 x 轴基准（如果提供了），否则用第一个部门的月份
  // 这样每个组织的 data 长度都对齐全局月份，缺失月份填 null（ECharts 自然断线）
  const months = globalMonths ? globalMonths.map(m => m.month) : departments[0].monthly.map(m => m.month);

  const series = departments.map((dept, index) => {
    // 构建该部门的月份→数值映射
    const monthMap = new Map(dept.monthly.map(m => [m.month, m[metric]]));
    // 按全局月份对齐，缺失月份填 null
    const data = months.map(m => monthMap.has(m) ? monthMap.get(m)! : null);

    return {
      name: dept.name,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      connectNulls: false, // 缺失月份断线，不强行连接
      data,
      lineStyle: {
        width: 2,
        color: COLORS[index % COLORS.length],
      },
      itemStyle: {
        color: COLORS[index % COLORS.length],
        borderWidth: 2,
        borderColor: '#fff',
      },
    };
  });

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
      // 过滤掉 null 值的 series（组织当月不存在时不显示 "-"）
      formatter: (params: any) => {
        const valid = params.filter((p: any) => p.value != null);
        if (valid.length === 0) return '';
        let html = `<div style="font-weight:600;margin-bottom:4px">${valid[0].axisValue}</div>`;
        valid.forEach((p: any) => {
          html += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
            ${p.seriesName}: <b>${p.value}</b>
          </div>`;
        });
        return html;
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
      <ReactECharts option={option} style={{ height: `${height}px` }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}
