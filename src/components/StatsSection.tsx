import React from 'react';
import { Activity, Settings, CheckSquare, BarChart2, Zap, Layers, TrendingUp, Bell, CheckSquare as CheckSquareIcon, Sparkles } from 'lucide-react';
import { NOTICES } from '../data/mockData';

function StatCard({ title, value, unit, trend, icon: Icon, trendUp }: { title: string, value: string, unit: string, trend: string, icon: any, trendUp?: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">{title}</span>
        <div className="p-1.5 bg-brand-light dark:bg-brand-900/30 rounded-lg transition-colors duration-300">
          <Icon className="w-4 h-4 text-brand dark:text-brand-400 transition-colors duration-300" />
        </div>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">{unit}</span>
      </div>
      <div className={`text-[10px] mt-2 font-bold flex items-center transition-colors duration-300 ${trendUp ? 'text-brand dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
        {trendUp && <TrendingUp className="w-3 h-3 mr-1" />}
        {trend}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center transition-colors duration-300">
          <Activity className="w-5 h-5 mr-2 text-brand dark:text-brand-400 transition-colors duration-300" />
          AI 效能统计
        </h2>
        <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-brand dark:hover:text-brand-400 hover:bg-brand-light dark:hover:bg-brand-900/30 rounded-xl transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="今日处理" value="24" unit="项" trend="+12%" icon={CheckSquare} trendUp />
        <StatCard title="SOP 达标" value="98" unit="%" trend="+2%" icon={BarChart2} trendUp />
        <StatCard title="AI 节省" value="2.5" unit="h" trend="+0.5h" icon={Zap} trendUp />
        <StatCard title="跨系统调用" value="156" unit="次" trend="稳定" icon={Layers} />
      </div>
    </section>
  );
}
