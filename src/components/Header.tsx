import { Calendar, Info } from 'lucide-react';

interface HeaderProps {
  updateDate: string;
}

export default function Header({ updateDate }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white py-8 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              人员信息变动统计看板
            </h1>
            <p className="text-slate-300 mt-2 text-sm md:text-base">
              各部门月度人员流动数据可视化分析
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Calendar size={18} className="text-emerald-400" />
              <span className="text-sm text-slate-200">数据更新：{updateDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-lg backdrop-blur-sm cursor-help group relative">
              <Info size={18} className="text-sky-400" />
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs text-slate-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                每周五更新数据，统计各部门人员入职、离职及净变动情况
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
