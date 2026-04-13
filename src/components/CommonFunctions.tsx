import React from 'react';
import { Layers } from 'lucide-react';
import { SYSTEMS } from '../data/mockData';

interface CommonFunctionsProps {
  setIsReceptionModalOpen: (open: boolean) => void;
}

export function CommonFunctions({ setIsReceptionModalOpen }: CommonFunctionsProps) {
  return (
    <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center transition-colors duration-300">
          <Layers className="w-5 h-5 mr-2 text-brand dark:text-brand-400 transition-colors duration-300" />
          常用功能
        </h2>
        <span className="text-[10px] font-bold text-brand dark:text-brand-400 bg-brand-light dark:bg-brand-900/30 px-2 py-0.5 rounded-lg border border-brand-border dark:border-brand-500/20 uppercase tracking-wider transition-colors duration-300">
          AI 自动授权
        </span>
      </div>
      <div className="flex justify-between items-center py-4 px-2 overflow-x-auto custom-scrollbar gap-4">
        {SYSTEMS.map((sys, index) => {
          const isActive = index === 0;
          return (
            <div 
              key={sys.id} 
              onClick={() => {
                if (sys.name === '到院接待') {
                  setIsReceptionModalOpen(true);
                }
              }}
              className={`flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ${
              isActive 
                ? 'w-[88px] h-[104px] bg-gradient-to-b from-brand to-brand-hover rounded-[24px] shadow-[0_12px_30px_-8px_rgba(59,130,246,0.6)] hover:-translate-y-1.5' 
                : 'w-[76px] h-[104px] hover:-translate-y-1.5'
            }`}>
              <div className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 relative ${
                isActive 
                  ? 'bg-white shadow-sm' 
                  : 'bg-white dark:bg-slate-800 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)] group-hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.4)]'
              }`}>
                {sys.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#D54941] to-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md z-20 border-2 border-white dark:border-slate-800 transition-colors duration-300">
                    {sys.count}
                  </span>
                )}
                <sys.icon 
                  className={`w-[24px] h-[24px] ${sys.color} transition-transform duration-300 group-hover:scale-110`} 
                  strokeWidth={2.5}
                />
              </div>
              <span className={`text-sm font-bold text-center whitespace-nowrap transition-colors ${
                isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}>
                {sys.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
