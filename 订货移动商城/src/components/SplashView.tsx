import React, { useEffect, useState } from 'react';
import { WLogo } from './WLogo';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashViewProps {
  onEnter: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoaded(true);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-primary text-white flex flex-col justify-between p-6 z-50 overflow-hidden select-none">
      {/* Top micro elements (Aesthetic Pairings) */}
      <div className="flex justify-between items-center opacity-85 pt-3">
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-[#d8daff]">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          <span>PORTAL_ACTIVE // V4.2</span>
        </div>
        <div className="flex items-center gap-1 font-sans text-[10px] text-[#e0e2ff] font-medium bg-white/10 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
          <span>常州监管局直连保税网点</span>
        </div>
      </div>

      {/* Center Gorgeous Logo & Titles block */}
      <div className="flex flex-col items-center justify-center text-center my-auto space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-32 h-32 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center relative group"
        >
          {/* Inner ambient glowing circles */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-60 transition-opacity animate-pulse" />
          <WLogo className="w-24 h-24 text-brand-primary z-10" color="brand" />
        </motion.div>

        <div className="space-y-2.5 max-w-sm z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-sans text-xl font-extrabold tracking-tight text-white"
          >
            常州唯一产品订货平台
          </motion.h1>
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs text-[#dcdfe6] font-medium leading-relaxed"
          >
            常州酒厂大宗B2B协议供销枢纽 • 智能仓储核单派单一站式工作舱
          </motion.p>
        </div>
      </div>

      {/* Bottom Progress Bar & Enter Action Card */}
      <div className="w-full max-w-sm mx-auto space-y-5 pb-6">
        {!loaded ? (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-[#cbd0ff]">
              <span>常州保税港双曲窖藏配额校正中...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-secondary transition-all duration-100 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <button 
              onClick={onEnter}
              className="w-full h-13 bg-brand-secondary hover:bg-white hover:text-brand-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>开启订货新时代</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#c5c8ff]">
              点击即可进入专属协议登录节点，自主分流采购与供应方视图
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
