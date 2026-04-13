import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Search, 
  Filter, 
  Sparkles,
  Send,
  FileText,
  Activity,
  ChevronRight,
  ChevronLeft,
  Plus,
  User,
  Bot,
  X,
  LayoutDashboard,
  Users,
  HeartPulse,
  Save,
  Paperclip,
  ArrowUp,
  Pencil,
  Check
} from 'lucide-react';
import { CUSTOMERS } from '../data/mockData';
import { AnimatedList, AnimatedRow } from './AIReportInterpretationDetailView';
import { AI_CARDS_DATA, SortableCard } from './AICards';

type SavedLayout = {
  id: string;
  name: string;
  cards: string[];
  customerId?: string;
};

import BlobCursor from './BlobCursor';

const EditableLayoutTag: React.FC<{ layout: SavedLayout, onRename: (id: string, newName: string) => void, onApply: (id: string) => void }> = ({ layout, onRename, onApply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(layout.name);

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSave = () => {
    if (name.trim()) {
      onRename(layout.id, name.trim());
    } else {
      setName(layout.name);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-blue-300">
        <input 
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="text-xs outline-none w-24 bg-transparent text-slate-900 dark:text-white"
        />
        <button onClick={handleSave} className="text-blue-500 hover:text-blue-600">
          <Check className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className="group relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 backdrop-blur-md border border-white/60 dark:border-white/10 text-indigo-900 dark:text-indigo-100 text-sm rounded-2xl font-semibold cursor-pointer transition-colors"
      title="点击应用布局"
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex items-center space-x-2">
        <span onClick={() => onApply(layout.id)} className="block drop-shadow-sm">{layout.name}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-100 ml-1"
          title="修改名称"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export const ConsultantAIWorkbench: React.FC<{ setCurrentPage: (page: any) => void, setNavigationParams?: (params: any) => void }> = ({ setCurrentPage, setNavigationParams }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New states for layout and AI assistant
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isAssistantShrunk, setIsAssistantShrunk] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiFloatingTip, setAiFloatingTip] = useState('');
  const constraintsRef = useRef(null);

  // Dashboard cards state
  const [dashboardCards, setDashboardCards] = useState<string[]>([]);
  const [isLayoutSaved, setIsLayoutSaved] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  
  // Chat history state
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);

  // Load saved layout on mount
  useEffect(() => {
    const savedLayoutsData = localStorage.getItem('aiWorkbenchLayouts');
    if (savedLayoutsData) {
      const parsedLayouts = JSON.parse(savedLayoutsData);
      setSavedLayouts(parsedLayouts);
    } else {
      const legacyLayout = localStorage.getItem('aiWorkbenchLayout');
      if (legacyLayout) {
        // Legacy layout support can be ignored as we now tie layouts to customers
      }
    }
  }, []);

  const loadCustomerLayout = (customer: any, currentLayouts: SavedLayout[]) => {
    const customerLayouts = currentLayouts.filter(l => l.customerId === customer.id);
    if (customerLayouts.length > 0) {
      setDashboardCards(customerLayouts[customerLayouts.length - 1].cards);
    } else {
      // Default layout for customers without saved layouts
      setDashboardCards(['panorama', 'risk', 'objection', 'renewal', 'upsell', 'consumption', 'insight', 'action']);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDashboardCards((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
      setIsLayoutSaved(false);
    }
  };

  const handleSaveLayout = () => {
    if (!selectedCustomer) return;
    
    const customerLayoutsCount = savedLayouts.filter(l => l.customerId === selectedCustomer.id).length;
    
    const newLayout = {
      id: Date.now().toString(),
      name: `AI结果显示区-默认布局${customerLayoutsCount + 1}`,
      cards: [...dashboardCards],
      customerId: selectedCustomer.id
    };
    const newLayouts = [...savedLayouts, newLayout];
    setSavedLayouts(newLayouts);
    localStorage.setItem('aiWorkbenchLayouts', JSON.stringify(newLayouts));
    setIsLayoutSaved(true);
    setTimeout(() => setIsLayoutSaved(false), 2000);
  };

  const handleReorderLayouts = (reorderedCustomerLayouts: SavedLayout[]) => {
    if (!selectedCustomer) return;
    const otherLayouts = savedLayouts.filter(l => l.customerId !== selectedCustomer.id);
    const newLayouts = [...otherLayouts, ...reorderedCustomerLayouts];
    setSavedLayouts(newLayouts);
    localStorage.setItem('aiWorkbenchLayouts', JSON.stringify(newLayouts));
  };

  const handleRenameLayout = (id: string, newName: string) => {
    const newLayouts = savedLayouts.map(l => l.id === id ? { ...l, name: newName } : l);
    setSavedLayouts(newLayouts);
    localStorage.setItem('aiWorkbenchLayouts', JSON.stringify(newLayouts));
  };

  const handleApplyLayout = (id: string) => {
    const layout = savedLayouts.find(l => l.id === id);
    if (layout) {
      setDashboardCards(layout.cards);
    }
  };

  const handleDeleteCard = (id: string) => {
    setDashboardCards(prev => prev.filter(cardId => cardId !== id));
  };

  const currentCustomerLayouts = useMemo(() => {
    if (!selectedCustomer) return [];
    return savedLayouts.filter(l => l.customerId === selectedCustomer.id);
  }, [savedLayouts, selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    return CUSTOMERS.filter(c => 
      c.name.includes(searchTerm) || 
      (c.phone && c.phone.includes(searchTerm)) || 
      (c.idCard && c.idCard.includes(searchTerm))
    );
  }, [searchTerm]);

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(false);
    setChatHistory([{ role: 'assistant', content: `已为您定位到客户 ${customer.name}，已同步客户档案。您可以让我整理客户全景、判断续费概率等。` }]);
    loadCustomerLayout(customer, savedLayouts);
  };

  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return;
    
    const query = chatMessage.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    
    // Check if chat message matches any customer name, phone, or idCard
    if (!selectedCustomer) {
      const foundCustomer = CUSTOMERS.find(c => 
        c.name === query || 
        c.phone === query || 
        c.idCard === query
      );
      
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
        setChatMessage('');
        setChatHistory(prev => [...prev, { role: 'assistant', content: `已为您定位到客户 ${foundCustomer.name}，已同步客户档案。您可以让我整理客户全景、判断续费概率等。` }]);
        loadCustomerLayout(foundCustomer, savedLayouts);
        return;
      } else {
        setChatHistory(prev => [...prev, { role: 'assistant', content: '未找到匹配的客户，请重新输入姓名、手机号或身份证号。' }]);
      }
    } else {
      // If customer is selected, check for specific queries
      let matchedCardId = 'panorama';
      let matchedTitle = '客户全景摘要';
      
      if (query.includes('全景') || query.includes('基本信息') || query.includes('摘要')) { matchedCardId = 'panorama'; matchedTitle = '客户全景摘要'; }
      else if (query.includes('风险') || query.includes('预警') || query.includes('处置')) { matchedCardId = 'risk'; matchedTitle = '风险处置建议'; }
      else if (query.includes('异议') || query.includes('预判')) { matchedCardId = 'objection'; matchedTitle = '异议预判'; }
      else if (query.includes('续费') || query.includes('建议')) { matchedCardId = 'renewal'; matchedTitle = '续费建议'; }
      else if (query.includes('升单') || query.includes('潜力') || query.includes('机会')) { matchedCardId = 'upsell'; matchedTitle = '升单机会'; }
      else if (query.includes('消费') || query.includes('节奏') || query.includes('预测')) { matchedCardId = 'consumption'; matchedTitle = '消费节奏预测'; }
      else if (query.includes('洞察') || query.includes('分层')) { matchedCardId = 'insight'; matchedTitle = '客户分层洞察'; }
      else if (query.includes('跟进') || query.includes('话术') || query.includes('动作')) { matchedCardId = 'action'; matchedTitle = '跟进动作与话术'; }
      // Management Cards Mapping
      else if (query.includes('基本信息') || query.includes('档案')) { matchedCardId = 'basic-info'; matchedTitle = '基本信息'; }
      else if (query.includes('营销') || query.includes('团队') || query.includes('店铺')) { matchedCardId = 'sales-team'; matchedTitle = '营销团队信息'; }
      else if (query.includes('医疗') || query.includes('医生') || query.includes('服务团队')) { matchedCardId = 'medical-team'; matchedTitle = '治疗服务团队信息'; }
      else if (query.includes('资产') || query.includes('余额') || query.includes('项目金')) { matchedCardId = 'asset'; matchedTitle = '客户资产概览'; }
      else if (query.includes('健康') || query.includes('体征') || query.includes('过敏')) { matchedCardId = 'health-services'; matchedTitle = '健康服务与体征'; }
      else if (query.includes('家庭') || query.includes('关系') || query.includes('图谱')) { matchedCardId = 'family-relations'; matchedTitle = '家庭关系图谱'; }
      else if (query.includes('规划') || query.includes('记录') || query.includes('治疗项目')) { matchedCardId = 'treatment-records'; matchedTitle = '治疗规划记录'; }
      
      setIsRightPanelOpen(false);
      setAiFloatingTip(`正在为您生成${matchedTitle}...`);
      
      // Simulate generating results
      setTimeout(() => {
        // Add the matched card to the dashboard if it's not already there
        setDashboardCards(prev => {
          if (!prev.includes(matchedCardId)) {
            return [...prev, matchedCardId];
          }
          return prev;
        });
        
        setAiResults(prev => [{
          id: Date.now(),
          type: matchedTitle,
          title: matchedTitle,
          content: `已为您生成 ${selectedCustomer.name} 的 ${matchedTitle} 卡片，请在右侧工作台查看。`
        }, ...prev]);
        
        setChatHistory(prev => [...prev, { role: 'assistant', content: `已为您生成 ${selectedCustomer.name} 的 ${matchedTitle} 卡片，请在右侧工作台查看。` }]);
        
        setAiFloatingTip(`已为您生成 ${matchedTitle} 卡片`);
        setTimeout(() => setAiFloatingTip(''), 3000);
      }, 1000);
    }
    
    setChatMessage('');
  };

  const middleColClass = 
    !isAssistantShrunk && isRightPanelOpen ? 'col-span-6' :
    !isAssistantShrunk && !isRightPanelOpen ? 'col-span-9' :
    isAssistantShrunk && isRightPanelOpen ? 'col-span-9' :
    'col-span-12';

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">我的AI工作台</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">AI业务中台 | 仅展示我负责的客户与客户信息</p>
        </div>
        <div className="flex items-center space-x-3">
          {dashboardCards.length > 0 && (
            <button 
              onClick={handleSaveLayout}
              className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                isLayoutSaved 
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
              }`}
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">{isLayoutSaved ? '已保存布局' : '收藏当前布局'}</span>
            </button>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索客户姓名/ID..." 
              onClick={() => setIsModalOpen(true)}
              readOnly
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-sm focus:ring-2 focus:ring-brand outline-none w-64 text-slate-900 dark:text-white placeholder-slate-400 transition-colors duration-300 cursor-pointer"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300 flex items-center justify-center w-10 h-10">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">筛</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden relative">
        
        {/* Left Sidebar: AI Assistant */}
        {!isAssistantShrunk && (
          <div className="col-span-3 flex flex-col overflow-hidden min-h-0 transition-colors duration-300">
          <div className="p-5 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">小智</h3>
              <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-bold">AI助手</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <button 
                onClick={() => setIsAssistantShrunk(true)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="收起小助手"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm backdrop-blur-md">
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {chatHistory.length > 0 ? (
              <div className="space-y-6">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 shrink-0 shadow-sm">AI</div>
                    )}
                    <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : !selectedCustomer ? (
              <>
                <div className="flex flex-col items-start">
                  <div className="max-w-[95%] p-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm text-sm leading-relaxed">
                    请先选择确定客户。我会基于该客户的档案、方案、消费与沟通信息，为你生成卡片化结果。
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  {['选中客户后可查看客户全景', '选中客户后可预测消费趋势', '选中客户后可生成跟进建议', '选中客户后可输出回访话术'].map((text, i) => (
                    <button key={i} disabled className="w-full py-3 px-4 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-xs font-medium rounded-xl border border-slate-100/50 dark:border-slate-700/50 text-left transition-all cursor-not-allowed">
                      {text}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-start space-y-4">
                  <div className="max-w-[95%] p-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm text-sm leading-relaxed">
                    已同步<span className="font-bold text-blue-600 dark:text-blue-400">{selectedCustomer.name}</span>的客户档案、在管方案与消费记录。现在可以直接向我提问。
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">AI</div>
                    <span className="text-[10px] font-bold text-slate-400">小智助手</span>
                  </div>
                  <div className="max-w-[95%] p-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm text-sm leading-relaxed">
                    你好，我已经准备好围绕<span className="font-bold text-blue-600 dark:text-blue-400">{selectedCustomer.name}</span>的客户经营进行分析。你可以让我整理客户全景、判断续费概率、预测消耗、提示风险，或输出升单方向。
                  </div>
                </div>
                <div className="space-y-3 mt-8">
                  {[`生成${selectedCustomer.name}的客户全景摘要`, '查看风险处置建议', '预测消费节奏', '生成跟进动作与话术'].map((text, i) => (
                    <button 
                      key={i} 
                      onClick={() => setChatMessage(text)}
                      className="group w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <span className="flex items-center justify-between">
                        {text}
                        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 transition-colors duration-300 border-t border-slate-100 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 rounded-b-2xl">
            <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder={!selectedCustomer ? "输入客户姓名/手机号/身份证号..." : "给小智下达指令..."}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm px-4 py-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button 
                onClick={handleChatSubmit}
                disabled={!chatMessage.trim()}
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${!chatMessage.trim() ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md hover:scale-105'}`}
              >
                <ArrowUp className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>
          </div>
        </div>
        )}

        {/* Middle Column: Main Content */}
        <div className={`${middleColClass} flex flex-col h-full min-h-0 ${!isRightPanelOpen ? 'pr-[72px]' : ''}`}>
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors duration-300">
          
          {!selectedCustomer ? (
            // Empty State - Top Banner
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">请选择客户开始 AI 工作台</h3>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] rounded font-medium">仅支持权限内客户</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">先从顶部搜索框中选择确定客户，系统才会同步客户档案、方案信息与固定 AI 分析卡。</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all whitespace-nowrap"
              >
                去选择客户
              </button>
            </div>
          ) : (
            // Default State - Customer Info Bar
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedCustomer.name} · VIP会员</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] rounded-full font-bold uppercase">VIP</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{selectedCustomer.age}岁 · {selectedCustomer.gender} · 当前在管方案2个 · 最近30天沟通下降 · 仅看我负责客户</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    if (setNavigationParams) {
                      setNavigationParams({ customerId: selectedCustomer.id });
                    }
                    setCurrentPage('ai-report-comparison-detail');
                  }}
                  className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold shadow-sm hover:bg-blue-600 transition-all"
                >
                  AI报告对比
                </button>
                <button 
                  onClick={() => {
                    if (setNavigationParams) {
                      setNavigationParams({ customerId: selectedCustomer.id });
                    }
                    setCurrentPage('ai-four-quadrant');
                  }}
                  className="px-4 py-1.5 bg-purple-500 text-white rounded-full text-xs font-bold shadow-sm hover:bg-purple-600 transition-all"
                >
                  四象限健康评估
                </button>
              </div>
            </div>
          )}

          {/* Layout Tags Track */}
          {selectedCustomer && currentCustomerLayouts.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 relative overflow-hidden group">
              <div className="px-6 py-3 flex items-center">
                <div className="flex-1 overflow-x-auto custom-scrollbar relative" ref={constraintsRef}>
                  <div className="flex space-x-3 w-max px-2 pb-1 min-w-full">
                    {currentCustomerLayouts.map(layout => (
                      <motion.div 
                        key={layout.id} 
                        drag="x"
                        dragConstraints={constraintsRef}
                        dragElastic={0.2}
                        dragMomentum={true}
                        className="cursor-grab active:cursor-grabbing shrink-0"
                      >
                        <EditableLayoutTag 
                          layout={layout} 
                          onRename={handleRenameLayout} 
                          onApply={handleApplyLayout} 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Results Area */}
          <div className="flex-1 p-6 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI结果显示区</h3>
              {!selectedCustomer ? (
                <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] rounded-full font-medium">待客户激活</span>
              ) : (
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] rounded-full font-medium">客户信息已同步</span>
              )}
            </div>

            {!selectedCustomer ? (
              // Empty State - Results Area
              <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-800/30">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 font-bold text-2xl mb-6">客</div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">请先选择确定客户</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-12 leading-relaxed">
                  客户确定后，系统会同步客户基本信息与方案信息；左侧继续和小智对话后，这里开始展示 AI 生成结果。
                </p>
                
                <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 text-left shadow-sm">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                    <div className="font-bold text-slate-900 dark:text-white mb-1">选择客户</div>
                    <div className="text-xs text-slate-500">同步客户上下文</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 text-left shadow-sm">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                    <div className="font-bold text-slate-900 dark:text-white mb-1">与小智对话</div>
                    <div className="text-xs text-slate-500">提出分析问题</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 text-left shadow-sm">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                    <div className="font-bold text-slate-900 dark:text-white mb-1">生成结果卡</div>
                    <div className="text-xs text-slate-500">在这里展示 AI 输出</div>
                  </div>
                </div>
              </div>
            ) : (
              // Default State - Results Area
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col space-y-6 pb-6 pr-2">
                {dashboardCards.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={dashboardCards}
                      strategy={rectSortingStrategy}
                    >
                      <div className="flex flex-wrap gap-6">
                        {dashboardCards.map((id) => {
                          const cardData = AI_CARDS_DATA.find(c => c.id === id);
                          if (!cardData) return null;
                          const CardComponent = cardData.component;
                          return (
                            <SortableCard 
                              key={id} 
                              id={id} 
                              title={cardData.title} 
                              colSpan={cardData.colSpan}
                              onEnlarge={() => setExpandedCardId(id)}
                              onDelete={() => handleDeleteCard(id)}
                            >
                              <CardComponent />
                            </SortableCard>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : aiResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {aiResults.map((result) => (
                        <motion.div 
                          key={result.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                        >
                          <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <h4 className="font-bold text-slate-900 dark:text-white">{result.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {result.content}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 font-bold text-2xl mb-6">AI</div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">已同步客户与方案信息，等待你与小智对话</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                        当你在左侧对话框向小智提问后，AI 会在这里生成摘要卡、建议卡、话术卡等结果。
                      </p>
                      <button className="px-6 py-2.5 bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                        试着问：给出续费建议
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="font-bold text-slate-700 dark:text-slate-300 mb-2">示例结果卡：客户全景摘要</div>
                        <div className="text-xs text-slate-500">展示客户当前价值、活跃状态、核心风险与沟通要点。</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="font-bold text-slate-700 dark:text-slate-300 mb-2">示例结果卡：行动建议</div>
                        <div className="text-xs text-slate-500">展示续费、升单、回访、预警处理等下一步动作建议。</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="font-bold text-blue-500 mb-3 text-sm">推荐对话起点</div>
                      <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li>总结客户近期经营重点</li>
                        <li>判断未来6个月消费趋势</li>
                        <li>生成续费与升单策略</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Right Sidebar Collapsed Icon Bar */}
        {!isRightPanelOpen && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-40">
            {/* Expand Button */}
            <button 
              onClick={() => setIsRightPanelOpen(true)}
              className="absolute -left-12 flex flex-col items-center justify-center w-10 py-4 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 mb-1" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">开</span>
            </button>

            {/* AI Icons Pill */}
            <div className="flex flex-col items-center py-6 px-2 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 space-y-6">
              <span className="text-sm font-bold text-slate-400">AI</span>
              
              <div className="flex flex-col space-y-5">
                {/* Consumption */}
                <div 
                  className="relative w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setIsRightPanelOpen(true)}
                  title="AI消耗预测"
                >
                  <span className="text-xl font-bold text-blue-500">¥</span>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">6</span>
                  </div>
                </div>

                {/* Upsell */}
                <div 
                  className="relative w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setIsRightPanelOpen(true)}
                  title="AI生单潜力"
                >
                  <span className="text-xl font-bold text-purple-500">升</span>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">高</span>
                  </div>
                </div>

                {/* Risk */}
                <div 
                  className="relative w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setIsRightPanelOpen(true)}
                  title="AI风险预警"
                >
                  <span className="text-xl font-bold text-red-500">!</span>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">中</span>
                  </div>
                </div>
              </div>

              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2"></div>
            </div>
          </div>
        )}

        {/* Right Sidebar: Insights */}
        {isRightPanelOpen && (
          <div className="col-span-3 flex flex-col h-full">
            {/* Right Sidebar Header */}
            <div className="p-5 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">AI 智能洞察</h3>
                </div>
                <button 
                  onClick={() => setIsRightPanelOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="收起洞察面板"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6">
                {/* AI Consumption Prediction */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300 flex flex-col min-h-[250px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI消耗预测</h3>
              {!selectedCustomer ? (
                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-medium">待生成</span>
              ) : (
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">6个月预测</span>
              )}
            </div>
            
            {!selectedCustomer ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="flex space-x-1 mb-4">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-sm">选择确定客户后自动生成</div>
                <div className="text-xs text-slate-400">当前卡片保持空白提示态，引导你先从顶部选择权限范围内的客户。</div>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">4月 启动期</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">体检评估 + 首次中医调理</div>
                  <div className="text-xs text-blue-500 font-medium mt-0.5">预计消耗 ¥8,500</div>
                </div>
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">5-6月 密集期</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">中医调理4次 + 光电抗衰2次</div>
                  <div className="text-xs text-blue-500 font-medium mt-0.5">预计消耗 ¥32,000</div>
                </div>
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">7-9月 巩固期</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">复查 + 维护疗程组合</div>
                  <div className="text-xs text-blue-500 font-medium mt-0.5">预计消耗 ¥27,500</div>
                </div>
              </div>
            )}
          </div>

          {/* AI Upsell Potential */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300 flex flex-col min-h-[250px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI升单潜力</h3>
              {!selectedCustomer ? (
                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-medium">待生成</span>
              ) : (
                <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">高机会</span>
              )}
            </div>

            {!selectedCustomer ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="flex space-x-1 mb-4">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-sm">选择确定客户后自动生成</div>
                <div className="text-xs text-slate-400">当前卡片保持空白提示态，引导你先从顶部选择权限范围内的客户。</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">高</div>
                    <div className="text-[10px] text-purple-500 font-medium">升单潜力</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">45%</div>
                    <div className="text-[10px] text-blue-500 font-medium">转化概率</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-3 text-center flex flex-col justify-center items-center">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">¥80K</div>
                    <div className="text-[10px] text-green-500 font-medium">潜在金额</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">推荐：中医调理金卡</div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 max-w-[140px] leading-tight">AI匹配度 92% · 基于消费节奏与沟通意向分析</div>
                    <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-all">生成话术</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Risk Warning */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300 flex flex-col min-h-[250px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI风险预警</h3>
              {!selectedCustomer ? (
                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-medium">待生成</span>
              ) : (
                <span className="text-[10px] text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">中风险</span>
              )}
            </div>

            {!selectedCustomer ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="flex space-x-1 mb-4">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-sm">选择确定客户后自动生成</div>
                <div className="text-xs text-slate-400">当前卡片保持空白提示态，引导你先从顶部选择权限范围内的客户。</div>
              </div>
            ) : (
              <>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">最近30天沟通频次下降，活跃度较上月回落</span>
                  </li>
                  <li className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">当前方案进入平稳期，客户价值感可能减弱</span>
                  </li>
                  <li className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">高价值VIP客户需尽快形成下一轮经营动作</span>
                  </li>
                </ul>
                <div className="mt-auto p-3 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    <span className="font-bold">AI建议：</span>72小时内完成一次主动回访
                  </p>
                </div>
              </>
            )}
          </div>
          </div>

          </div>
        )}
      </div>

      {/* Customer Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">选择客户</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">从列表中选择要分析的客户，或通过姓名、手机号、身份证号检索</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="输入客户姓名、手机号或身份证号搜索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900/50">
                <div className="grid grid-cols-12 gap-4 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 py-4 px-8 font-semibold bg-white dark:bg-slate-800">
                  <div className="col-span-2 text-left">客户姓名</div>
                  <div className="col-span-2 text-left">性别 / 年龄</div>
                  <div className="col-span-2 text-left">最近体检日期</div>
                  <div className="col-span-2 text-left">AI综合判断</div>
                  <div className="col-span-3 text-left">关键异常指标</div>
                  <div className="col-span-1 text-center">操作</div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <AnimatedList className="flex flex-col w-full space-y-2">
                    {filteredCustomers.map((customer, index) => (
                      <AnimatedRow key={customer.id} customer={customer} index={index} onViewDetails={handleSelectCustomer} />
                    ))}
                    {filteredCustomers.length === 0 && (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        没有找到匹配的客户
                      </div>
                    )}
                  </AnimatedList>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Q-version AI Assistant */}
      <AnimatePresence>
        {isAssistantShrunk && (
          <motion.div 
            initial={{ scale: 0, opacity: 0, x: -50, y: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0, x: -50, y: 50 }}
            className="absolute bottom-8 left-8 z-50 flex items-end space-x-4"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  boxShadow: [
                    "0px 10px 20px -5px rgba(59, 130, 246, 0.4)",
                    "0px 25px 35px -5px rgba(168, 85, 247, 0.6)",
                    "0px 10px 20px -5px rgba(59, 130, 246, 0.4)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 cursor-pointer overflow-hidden relative z-10" 
                onClick={() => setIsAssistantShrunk(false)}
                title="点击展开工作台"
              >
                <img src="/uploads/1744425338166-f28329b3-195c-4235-937b-586b40e947d6.png" alt="AI Assistant" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full z-0 pointer-events-none"
              />
              {/* Floating Tip */}
              <AnimatePresence>
                {aiFloatingTip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-full mb-2 ml-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm px-4 py-2 rounded-2xl rounded-bl-none shadow-xl border border-slate-100 dark:border-slate-700 whitespace-nowrap z-50"
                  >
                    {aiFloatingTip}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {expandedCardId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setExpandedCardId(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const cardData = AI_CARDS_DATA.find(c => c.id === expandedCardId);
                if (!cardData) return null;
                const CardComponent = cardData.component;
                return (
                  <>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{cardData.title}</h3>
                      </div>
                      <button 
                        onClick={() => setExpandedCardId(null)}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
                      <CardComponent />
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
