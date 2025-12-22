import React, { useRef } from 'react';
import { Report } from '../../../services/report.service';
import { 
  Star, Zap, ShieldCheck, TrendingUp, Info, Award, Globe, 
  Map, Activity, PieChart, Cpu, Target, Rocket, Users, Coins,
  ChevronDown, Flame, Medal, Fingerprint, Sparkles
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

const mockYearlyData = {
  monthlyGrowth: [
    { month: '1月', calls: 1.2 }, { month: '2月', calls: 1.5 }, { month: '3月', calls: 2.1 },
    { month: '4月', calls: 2.4 }, { month: '5月', calls: 2.8 }, { month: '6月', calls: 3.5 },
    { month: '7月', calls: 3.8 }, { month: '8月', calls: 4.5 }, { month: '9月', calls: 5.2 },
    { month: '10月', calls: 6.1 }, { month: '11月', calls: 7.4 }, { month: '12月', calls: 8.8 },
  ],
  achievements: [
    { title: "生态实体现存量突破 526+", desc: "西南地区最密集的 AI 企业集群正式成型。" },
    { title: "文心 4.0 深度渗透率 65%", desc: "标志着生成式 AI 已进入本地核心业务逻辑。" },
    { title: "跨城际协同网络覆盖", desc: "实现了成德眉资及川渝地区的技术服务下沉。" },
    { title: "年度联合解决方案 128 套", desc: "涵盖金融、医疗、制造等 15 个垂直行业。" }
  ],
  mvpPartners: [
    { name: '成都考拉悠然', score: 98, tag: '视觉大模型' },
    { name: '华鲲振宇', score: 96, tag: '国产化算力' },
    { name: '重庆云从科技', score: 95, tag: '人机协同' },
    { name: '西安奕斯伟', score: 92, tag: '半导体先锋' },
  ]
};

interface YearlyTemplateProps {
  report: Report;
  onDrillDown: (title: string, type: 'enterprise' | 'list', items: any[]) => void;
}

const SectionTitle: React.FC<{ number: string; title: string; subtitle: string }> = ({ number, title, subtitle }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-20 space-y-4">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        className="flex items-center gap-4"
      >
        <span className="text-6xl font-black text-blue-600/20 italic font-mono">{number}</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="text-5xl font-black uppercase italic tracking-tighter text-gray-900"
      >
        {title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

const YearlyTemplate: React.FC<YearlyTemplateProps> = ({ report, onDrillDown }) => {
  const currentYear = new Date(report.createdAt).getFullYear();
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="space-y-40 pb-40 font-sans">
      
      {/* CHAPTER 0: THE OPENING (电影感开场) */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden bg-gray-900 rounded-[40px] border-[12px] border-gray-900 shadow-[30px_30px_0px_0px_rgba(59,130,246,1)]">
        {/* 动态背景流光 */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 gap-1 h-full">
            {Array.from({length: 64}).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                className="border-r border-b border-blue-500/30"
              />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 space-y-12 px-6"
        >
          <div className="inline-block px-6 py-2 bg-blue-600 text-white font-black text-sm uppercase tracking-[0.5em] italic mb-4">
            CONFIDENTIAL ANNUAL REPORT
          </div>
          <h2 className="text-[8rem] md:text-[12rem] font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-[15px_15px_0px_rgba(59,130,246,1)]">
            蓝图 2025
          </h2>
          <div className="space-y-4">
            <p className="text-4xl font-bold text-blue-400 tracking-[0.4em] uppercase italic">
              西南 AI 产业生态全景年度战报
            </p>
            <div className="h-2 w-48 bg-yellow-400 mx-auto"></div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="pt-20 opacity-30"
          >
            <ChevronDown size={48} className="mx-auto text-white" />
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-60">
        
        {/* CHAPTER 1: 星火燎原 (GROWTH) */}
        <section>
          <SectionTitle number="01" title="星火燎原" subtitle="Ecosystem Ignition & Growth" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h4 className="text-7xl font-black italic text-gray-900 flex items-baseline gap-4">
                  526 <span className="text-2xl text-gray-400">个</span>
                </h4>
                <p className="text-xl font-bold text-gray-600 leading-relaxed">
                  库内活跃资产节点。相比去年增长 <span className="text-blue-600 underline decoration-4 underline-offset-8">145%</span>，我们正式在西南大地上点亮了最密集的 AI 神经网络。
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-blue-50 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">成都核心区覆盖</p>
                  <p className="text-4xl font-black italic text-gray-900">316 ENT</p>
                </div>
                <div className="p-8 bg-yellow-50 border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">重庆增长能级</p>
                  <p className="text-4xl font-black italic text-gray-900">110 ENT</p>
                </div>
              </div>
            </div>

            <NeubrutalCard className="bg-white p-10 border-8">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockYearlyData.monthlyGrowth}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'black'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: '900' }} />
                    <Area type="step" dataKey="calls" stroke="#000" strokeWidth={6} fillOpacity={1} fill="url(#colorCalls)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Annual API Call Volume Pulse (Index: 1.0)</p>
            </NeubrutalCard>
          </div>
        </section>

        {/* CHAPTER 2: 攻坚克难 (STRATEGIC) */}
        <section className="relative">
          {/* 荣誉盖章 (Achievement Stamp) */}
          <motion.div 
            initial={{ scale: 2, opacity: 0, rotate: -45 }}
            whileInView={{ scale: 1, opacity: 0.15, rotate: -15 }}
            className="absolute -top-20 -right-20 pointer-events-none z-0"
          >
            <div className="w-80 h-80 border-[20px] border-red-600 rounded-full flex items-center justify-center text-red-600 font-black text-6xl text-center p-10">
              战略<br/>达成
            </div>
          </motion.div>

          <SectionTitle number="02" title="攻坚克难" subtitle="Strategic Conquest & Tech Depth" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {mockYearlyData.achievements.map((ach, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white border-8 border-gray-900 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-[320px]"
              >
                <div>
                  <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center font-black italic mb-6">0{i+1}</div>
                  <h4 className="text-xl font-black uppercase mb-4 leading-tight">{ach.title}</h4>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">{ach.desc}</p>
                </div>
                <Medal className="text-yellow-500 mt-6 self-end" size={32} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CHAPTER 3: 生态之星 (MVP WALL) */}
        <section className="bg-yellow-400 -mx-6 px-6 py-40 border-y-[20px] border-gray-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
            <Award size={600} />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center space-y-4">
              <h3 className="text-7xl font-black uppercase italic tracking-tighter text-gray-900">年度生态之星</h3>
              <p className="text-gray-900/60 font-black tracking-[0.5em] uppercase text-xs italic">Hall of Fame // Top Strategic Partners</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {mockYearlyData.mvpPartners.map((p, i) => (
                <div key={i} className="flex gap-8 items-center bg-white border-8 border-gray-900 p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] group hover:bg-gray-900 hover:text-white transition-all cursor-pointer">
                  <div className="w-24 h-24 bg-blue-600 border-4 border-gray-900 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Fingerprint className="text-white" size={48} />
                  </div>
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 bg-yellow-400 text-gray-900 text-[10px] font-black uppercase tracking-widest">{p.tag}</span>
                    <h4 className="text-3xl font-black uppercase italic">{p.name}</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-2 flex-1 bg-gray-100 border-2 border-gray-900">
                        <div className="h-full bg-blue-500" style={{ width: `${p.score}%` }}></div>
                      </div>
                      <span className="font-mono font-black text-xl italic">{p.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAPTER 4: 未来宣言 (VISION) */}
        <section>
          <SectionTitle number="03" title="向光而行" subtitle="Vision 2026: The Agentic Era" />
          
          <div className="bg-blue-600 p-20 border-[16px] border-gray-900 shadow-[40px_40px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Rocket size={400} />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <h4 className="text-6xl font-black italic tracking-tighter leading-tight">
                  “不仅是工具，<br/>更是进化的伙伴。”
                </h4>
                <p className="text-2xl font-bold text-blue-100 leading-relaxed italic">
                  2026 年，我们将见证从“AI 辅助”向“AI 主导”的生产流程进化。成都 70% 的制造企业将完成智能体 (Agent) 部署。
                </p>
                <div className="flex gap-10">
                  <div className="text-center">
                    <p className="text-6xl font-black italic mb-2 text-yellow-400">1.5亿</p>
                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">年度预计调用量</p>
                  </div>
                  <div className="text-center">
                    <p className="text-6xl font-black italic mb-2 text-white">1000+</p>
                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">核心开发者池</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 border-4 border-dashed border-white/30 p-10 flex flex-col justify-center text-center space-y-8">
                <Sparkles size={80} className="mx-auto text-yellow-400 animate-pulse" />
                <h5 className="text-2xl font-black uppercase italic">AI 战略认证通过</h5>
                <p className="text-xs font-bold text-blue-100 leading-relaxed uppercase tracking-widest">
                  System Status: Fully Autonomous<br/>
                  Registry Score: S-Rank Elite<br/>
                  Next Milestone: Total Ecosystem Sync
                </p>
                <button className="px-8 py-4 bg-white text-blue-600 border-4 border-gray-900 font-black uppercase text-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                  调取 2026 增长白皮书
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL AUTHENTICATION */}
        <footer className="text-center space-y-16 py-20 border-t-8 border-gray-900">
          <div className="inline-block p-4 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
            <div className="bg-white px-12 py-8 border-4 border-dashed border-gray-900">
              <p className="text-3xl font-black uppercase tracking-[0.5em] text-gray-900 italic">战绩核准：SYSTEM_APPROVED</p>
            </div>
          </div>
          <div className="flex justify-center gap-12 opacity-20">
            <div className="w-20 h-20 border-[16px] border-gray-900"></div>
            <div className="w-20 h-20 border-[16px] border-gray-900 rounded-full"></div>
            <Cpu size={80} className="text-gray-900" />
          </div>
          <p className="text-lg font-bold text-gray-500 max-w-4xl mx-auto leading-loose italic">
            本报告由 Enterprise AI Workstation 自动化情报系统生成。每一行数据都代表了我们在西南 AI 生态中迈出的坚实一步。基于 526 家企业的真实脉动，我们正共同绘制一幅通往未来的宏伟蓝图。
          </p>
          <div className="pt-10 flex justify-center gap-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            <span>Security Hash: 0x2025_BLUEPRINT</span>
            <span>|</span>
            <span>Issued: {new Date().toLocaleDateString()}</span>
            <span>|</span>
            <span>(c) 2025 AI_Workstation_V2</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default YearlyTemplate;