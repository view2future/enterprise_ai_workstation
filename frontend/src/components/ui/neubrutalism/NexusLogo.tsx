import React from 'react';
import { motion } from 'framer-motion';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  showText?: boolean;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({ 
  size = 'md', 
  className = '', 
  color = 'bg-blue-600',
  showText = false 
}) => {
  const sizeMap = {
    sm: 'w-10 h-10 border-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    md: 'w-14 h-14 border-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]',
    lg: 'w-24 h-24 border-[6px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    xl: 'w-36 h-36 border-[8px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]',
  };

  const innerSizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // 动画配置
  const breatheTransition = { duration: 4, repeat: Infinity, ease: "easeInOut" };
  const flowTransition = { duration: 2, repeat: Infinity, ease: "linear" };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -1 }}
        className={`relative ${sizeMap[size]} border-gray-900 bg-white flex items-center justify-center overflow-hidden shrink-0`}
      >
        {/* 1. 【流动感】背景动态能量栅格 */}
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={flowTransition}
          className="absolute inset-0 opacity-[0.07] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(0deg, #000 1px, transparent 1px)',
            backgroundSize: '10px 10px'
          }}
        ></motion.div>

        {/* 2. 【机械感】核心分体构型 */}
        <div className={`relative ${innerSizeMap[size]} flex items-center justify-center`}>
          
          {/* 左侧能量柱 - 轻微上下浮动 */}
          <motion.div 
            animate={{ y: [-1, 1, -1] }}
            transition={{ ...breatheTransition, delay: 0.5 }}
            className={`absolute left-0 top-0 w-1/4 h-full ${color} border-r-2 border-gray-900 shadow-[2px_0px_10px_rgba(59,130,246,0.3)]`}
          />

          {/* 右侧能量柱 - 轻微上下浮动（反向） */}
          <motion.div 
            animate={{ y: [1, -1, 1] }}
            transition={{ ...breatheTransition, delay: 0.5 }}
            className={`absolute right-0 top-0 w-1/4 h-full ${color} border-l-2 border-gray-900 shadow-[-2px_0px_10px_rgba(59,130,246,0.3)]`}
          />

          {/* 核心对角线 - 内部带有光流 */}
          <motion.div 
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={breatheTransition}
            className={`absolute inset-0 w-full h-full ${color} border-gray-900 overflow-hidden`}
            style={{ clipPath: 'polygon(15% 0, 45% 0, 85% 100%, 55% 100%)' }}
          >
            {/* 内部穿梭光流 */}
            <motion.div 
              animate={{ 
                top: ['-100%', '200%'],
                left: ['-100%', '200%']
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "circIn" }}
              className="absolute w-full h-10 bg-white/40 blur-xl -rotate-45"
            />
          </motion.div>
        </div>

        {/* 3. 【扫描线】缓慢扫过的数字化横线 */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-blue-400/30 z-10"
        />

        {/* 4. 【系统状态】右上角复合脉冲 */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-b-2 border-l-2 border-gray-900 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-400 rounded-full"
          ></motion.div>
          <div className="relative w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"></div>
        </div>
      </motion.div>

      {/* 文字标识升级 */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <motion.span 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={breatheTransition}
              className="font-black italic tracking-tighter text-2xl leading-none text-gray-900"
            >
              NEXUS
            </motion.span>
            <span className="text-[10px] font-black text-blue-600 italic">v3.0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-4 bg-gray-300"></div>
            <span className="font-mono text-[7px] tracking-[0.4em] text-gray-400 uppercase font-bold">Lantú Intelligence</span>
          </div>
        </div>
      )}
    </div>
  );
};