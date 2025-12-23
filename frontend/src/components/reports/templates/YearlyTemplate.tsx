import React, { useRef, useEffect } from 'react';
import { Report } from '../../../services/report.service';
import { 
  Star, Zap, ShieldCheck, TrendingUp, Info, Award, Globe, 
  Map, Activity, PieChart, Cpu, Target, Rocket, Users, Coins,
  ChevronDown, Flame, Medal, Fingerprint, Sparkles, Binary, Check
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import confetti from 'canvas-confetti';

const mockYearlyData = {
  stats: { total: 526, p0: 150, paddle: 210, ernie: 316, growth: '145%' },
  milestones: [
    { chapter: "第一章：星火燎原", title: "生态实体现存量突破 500+", desc: "西南地区最密集的 AI 企业集群正式成型，形成了全域覆盖的神经元网络。", date: "Q1-Q2" },
    { chapter: "第二章：能级跃迁", title: "文心 4.0 深度渗透率 65%", desc: "标志着生成式 AI 已从“边缘辅助”进入“核心业务逻辑”的深水区。", date: "Q3" },
    { chapter: "第三章：向光而行", title: "年度联合解决方案 128 套", desc: "涵盖金融、医疗、制造等 15 个垂直行业，产生了实质性的降本增效成果。", date: "Q4" }
  ],
  topPerformers: [
    { name: '考拉悠然', type: '视觉大模型', score: 98 },
    { name: '华鲲振宇', type: '国产算力', score: 96 },
    { name: '云从科技', type: '人机协同', score: 95 }
  ]
};

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const YearlyTemplate: React.FC<{ report: Report; onDrillDown: any }> = ({ report, onDrillDown }) => {
  const currentYear = new Date(report.createdAt).getFullYear();

  // 触发烟花特效
  const fireSuccess = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#fbbf24', '#ffffff'] });
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100">
      
      {/* 1. 极致叙事开场 (Hero) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="whitespace-nowrap font-mono text-[100px] leading-none uppercase italic">BLUEPRINT ECOSYSTEM DATA NEXUS AI</div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 space-y-8 px-6 text-center"
        >
          <div className="inline-block px-4 py-1 border-2 border-blue-500 text-blue-400 font-black text-xs uppercase tracking-[0.8em] mb-4">
            CONFIDENTIAL ANNUAL DOSSIER
          </div>
          <h1 className="text-[10vw] font-black italic tracking-tighter text-white leading-none drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] uppercase">
            蓝图 {currentYear}
          </h1>
          <p className="text-2xl font-bold text-gray-400 uppercase tracking-[0.5em] italic">西南 AI 产业全息年度研报</p>
          <motion.div 
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="pt-24 flex flex-col items-center gap-4 cursor-pointer opacity-40"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white">开始阅读长卷</span>
            <ChevronDown size={32} className="text-white" />
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        
        {/* 2. 年度关键指标 (KPIs) */}
        <section className="py-40">
          <FadeInSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-gray-900 border-4 border-gray-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-white p-12 space-y-4 border-r-4 border-gray-900">
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">实体现存量</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-7xl font-black italic text-gray-900">{mockYearlyData.stats.total}</h4>
                  <span className="text-blue-600 font-bold">NODE</span>
                </div>
                <p className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 inline-block border border-blue-200">同比增长 {mockYearlyData.stats.growth} ↑</p>
              </div>
              <div className="bg-white p-12 space-y-4 border-r-4 border-gray-900">
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">P0级伙伴</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-7xl font-black italic text-red-600">{mockYearlyData.stats.p0}</h4>
                  <span className="text-red-600 font-bold">CORE</span>
                </div>
                <p className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 inline-block border border-red-200">战略级指挥权重</p>
              </div>
              <div className="bg-white p-12 space-y-4">
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">技术覆盖面</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-7xl font-black italic text-gray-900">65%</h4>
                </div>
                <p className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 inline-block border border-green-200">文心一言 4.0 渗透深度</p>
              </div>
            </div>
          </FadeInSection>
        </section>

        {/* 3. 战略章节长卷 (Milestones) */}
        <section className="py-40 space-y-60">
          {mockYearlyData.milestones.map((m, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center`}>
              <div className="flex-1 space-y-8">
                <FadeInSection>
                  <div className="flex items-center gap-4 text-blue-600">
                    <Binary size={20} />
                    <span className="font-mono text-sm font-black uppercase tracking-widest">{m.chapter}</span>
                  </div>
                  <h3 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900 mt-4 leading-none">{m.title}</h3>
                  <div className="h-2 w-32 bg-yellow-400 my-8"></div>
                  <p className="text-xl font-bold text-gray-500 leading-relaxed italic">{m.desc}</p>
                  <div className="pt-8">
                    <span className="px-4 py-2 bg-gray-900 text-white font-black text-sm uppercase italic">{m.date} 任务周期达成</span>
                  </div>
                </FadeInSection>
              </div>
              <div className="flex-1 w-full">
                <FadeInSection delay={0.2}>
                  <div className="relative p-4 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] bg-gray-50 aspect-video flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-grid-v2"></div>
                    {i === 0 ? <Globe size={200} className="text-blue-200 animate-spin-slow" /> : i === 1 ? <Cpu size={200} className="text-purple-200" /> : <Rocket size={200} className="text-yellow-200" />}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      <span className="text-[8px] font-mono text-gray-400">ENCRYPTED_VISUAL_STREAM</span>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            </div>
          ))}
        </section>

        {/* 4. 荣耀瞬间 (MVP WALL) */}
        <section className="py-40 bg-gray-900 -mx-6 px-10 rounded-[60px] border-[16px] border-gray-900 shadow-[30px_30px_0px_0px_rgba(251,191,36,1)]">
          <FadeInSection>
            <div className="text-center mb-24 space-y-4">
              <h3 className="text-7xl font-black uppercase italic tracking-tighter text-white">年度生态之星</h3>
              <p className="text-yellow-400 font-black tracking-[0.5em] uppercase text-xs">Strategic Hall of Fame // Southwest Region</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {mockYearlyData.topPerformers.map((p, i) => (
                <motion.div 
                  key={i} whileHover={{ y: -20, scale: 1.02 }}
                  className="bg-white border-8 border-gray-900 p-10 flex flex-col items-center text-center space-y-6 relative"
                >
                  <div className="absolute -top-8 bg-yellow-400 border-4 border-gray-900 px-4 py-1 font-black italic text-sm">NO.{i+1}</div>
                  <div className="w-24 h-24 bg-gray-950 flex items-center justify-center rounded-2xl rotate-3 shadow-xl">
                    <Fingerprint className="text-blue-400" size={48} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic">{p.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{p.type}</p>
                  </div>
                  <div className="w-full pt-6 border-t-2 border-gray-100 flex justify-between items-center">
                    <span className="text-[8px] font-black text-gray-400 uppercase">Match Score</span>
                    <span className="text-2xl font-black italic text-blue-600">{p.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </section>

        {/* 5. 展望 2026 (The Future) */}
        <section className="py-60 text-center space-y-16">
          <FadeInSection>
            <div className="inline-flex items-center gap-4 bg-blue-600 text-white px-8 py-3 rounded-full border-4 border-gray-900 font-black italic uppercase text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles size={24} /> 2026 产业演进预测
            </div>
            <h2 className="text-8xl font-black uppercase italic tracking-tighter text-gray-900 leading-none mt-12">
              从“AI 辅助”<br/>向“AI 主导”全面跃迁
            </h2>
            <p className="max-w-3xl mx-auto text-2xl font-bold text-gray-400 italic leading-relaxed pt-8">
              预计 2026 年，成都库内 70% 的制造企业将完成基于文心大模型的 Agent 智能体部署。我们将见证生产力在全地域维度的指数级爆发。
            </p>
            <button 
              onMouseEnter={fireSuccess}
              className="mt-20 px-12 py-6 bg-yellow-400 border-8 border-gray-900 font-black uppercase text-xl italic hover:bg-gray-900 hover:text-white transition-all shadow-[15px_15px_0px_0px_rgba(59,130,246,1)]"
            >
              核准并下发年度指令 ➔
            </button>
          </FadeInSection>
        </section>

        {/* 6. 最终认证 (Footer) */}
        <footer className="py-40 border-t-8 border-gray-100 text-center space-y-12">
          <div className="flex justify-center gap-12 opacity-10">
            <div className="w-20 h-20 border-[12px] border-gray-900"></div>
            <div className="w-20 h-20 border-[12px] border-gray-900 rounded-full"></div>
            <div className="w-20 h-20 border-[12px] border-gray-900 rotate-45"></div>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-300 uppercase tracking-[1.5em]">Neural Analyzer v9.4.2</p>
            <p className="text-xs font-bold text-gray-400 italic">
              Authenticated Dossier // (c) 2025 Enterprise AI Workstation V2.0
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default YearlyTemplate;
