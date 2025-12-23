import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Terminal, 
  Cpu, 
  BarChart3, 
  Globe, 
  ChevronRight, 
  Play, 
  Database, 
  Layers,
  FileSearch,
  Fingerprint,
  Radio,
  Lock
} from 'lucide-react';
import { NeubrutalButton, NeubrutalCard } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { NexusLogo } from '../../components/ui/neubrutalism/NexusLogo';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b-4 border-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <NexusLogo size="sm" color="bg-blue-600" />
          <span className="font-black text-2xl tracking-tighter italic uppercase">联图 / NEXUS</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-black uppercase text-xs tracking-widest">
          <a href="#features" className="hover:text-blue-600 transition-colors">核心功能</a>
          <a href="#showcase" className="hover:text-blue-600 transition-colors">视觉卷宗</a>
          <a href="#tech" className="hover:text-blue-600 transition-colors">内核架构</a>
        </div>
        <NeubrutalButton variant="primary" size="sm" onClick={() => navigate('/login')}>
          系统接入_
        </NeubrutalButton>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden bg-gray-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="whitespace-nowrap font-mono text-[120px] leading-none uppercase italic">
              BLUEPRINT ECOSYSTEM DATA NEXUS AI STRATEGY KERNEL
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1 bg-yellow-400 border-2 border-gray-900 font-black text-xs uppercase tracking-[0.3em] -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Southwest AI Industrial Engine
            </div>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tighter uppercase italic text-gray-900">
              掌控<span className="text-blue-600">产业</span><br/>
              拓扑<span className="text-gray-400">真相.</span>
            </h1>
            <p className="text-xl font-bold text-gray-600 max-w-xl leading-relaxed">
              联图 / Nexus 是专为行业协会打造的 SaaS 决策平台。通过“成员指纹”与“政策沙盒”，将碎片化的企业数据转化为可感知的战略资产。
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <NeubrutalButton variant="primary" size="lg" className="text-xl px-10" onClick={() => navigate('/login')}>
                立即接入系统 ➔
              </NeubrutalButton>
              <div className="flex items-center gap-4 px-6 border-4 border-dashed border-gray-300 font-black text-sm uppercase text-gray-400">
                <Terminal size={18} /> LIANTU_KERNEL_V3.0
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 100, opacity: 0, rotate: 5 }}
            animate={{ x: 0, opacity: 1, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-600 translate-x-6 translate-y-6 border-4 border-gray-900 -z-10"></div>
            <div className="bg-white border-8 border-gray-900 p-2 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-video relative group">
               {/* 模拟仪表盘截图 */}
               <div className="absolute inset-0 bg-gray-900 flex flex-col p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest italic">NEXUS_WAR_ROOM_DASHBOARD</div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="col-span-2 border-2 border-blue-500/30 bg-blue-500/5 flex items-center justify-center relative overflow-hidden">
                       <Globe size={120} className="text-blue-500/20 absolute animate-pulse" />
                       <div className="z-10 text-blue-400 font-mono text-[10px] space-y-1">
                          <p>SCANNING_REGION: 成都市高新区...</p>
                          <p>NODES_LOCKED: 526_ENTERPRISES</p>
                          <p>HEALTH_STATUS: OPTIMAL</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-1/2 border-2 border-yellow-500/30 bg-yellow-500/5 p-2 flex flex-col justify-between">
                          <div className="w-full h-1 bg-gray-800"><div className="w-3/4 h-full bg-yellow-500"></div></div>
                          <div className="w-full h-1 bg-gray-800"><div className="w-1/2 h-full bg-yellow-500"></div></div>
                          <p className="text-yellow-500 font-mono text-[8px]">POLICY_SIM_ACTIVE</p>
                       </div>
                       <div className="h-1/3 border-2 border-green-500/30 bg-green-500/5 flex items-center justify-center">
                          <BarChart3 className="text-green-500/40" size={32} />
                       </div>
                    </div>
                  </div>
               </div>
               <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-white border-4 border-gray-900 rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-110 transition-transform">
                    <Play className="text-blue-600 fill-blue-600 ml-1" size={32} />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-12 border-y-8 border-gray-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: '库内全量节点', val: '500+', sub: 'REAL ENTITIES' },
            { label: '核心评估维度', val: '26', sub: 'DATA PILLARS' },
            { label: '情报置信度', val: '99.8%', sub: 'VERACITY SCORE' },
            { label: '决策响应速度', val: '0.2s', sub: 'SYNC LATENCY' },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className="text-white text-5xl font-black italic tracking-tighter leading-none mb-1">{stat.val}</h4>
              <p className="text-gray-600 font-bold text-[10px] tracking-[0.3em]">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-6xl font-black uppercase italic tracking-tighter">核心作战模组</h2>
          <div className="h-2 w-40 bg-blue-600 mx-auto"></div>
          <p className="text-gray-500 font-bold text-xl uppercase tracking-widest italic">Matrix Modules Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <NeubrutalCard className="bg-white border-blue-600 !p-10 hover:-translate-y-4 transition-transform shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
            <div className="w-16 h-16 bg-blue-100 border-4 border-blue-600 flex items-center justify-center mb-8 rotate-3">
              <Fingerprint className="text-blue-600" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4 italic">成员指纹</h3>
            <p className="font-bold text-gray-600 leading-relaxed">
              超越基础名录。通过 26 个维度深度穿透，实时跟踪企业的技术栈演进（飞桨/文心）、月均 API 负载及 AI 落地成熟度。
            </p>
          </NeubrutalCard>

          <NeubrutalCard className="bg-white border-yellow-400 !p-10 hover:-translate-y-4 transition-transform shadow-[12px_12px_0px_0px_rgba(245,158,11,1)]">
            <div className="w-16 h-16 bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center mb-8 -rotate-3">
              <Radio className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4 italic">政策沙盒</h3>
            <p className="font-bold text-gray-600 leading-relaxed">
              基于博弈论的实验性环境。实时演算补贴、算力开放等政策对 P0 核心伙伴活跃度的长周期影响，实现“数据预测决策”。
            </p>
          </NeubrutalCard>

          <NeubrutalCard className="bg-white border-green-500 !p-10 hover:-translate-y-4 transition-transform shadow-[12px_12px_0px_0px_rgba(16,185,129,1)]">
            <div className="w-16 h-16 bg-green-100 border-4 border-green-500 flex items-center justify-center mb-8 rotate-6">
              <FileSearch className="text-green-600" size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase mb-4 italic">情报档案馆</h3>
            <p className="font-bold text-gray-600 leading-relaxed">
              Smart Naming 协议支持。自动生成具有 L7 级机密感的产业白皮书，支持从 KPI 指标一键下钻至原始企业记录。
            </p>
          </NeubrutalCard>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-32 bg-gray-50 border-y-8 border-gray-900 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-gray-900">视觉卷宗</h2>
              <p className="text-2xl font-bold text-blue-600 uppercase tracking-widest italic">The Strategic Visual Interface</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-gray-900 text-white font-black text-xs uppercase italic tracking-widest shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                AUTHENTICATED_SCREENSHOTS
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <NeubrutalCard className="bg-white !p-4 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] group">
               <div className="aspect-[4/3] bg-gray-100 border-4 border-gray-900 relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 text-white font-black text-[10px] uppercase italic">
                    Live: 区域势能排行榜
                  </div>
                  <div className="w-full h-full bg-gray-200 p-8 flex flex-col justify-end space-y-4">
                     {/* 模拟图表条形 */}
                     {[0.9, 0.7, 0.6, 0.45].map((w, i) => (
                       <div key={i} className="space-y-1">
                          <div className="flex justify-between font-black text-[10px] uppercase">
                            <span>{['高新区', '武侯区', '锦江区', '成华区'][i]}</span>
                            <span>{Math.floor(w*100)}%</span>
                          </div>
                          <div className="h-6 bg-white border-2 border-gray-900 relative">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${w * 100}%` }}
                               className={`h-full border-r-2 border-gray-900 ${['bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500'][i]}`}
                             ></motion.div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </NeubrutalCard>

            <div className="space-y-8">
              <div className="space-y-2 border-l-8 border-blue-600 pl-8">
                <h3 className="text-4xl font-black uppercase italic tracking-tight">穿透式决策</h3>
                <p className="text-lg font-bold text-gray-600 italic">
                  “不仅是图表，更是通往实体现地的入口。”
                </p>
              </div>
              <p className="text-xl font-bold text-gray-500 leading-relaxed pl-8">
                点击任何一个数据节点，系统将立刻剥离宏观外壳，为您呈现企业的实时技术对标数据与互动历史。这种“所见即所得”的数据验证机制，确保了决策平台的绝对真实性。
              </p>
              <div className="pl-8 pt-4">
                <NeubrutalButton variant="secondary" onClick={() => navigate('/login')}>
                  查看更多界面 ➔
                </NeubrutalButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
          <div className="lg:col-span-1">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">内核架构</h2>
            <div className="h-2 w-20 bg-gray-900 mb-6"></div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs italic leading-loose">
              Robust Tech Stack // Enterprise Grade Integrity
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { icon: Cpu, label: 'NestJS', sub: 'CORE KERNEL' },
              { icon: Layers, label: 'React', sub: 'UI ARCH' },
              { icon: Database, label: 'Prisma', sub: 'DB_LAYER' },
              { icon: Zap, label: 'ERNIE Bot', sub: 'AI_INTEL' },
            ].map((tech, i) => (
              <div key={i} className="p-8 border-4 border-gray-100 flex flex-col items-center text-center space-y-4 hover:border-gray-900 transition-colors group">
                <tech.icon size={48} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                <div>
                  <p className="font-black uppercase tracking-tighter text-xl">{tech.label}</p>
                  <p className="font-bold text-gray-400 text-[10px] tracking-widest uppercase">{tech.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <NeubrutalCard className="max-w-7xl mx-auto bg-blue-600 border-gray-900 !p-20 text-white text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
            <Lock size={300} />
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-none tracking-tighter uppercase italic">
              准备好重构您的<br/>产业情报体系吗？
            </h2>
            <p className="text-2xl font-bold text-blue-100 max-w-2xl mx-auto italic">
              加入联图 / Nexus 生态，让数据资产转化为西南 AI 产业的战略驱动力。
            </p>
            <div className="pt-8">
              <NeubrutalButton variant="secondary" size="lg" className="text-2xl px-12 py-6 text-blue-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={() => navigate('/login')}>
                立即执行接入协议 ➔
              </NeubrutalButton>
            </div>
          </div>
        </NeubrutalCard>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t-8 border-gray-900 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <NexusLogo size="sm" color="bg-blue-600" />
              <span className="font-black text-2xl tracking-tighter italic uppercase">联图 / NEXUS</span>
            </div>
            <p className="font-bold text-gray-500 leading-relaxed">
              西南人工智能产业生态智研决策平台。<br/>
              © 2025 LIANTU NEXUS OS V3.0
            </p>
          </div>
          <div className="flex flex-col gap-4 font-black uppercase text-sm italic">
            <span className="text-gray-400 not-italic tracking-[0.3em] mb-2 text-[10px]">NAVIGATION</span>
            <a href="#" className="hover:text-blue-600 transition-colors">系统接入</a>
            <a href="#" className="hover:text-blue-600 transition-colors">开发路线图</a>
            <a href="#" className="hover:text-blue-600 transition-colors">隐私安全协议</a>
          </div>
          <div className="space-y-6 md:text-right">
            <div className="inline-block p-4 bg-gray-50 border-4 border-dashed border-gray-200">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Authenticated By</p>
              <p className="text-lg font-black italic uppercase tracking-tighter underline decoration-blue-600 decoration-4">Strategic Command Center</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;