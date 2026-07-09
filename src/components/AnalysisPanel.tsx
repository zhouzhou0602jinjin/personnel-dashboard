import { TrendingUp, TrendingDown, Users, UserPlus, UserMinus, Award, AlertTriangle, Info } from 'lucide-react';
import type { AnalysisSummary } from '@/utils/data-loader';

interface AnalysisPanelProps {
  summary: AnalysisSummary;
  monthLabel: string;
  accentColor?: 'sky' | 'emerald';
}

const accentBg = {
  sky: 'from-sky-500 to-sky-600',
  emerald: 'from-emerald-500 to-emerald-600',
};

export default function AnalysisPanel({ summary, monthLabel, accentColor = 'sky' }: AnalysisPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${accentBg[accentColor]} px-5 py-4`}>
        <h3 className="text-white font-semibold text-base flex items-center gap-2">
          <TrendingUp size={18} />
          {monthLabel}数据分析摘要
        </h3>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-sky-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sky-700 text-sm font-medium mb-2">
              <Users size={16} />
              在职总人数
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {summary.totalHeadcount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              全职 {summary.fullTimeCount} · 实习 {summary.internCount}
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-2">
              <UserPlus size={16} />
              本月入职
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {summary.totalJoin}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              入职率 {summary.joinRate}%
            </div>
          </div>
          <div className="bg-rose-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-rose-700 text-sm font-medium mb-2">
              <UserMinus size={16} />
              本月离职
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {summary.totalLeave}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              离职率 {summary.leaveRate}%
            </div>
          </div>
          <div className={`rounded-lg p-4 ${summary.totalNetChange >= 0 ? 'bg-amber-50' : 'bg-orange-50'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium mb-2 ${summary.totalNetChange >= 0 ? 'text-amber-700' : 'text-orange-700'}`}>
              {summary.totalNetChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              净变动
            </div>
            <div className={`text-2xl font-bold ${summary.totalNetChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {summary.totalNetChange > 0 ? '+' : ''}{summary.totalNetChange}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              共 {summary.deptCount} 个部门
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Award size={16} className="text-emerald-500" />
              增长亮点
            </div>
            <div className="space-y-2 text-sm">
              {summary.topGrowthDept.name !== '-' ? (
                <div className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                  <span className="text-slate-600">增长最快：{summary.topGrowthDept.name}</span>
                  <span className="text-emerald-600 font-semibold">+{summary.topGrowthDept.count}</span>
                </div>
              ) : (
                <div className="text-slate-400 text-sm">无净增长部门</div>
              )}
              {summary.topJoinDept.name !== '-' && summary.topJoinDept.count > 0 && (
                <div className="flex items-center justify-between bg-sky-50 rounded-lg px-3 py-2">
                  <span className="text-slate-600">入职最多：{summary.topJoinDept.name}</span>
                  <span className="text-sky-600 font-semibold">+{summary.topJoinDept.count}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <AlertTriangle size={16} className="text-amber-500" />
              关注重点
            </div>
            <div className="space-y-2 text-sm">
              {summary.topDeclineDept.name !== '-' ? (
                <div className="flex items-center justify-between bg-rose-50 rounded-lg px-3 py-2">
                  <span className="text-slate-600">减少最多：{summary.topDeclineDept.name}</span>
                  <span className="text-rose-600 font-semibold">{summary.topDeclineDept.count}</span>
                </div>
              ) : (
                <div className="text-slate-400 text-sm">无净减少部门</div>
              )}
              {summary.topLeaveDept.name !== '-' && summary.topLeaveDept.count > 0 && (
                <div className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
                  <span className="text-slate-600">离职最多：{summary.topLeaveDept.name}</span>
                  <span className="text-amber-600 font-semibold">-{summary.topLeaveDept.count}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {summary.notes && summary.notes.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Info size={16} className="text-blue-500" />
              备注说明
            </div>
            <div className="space-y-2">
              {summary.notes.map((note, index) => (
                <div key={index} className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-slate-600">
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
