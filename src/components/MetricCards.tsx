import { Users, UserPlus, UserMinus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MonthlyData } from '@/types';

interface MetricCardsProps {
  data: MonthlyData | null;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  const trendIcon = trend !== undefined && trend > 0 ? (
    <TrendingUp size={16} className="text-emerald-500" />
  ) : trend !== undefined && trend < 0 ? (
    <TrendingDown size={16} className="text-rose-500" />
  ) : trend !== undefined ? (
    <Minus size={16} className="text-slate-400" />
  ) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value.toLocaleString()}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trendIcon}
              <span className={`text-xs font-medium ${
                trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {trend > 0 ? '+' : ''}{trend} 较上月
              </span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function MetricCards({ data }: MetricCardsProps) {
  if (!data) return null;

  const totalCount = data.startCount;
  const joinCount = data.joinCount;
  const leaveCount = data.leaveCount;
  const netChange = data.netChange;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="在职总人数"
        value={totalCount}
        icon={<Users size={24} className="text-sky-600" />}
        color="bg-sky-50"
      />
      <MetricCard
        title="本月入职"
        value={joinCount}
        icon={<UserPlus size={24} className="text-emerald-600" />}
        color="bg-emerald-50"
      />
      <MetricCard
        title="本月离职"
        value={leaveCount}
        icon={<UserMinus size={24} className="text-rose-600" />}
        color="bg-rose-50"
      />
      <MetricCard
        title="净变动"
        value={netChange}
        icon={netChange >= 0 ? (
          <TrendingUp size={24} className="text-amber-600" />
        ) : (
          <TrendingDown size={24} className="text-amber-600" />
        )}
        color="bg-amber-50"
      />
    </div>
  );
}
