import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, User, ShieldCheck } from 'lucide-react';

interface FeedItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'update' | 'create' | 'sync' | 'alert';
}

const mockFeeds: FeedItem[] = [
  { id: '1', user: '系统代理', action: '捕获新情报', target: '成都考拉悠然...', time: '2分钟前', type: 'update' },
  { id: '2', user: '情报员小王', action: '更新了能级', target: '华鲲振宇', time: '5分钟前', type: 'sync' },
  { id: '3', user: '情报员小李', action: '执行数据同步', target: '西南数据包', time: '12分钟前', type: 'sync' },
  { id: '4', user: 'AI 分析师', action: '生成研报', target: 'Q4季度预测', time: '20分钟前', type: 'alert' },
];

export const OperationalLiveFeed: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const [items, setItems] = useState<FeedItem[]>(mockFeeds);

  // 模拟实时动态
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: FeedItem = {
        id: Math.random().toString(36).substr(2, 9),
        user: ['情报员小张', '系统代理', 'AI 检测器'][Math.floor(Math.random() * 3)],
        action: ['完成同步', '更新画像', '检测到异动', '触发富化'][Math.floor(Math.random() * 4)],
        target: ['西安奕斯伟', '重庆云从', '贵州满帮', '昆明贝泰妮'][Math.floor(Math.random() * 4)],
        time: '刚刚',
        type: 'update'
      };
      setItems(prev => [newItem, ...prev.slice(0, 4)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-700/50">
        <Activity size={16} className="text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 border-t border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
          <Activity size={12} className="text-blue-500" /> 实时情报流水
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
      </div>
      
      <div className="space-y-3 overflow-hidden">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="bg-gray-900/50 border-l-2 border-blue-500 p-2 space-y-1 relative group overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter flex items-center gap-1">
                  <User size={8} /> {item.user}
                </span>
                <span className="text-[7px] font-bold text-gray-600">{item.time}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-300 leading-tight">
                {item.action} <span className="text-white italic">{item.target}</span>
              </p>
              
              {/* 装饰性背景流光 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
