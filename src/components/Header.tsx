import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Zap, Bell, Stethoscope, Activity, FileCode, Image as ImageIcon, Download, Moon, Sun } from 'lucide-react';
import { NOTICES } from '../data/mockData';
import { exportToHtml, exportToImage } from '../lib/exportUtils';

interface HeaderProps {
  currentNoticeIndex: number;
  currentPage: 'dashboard' | 'health-butler' | 'function-square' | 'ai-diagnosis' | 'medical-ai' | 'nurse-ai' | 'consultant-ai' | 'ai-report-comparison-detail';
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function Header({ currentNoticeIndex, currentPage, isDarkMode, setIsDarkMode }: HeaderProps) {
  const handleExportHtml = () => {
    const fileName = `丽滋卡尔_${currentPage}_${new Date().toISOString().split('T')[0]}.html`;
    exportToHtml('root-app-container', fileName);
  };

  const handleExportImage = () => {
    const fileName = `丽滋卡尔_${currentPage}_${new Date().toISOString().split('T')[0]}.png`;
    exportToImage('root-app-container', fileName);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'AI业务工作台';
      case 'health-butler': return '健康管家AI';
      case 'function-square': return '功能广场';
      case 'ai-diagnosis': return 'AI智能诊断';
      case 'medical-ai': return '医疗AI工作台';
      case 'nurse-ai': return '护士AI工作台';
      case 'consultant-ai': return '我的AI工作台';
      case 'ai-report-comparison-detail': return 'AI报告对比';
      default: return 'AI业务工作台';
    }
  };
  return (
    <header className="h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-8 shrink-0 z-20 transition-colors duration-300">
      
      {/* Greeting */}
      <div className="flex items-center mr-8 shrink-0">
        <div className="w-12 h-12 flex items-center justify-center mr-3">
          {currentPage === 'dashboard' ? (
            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {getPageTitle()}
        </h1>

        {/* Export Buttons */}
        <div className="flex items-center bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-1 shadow-sm ml-6 transition-colors duration-300">
          <button 
            onClick={handleExportHtml}
            title="导出为HTML"
            className="flex items-center space-x-2 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand-400 hover:bg-brand-light dark:hover:bg-brand-900/30 rounded-lg transition-all text-xs font-bold"
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden lg:inline">HTML</span>
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button 
            onClick={handleExportImage}
            title="导出为图片"
            className="flex items-center space-x-2 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand-400 hover:bg-brand-light dark:hover:bg-brand-900/30 rounded-lg transition-all text-xs font-bold"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden lg:inline">图片</span>
          </button>
        </div>
      </div>

      {/* Notice Carousel */}
      {currentPage !== 'ai-diagnosis' && currentPage !== 'dashboard' && (
        <div className="flex-1 mr-8 flex items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-xl px-4 py-2.5 relative overflow-hidden group border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <Volume2 className="w-4 h-4 text-brand mr-4 shrink-0 animate-pulse" />
          
          <div className="flex-1 overflow-hidden relative h-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNoticeIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center text-sm text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:text-brand dark:hover:text-brand-400 transition-colors"
              >
                <span className="font-mono text-brand dark:text-brand-400 mr-3 tracking-wider bg-brand/10 dark:bg-brand-900/30 px-2 py-0.5 rounded text-xs border border-brand/20 dark:border-brand-500/20 flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-brand dark:text-brand-400" />
                  {NOTICES[currentNoticeIndex].date}
                </span>
                <span className="tracking-wide font-medium">{NOTICES[currentNoticeIndex].title}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {(currentPage === 'ai-diagnosis' || currentPage === 'dashboard') && <div className="flex-1"></div>}

      <div className="flex items-center space-x-4 shrink-0">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-brand dark:hover:text-brand-400 hover:bg-brand-light dark:hover:bg-brand-900/30 rounded-xl transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="relative p-2 text-slate-400 dark:text-slate-500 hover:text-brand dark:hover:text-brand-400 hover:bg-brand-light dark:hover:bg-brand-900/30 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D54941] rounded-full animate-pulse shadow-[0_0_8px_rgba(213,73,65,0.6)]"></span>
        </button>
        <div className="text-sm text-slate-600 dark:text-slate-300 font-medium bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 px-4 py-2 rounded-full shadow-sm transition-colors duration-300">
          2026年3月16日 星期一
        </div>
      </div>
    </header>
  );
}
