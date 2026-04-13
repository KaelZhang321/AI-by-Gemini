import React from 'react';
import { 
  ArrowUpDown, SlidersHorizontal, ChevronRight, Plus, 
  MessageSquareText, Paperclip 
} from 'lucide-react';
import { WORKS, TODOS } from '../data/mockData';

interface TaskSectionProps {
  activeTab: 'work' | 'todo' | 'risk';
  setActiveTab: (tab: 'work' | 'todo' | 'risk') => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
}

export function TaskSection({ 
  activeTab, 
  setActiveTab, 
  selectedTaskId, 
  setSelectedTaskId, 
  setIsCreateModalOpen 
}: TaskSectionProps) {
  const currentTasks = activeTab === 'work' ? WORKS : TODOS;

  return (
    <section className="xl:col-span-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 transition-colors duration-300">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setActiveTab('work')}
            className={`text-lg font-bold flex items-center transition-colors relative ${activeTab === 'work' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            任务中心
          </button>
          <button 
            onClick={() => setActiveTab('todo')}
            className={`text-lg font-bold flex items-center transition-colors relative ${activeTab === 'todo' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            待办事项
            <span className="ml-2 bg-[#FF5F57] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none shadow-sm">3</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
            <ArrowUpDown className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
            排序
            <ChevronRight className="w-3 h-3 ml-1.5 rotate-90 text-slate-400 dark:text-slate-500" />
          </button>
          <button className="flex items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
            <SlidersHorizontal className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
            筛选
            <ChevronRight className="w-3 h-3 ml-1.5 rotate-90 text-slate-400 dark:text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 items-start">
        {currentTasks.map(todo => {
          const isSelected = selectedTaskId === todo.id;
          
          return (
            <div 
              key={todo.id} 
              onClick={() => setSelectedTaskId(isSelected ? null : todo.id)}
              className={`group flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] scale-105 z-20 ring-1 ring-slate-200 dark:ring-slate-600 rotate-1' 
                  : 'shadow-sm hover:shadow-md hover:-translate-y-1 z-10'
              }`}
            >
              <div className="flex flex-col mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 leading-tight transition-colors duration-300">
                  {todo.title}
                </h3>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">
                  {todo.timeRange}
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors duration-300">任务描述</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 transition-colors duration-300">
                  {todo.description}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex -space-x-2">
                  {todo.assignees?.map((avatar, i) => (
                    <img key={i} src={avatar} alt="Assignee" className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-colors duration-300" />
                  ))}
                </div>
                <div className="flex items-center space-x-3 text-slate-400 dark:text-slate-500 transition-colors duration-300">
                  <div className="flex items-center text-xs font-medium">
                    <MessageSquareText className="w-4 h-4 mr-1" />
                    {todo.comments || 0}
                  </div>
                  <div className="flex items-center text-xs font-medium">
                    <Paperclip className="w-4 h-4 mr-1" />
                    {todo.attachments || 0}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-2 flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors duration-300">执行进度</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{todo.progress}%</span>
                    <button className="px-3 py-1 bg-brand text-white text-[10px] font-bold rounded-full hover:bg-brand-hover transition-colors shadow-sm">
                      去完成
                    </button>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${todo.progress > 80 ? 'bg-brand' : todo.progress > 40 ? 'bg-orange-400' : 'bg-red-400'}`}
                    style={{ width: `${todo.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300 min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:border-brand/20 dark:group-hover:border-brand/20">
            <Plus className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-brand dark:group-hover:text-brand-400 transition-colors duration-300" />
          </div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-brand dark:group-hover:text-brand-400 transition-colors duration-300">新建任务</span>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center transition-colors duration-300">点击添加新的工作或待办事项</p>
        </div>
      </div>
    </section>
  );
}
