import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, LayoutDashboard, Sparkles, Search, Bell, Settings,
  Sun, Moon, LogOut, Menu, ChevronRight, Activity, FileHeart
} from 'lucide-react';

interface NavItemProps {
  icon?: any;
  label: string;
  active?: boolean;
  badge?: number;
  isSubItem?: boolean;
  isDark?: boolean;
  isCollapsed?: boolean;
  hasArrow?: boolean;
  isLastSubItem?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, badge, isSubItem, isDark, isCollapsed, hasArrow, isOpen, onClick }: NavItemProps) {
  return (
    <motion.div 
      variants={{
        expanded: { height: "auto", opacity: 1, display: "block", transition: { duration: 0.3, ease: "easeOut" } },
        collapsed: { 
          height: isSubItem ? 0 : "auto", 
          opacity: isSubItem ? 0 : 1, 
          transition: { duration: 0.3, ease: "easeIn" },
          transitionEnd: { display: isSubItem ? "none" : "block" } 
        }
      }}
      className="relative"
    >
      {isSubItem && !isCollapsed && (
        <div className={`absolute left-[-1rem] top-1/2 w-2 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
      )}
      
      <button 
        onClick={onClick}
        title={isCollapsed && !isSubItem ? label : undefined}
        className={`flex items-center transition-all duration-300 group relative ${
          isCollapsed 
            ? (isSubItem ? 'px-0 py-0 m-0 h-0 overflow-hidden' : 'w-12 h-12 justify-center mx-auto rounded-xl mb-2') 
            : 'w-full justify-between px-4 rounded-xl ' + (isSubItem ? 'py-2 mb-1' : (active ? 'py-4 mb-2' : 'py-2.5 mb-1'))
        } ${
          active 
            ? (isDark 
                ? 'text-white bg-[#323B4E] shadow-[0_0_15px_rgba(42,53,213,0.15)] ring-1 ring-white/10' 
                : 'text-brand font-bold bg-slate-100 shadow-sm') 
            : (isDark ? 'text-slate-400 hover:text-white hover:bg-[#1F222E]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50')
        }`}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {Icon && (
            <div className={`transition-colors duration-300 ${isCollapsed ? '' : 'mr-3'} ${
              active 
                ? (isDark ? 'text-white' : 'text-brand') 
                : (isDark ? (isOpen ? 'text-white' : 'text-slate-500 group-hover:text-slate-300') : 'text-slate-400 group-hover:text-slate-600')
            }`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <motion.div
            variants={{
              expanded: { width: "auto", opacity: 1, display: "flex", transition: { duration: 0.3, ease: "easeOut" } },
              collapsed: { width: 0, opacity: 0, transition: { duration: 0.3, ease: "easeIn" }, transitionEnd: { display: "none" } }
            }}
            className="overflow-hidden whitespace-nowrap flex items-center"
          >
            <motion.span 
              variants={{
                expanded: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: "easeOut" } },
                collapsed: { opacity: 0, x: -10, filter: "blur(4px)", transition: { duration: 0.2, ease: "easeIn" } }
              }}
              style={{ display: 'inline-block' }}
              className={`${isSubItem ? 'text-xs' : 'text-sm'} tracking-wide ${active ? 'font-medium' : ''} ${!active && isOpen ? 'text-white' : ''}`}
            >
              {label}
            </motion.span>
          </motion.div>
        </div>
        
        <motion.div 
          variants={{
            expanded: { opacity: 1, width: "auto", display: "flex", filter: "blur(0px)", x: 0, transition: { duration: 0.4, ease: "easeOut" } },
            collapsed: { opacity: 0, width: 0, filter: "blur(4px)", x: -10, transition: { duration: 0.2, ease: "easeIn" }, transitionEnd: { display: "none" } }
          }}
          className="flex items-center space-x-2 overflow-hidden whitespace-nowrap"
        >
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
              active ? 'bg-brand text-white' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-brand-light text-brand')
            }`}>
              {badge}
            </span>
          )}
          {hasArrow && (
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-90 text-white' : ''}`} />
          )}
        </motion.div>
      </button>
    </motion.div>
  );
}

interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  currentPage: 'dashboard' | 'health-butler' | 'function-square' | 'ai-diagnosis' | 'medical-ai' | 'nurse-ai' | 'consultant-ai' | 'ai-component-management' | 'health-report';
  setCurrentPage: (page: 'dashboard' | 'health-butler' | 'function-square' | 'ai-diagnosis' | 'medical-ai' | 'nurse-ai' | 'consultant-ai' | 'ai-component-management' | 'health-report') => void;
  onLogout: () => void;
}

export function Sidebar({ isDarkMode, setIsDarkMode, isCollapsed, setIsCollapsed, currentPage, setCurrentPage, onLogout }: SidebarProps) {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [openMenus, setOpenMenus] = React.useState({ cockpit: true, featured: true });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className={`flex flex-col relative overflow-hidden z-10 shadow-sm shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} ${isDarkMode ? 'bg-[#0F111A] border-r border-slate-800' : 'bg-white border-r border-slate-100'}`}>
      
      {/* 1. Top Controls (Dots) */}
      <div className={`h-12 flex items-center shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        <motion.div 
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={{
            expanded: { width: "auto", opacity: 1, display: "flex", transition: { duration: 0.3 } },
            collapsed: { width: 0, opacity: 0, transition: { duration: 0.2 }, transitionEnd: { display: "none" } }
          }}
          className="flex space-x-1.5 overflow-hidden"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shrink-0"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shrink-0"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shrink-0"></div>
        </motion.div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Logo & Search */}
      <div className={`flex items-center mb-6 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        <div className="flex items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20 shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Activity className="w-7 h-7" />
            )}
          </div>
          <motion.div
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={{
              expanded: { width: "auto", opacity: 1, marginLeft: "0.75rem", display: "block", filter: "blur(0px)", x: 0, transition: { duration: 0.3, ease: "easeOut" } },
              collapsed: { width: 0, opacity: 0, marginLeft: 0, filter: "blur(4px)", x: -10, transition: { duration: 0.2, ease: "easeIn" }, transitionEnd: { display: "none" } }
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AI业务工作台</span>
          </motion.div>
        </div>
        <motion.button 
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={{
            expanded: { opacity: 1, width: "auto", display: "block", filter: "blur(0px)", x: 0, transition: { duration: 0.3, ease: "easeOut" } },
            collapsed: { opacity: 0, width: 0, filter: "blur(4px)", x: -10, transition: { duration: 0.2, ease: "easeIn" }, transitionEnd: { display: "none" } }
          }}
          className={`p-2 rounded-xl transition-colors overflow-hidden shrink-0 ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
        >
          <Search className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 3. Main Navigation */}
      <motion.nav 
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={{
          expanded: {
            transition: { staggerChildren: 0.03, delayChildren: 0.1 }
          },
          collapsed: {
            transition: { staggerChildren: 0.01, staggerDirection: -1 }
          }
        }}
        className={`flex-1 space-y-1 overflow-y-auto relative z-10 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}
      >
        <NavItem 
          icon={Home} 
          label="首页" 
          active={currentPage === 'dashboard'} 
          isDark={isDarkMode} 
          isCollapsed={isCollapsed} 
          onClick={() => setCurrentPage('dashboard')}
        />
        
        <motion.div variants={{ expanded: { transition: { staggerChildren: 0.03 } }, collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } } }} className="pt-2">
          <NavItem 
            icon={LayoutDashboard} 
            label="AI智能驾驶舱" 
            isDark={isDarkMode} 
            isCollapsed={isCollapsed} 
            hasArrow={!isCollapsed}
            isOpen={openMenus.cockpit}
            active={currentPage === 'function-square' || currentPage === 'health-butler' || currentPage === 'medical-ai' || currentPage === 'nurse-ai' || currentPage === 'consultant-ai'}
            onClick={() => {
              setOpenMenus(prev => ({ ...prev, cockpit: !prev.cockpit }));
              if (currentPage !== 'function-square') setCurrentPage('function-square');
            }}
          />
          <AnimatePresence initial={false}>
            {openMenus.cockpit && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div variants={{ expanded: { transition: { staggerChildren: 0.03 } }, collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } } }} className={`ml-9 space-y-0 relative transition-all duration-300 ${isCollapsed ? 'mt-0' : 'mt-1'}`}>
                  <motion.div 
                    variants={{ expanded: { opacity: 1 }, collapsed: { opacity: 0 } }}
                    className={`absolute left-[-1rem] top-0 bottom-5 w-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                  ></motion.div>
                  <NavItem 
                    label="我的AI工作台" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'consultant-ai'}
                    onClick={() => setCurrentPage('consultant-ai')}
                  />
                  <NavItem 
                    label="医疗AI工作台" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'medical-ai'}
                    onClick={() => setCurrentPage('medical-ai')}
                  />
                  <NavItem 
                    label="护士AI工作台" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'nurse-ai'}
                    onClick={() => setCurrentPage('nurse-ai')}
                  />
                  <NavItem 
                    label="健康管家AI" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'health-butler'}
                    onClick={() => setCurrentPage('health-butler')}
                  />
                  <NavItem label="预约管理AI" isSubItem isDark={isDarkMode} />
                  <NavItem label="发药管理AI" isSubItem isDark={isDarkMode} />
                  <NavItem label="成交管理AI" isSubItem isDark={isDarkMode} />
                  <NavItem label="消耗管理AI" isSubItem isDark={isDarkMode} />
                  <NavItem label="客户云仓" isSubItem isDark={isDarkMode} />
                  <NavItem label="数据门户" isSubItem isDark={isDarkMode} />
                  <NavItem label="会议管理" isSubItem isDark={isDarkMode} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={{ expanded: { transition: { staggerChildren: 0.03 } }, collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } } }} className="pt-2">
          <NavItem 
            icon={Sparkles} 
            label="特色服务" 
            isDark={isDarkMode} 
            isCollapsed={isCollapsed} 
            hasArrow={!isCollapsed}
            isOpen={openMenus.featured}
            active={currentPage === 'ai-diagnosis' || currentPage === 'ai-component-management'}
            onClick={() => {
              setOpenMenus(prev => ({ ...prev, featured: !prev.featured }));
              if (currentPage !== 'ai-diagnosis') setCurrentPage('ai-diagnosis');
            }}
          />
          <AnimatePresence initial={false}>
            {openMenus.featured && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div variants={{ expanded: { transition: { staggerChildren: 0.03 } }, collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } } }} className={`ml-9 space-y-0 relative transition-all duration-300 ${isCollapsed ? 'mt-0' : 'mt-1'}`}>
                  <motion.div 
                    variants={{ expanded: { opacity: 1 }, collapsed: { opacity: 0 } }}
                    className={`absolute left-[-1rem] top-0 bottom-5 w-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                  ></motion.div>
                  <NavItem 
                    label="AI辅助诊断" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'ai-diagnosis'}
                    onClick={() => setCurrentPage('ai-diagnosis')}
                  />
                  <NavItem label="AI辅助决策" isSubItem isDark={isDarkMode} />
                  <NavItem label="AI辅助康复" isSubItem isDark={isDarkMode} />
                  <NavItem 
                    label="AI组建管理" 
                    isSubItem 
                    isDark={isDarkMode} 
                    active={currentPage === 'ai-component-management'}
                    onClick={() => setCurrentPage('ai-component-management')}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <NavItem icon={Search} label="客户查询" isDark={isDarkMode} isCollapsed={isCollapsed} />
        <NavItem
          icon={FileHeart}
          label="体检报告"
          isDark={isDarkMode}
          isCollapsed={isCollapsed}
          active={currentPage === 'health-report'}
          onClick={() => setCurrentPage('health-report')}
        />
      </motion.nav>

      {/* 4. Bottom Sections (Notifications & Settings) */}
      <motion.div 
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={{
          expanded: {
            transition: { staggerChildren: 0.03, delayChildren: 0.3 }
          },
          collapsed: {
            transition: { staggerChildren: 0.01, staggerDirection: -1 }
          }
        }}
        className={`py-4 space-y-1 relative z-10 shrink-0 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}
      >
        <NavItem icon={Bell} label="通知公告" badge={3} isDark={isDarkMode} isCollapsed={isCollapsed} />
        <NavItem icon={Settings} label="工作台设置" isDark={isDarkMode} isCollapsed={isCollapsed} />
      </motion.div>

      {/* 5. Theme Switcher & User Profile */}
      <div className={`border-t relative z-10 shrink-0 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'} ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        
        <motion.div 
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={{
            expanded: { height: "auto", opacity: 1, marginBottom: "1rem", display: "flex", transition: { duration: 0.3, ease: "easeOut" } },
            collapsed: { height: 0, opacity: 0, marginBottom: 0, transition: { duration: 0.3, ease: "easeIn" }, transitionEnd: { display: "none" } }
          }}
          className={`items-center p-1 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#090B11]' : 'bg-slate-100'}`}
        >
          <button 
            onClick={() => setIsDarkMode(false)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${!isDarkMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button 
            onClick={() => setIsDarkMode(true)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </motion.div>

        <div className={`flex items-center rounded-2xl transition-all duration-300 ${isCollapsed ? 'justify-center p-2' : 'justify-between p-3'} ${isDarkMode ? 'bg-[#1F222E]' : 'bg-slate-50'}`}>
          <div className="flex items-center min-w-0">
            <div className="relative shrink-0">
              <img src="https://picsum.photos/seed/avatar3/100/100" alt="User" className="w-10 h-10 rounded-xl object-cover shadow-sm" referrerPolicy="no-referrer" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand border-2 border-white rounded-full"></span>
            </div>
            <motion.div 
              initial={false}
              animate={isCollapsed ? "collapsed" : "expanded"}
              variants={{
                expanded: { width: "auto", opacity: 1, marginLeft: "0.75rem", display: "flex", filter: "blur(0px)", x: 0, transition: { duration: 0.3, ease: "easeOut" } },
                collapsed: { width: 0, opacity: 0, marginLeft: 0, filter: "blur(4px)", x: -10, transition: { duration: 0.2, ease: "easeIn" }, transitionEnd: { display: "none" } }
              }}
              className="flex-col min-w-0 overflow-hidden whitespace-nowrap"
            >
              <span className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>李调度</span>
              <span className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>管理员</span>
            </motion.div>
          </div>
          <motion.button 
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={{
              expanded: { opacity: 1, width: "auto", display: "block", filter: "blur(0px)", x: 0, transition: { duration: 0.3, ease: "easeOut" } },
              collapsed: { opacity: 0, width: 0, filter: "blur(4px)", x: -10, transition: { duration: 0.2, ease: "easeIn" }, transitionEnd: { display: "none" } }
            }}
            onClick={onLogout} 
            className={`p-1.5 rounded-lg transition-colors overflow-hidden shrink-0 ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-400 hover:bg-slate-200'}`}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
