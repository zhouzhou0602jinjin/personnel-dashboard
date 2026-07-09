import ReactECharts from 'echarts-for-react';
import { Users, UserCheck, Briefcase, BarChart3 } from 'lucide-react';

interface BranchData {
  branch: string;
  city: string;
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
  const regions = data.regions;
  const names = regions.map((r) => r.regionName);
  const specialistRatios = regions.map((r) => {
    if (r.summary.salesSpecialist === 0) return 0;
    return Number(
      ((r.summary.csSpecialist + r.summary.implementSpecialist) / r.summary.salesSpecialist).toFixed(2)
    );
  });
  const fullRatios = regions.map((r) => {
    const denominator = r.summary.salesSpecialist + r.summary.salesManager;
    if (denominator === 0) return 0;
    return Number(
      (
        (r.summary.csManager +
          r.summary.csSupervisor +
          r.summary.csSpecialist +
          r.summary.implementSupervisor +
          r.summary.implementSpecialist) /
        denominator
      ).toFixed(2)
    );
  });

  const option = {
    title: {
      text: '各片区客成销售比对比',
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
      data: ['客成销售比（专员）', '客成销售比（全量）'],
      top: '5%',
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '18%',
      containLabel: true,
    },
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
      axisLabel: { color: '#475569', fontSize: 11 },
    },
    series: [
      {
        name: '客成销售比（专员）',
        type: 'bar' as const,
        data: specialistRatios.map((value) => ({
          value,
          itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: '40%',
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
        data: fullRatios.map((value) => ({
          value,
          itemStyle: { color: '#10b981', borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: '40%',
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
      <ReactECharts option={option} style={{ height: '360px' }} />
    </div>
  );
}

function PositionStackChart({ data }: { data: SalesCsData }) {
  const regions = data.regions;
  const names = regions.map((r) => r.regionName);

  const seriesData = [
    { name: '销售专员', key: 'salesSpecialist' as const, color: '#3b82f6' },
    { name: '销售主管', key: 'salesManager' as const, color: '#1e40af' },
    { name: '客户成功经理', key: 'csManager' as const, color: '#22c55e' },
    { name: '客户成功主管', key: 'csSupervisor' as const, color: '#86efac' },
    { name: '客户成功专员', key: 'csSpecialist' as const, color: '#10b981' },
    { name: '实施主管', key: 'implementSupervisor' as const, color: '#f97316' },
    { name: '实施专员', key: 'implementSpecialist' as const, color: '#f59e0b' },
  ];

  const series = seriesData.map((s) => ({
    name: s.name,
    type: 'bar' as const,
    stack: 'total' as const,
    data: regions.map((r) => r.summary[s.key]),
    itemStyle: { color: s.color },
    barWidth: '50%',
  }));

  const option = {
    title: {
      text: '各片区岗位人数分布',
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
      data: seriesData.map((s) => s.name),
      top: '5%',
      textStyle: { fontSize: 11 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: names,
      axisLine: {
        lineStyle: { color: '#e2e8f0' },
      },
      axisTick: { show: false },
      axisLabel: { color: '#475569', fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: '#f1f5f9' },
      },
      axisLabel: { color: '#64748b' },
    },
    series,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '360px' }} />
    </div>
  );
}

function SalesVsCsChart({ data }: { data: SalesCsData }) {
  const regions = data.regions;
  const names = regions.map((r) => r.regionName);
  const salesTotals = regions.map((r) => r.summary.salesSpecialist + r.summary.salesManager);
  const csTotals = regions.map(
    (r) =>
      r.summary.csManager +
      r.summary.csSupervisor +
      r.summary.csSpecialist +
      r.summary.implementSupervisor +
      r.summary.implementSpecialist
  );

  const option = {
    title: {
      text: '销售团队 vs 客户成功团队人数对比',
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
    },
    legend: {
      data: ['销售团队', '客户成功团队'],
      top: '5%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: names,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#475569', fontSize: 11 },
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
        data: salesTotals,
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
        barWidth: '30%',
        barGap: '10%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 11 },
      },
      {
        name: '客户成功团队',
        type: 'bar' as const,
        data: csTotals,
        itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
        barWidth: '30%',
        label: { show: true, position: 'top' as const, color: '#475569', fontSize: 11 },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '360px' }} />
    </div>
  );
}

function CsRolePieChart({ data }: { data: SalesCsData }) {
  const s = data.summary;
  const pieData = [
    { value: s.csManager, name: '客户成功经理' },
    { value: s.csSupervisor, name: '客户成功主管' },
    { value: s.csSpecialist, name: '客户成功专员' },
    { value: s.implementSupervisor, name: '实施主管' },
    { value: s.implementSpecialist, name: '实施专员' },
  ].filter((d) => d.value > 0);

  const option = {
    title: {
      text: '客户成功团队岗位分布',
      left: 'left',
      textStyle: { fontSize: 16, fontWeight: 600, color: '#334155' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
      formatter: '{b}: {c}人 ({d}%)',
    },
    legend: {
      orient: 'vertical' as const,
      right: '5%',
      top: 'center',
      textStyle: { fontSize: 12, color: '#475569' },
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '70%'] as [string, string],
        center: ['40%', '55%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{c}人',
          fontSize: 11,
          color: '#475569',
        },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.1)' },
        },
        data: pieData.map((d, i) => ({
          ...d,
          itemStyle: {
            color: ['#22c55e', '#86efac', '#10b981', '#f97316', '#f59e0b'][i],
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <ReactECharts option={option} style={{ height: '360px' }} />
    </div>
  );
}

function BranchRatioRankChart({ data }: { data: SalesCsData }) {
  const branches: { name: string; ratio: number; region: string }[] = [];
  data.regions.forEach((region) => {
    region.branches.forEach((branch) => {
      if (branch.salesSpecialist > 0) {
        const ratio = (branch.csSpecialist + branch.implementSpecialist) / branch.salesSpecialist;
        branches.push({
          name: branch.city ? `${branch.branch}(${branch.city})` : branch.branch,
          ratio: Number(ratio.toFixed(2)),
          region: region.regionName,
        });
      }
    });
  });

  const sorted = branches.sort((a, b) => a.ratio - b.ratio);
  const names = sorted.map((b) => b.name);
  const ratios = sorted.map((b) => b.ratio);

  const option = {
    title: {
      text: '各分公司客成销售比排行（专员）',
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
      formatter: (params: any) => {
        const item = sorted[params[0].dataIndex];
        return `${item.region}<br/>${item.name}: <b>${item.ratio}</b>`;
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#475569', fontSize: 10 },
    },
    series: [
      {
        type: 'bar' as const,
        data: ratios.map((value) => ({
          value,
          itemStyle: {
            color: value >= 3 ? '#ef4444' : value >= 2 ? '#f59e0b' : '#3b82f6',
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
      <ReactECharts option={option} style={{ height: '500px' }} />
    </div>
  );
}

function DetailTable({ data }: { data: SalesCsData }) {
  const rows: {
    type: 'region' | 'branch' | 'total';
    region?: string;
    branch?: string;
    city?: string;
    salesSpecialist: number;
    salesManager: number;
    csManager: number;
    csSupervisor: number;
    csSpecialist: number;
    implementSupervisor: number;
    implementSpecialist: number;
  }[] = [];

  data.regions.forEach((region) => {
    rows.push({
      type: 'region',
      region: region.regionName,
      branch: region.regionName,
      city: '-',
      salesSpecialist: region.summary.salesSpecialist,
      salesManager: region.summary.salesManager,
      csManager: region.summary.csManager,
      csSupervisor: region.summary.csSupervisor,
      csSpecialist: region.summary.csSpecialist,
      implementSupervisor: region.summary.implementSupervisor,
      implementSpecialist: region.summary.implementSpecialist,
    });

    region.branches.forEach((branch) => {
      rows.push({
        type: 'branch',
        region: region.regionName,
        branch: branch.branch,
        city: branch.city,
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
    city: '-',
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
    '分公司',
    '城市',
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
      <h3 className="text-base font-semibold text-slate-800 mb-4">各片区与分公司人员明细</h3>
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
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.city}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.salesSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.salesManager}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csManager}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csSupervisor}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.csSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.implementSupervisor}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{row.implementSpecialist}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {calcRatioSpecialist(row)}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {calcRatioFull(row)}
                  </td>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <RatioCompareChart data={data} />
        <PositionStackChart data={data} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SalesVsCsChart data={data} />
        <CsRolePieChart data={data} />
      </div>

      <BranchRatioRankChart data={data} />

      <DetailTable data={data} />
    </section>
  );
}
