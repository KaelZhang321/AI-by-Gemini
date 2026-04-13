import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, MessageSquare, X } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

interface AIAssistantProps {
  messages: Message[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendMessage: (overrideText?: string) => void;
  isAIOpen: boolean;
  setIsAIOpen: (val: boolean) => void;
}

export function AIAssistant({ 
  messages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  isAIOpen, 
  setIsAIOpen 
}: AIAssistantProps) {
  
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, j) => (
      <React.Fragment key={j}>
        {line.startsWith('📊') || line.startsWith('🚗') ? (
          <strong className="block mb-2 text-slate-900 dark:text-white text-base font-bold transition-colors duration-300">{line}</strong>
        ) : line.includes('[点击一键派单') ? (
          <button className="mt-3 w-full py-2.5 bg-brand-light dark:bg-brand-900/30 text-brand dark:text-brand-400 font-bold rounded-xl hover:bg-brand-border dark:hover:bg-brand-800/50 transition-colors border border-brand-border dark:border-brand-700/50 shadow-sm">{line}</button>
        ) : (
          <span className="block">{line}</span>
        )}
      </React.Fragment>
    ));
  };

  const SuggestedQuestions = ({ isSmall = false }: { isSmall?: boolean }) => (
    <div className={`${isSmall ? 'shrink-0 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 transition-colors duration-300' : 'flex-1 overflow-y-auto pr-2 custom-scrollbar'}`}>
      <p className={`font-medium text-slate-500 dark:text-slate-400 mb-4 transition-colors duration-300 ${isSmall ? 'text-xs mb-2' : 'text-sm'}`}>
        {isSmall ? '猜您想问' : '您可以尝试问我以下问题'}
      </p>
      <div className={`${isSmall ? 'flex flex-wrap gap-2' : 'flex flex-col space-y-3'}`}>
        {[
          { text: "帮我查询张美玲在云仓的剩余库存", tag: "客户云仓" },
          { text: "今天下午3点到5点，有哪些空闲的专车司机？", tag: "约车调度" },
          { text: "生成一份本周高端客户接待效能报告", tag: "数据分析" },
          { text: "查看最新的合规审查红头文件", tag: "政策中心" }
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt.text)}
            className={`${
              isSmall 
                ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-border dark:hover:border-brand-500/50 text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-brand-400 text-xs px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]'
                : 'bg-white dark:bg-slate-800 hover:bg-brand-light/50 dark:hover:bg-brand-900/20 cursor-pointer p-5 rounded-2xl transition-all shadow-sm flex flex-col space-y-3 border border-transparent hover:border-brand-border dark:hover:border-brand-500/50 text-left'
            }`}
            title={prompt.text}
          >
            <span className={`${isSmall ? '' : 'text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300'}`}>
              {isSmall ? prompt.text : `"${prompt.text}"`}
            </span>
            {!isSmall && <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">{prompt.tag}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const ChatInput = ({ isFloating = false }: { isFloating?: boolean }) => (
    <div className={`relative group w-full shrink-0 ${isFloating ? '' : 'mb-6'}`}>
      <motion.div 
        className="absolute -inset-0.5 rounded-full opacity-30 blur-md group-focus-within:opacity-60 transition-opacity duration-500"
        style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd, #2563eb, #3b82f6)',
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div 
        className="absolute inset-0 rounded-full opacity-50 group-focus-within:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd, #2563eb, #3b82f6)',
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-full m-[1.5px] flex items-center shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <input 
          type="text" 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="请告诉我需要协助的事情..." 
          className={`w-full bg-transparent rounded-full pl-6 pr-28 py-4 text-sm focus:outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 relative z-10 transition-colors duration-300 ${isFloating ? 'py-3.5' : ''}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-3 z-10">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider transition-colors duration-300">{chatInput.length}/100</span>
          <button 
            onClick={() => chatInput.trim() && handleSendMessage()}
            className="w-10 h-10 flex items-center justify-center bg-brand hover:bg-brand-hover rounded-full text-white shadow-lg shadow-brand/30 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="flex-1 flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-300 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center transition-colors duration-300">
            <Sparkles className="w-5 h-5 mr-2 text-brand dark:text-brand-400 transition-colors duration-300" />
            智能助手
          </h2>
          <span className="text-[10px] font-bold text-brand dark:text-brand-400 bg-brand-light dark:bg-brand-900/30 px-2 py-0.5 rounded-lg border border-brand-border dark:border-brand-500/20 uppercase tracking-wider transition-colors duration-300">
            AI 实时在线
          </span>
        </div>
        {messages.length <= 1 && <ChatInput />}

        <div className="w-full flex-1 flex flex-col min-h-0">
          {messages.length > 1 ? (
            <>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
                {messages.slice(1).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mr-2 transition-colors duration-300">
                        <Sparkles className="w-4 h-4 text-brand dark:text-brand-400 transition-colors duration-300" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    }`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                ))}
              </div>
              <ChatInput />
              <SuggestedQuestions isSmall />
            </>
          ) : (
            <SuggestedQuestions />
          )}
        </div>
      </section>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isAIOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 w-[400px] h-[550px] rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 mb-4 flex flex-col overflow-hidden transition-colors duration-300"
            >
              <div className="h-16 bg-gradient-to-r from-brand to-brand-hover px-5 flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex items-center text-white relative z-10">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-sm">AI 智能助手</span>
                    <span className="text-[10px] text-cyan-100">Lizi Kar Workspace</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAIOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors relative z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0 mr-2 shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    }`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0 transition-colors duration-300">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="询问跨系统数据或SOP..."
                    className="w-full bg-slate-100/80 dark:bg-slate-900/80 border-transparent rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-brand dark:focus:border-brand-500 focus:ring-4 focus:ring-brand/10 dark:focus:ring-brand/20 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!chatInput.trim()}
                    className="absolute right-2 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-brand to-brand-hover text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md hover:shadow-brand/20 transition-all"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsAIOpen(!isAIOpen)}
          className="w-14 h-14 bg-gradient-to-r from-brand to-brand-hover text-white rounded-full shadow-lg shadow-brand/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 relative group"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {!isAIOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#D54941] border-2 border-white dark:border-slate-800 rounded-full shadow-sm transition-colors duration-300"></span>
          )}
        </button>
      </div>
    </>
  );
}
