import React from 'react';
import { Bell, Sparkles, CheckSquare } from 'lucide-react';
import { NOTICES } from '../data/mockData';

export function NoticesSection() {
  return (
    <section className="flex-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center transition-colors duration-300">
          <Bell className="w-5 h-5 mr-2 text-brand dark:text-brand-400 transition-colors duration-300" />
          通知公告
        </h2>
        <button className="text-sm font-medium text-brand dark:text-brand-400 hover:text-brand-hover transition-colors duration-300">
          全部
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
        {NOTICES.map((notice, index) => (
          <div key={notice.id} className={`flex flex-col py-4 ${index !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : 'pt-0'}`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
                {notice.title}
              </h3>
              {!notice.read && (
                <span className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0 ml-4"></span>
              )}
            </div>
            
            <div className="bg-[#F8FAFC] dark:bg-slate-800/50 rounded-xl p-4 mb-3 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center text-brand dark:text-brand-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">AI 摘要</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {notice.aiSummary}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {notice.date}
              </span>
              <button className="text-xs text-brand dark:text-brand-400 flex items-center hover:text-brand-hover transition-colors">
                {notice.read ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 mr-1" />
                    已读
                  </>
                ) : (
                  '标记已读'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
