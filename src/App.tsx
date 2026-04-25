import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TaskSection } from './components/TaskSection';
import { RiskSection } from './components/RiskSection';
import { AIAssistant } from './components/AIAssistant';
import { CommonFunctions } from './components/CommonFunctions';
import { NoticesSection } from './components/NoticesSection';
import { StatsSection } from './components/StatsSection';
import { ReceptionModal, CreateTaskModal } from './components/Modals';
import { HealthButlerView } from './components/HealthButlerView';
import { FunctionSquareView } from './components/FunctionSquareView';
import { AIDiagnosisView } from './components/AIDiagnosisView';
import { MedicalAIWorkbench } from './components/MedicalAIWorkbench';
import { NurseAIWorkbench } from './components/NurseAIWorkbench';
import { ConsultantAIWorkbench } from './components/ConsultantAIWorkbench';
import { AIReportComparisonDetailView } from './components/AIReportInterpretationDetailView';
import { AIFourQuadrantView } from './components/AIFourQuadrantView';
import { AIComponentManagementView } from './components/AIComponentManagementView';
import { AIRealtimeRecordingView } from './components/AIRealtimeRecordingView';
import { HealthReportView } from './components/HealthReport/HealthReportView';
import { LoginPage } from './LoginPage';
import { NOTICES } from './data/mockData';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarDarkMode, setIsSidebarDarkMode] = useState(true);
  const [isContentDarkMode, setIsContentDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'health-butler' | 'function-square' | 'ai-diagnosis' | 'medical-ai' | 'nurse-ai' | 'consultant-ai' | 'ai-report-comparison-detail' | 'ai-four-quadrant' | 'ai-component-management' | 'ai-realtime-recording' | 'health-report'>('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'work' | 'todo' | 'risk'>('work');
  const [chatInput, setChatInput] = useState('');
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(2);
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [receptionForm, setReceptionForm] = useState({
    name: '张美玲',
    serial: 'REQ-20240125-001',
    details: '客户到院，体温正常，准备进行深度体检方案签署。'
  });

  const [messages, setMessages] = useState([
    { role: 'ai', content: '您好，我是丽滋卡尔AI助手。您可以向我查询跨系统数据，例如：“张美玲在云仓还剩多少库存？”或“今日下午约车排班”。' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % NOTICES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = (overrideText?: string) => {
    const query = typeof overrideText === 'string' ? overrideText : chatInput;
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setChatInput('');

    // Mock AI Response
    setTimeout(() => {
      let response = '已为您汇总相关数据。';
      if (query.includes('张美玲') && query.includes('库存')) {
        response = '📊 **数据简报**\n张美玲（ID: VIP-8821）在客户云仓当前剩余：\n- 极品燕窝：2盒\n- 定制营养素：5瓶\n\n最近一次出库时间为 2026-03-10。';
      } else if (query.includes('空闲司机') || query.includes('派车') || query.includes('专车司机')) {
        response = '🚗 **运力简报**\n当前周边 3 公里内空闲司机：\n1. 张师傅 (京A·88***) - 距 1.2km\n2. 李师傅 (京A·66***) - 距 2.5km\n\n[点击一键派单至张师傅]';
      } else if (query.includes('效能报告')) {
        response = '📈 **效能简报**\n本周高端客户接待效能：\n- 客户满意度：99.2%\n- 平均等待时长：4.5分钟 (达标)\n- 异常派单率：0.1%\n\n报告已生成，[点击预览完整报告]';
      } else if (query.includes('红头文件')) {
         response = '🛡️ **政策速递**\n为您找到最新文件：《2026年度第一季度合规审查红头文件》\n核心内容：强调数据隐私保护，严禁跨权限导出老客户CRM数据。\n\n[点击查看文件详情]';
      }
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div id="root-app-container" className="flex h-screen bg-[#F4F6F8] font-sans text-slate-800 overflow-hidden">
      
      <Sidebar 
        isDarkMode={isSidebarDarkMode} 
        setIsDarkMode={setIsSidebarDarkMode} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem('rememberedEmail');
        }}
      />

      <div className={`flex-1 flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${isContentDarkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-[#F4F6F8] text-slate-800'}`}>
        {currentPage === 'dashboard' && (
          <Header currentNoticeIndex={currentNoticeIndex} currentPage={currentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
        )}

        <main id="main-content-area" className={`flex-1 overflow-y-auto pb-8 relative px-8 ${currentPage === 'dashboard' ? 'pt-4' : 'pt-8'}`}>
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-brand-light/40 via-brand-light/20 to-transparent dark:from-brand-900/20 dark:via-brand-900/10 pointer-events-none -z-10"></div>
          
          <div className="max-w-[1720px] mx-auto space-y-6 h-full">
            {currentPage === 'dashboard' ? (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
                  <TaskSection 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    selectedTaskId={selectedTaskId} 
                    setSelectedTaskId={setSelectedTaskId} 
                    setIsCreateModalOpen={setIsCreateModalOpen} 
                  />
                  <RiskSection />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                  {/* Left Column */}
                  <div className="xl:col-span-1 flex flex-col gap-6">
                    <AIAssistant 
                      messages={messages} 
                      chatInput={chatInput} 
                      setChatInput={setChatInput} 
                      handleSendMessage={handleSendMessage} 
                      isAIOpen={isAIOpen} 
                      setIsAIOpen={setIsAIOpen} 
                    />
                    <StatsSection />
                  </div>

                  {/* Right Column */}
                  <div className="xl:col-span-2 flex flex-col gap-6">
                    <CommonFunctions setIsReceptionModalOpen={setIsReceptionModalOpen} />
                    <NoticesSection />
                  </div>
                </div>
              </>
            ) : currentPage === 'health-butler' ? (
              <HealthButlerView />
            ) : currentPage === 'function-square' ? (
              <FunctionSquareView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
            ) : currentPage === 'ai-diagnosis' ? (
              <AIDiagnosisView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
            ) : currentPage === 'medical-ai' ? (
              <MedicalAIWorkbench setCurrentPage={setCurrentPage} />
            ) : currentPage === 'nurse-ai' ? (
              <NurseAIWorkbench />
            ) : currentPage === 'ai-report-comparison-detail' ? (
              <AIReportComparisonDetailView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} navigationParams={navigationParams} />
            ) : currentPage === 'ai-four-quadrant' ? (
              <AIFourQuadrantView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} navigationParams={navigationParams} />
            ) : currentPage === 'ai-component-management' ? (
              <AIComponentManagementView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
            ) : currentPage === 'ai-realtime-recording' ? (
              <AIRealtimeRecordingView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
            ) : currentPage === 'health-report' ? (
              <HealthReportView setCurrentPage={setCurrentPage} isDarkMode={isContentDarkMode} setIsDarkMode={setIsContentDarkMode} />
            ) : (
              <ConsultantAIWorkbench setCurrentPage={setCurrentPage} setNavigationParams={setNavigationParams} />
            )}
          </div>
        </main>
      </div>

      <ReceptionModal 
        isOpen={isReceptionModalOpen} 
        onClose={() => setIsReceptionModalOpen(false)} 
        form={receptionForm} 
        setForm={setReceptionForm} 
      />

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

    </div>
  );
}
