import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export const TaskMonitor: React.FC = () => {
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/veracity/tasks/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveTasks(res.data);
    } catch (e) {}
  };

  // 轮询任务状态
  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, 3000);
    return () => clearInterval(timer);
  }, []);

  if (activeTasks.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[1000]">
      <motion.div 
        layout
        className="bg-gray-900 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl overflow-hidden"
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 flex items-center gap-3 w-full hover:bg-gray-800 transition-colors"
        >
          <div className="relative">
            <Activity size={16} className="text-blue-400 animate-pulse" />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-[8px] text-white px-1 rounded-full font-black">
              {activeTasks.length}
            </span>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            正在执行深猎任务...
          </span>
          <ChevronRight size={14} className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ opacity: 0 }}
              className="border-t border-gray-800 max-h-60 overflow-y-auto w-64"
            >
              {activeTasks.map(task => (
                <div key={task.id} className="p-4 border-b border-gray-800 last:border-0 space-y-3 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-white truncate w-40 italic">{task.targetName}</p>
                    <span className="text-xs font-mono font-black text-cyan-400">{task.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-none overflow-hidden border border-gray-700">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${task.progress}%` }} 
                      className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                    />
                  </div>
                  <p className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-tighter truncate">
                    {task.step}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
