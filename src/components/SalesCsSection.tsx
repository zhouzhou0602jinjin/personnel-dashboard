import ReactECharts from 'echarts-for-react';
import { Users, UserCheck, Briefcase, BarChart3 } from 'lucide-react';
import sequenceData from '@/data/sequence-ratio-data.json';

interface BranchData {
  branch: string;
  cities: string[];
  salesSpecialist: number;
  salesManager: number;
  csManager: number;
  csSupervisor: number;
  csSpecialist: number;
  implementSupervisor: number;
  implementSpecialist: number;
}

interface RegionSummary {
  region: string;
  branch: string;
  salesSpecialist: number;
  salesManager: number;
  csManager: number;
  csSupervisor: number;
  csSpecialist: number;
  implementSupervisor: number;
  implementSpecialist: number;
}

interface RegionData {
  regionName: string;
  summary: RegionSummary;
  branches: BranchData[];
}

interface SalesCsData {
  updateDate: string;
  summary: RegionSummary;
  regions: RegionData[];
}

interface SalesCsSectionProps {
  data: SalesCsData;
}

interface FlatNode {
  type: 'region' | 'branch';
  name: string;
  fullName: string;
  regionName: string;
  cities: string[];
  salesSpecialist: number;
  salesManager: number;
  csManager: number;
  csSupervisor: number;
  csSpecialist: number;
  implementSupervisor: number;
  implementSpecialist: number;
  ratioSpecialist: number;
  ratioFull: number;
  salesTotal: number;
  csTotal: number;
}

function calcRatioSpecialist(row: { salesSpecialist: number; csSpecialist: number; implementSpecialist: number }): string {
  if (row.salesSpecialist === 0) return '-';
  return ((row.csSpecialist + row.implementSpecialist) / row.salesSpecialist).toFixed(2);
}

function calcRatioFull(row: {
  salesSpecialist: number;
  salesManager: number;
  csManager: number;
  csSupervisor: number;
  csSpecialist: number;
  implementSupervisor: number;
  implementSpecialist: number;
}): string {
  const denominator = row.salesSpecialist + row.salesManager;
  if (denominator === 0) return '-';
  const numerator = row.csManager + row.csSupervisor + row.csSpecialist + row.implementSupervisor + row.implementSpecialist;
  return (numerator / denominator).toFixed(2);
}

function buildFlatData(data: SalesCsData): FlatNode[] {
  const result: FlatNode[] = [];
  data.regions.forEach((region) => {
    const r = region.summary;
    const rSalesTotal = r.salesSpecialist + r.salesManager;
    const rCsTotal = r.csManager + r.csSupervisor + r.csSpecialist + r.implementSupervisor + r.implementSpecialist;
    const regionCities = region.branches.flatMap((b) => b.cities);
    result.push({
      type: 'region',
      name: region.regionName,
      fullName: region.regionName,
      regionName: region.regionName,
      cities: regionCities,
      salesSpecialist: r.salesSpecialist,
      salesManager: r.salesManager,
      csManager: r.csManager,
      csSupervisor: r.csSupervisor,
      csSpecialist: r.csSpecialist,
      implementSupervisor: r.implementSupervisor,
      implementSpecialist: r.implementSpecialist,
      ratioSpecialist: r.salesSpecialist === 0 ? 0 : Number(((r.csSpecialist + r.implementSpecialist) / r.salesSpecialist).toFixed(2)),
      ratioFull: rSalesTotal === 0 ? 0 : Number((rCsTotal / rSalesTotal).toFixed(2)),
      salesTotal: rSalesTotal,
      csTotal: rCsTotal,
    });

    region.branches.forEach((branch) => {
      if (branch.branch.includes('直属')) return;
      const bSalesTotal = branch.salesSpecialist + branch.salesManager;
      const bCsTotal = branch.csManager + branch.csSupervisor + branch.csSpecialist + branch.implementSupervisor + branch.implementSpecialist;
      result.push({
        type: 'branch',
        name: branch.branch,
        fullName: branch.branch,
        regionName: region.regionName,
        cities: branch.cities,
        salesSpecialist: branch.salesSpecialist,
        salesManager: branch.salesManager,
        csManager: branch.csManager,
        csSupervisor: branch.csSupervisor,
        csSpecialist: branch.csSpecialist,
        implementSupervisor: branch.implementSupervisor,
        implementSpecialist: branch.implementSpecialist,
        ratioSpecialist: branch.salesSpecialist === 0 ? 0 : Number(((branch.csSpecialist + branch.implementSpecialist) / branch.salesSpecialist).toFixed(2)),
        ratioFull: bSalesTotal === 0 ? 0 : Number((bCsTotal / bSalesTotal).toFixed(2)),
        salesTotal: bSalesTotal,
        csTotal: bCsTotal,
      });
    });
  });
  return result;
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );
}

function OverviewCards({ data }: { data: SalesCsData }) {
  const s = data.summary;
  const salesTotal = s.salesSpecialist + s.salesManager;
  const csTotal = s.csManager + s.csSupervisor + s.csSpecialist + s.implementSupervisor + s.implementSpecialist;
  const ratioSpecialist = calcRatioSpecialist(s);
  const ratioFull = calcRatioFull(s);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="销售团队总人数"
        value={salesTotal}
        icon={<Users size={24} className="text-amber-600" />}
        color="bg-amber-50"
      />
      <MetricCard
        title="客户成功团队总人数"
        value={csTotal}
        icon={<UserCheck size={24} className="text-amber-600" />}
        color="bg-amber-50"
      />
      <MetricCard
        title="客成销售比（专员）"
        value={ratioSpecialist}
        icon={<Briefcase size={24} className="text-amber-600" />}
        color="bg-amber-50"
      />
      <MetricCard
        title="客成销售比（全量）"
        value={ratioFull}
        icon={<BarChart3 size={24} className="text-amber-600" />}
        color="bg-amber-50"
      />
    </div>
  );
}

function RatioCompareChart({ data }: { data: SalesCsData }) {
  const flat = buildFlatData(data);
  const names = flat.map((item) => (item.type === 'region' ? item.fullName : `  ${item.fullName}`));
  const specialistRatios = flat.map((item) => item.ratioSpecialist);
  const fullRatios = flat.map((item) => item.ratioFull);

  const regionIndices = flat.map((item, idx) => (item.type === 'region' ? idx : -1)).filter((idx) => idx !== -1);

  const option = {
    title: {
      text: '各片区与分公司客成销售比对比',
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
      formatter: (params: { dataIndex: number }[]) => {
        const idx = params[0].dataIndex;
        const item = flat[idx];
        const lines = [
          `<b>${item.regionName}${item.type === 'branch' ? ' · ' + item.fullName : ''}</b>`,
          item.cities.length > 0 ? `覆盖城市: ${item.cities.join('、')}` : '',
          `客成销售比（专员）: <b>${item.ratioSpecialist}</b>`,
          `客成销售比（全量）: <b>${item.ratioFull}</b>`,
          `销售团队: ${item.salesTotal}人`,
          `客户成功团队: ${item.csTotal}人`,
        ].filter((l) => l);
        return lines.join('<br/>');
      },
    },
    legend: {
      data: ['客成销售比（专员）', '客成销售比（全量）'],
      top: '5%',
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '8%',
      top: '15%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'slider' as const,
        yAxisIndex: 0,
        width: 16,
        right: '2%',
        top: '15%',
        bottom: '8%',
        start: 0,
        end: 100,
        handleSize: '100%',
        show: true,
      },
      {
        type: 'inside' as const,
        yAxisIndex: 0,
      },
    ],
    xAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: '#f1f5f9' },
      },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLine: {
        lineStyle: { color: '#e2e8f0' },
      },
      axisTick: { show: false },
      axisLabel: {
        color: (value: string, idx: number) => {
          return flat[idx]?.type === 'region' ? '#1e293b' : '#64748b';
        },
        fontSize: 11,
        fontWeight: (value: string, idx: number) => {
          return flat[idx]?.type === 'region' ? 'bold' : 'normal';
        },
      },
    },
    series: [
      {
        name: '客成销售比（专员）',
        type: 'bar' as const,
        data: specialistRatios.map((value, idx) => ({
          value,
          itemStyle: {
            color: flat[idx].type === 'region' ? '#2563eb' : '#93c5fd',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '35%',
        barGap: '20%',
        label: {
          show: true,
          position: 'right' as const,
          color: '#475569',
          fontSize: 11,
          formatter: '{c}',
        },
      },
      {
        name: '客成销售比（全量）',
        type: 'bar' as const,
        data: fullRatios.map((value, idx) => ({
          value,
          itemStyle: {
            color: flat[idx].type === 'region' ? '#059669' : '#6ee7b7',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '35%',
        label: {
          show: true,
          position: 'right' as const,
          color: '#475569',
          fontSize: 11,
          formatter: '{c}',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#94a3b8',
            type: 'dashed',
            width: 1,
          },
          data: regionIndices.map((idx) => ({
            yAxis: idx + 0.5,
          })),
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '600px' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}

function SalesVsCsChart({ data }: { data: SalesCsData }) {
  const flat = buildFlatData(data);
  const names = flat.map((item) => (item.type === 'region' ? item.fullName : `  ${item.fullName}`));
  const salesTotals = flat.map((item) => item.salesTotal);
  const csTotals = flat.map((item) => item.csTotal);

  const regionIndices = flat.map((item, idx) => (item.type === 'region' ? idx : -1)).filter((idx) => idx !== -1);

  const option = {
    title: {
      text: '各片区与分公司销售团队 vs 客户成功团队人数对比',
      left: 'left',
      textStyle: { fontSize: 16, fontWeight: 600, color: '#334155' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' as const },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
      formatter: (params: { dataIndex: number }[]) => {
        const idx = params[0].dataIndex;
        const item = flat[idx];
        const lines = [
          `<b>${item.regionName}${item.type === 'branch' ? ' · ' + item.fullName : ''}</b>`,
          item.cities.length > 0 ? `覆盖城市: ${item.cities.join('、')}` : '',
          `销售团队: <b>${item.salesTotal}人</b>`,
          `客户成功团队: <b>${item.csTotal}人</b>`,
          `客成销售比（全量）: ${item.ratioFull}`,
        ].filter((l) => l);
        return lines.join('<br/>');
      },
    },
    legend: {
      data: ['销售团队', '客户成功团队'],
      top: '10%',
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '5%',
      top: '20%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'slider' as const,
        xAxisIndex: 0,
        height: 16,
        bottom: '1%',
        start: 0,
        end: 100,
        show: true,
      },
      {
        type: 'inside' as const,
        xAxisIndex: 0,
      },
    ],
    xAxis: {
      type: 'category' as const,
      data: names,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: {
        color: (value: string, idx: number) => {
          return flat[idx]?.type === 'region' ? '#1e293b' : '#64748b';
        },
        fontSize: 11,
        fontWeight: (value: string, idx: number) => {
          return flat[idx]?.type === 'region' ? 'bold' : 'normal';
        },
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' },
    },
    series: [
      {
        name: '销售团队',
        type: 'bar' as const,
        data: salesTotals.map((value, idx) => ({
          value,
          itemStyle: {
            color: flat[idx].type === 'region' ? '#1d4ed8' : '#93c5fd',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '30%',
        barGap: '10%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 10 },
      },
      {
        name: '客户成功团队',
        type: 'bar' as const,
        data: csTotals.map((value, idx) => ({
          value,
          itemStyle: {
            color: flat[idx].type === 'region' ? '#059669' : '#6ee7b7',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '30%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 10 },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#94a3b8',
            type: 'dashed',
            width: 1,
          },
          data: regionIndices.map((idx) => ({
            xAxis: idx + 0.5,
          })),
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '480px' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}

function GuanMinRatioChart() {
  const months = sequenceData.data.map((d) => d.month);
  const csData = sequenceData.data.map((d) => d.customerSuccess);
  const salesData = sequenceData.data.map((d) => d.sales);
  const managementData = sequenceData.data.map((d) => d.management);
  const ratioData = sequenceData.data.map((d) => {
    return Number(((d.customerSuccess + d.sales) / d.management).toFixed(2));
  });

  const option = {
    title: {
      text: '片区人员序列占比与官民比趋势',
      left: 'left',
      textStyle: { fontSize: 16, fontWeight: 600, color: '#334155' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' as const },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
    },
    legend: {
      data: ['客户成功', '销售', '管理', '官民比'],
      top: '5%',
    },
    grid: [
      { left: '3%', right: '4%', bottom: '35%', top: '18%', containLabel: true },
      { left: '3%', right: '4%', bottom: '8%', height: '18%', top: '72%', containLabel: true },
    ],
    xAxis: [
      {
        type: 'category' as const,
        data: months,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#475569', fontSize: 11 },
      },
      {
        type: 'category' as const,
        gridIndex: 1,
        data: months,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#475569', fontSize: 11 },
      },
    ],
    yAxis: [
      {
        type: 'value' as const,
        name: '人数',
        nameTextStyle: { color: '#64748b', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b' },
      },
      {
        type: 'value' as const,
        gridIndex: 1,
        name: '官民比',
        nameTextStyle: { color: '#64748b', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b' },
      },
    ],
    series: [
      {
        name: '客户成功',
        type: 'bar' as const,
        data: csData,
        itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
        barWidth: '25%',
        barGap: '10%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 11 },
      },
      {
        name: '销售',
        type: 'bar' as const,
        data: salesData,
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
        barWidth: '25%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 11 },
      },
      {
        name: '管理',
        type: 'bar' as const,
        data: managementData,
        itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] },
        barWidth: '25%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 11 },
      },
      {
        name: '官民比',
        type: 'line' as const,
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: ratioData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#f59e0b', width: 3 },
        itemStyle: { color: '#f59e0b', borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.05)' },
            ],
          },
        },
        label: {
          show: true,
          position: 'top' as const,
          color: '#92400e',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}',
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '420px' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
}

function DetailTable({ data }: { data: SalesCsData }) {
  const rows: {
    type: 'region' | 'branch' | 'total';
    region?: string;
    branch?: string;
    cities?: string[];
    salesSpecialist: number;
    salesManager: number;
    csManager: number;
    csSupervisor: number;
    csSpecialist: number;
    implementSupervisor: number;
    implementSpecialist: number;
  }[] = [];

  data.regions.forEach((region) => {
    const regionCities = region.branches.flatMap((b) => b.cities);
    rows.push({
      type: 'region',
      region: region.regionName,
      branch: region.regionName,
      cities: regionCities,
      salesSpecialist: region.summary.salesSpecialist,
      salesManager: region.summary.salesManager,
      csManager: region.summary.csManager,
      csSupervisor: region.summary.csSupervisor,
      csSpecialist: region.summary.csSpecialist,
      implementSupervisor: region.summary.implementSupervisor,
      implementSpecialist: region.summary.implementSpecialist,
    });

    region.branches.forEach((branch) => {
      if (branch.branch.includes('直属')) return;
      rows.push({
        type: 'branch',
        region: region.regionName,
        branch: branch.branch,
        cities: branch.cities,
        salesSpecialist: branch.salesSpecialist,
        salesManager: branch.salesManager,
        csManager: branch.csManager,
        csSupervisor: branch.csSupervisor,
        csSpecialist: branch.csSpecialist,
        implementSupervisor: branch.implementSupervisor,
        implementSpecialist: branch.implementSpecialist,
      });
    });
  });

  rows.push({
    type: 'total',
    region: '总计',
    branch: '总计',
    cities: [],
    salesSpecialist: data.summary.salesSpecialist,
    salesManager: data.summary.salesManager,
    csManager: data.summary.csManager,
    csSupervisor: data.summary.csSupervisor,
    csSpecialist: data.summary.csSpecialist,
    implementSupervisor: data.summary.implementSupervisor,
    implementSpecialist: data.summary.implementSpecialist,
  });

  const headers = [
    '区域',
    '分公司/办事处',
    '销售专员',
    '销售主管',
    '客户成功经理',
    '客户成功主管',
    '客户成功专员',
    '实施主管',
    '实施专员',
    '客成比(专员)',
    '客成比(全量)',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 overflow-hidden">
      <h3 className="text-base font-semibold text-slate-800 mb-4">各片区与分公司销售团队与客户成功团队人员明细</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              {headers.map((h) => (
                <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap border-b border-slate-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isRegion = row.type === 'region';
              const isTotal = row.type === 'total';
              const bgClass = isRegion
                ? 'bg-sky-50 font-bold text-slate-800'
                : isTotal
                ? 'bg-amber-50 font-bold text-slate-800'
                : 'bg-white text-slate-700';
              const borderClass = isRegion || isTotal ? 'border-t-2 border-slate-200' : 'border-t border-slate-100';

              return (
                <tr key={idx} className={`${bgClass} ${borderClass}`}>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.region}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.branch}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.salesSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.salesManager}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csManager}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csSupervisor}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.implementSupervisor}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.implementSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{calcRatioSpecialist(row)}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{calcRatioFull(row)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SalesCsSection({ data }: SalesCsSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-amber-500 rounded-full" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">销售与客户成功人员配置</h2>
          <p className="text-sm text-slate-500 mt-1">数据更新日期：{data.updateDate}</p>
        </div>
      </div>

      <OverviewCards data={data} />

      <div className="grid grid-cols-1 gap-5">
        <RatioCompareChart data={data} />
      </div>

      <div className="grid grid-cols-1 gap-5">
        <SalesVsCsChart data={data} />
      </div>

      <DetailTable data={data} />

      <GuanMinRatioChart />
    </section>
  );
}
