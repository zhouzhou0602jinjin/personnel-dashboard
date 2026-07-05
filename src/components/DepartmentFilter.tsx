import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DepartmentFilterProps {
  departments: string[];
  selected: string;
  onChange: (dept: string) => void;
  label?: string;
}

export default function DepartmentFilter({ departments, selected, onChange, label }: DepartmentFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-700 hover:border-slate-300 transition-colors shadow-sm min-w-[180px] justify-between"
      >
        {label && (
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {label}
          </span>
        )}
        <span className="text-sm font-medium">{selected}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => {
                onChange(dept);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selected === dept
                  ? 'bg-sky-50 text-sky-700 font-medium'
                  : 'text-slate-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
