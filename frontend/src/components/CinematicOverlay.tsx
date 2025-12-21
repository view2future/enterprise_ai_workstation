import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Play, Shield, Globe, Award, TrendingUp } from 'lucide-react';
import { cinematicEngine } from '../utils/cinematicEngine';

export const CinematicOverlay: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: "2025 西南 AI 生态概览", icon: Globe, desc: "覆盖川渝云贵陕 526 家核心 AI 企业节点" },
    { title: "战略级伙伴关系达成", icon: Award, desc: "P0 级核心伙伴占比提升 12%，完成全产业链补链" },
    { title: "技术底座渗透深度", icon: Shield, desc: "文心一言 4.0 渗透率突破 65%，飞桨活跃节点突破 300+" },
    { title: "未来增长能级预测", icon: TrendingUp, desc: "预计下季度 API 调用量将实现 150% 爆发式增长" }
  ];

  const toggleCinema = () => {
    if (!isActive) {
      cinematicEngine.enterCinemaMode();
      setIsActive(true);
      setStep(0);
    } else {
      setIsActive(false);
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setStep(s => (s + 1) % steps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <>
      <button 
        onClick={toggleCinema}
        className="fixed bottom-10 right-32 z-50 p-4 bg-gray-900 border-4 border-blue-500 text-white shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
        title="开启极光演示模式"
      >
        <Play size={24} className="group-hover:text-blue-400" />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-gray-950 flex flex-col items-center justify-center p-20 text-center overflow-hidden"
          >
            {/* 背景动态网格 */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
            
            <button 
              onClick={toggleCinema}
              className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-12"
            >
              <div className="w-32 h-32 bg-blue-600 border-4 border-white rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(37,99,235,0.5)]">
                {React.createElement(steps[step].icon, { size: 64, className: "text-white" })}
              </div>
              
              <div className="space-y-6">
                <h2 className="text-8xl font-black uppercase italic tracking-tighter text-white leading-none">
                  {steps[step].title}
                </h2>
                <p className="text-3xl font-bold text-blue-400 uppercase tracking-[0.5em] italic">
                  {steps[step].desc}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-20">
                {steps.map((_, i) => (
                  <div key={i} className={`h-2 transition-all duration-500 ${i === step ? 'w-20 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]' : 'w-4 bg-gray-800'}`}></div>
                ))}
              </div>
            </motion.div>

            <div className="absolute bottom-10 left-10 text-left font-mono text-[10px] text-gray-700">
              <p>EN_AI_STATION_V2.0_CINEMA_FEED</p>
              <p>AUTH_LEVEL: L7_ADMIRAL</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
