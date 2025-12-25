import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const GeekPandaCursor: React.FC = () => {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const [isOutside, setIsOutside] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const pandaX = useSpring(mouseX, springConfig);
  const pandaY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsOutside(false);
      mouseX.set(e.clientX + 15);
      mouseY.set(e.clientY + 15);
    };

    const handleMouseLeave = () => {
      setIsOutside(true);
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    };

    const handleMouseEnter = () => {
      setIsOutside(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: pandaX,
        y: pandaY,
        pointerEvents: 'none',
        zIndex: 9999,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="flex items-center justify-center"
    >
      <div className="relative">
        <AnimatePresence>
          {!isOutside && (
            <motion.div
              key="cursor-mode"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative"
            >
              {/* 1. 外层流动光环特效 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-blue-500/20 rounded-full"
                style={{ borderStyle: 'dashed', borderWidth: '1px' }}
              />
              
              {/* 2. 轨道上的发光数据点 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px]"
              >
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_8px_#60a5fa]" />
              </motion.div>

              {/* 3. 经典简约 Geek 熊猫头像 */}
              <div className="relative shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-full bg-white/10 backdrop-blur-sm p-1">
                <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="15" fill="black" />
                  <circle cx="75" cy="25" r="15" fill="black" />
                  <circle cx="50" cy="60" r="40" fill="white" stroke="black" strokeWidth="2" />
                  <rect x="20" y="45" width="25" height="20" rx="10" fill="black" />
                  <rect x="55" y="45" width="25" height="20" rx="10" fill="black" />
                  <circle cx="32" cy="55" r="4" fill="white" />
                  <circle cx="68" cy="55" r="4" fill="white" />
                  <ellipse cx="50" cy="70" rx="6" ry="4" fill="black" />
                  <path d="M 40 90 L 60 90 L 50 82 Z" fill="#3b82f6" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部微弱扩散脉冲 */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500/20 rounded-full -z-10"
        />
      </div>
    </motion.div>
  );
};

export default GeekPandaCursor;