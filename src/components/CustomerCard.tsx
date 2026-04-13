import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

export const CustomerCard = ({ customer, idx, onClick }: any) => {
  const circleRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      if (!circle?.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);

      tlRef.current = tl;
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.easeOut',
      overwrite: 'auto'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="px-8 py-6 grid grid-cols-12 gap-4 items-center transition-all cursor-pointer border-b border-slate-50/50 group relative overflow-hidden"
    >
      <span 
        className="absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
        style={{ background: 'var(--color-brand, #3B82F6)', willChange: 'transform' }}
        ref={circleRef}
      />
      
      <div className="col-span-4 flex items-center space-x-4 relative z-[2]">
        <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-hover rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand/10 group-hover:rotate-3 transition-all">
          {customer.avatar}
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-bold text-slate-900 group-hover:text-white transition-colors truncate">{customer.name}</h4>
          <p className="text-xs text-slate-500 group-hover:text-white/80 mt-0.5 transition-colors truncate">{customer.theme}</p>
        </div>
      </div>

      <div className="col-span-3 relative z-[2]">
        <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 group-hover:bg-white/20 text-slate-600 group-hover:text-white transition-colors text-[10px] font-bold rounded-3xl border border-slate-100 group-hover:border-white/30">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-white mr-1.5 transition-colors"></div>
          {customer.status}
        </span>
      </div>

      <div className="col-span-3 relative z-[2]">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 group-hover:text-white/70 transition-colors font-bold uppercase tracking-wider">血压</span>
            <span className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">{customer.bp}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 group-hover:text-white/70 transition-colors font-bold uppercase tracking-wider">风险</span>
            <span className={`text-xs font-bold transition-colors ${customer.risk.includes('0.7') || customer.risk.includes('高压') ? 'text-red-500 group-hover:text-red-200' : 'text-emerald-500 group-hover:text-emerald-200'}`}>
              {customer.risk}
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-2 text-right relative z-[2]">
        <button className="p-2 bg-white group-hover:bg-white/20 border border-slate-100 group-hover:border-white/30 text-brand group-hover:text-white rounded-3xl transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
