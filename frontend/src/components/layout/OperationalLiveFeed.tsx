import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, User, ShieldCheck, X, Clock, FileText } from 'lucide-react';

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
  const [items, setItems] = useState<FeedItem[]>(mockFeeds.slice(0, 2));
  const [history, setHistory] = useState<FeedItem[]>(mockFeeds);
  const [showHistory, setShowHistory] = useState(false);

  // 模拟实时动态
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: FeedItem = {
        id: Math.random().toString(36).substr(2, 9),
        user: ['情报员小张', '系统代理', 'AI 检测器', '数据爬虫'][Math.floor(Math.random() * 4)],
        action: ['完成同步', '更新画像', '检测到异动', '触发富化', '生成报告'][Math.floor(Math.random() * 5)],
        target: ['西安奕斯伟', '重庆云从', '贵州满帮', '昆明贝泰妮', '成都极米', '领英数据源'][Math.floor(Math.random() * 6)],
        time: '刚刚',
        type: 'update'
      };
      
      // Sidebar display: keep only recent 2
      setItems(prev => [newItem, ...prev].slice(0, 2));
      // History: keep recent 50
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isCollapsed) {
    return (
      <div 
        className="flex flex-col items-center gap-4 py-4 border-t border-gray-700/50 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setShowHistory(true)}
        title="点击查看情报流水"
      >
        <Activity size={16} className="text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-4 border-t border-gray-700/50">
        <div 
          className="flex items-center justify-between mb-3 cursor-pointer group hover:opacity-80 transition-opacity"
          onClick={() => setShowHistory(true)}
          title="点击查看完整历史"
        >
          <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2 group-hover:text-blue-400 transition-colors">
            <Activity size={12} className="text-blue-500" /> 实时情报流水
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-gray-600 group-hover:text-gray-400">VIEW ALL</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
          </div>
        </div>
        
        <div className="space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="bg-gray-900/50 border-l-2 border-blue-500 p-2 space-y-1 relative group overflow-hidden cursor-pointer hover:bg-gray-800/80 transition-colors"
                onClick={() => setShowHistory(true)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter flex items-center gap-1">
                    <User size={8} /> {item.user}
                  </span>
                  <span className="text-[7px] font-bold text-gray-600">{item.time}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-300 leading-tight truncate">
                  {item.action} <span className="text-white italic">{item.target}</span>
                </p>
                
                {/* 装饰性背景流光 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-900 border-2 border-blue-500 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.2)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <Activity size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-widest">情报流水日志</h2>
                    <p className="text-[10px] text-blue-400 font-mono">LIVE INTELLIGENCE FEED HISTORY</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {history.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-colors group">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                      <div className="w-0.5 h-full bg-gray-700 group-hover:bg-blue-500/30 transition-colors"></div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-2">
                          <User size={12} /> {item.user}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {item.action} <span className="text-white font-bold">{item.target}</span>
                      </p>
                      <div className="flex gap-2 pt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 uppercase tracking-wider">
                          TYPE: {item.type}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-400 uppercase tracking-wider">
                          ID: {item.id}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p>暂无情报记录</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-800 bg-gray-900/95 text-center">
                <p className="text-[10px] text-gray-600 font-mono">
                  DISPLAYING LAST {history.length} ENTRIES • SYSTEM MONITORING ACTIVE
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
