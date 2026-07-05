import type { DepartmentData, MonthlyData } from '@/types';
import { getLatestMonthData } from '@/utils/data-loader';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryTableProps {
  departments: DepartmentData[];
  totalMonthly: MonthlyData[];
  totalLabel?: string;
}

export default function SummaryTable({ departments, totalMonthly, totalLabel = '合计' }: SummaryTableProps) {
  if (departments.length === 0) return null;

  const latestTotal = totalMonthly[totalMonthly.length - 1];
  const months = totalMonthly.map(m => m.month);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800">
          各部门数据明细
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          点击列头可查看不同月份数据（展示最新月）
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10 min-w-[140px]">
                部门
              </th>
              <th className="text-center px-3 py-3 font-semibold text-slate-600">
                在职人数
              </th>
              <th className="text-center px-3 py-3 font-semibold text-slate-600">
                全职
              </th>
              <th className="text-center px-3 py-3 font-semibold text-slate-600">
                实习
              </th>
              <th className="text-center px-3 py-3 font-semibold text-emerald-600">
                入职
              </th>
              <th className="text-center px-3 py-3 font-semibold text-rose-600">
                离职
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">
                净变动
              </th>
              <th className="text-center px-3 py-3 font-semibold text-slate-600">
                人员变动趋势
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, idx) => {
              const latest = getLatestMonthData(dept);
              if (!latest) return null;
              return (
                <tr
                  key={dept.name}
                  className={`border-t border-slate-100 hover:bg-slate-50/50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="text-left px-4 py-3 font-medium text-slate-700 sticky left-0 bg-inherit z-10">
                    {dept.name}
                  </td>
                  <td className="text-center px-3 py-3 text-slate-700 font-semibold">
                    {latest.startCount}
                  </td>
                  <td className="text-center px-3 py-3 text-slate-600">
                    {latest.fullTime}
                  </td>
                  <td className="text-center px-3 py-3 text-slate-600">
                    {latest.intern}
                  </td>
                  <td className="text-center px-3 py-3 text-emerald-600 font-medium">
                    +{latest.joinCount}
                  </td>
                  <td className="text-center px-3 py-3 text-rose-600 font-medium">
                    -{latest.leaveCount}
                  </td>
                  <td className="text-center px-4 py-3">
                    <span className={`inline-flex items-center gap-1 font-medium ${
                      latest.netChange > 0
                        ? 'text-emerald-600'
                        : latest.netChange < 0
                        ? 'text-rose-600'
                        : 'text-slate-500'
                    }`}>
                      {latest.netChange > 0 ? (
                        <TrendingUp size={14} />
                      ) : latest.netChange < 0 ? (
                        <TrendingDown size={14} />
                      ) : (
                        <Minus size={14} />
                      )}
                      {latest.netChange > 0 ? '+' : ''}
                      {latest.netChange}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <MiniSparkline data={dept.monthly.map(m => m.startCount)} />
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-slate-200 bg-sky-50/50 font-semibold">
              <td className="text-left px-4 py-3 text-slate-800 sticky left-0 bg-sky-50/50 z-10">
                {totalLabel}
              </td>
              <td className="text-center px-3 py-3 text-slate-800">
                {latestTotal?.startCount ?? 0}
              </td>
              <td className="text-center px-3 py-3 text-slate-700">
                {latestTotal?.fullTime ?? 0}
              </td>
              <td className="text-center px-3 py-3 text-slate-700">
                {latestTotal?.intern ?? 0}
              </td>
              <td className="text-center px-3 py-3 text-emerald-700">
                +{latestTotal?.joinCount ?? 0}
              </td>
              <td className="text-center px-3 py-3 text-rose-700">
                -{latestTotal?.leaveCount ?? 0}
              </td>
              <td className="text-center px-4 py-3">
                <span className={`inline-flex items-center gap-1 ${
                  (latestTotal?.netChange ?? 0) > 0
                    ? 'text-emerald-700'
                    : (latestTotal?.netChange ?? 0) < 0
                    ? 'text-rose-700'
                    : 'text-slate-600'
                }`}>
                  {(latestTotal?.netChange ?? 0) > 0 ? (
                    <TrendingUp size={14} />
                  ) : (latestTotal?.netChange ?? 0) < 0 ? (
                    <TrendingDown size={14} />
                  ) : (
                    <Minus size={14} />
                  )}
                  {(latestTotal?.netChange ?? 0) > 0 ? '+' : ''}
                  {latestTotal?.netChange ?? 0}
                </span>
              </td>
              <td className="text-center px-3 py-3">
                <MiniSparkline data={totalMonthly.map(m => m.startCount)} accent />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
        统计月份：{months.join(' / ')}
      </div>
    </div>
  );
}

function MiniSparkline({ data, accent = false }: { data: number[]; accent?: boolean }) {
  const width = 100;
  const height = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = accent ? '#0ea5e9' : '#94a3b8';
  const fillColor = accent ? 'rgba(14, 165, 233, 0.15)' : 'rgba(148, 163, 184, 0.1)';

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="inline-block">
      <polygon points={areaPoints} fill={fillColor} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
