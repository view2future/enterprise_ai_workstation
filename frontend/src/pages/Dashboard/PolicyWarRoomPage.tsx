
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Share2, 
  Target, 
  Zap, 
  Calendar, 
  ChevronRight, 
  BarChart, 
  Clock, 
  ShieldAlert,
  Search,
  Plus
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

// 模拟政策数据
const MOCK_POLICY = {
  id: 1,
  title: "关于加快成都人工智能产业生态建设的若干政策措施 (V4.0)",
  officialId: "成经信办〔2025〕12号",
  content: `
    第一条【资金奖补】对新入选“成都人工智能标杆企业”的企业，给予一次性 100 万元奖补。
    第二条【算力支持】每年发放总额 5000 万元“算力券”，支持企业使用文心一言等国产大模型。
    第三条【人才引进】对核心技术团队在蓉落户的，最高给予 200 万元安家费。
    第四条【应用场景】支持“AI+工业”垂直领域深度融合，标杆项目给予投入额 30% 的补贴。
    第五条【PB 授权特惠】凡获得“Powered by Baidu”授权的企业，在申报成都市产业项目时优先加分。
  `,
  analysis: [
    { id: 'n1', label: '资金奖补', x: 200, y: 150, intensity: 'High', details: '100W 标杆奖补' },
    { id: 'n2', label: '算力支持', x: 400, y: 100, intensity: 'Mid', details: '5000W 算力券' },
    { id: 'n3', label: '人才政策', x: 350, y: 250, intensity: 'Mid', details: '200W 安家费' },
    { id: 'n4', label: 'PB授权', x: 150, y: 300, intensity: 'Max', details: '优先加分项' },
  ],
  deadline: '2026-03-31'
};

const PolicyWarRoomPage: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 overflow-hidden">
      {/* 头部状态条 */}
      <div className="flex items-center justify-between bg-black text-white p-4 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 border-2 border-white flex items-center justify-center font-black animate-pulse">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic">政策战术指挥室 <span className="text-blue-400">/ THE WAR ROOM</span></h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Local Policy Intel & Strategic Visualization</p>
          </div>
        </div>
        <div className="flex gap-3">
          <NeubrutalButton variant="secondary" size="sm" className="border-white text-white">
            <Share2 size={14} className="mr-2" /> 链接嗅探
          </NeubrutalButton>
          <NeubrutalButton variant="warning" size="sm" className="border-white">
            <Plus size={14} className="mr-2" /> 采集存证
          </NeubrutalButton>
        </div>
      </div>

      {/* 核心双轨界面 */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* 左轨：政策原文 (1:1 分屏) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <NeubrutalCard className="flex-1 flex flex-col bg-white overflow-hidden p-0">
            <div className="bg-gray-100 border-b-4 border-gray-900 p-4 flex items-center justify-between">
              <span className="font-black text-xs uppercase flex items-center gap-2">
                <FileText size={16} /> 政策卷宗原文
              </span>
              <span className="bg-gray-900 text-white text-[10px] px-2 py-1 font-mono">{MOCK_POLICY.officialId}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-gray-800 selection:bg-yellow-300">
              <h2 className="text-2xl font-black mb-8 border-b-4 border-gray-900 pb-4">{MOCK_POLICY.title}</h2>
              <div className="space-y-6 text-lg whitespace-pre-wrap">
                {MOCK_POLICY.content.split('\n').map((line, i) => {
                  const isHighlighted = line.includes('奖补') || line.includes('PB');
                  return (
                    <p key={i} className={`p-2 transition-all ${isHighlighted ? 'bg-blue-50 border-l-4 border-blue-600 font-bold' : ''}`}>
                      {line.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          </NeubrutalCard>
        </div>

        {/* 右轨：可视化分析 (1:1 分屏) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* 神经元脑图可视化 */}
          <NeubrutalCard className="flex-[2] bg-gray-50 relative overflow-hidden flex flex-col p-0">
            <div className="bg-blue-600 text-white border-b-4 border-gray-900 p-4 font-black text-xs uppercase flex items-center justify-between">
              <span>动态语义神经元 <span className="opacity-50">/ NEURON MAP</span></span>
              <span className="animate-pulse">SYSTEM LIVE</span>
            </div>
            
            <div className="flex-1 relative">
              {/* 背景格点 */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <svg className="w-full h-full">
                {/* 绘制连线 */}
                {MOCK_POLICY.analysis.map((node, i) => (
                  <line 
                    key={`line-${i}`}
                    x1="50%" y1="50%" 
                    x2={node.x} y2={node.y} 
                    stroke="#000" strokeWidth="2" strokeDasharray="4 4"
                    className="opacity-20"
                  />
                ))}
                
                {/* 绘制中心点 */}
                <circle cx="50%" cy="50%" r="20" fill="#000" />
                <text x="50%" y="50%" dy="40" textAnchor="middle" className="font-black text-[10px] uppercase">核心政策目标</text>
              </svg>

              {/* 脑图节点 */}
              {MOCK_POLICY.analysis.map((node) => (
                <motion.div
                  key={node.id}
                  style={{ left: node.x, top: node.y }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveNode(node.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-4 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-1 transition-all ${activeNode === node.id ? 'bg-yellow-400 -translate-y-1' : 'bg-white hover:bg-blue-50'}`}
                >
                  <span className="font-black text-xs uppercase">{node.label}</span>
                  <span className={`text-[8px] font-bold px-1 border border-black ${node.intensity === 'Max' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>
                    {node.intensity}
                  </span>
                </motion.div>
              ))}
              
              {/* 节点详情浮窗 */}
              <AnimatePresence>
                {activeNode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-6 left-6 right-6 bg-gray-900 text-white p-6 border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(37,99,235,0.4)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-xl italic tracking-widest text-blue-400 uppercase">
                        {MOCK_POLICY.analysis.find(n => n.id === activeNode)?.label}
                      </h4>
                      <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-white">✕</button>
                    </div>
                    <p className="text-sm font-bold text-gray-300">
                      {MOCK_POLICY.analysis.find(n => n.id === activeNode)?.details}
                    </p>
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-400">
                        <Target size={12} /> 匹配度: 95%
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-400">
                        <ShieldAlert size={12} /> 申报难度: 中等
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </NeubrutalCard>

          {/* 底部挂件区 */}
          <div className="grid grid-cols-2 gap-6 h-48">
            {/* FUNDING 挂件 */}
            <NeubrutalCard className="bg-white flex flex-col justify-between p-4">
              <h3 className="text-xs font-black uppercase flex items-center gap-2">
                <BarChart size={14} className="text-blue-600" /> 奖补阶梯可视化
              </h3>
              <div className="flex items-end gap-2 flex-1 mt-2">
                <div className="flex-1 bg-gray-200 border-2 border-gray-900 h-1/4 relative group">
                   <div className="absolute -top-6 left-0 w-full text-center text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">10W</div>
                </div>
                <div className="flex-1 bg-blue-400 border-2 border-gray-900 h-2/4 relative group">
                   <div className="absolute -top-6 left-0 w-full text-center text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">50W</div>
                </div>
                <div className="flex-1 bg-blue-600 border-2 border-gray-900 h-full relative group">
                   <div className="absolute -top-6 left-0 w-full text-center text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">100W+</div>
                </div>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">Scale: Enterprise Revenue / Certification</p>
            </NeubrutalCard>

            {/* TIMELINE 挂件 */}
            <NeubrutalCard className="bg-gray-900 text-white flex flex-col justify-center items-center gap-2 text-center p-4">
              <Clock size={32} className="text-red-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase">战略倒计时</span>
                <span className="text-2xl font-black italic text-red-500">98 DAYS LEFT</span>
                <span className="text-[8px] font-bold text-gray-400">截止日期: {MOCK_POLICY.deadline}</span>
              </div>
            </NeubrutalCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PolicyWarRoomPage;
