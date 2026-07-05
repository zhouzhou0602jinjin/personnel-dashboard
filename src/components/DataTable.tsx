import type { DepartmentData } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataTableProps {
  data: DepartmentData | null;
}

export default function DataTable({ data }: DataTableProps) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800">
          月度变动明细
          <span className="text-slate-400 text-sm font-normal ml-2">— {data.name}</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-5 py-3 font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10">
                月份
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">
                月初人数
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">
                全职
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">
                实习
              </th>
              <th className="text-center px-4 py-3 font-semibold text-emerald-600">
                入职
              </th>
              <th className="text-center px-4 py-3 font-semibold text-rose-600">
                离职
              </th>
              <th className="text-center px-5 py-3 font-semibold text-slate-600">
                净变动
              </th>
            </tr>
          </thead>
          <tbody>
            {data.monthly.map((month, index) => (
              <tr
                key={month.month}
                className={`border-t border-slate-100 hover:bg-slate-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="text-left px-5 py-3 font-medium text-slate-700 sticky left-0 bg-inherit z-10">
                  {month.month}
                </td>
                <td className="text-center px-4 py-3 text-slate-700 font-medium">
                  {month.startCount}
                </td>
                <td className="text-center px-4 py-3 text-slate-600">
                  {month.fullTime}
                </td>
                <td className="text-center px-4 py-3 text-slate-600">
                  {month.intern}
                </td>
                <td className="text-center px-4 py-3 text-emerald-600 font-medium">
                  +{month.joinCount}
                </td>
                <td className="text-center px-4 py-3 text-rose-600 font-medium">
                  -{month.leaveCount}
                </td>
                <td className="text-center px-5 py-3">
                  <span className={`inline-flex items-center gap-1 font-medium ${
                    month.netChange > 0
                      ? 'text-emerald-600'
                      : month.netChange < 0
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}>
                    {month.netChange > 0 ? (
                      <TrendingUp size={14} />
                    ) : month.netChange < 0 ? (
                      <TrendingDown size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                    {month.netChange > 0 ? '+' : ''}
                    {month.netChange}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
