import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: 'sky' | 'emerald' | 'amber' | 'rose';
  children: ReactNode;
}

const accentStyles = {
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export default function Section({ title, subtitle, icon, accentColor = 'sky', children }: SectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-8 ${accentStyles[accentColor]} rounded-full`} />
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1 ml-0">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
