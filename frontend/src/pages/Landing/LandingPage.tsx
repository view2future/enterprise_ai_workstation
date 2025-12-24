import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Cpu, 
  BarChart3, 
  Globe, 
  ChevronRight, 
  Database, 
  Fingerprint,
  Radio,
  ArrowRight,
  Activity,
  ZapOff,
  Zap,
  MousePointer2,
  Sparkles,
  Command,
  Search,
  Layers,
  Bot,
  Swords,
  Map,
  ShieldCheck,
  Zap as ZapIcon
} from 'lucide-react';
import { NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { NexusLogo } from '../../components/ui/neubrutalism/NexusLogo';
import { soundEngine } from '../../utils/SoundUtility';

const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <span 
      className={`relative inline-block ${className} ${isHovered ? 'glitch-active' : ''}`}
      onMouseEnter={() => { setIsHovered(true); soundEngine.playTick(); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </span>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'cn' | 'en'>('cn');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const t = {
    cn: {
      nav: { features: '核心功能', showcase: '智研演示', ecosystem: '产业生态', launch: '控制台 _' },
      hero: { 
        tag: '联图 Nexus / 企业级智研决策平台', 
        h1: '数据驱动<br />决策未来', 
        p: '下一代企业战略智研系统，将海量非结构化数据转化为高价值竞争情报与决策依据。', 
        start: '进入系统 ➔',
        init: 'nexus --mode enterprise --auth active'
      },
      features: {
        title: '核心功能',
        subtitle: 'THE ENGINE OF STRATEGIC DOMINANCE',
        items: [
          { 
            title: "全域数字指纹", 
            desc: "从26个维度深度刻画企业、对手及合作伙伴的DNA，实时掌握技术栈、资本动向与战略意图。", 
            stats: "26D Profiling",
            icon: <Fingerprint className="w-8 h-8" />,
            color: "bg-blue-500",
            shadow: "shadow-[8px_8px_0_0_rgba(59,130,246,1)]"
          },
          { 
            title: "政策智研雷达", 
            desc: "毫秒级捕捉全球政策动态，利用AI沙盒模拟法规变化对业务生态的真实影响，化风险为机遇。", 
            stats: "Real-time Intel",
            icon: <Radio className="w-8 h-8" />,
            color: "bg-purple-600",
            shadow: "shadow-[8px_8px_0_0_rgba(147,51,234,1)]"
          },
          { 
            title: "AI 战略决策引擎", 
            desc: "基于深度学习的行业研报自动化生成，为管理层提供7x24小时的数字化顾问服务。", 
            stats: "LLM Powered",
            icon: <Bot className="w-8 h-8" />,
            color: "bg-emerald-500",
            shadow: "shadow-[8px_8px_0_0_rgba(16,185,129,1)]"
          }
        ]
      },
      experience: {
        h2: '富有张力的交互体验',
        p: '联图 Nexus 采用了全新的工业级UI规范，让决策过程如同指挥现代战争般精准、直观。',
        f1: '指令中心 (Cmd+K)',
        f1d: '无死角触达全域数据，效率提升800%。',
        f2: '战术作战地图',
        f2d: '可视化产业生态位，秒级定位核心竞争点。',
        f3: '情报作战室',
        f3d: '多维数据交叉分析，实时还原市场真相。'
      },
      efficiency: {
        h2: '告别低效的决策模式',
        p: '传统的企业管理往往依赖滞后的报表。联图 Nexus 带来即时的数字化洞察。',
        items: ['情报处理速度提升12倍', '决策响应周期缩短85%', '零漏报的政策预警', '全自动化的竞争对标'],
        old: '传统调研模式',
        oldDesc: '静态报表，周级响应，信息孤岛。',
        nexus: '联图 Nexus',
        nexusDesc: '实时智研，秒级同步，智能闭环。',
      },
      cta: {
        h2: '现在就构建您的<br />企业指挥中心',
        p: '加入数字化顶尖梯队，用联图 Nexus 开启智能决策新纪元。',
        btn: '启动控制台 ➔',
        sales: '预约专家演示'
      },
      footer: {
        desc: '联图 Nexus：面向现代企业的高级智研决策操作系统，驱动产业数字化进阶。',
        copy: '© 2025 联图 NEXUS. ALL RIGHTS RESERVED.'
      }
    },
    en: {
      nav: { features: 'Core Features', showcase: 'Demo', ecosystem: 'Ecosystem', launch: 'Console _' },
      hero: { 
        tag: 'Liantu Nexus / Enterprise Strategy Platform', 
        h1: 'DATA DRIVEN<br />DECISION BOLD', 
        p: 'Next-gen enterprise intelligence. Transform vast unstructured data into high-stakes strategic assets.', 
        start: 'Launch Console ➔',
        init: 'nexus --mode enterprise --auth active'
      },
      features: {
        title: 'Capabilities',
        subtitle: 'THE ENGINE OF STRATEGIC DOMINANCE',
        items: [
          { 
            title: "Global Fingerprint", 
            desc: "Deep DNA profiling of entities across 26 dimensions. Track tech stacks, capital, and intent in real-time.", 
            stats: "26D Profiling",
            icon: <Fingerprint className="w-8 h-8" />,
            color: "bg-blue-500",
            shadow: "shadow-[8px_8px_0_0_rgba(59,130,246,1)]"
          },
          { 
            title: "Intel Radar", 
            desc: "Millisecond tracking of global policies. Simulate regulatory impacts via AI sandboxing.", 
            stats: "Real-time Intel",
            icon: <Radio className="w-8 h-8" />,
            color: "bg-purple-600",
            shadow: "shadow-[8px_8px_0_0_rgba(147,51,234,1)]"
          },
          { 
            title: "AI Strategy Engine", 
            desc: "Automated intelligence reporting with deep learning. 24/7 digital advisory for leadership.", 
            stats: "LLM Powered",
            icon: <Bot className="w-8 h-8" />,
            color: "bg-emerald-500",
            shadow: "shadow-[8px_8px_0_0_rgba(16,185,129,1)]"
          }
        ]
      },
      experience: {
        h2: 'Dynamic Interaction',
        p: 'Liantu Nexus employs industrial UI standards. Experience precision and intuition in strategic decision-making.',
        f1: 'Command Center (Cmd+K)',
        f1d: 'Zero-latency access to all data. 800% efficiency boost.',
        f2: 'Tactical War Map',
        f2d: 'Visualize ecological niches and competitive hotspots.',
        f3: 'Intelligence War Room',
        f3d: 'Cross-dimensional analysis for market truth in real-time.'
      },
      efficiency: {
        h2: 'End Legacy Decisions',
        p: 'Traditional enterprise management relies on lagged reports. Nexus brings instant digital insight.',
        items: ['12x Faster Intel Processing', '85% Cycle Reduction', 'Zero-miss Policy Alerts', 'Automated Benchmarking'],
        old: 'Legacy Research',
        oldDesc: 'Static reports, weekly updates, data silos.',
        nexus: 'Liantu Nexus',
        nexusDesc: 'Live Intel, instant sync, intelligent loop.',
      },
      cta: {
        h2: 'BUILD YOUR<br />COMMAND CENTER',
        p: 'Join the digital elite. Unlock the era of smart decision-making with Liantu Nexus.',
        btn: 'Launch Now ➔',
        sales: 'Book Expert Demo'
      },
      footer: {
        desc: 'Liantu Nexus: Advanced intelligence OS for modern enterprises, driving industrial evolution.',
        copy: '© 2025 LIANTU NEXUS. ALL RIGHTS RESERVED.'
      }
    }
  };

  const activeT = t[lang];

  return (
    <div ref={containerRef} className="bg-[#f0f0f0] min-h-screen text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      {/* Scanline Effect (from index.css) */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanline-effect opacity-[0.03]"></div>
      
      {/* V2 Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 bg-cyber-grid"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[110] bg-white border-b-8 border-black px-8 py-6 flex justify-between items-center shadow-[0_8px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <NexusLogo size="sm" color="bg-black" />
          <span className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">联图 Nexus</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 font-black uppercase text-sm tracking-[0.2em]">
          {['features', 'showcase', 'ecosystem'].map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              onClick={() => soundEngine.playTick()}
              className="relative hover:text-blue-600 transition-colors border-b-4 border-transparent hover:border-blue-600 pb-1"
            >
              {activeT.nav[item as keyof typeof activeT.nav]}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setLang(lang === 'cn' ? 'en' : 'cn'); soundEngine.playPneumatic(); }}
            className="font-black text-xs uppercase bg-black text-white px-3 py-1.5 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {lang === 'cn' ? 'ENGLISH' : '中文'}
          </button>
          <NeubrutalButton 
            variant="primary" 
            size="md" 
            onClick={() => navigate('/login')} 
            className="!bg-blue-600 !text-white !border-black !shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:!bg-black"
          >
            {activeT.nav.launch}
          </NeubrutalButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-48 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-8 space-y-12 z-10">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white border-4 border-black font-black text-sm uppercase tracking-[0.4em] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              <Activity size={20} className="text-blue-600 animate-pulse" /> {activeT.hero.tag}
            </motion.div>
            
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-[clamp(5rem,15vw,12rem)] font-black leading-[0.75] tracking-tighter uppercase italic"
            >
               <GlitchText text={activeT.hero.h1.split('<br />')[0]} className="text-black" /> <br />
               <GlitchText text={activeT.hero.h1.split('<br />')[1]} className="text-blue-600" />
            </motion.h1>

            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-800 max-w-2xl leading-tight border-l-[12px] border-black pl-8"
            >
              {activeT.hero.p}
            </motion.p>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-10 pt-10"
            >
              <button 
                className="text-3xl px-16 py-10 bg-black text-yellow-400 border-4 border-black font-black uppercase italic shadow-[15px_15px_0_0_rgba(59,130,246,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95 flex items-center gap-6"
                onClick={() => { soundEngine.playLaunch(); navigate('/login'); }}
              > 
                {activeT.hero.start}
              </button>
              
              <div className="flex items-center gap-6 px-10 border-4 border-black bg-white font-mono text-sm shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden group cursor-help">
                <Terminal size={24} /> 
                <span className="font-bold tracking-widest">{activeT.hero.init}</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 relative hidden lg:block">
             <motion.div 
               style={{ rotate }}
               className="w-[600px] h-[600px] border-8 border-dashed border-black/10 rounded-full flex items-center justify-center p-20"
             >
                <div className="w-full h-full border-8 border-black rounded-full animate-spin-slow"></div>
             </motion.div>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-white border-8 border-black p-0 shadow-[40px_40px_0_0_rgba(0,0,0,1)] w-[450px] overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-700">
                    <div className="bg-gray-900 p-4 border-b-4 border-black flex justify-between">
                       <div className="flex gap-2">
                          <div className="w-4 h-4 bg-red-500 border-2 border-black"></div>
                          <div className="w-4 h-4 bg-yellow-400 border-2 border-black"></div>
                       </div>
                       <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">TACTICAL_MAP_V2</div>
                    </div>
                    <div className="aspect-square bg-[#f8fafc] p-8 space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <div className="text-[10px] font-black uppercase text-gray-400">Total Entities</div>
                             <div className="text-5xl font-black italic">1,842</div>
                          </div>
                          <div className="bg-green-500 text-white px-2 py-1 font-black text-xs">+12.5%</div>
                       </div>
                       <div className="h-48 border-4 border-black bg-white relative flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-blue-600/5 bg-grid-v2"></div>
                          <Activity className="w-32 h-32 text-blue-100" />
                          <div className="relative z-10 text-2xl font-black italic text-blue-600 animate-pulse">MONITORING...</div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="h-12 border-2 border-black bg-gray-100"></div>
                          <div className="h-12 border-2 border-black bg-blue-600"></div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-48 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-12">
          <div className="space-y-8 max-w-3xl">
            <h2 className="text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">{activeT.features.title}</h2>
            <p className="text-3xl font-black text-blue-600 uppercase tracking-[0.3em] italic">{activeT.features.subtitle}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 border-8 border-black animate-spin-slow bg-yellow-400 flex items-center justify-center shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
              <ZapIcon size={48} className="text-black" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {activeT.features.items.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ x: -10, y: -10 }}
              className="group cursor-pointer"
              onMouseEnter={() => soundEngine.playTick()}
            >
              <div className={`bg-white border-8 border-black p-12 h-full ${f.shadow} group-hover:shadow-[20px_20px_0_0_rgba(0,0,0,1)] transition-all duration-300 relative flex flex-col justify-between overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 -z-0 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                
                <div className="space-y-10 relative z-10">
                  <div className={`w-24 h-24 ${f.color} border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center justify-center text-white`}>
                    {f.icon}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-5xl font-black uppercase italic leading-none">{f.title}</h3>
                    <p className="text-xl font-bold text-gray-500 leading-tight border-l-4 border-gray-200 pl-4">{f.desc}</p>
                  </div>
                </div>
                
                <div className="pt-12 flex items-center justify-between border-t-4 border-black mt-12 relative z-10">
                  <span className="font-black uppercase text-sm tracking-widest text-blue-600 italic">{f.stats}</span>
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Showcase Section */}
      <section id="showcase" className="py-48 bg-black text-white border-y-[16px] border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <h2 className="text-8xl font-black uppercase italic tracking-tighter leading-none text-neon-blue">{activeT.experience.h2}</h2>
              <p className="text-3xl font-bold text-gray-400 max-w-xl leading-snug">{activeT.experience.p}</p>
              
              <div className="space-y-12">
                {[
                  { icon: <Command />, title: activeT.experience.f1, desc: activeT.experience.f1d, color: 'text-blue-400' },
                  { icon: <Map />, title: activeT.experience.f2, desc: activeT.experience.f2d, color: 'text-yellow-400' },
                  { icon: <Swords />, title: activeT.experience.f3, desc: activeT.experience.f3d, color: 'text-red-400' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-10 items-start group p-6 border-4 border-transparent hover:border-white/10 hover:bg-white/5 transition-all"
                    onMouseEnter={() => soundEngine.playTick()}
                  >
                    <div className={`p-5 bg-white text-black border-4 border-white shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                      {item.icon}
                    </div>
                    <div className="space-y-3">
                      <h4 className={`text-3xl font-black uppercase italic ${item.color}`}>{item.title}</h4>
                      <p className="text-gray-500 font-bold text-lg leading-tight">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="bg-[#0a0a0a] border-8 border-white p-0 shadow-[40px_40px_0_0_rgba(59,130,246,1)] relative z-10 transform group-hover:rotate-y-6 transition-transform duration-1000">
                <div className="p-12 space-y-10">
                  <div className="flex items-center gap-8 border-b-8 border-white/10 pb-10">
                    <Search className="w-16 h-16 text-blue-500" />
                    <div className="text-5xl font-black uppercase italic tracking-[0.2em]">Nexus_Query</div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { l: 'MEMBER_DNA_SYNC', a: 'STABLE', c: 'bg-green-600' },
                      { l: 'POLICY_SANDBOX_V3', a: 'ACTIVE', c: 'bg-blue-600' },
                      { l: 'COMPETITOR_SIGNAL', a: 'WARN', c: 'bg-red-600 animate-pulse' }
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-6 px-8 bg-white/5 border-2 border-white/10 hover:border-blue-500 transition-colors">
                        <span className="font-black text-lg tracking-[0.4em] font-mono">{row.l}</span>
                        <span className={`text-xs font-black px-4 py-1 ${row.c}`}>{row.a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-400 border-8 border-black -z-0 rotate-12 flex items-center justify-center">
                 <ShieldCheck size={80} className="text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Comparison */}
      <section className="py-48 px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-12">
                <div className="p-12 bg-white border-8 border-black shadow-[15px_15px_0_0_rgba(239,68,68,1)] flex flex-col gap-8 transform -rotate-3 hover:rotate-0 transition-transform">
                   <ZapOff size={80} className="text-red-500" />
                   <h4 className="text-4xl font-black uppercase italic leading-none">{activeT.efficiency.old}</h4>
                   <p className="font-bold text-gray-400 italic leading-tight text-xl">{activeT.efficiency.oldDesc}</p>
                </div>
                <div className="p-12 bg-white border-8 border-black shadow-[15px_15px_0_0_rgba(34,197,94,1)] flex flex-col gap-8 transform rotate-3 hover:rotate-0 transition-transform">
                   <Zap size={80} className="text-green-500" />
                   <h4 className="text-4xl font-black uppercase italic leading-none">{activeT.efficiency.nexus}</h4>
                   <p className="font-bold text-black italic leading-tight text-xl">{activeT.efficiency.nexusDesc}</p>
                </div>
                <div className="col-span-2 p-16 bg-black text-white border-8 border-black shadow-[20px_20px_0_0_rgba(59,130,246,1)] flex flex-col md:flex-row justify-between items-center gap-12">
                   <div className="space-y-6 text-center md:text-left">
                      <div className="text-blue-500 font-black text-lg uppercase tracking-[0.5em]">Efficiency_Boost</div>
                      <h4 className="text-8xl font-black italic tracking-tighter uppercase">+1200%</h4>
                   </div>
                   <div className="h-32 w-2 bg-white/20 hidden md:block"></div>
                   <div className="text-center md:text-right space-y-4">
                      <p className="font-black uppercase text-sm tracking-widest text-gray-500">Decision Speed</p>
                      <p className="text-4xl font-black italic animate-flow-text bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-[length:200%_auto] bg-clip-text text-transparent">REAL-TIME</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-16 order-1 lg:order-2">
            <h2 className="text-8xl font-black uppercase italic tracking-tighter leading-none">{activeT.efficiency.h2}</h2>
            <p className="text-3xl font-bold text-gray-600 leading-tight border-l-[16px] border-black pl-10">{activeT.efficiency.p}</p>
            
            <ul className="space-y-8">
              {activeT.efficiency.items.map((item, i) => (
                <motion.li 
                  key={i} 
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-8 group"
                >
                  <div className="w-16 h-16 bg-yellow-400 border-8 border-black flex items-center justify-center group-hover:bg-black group-hover:text-yellow-400 transition-colors">
                    <ChevronRight size={32} className="font-black" />
                  </div>
                  <span className="text-3xl font-black uppercase italic group-hover:text-blue-600 transition-colors cursor-default">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA - Super Bold */}
      <section className="px-8 pb-64 pt-32">
        <div className="max-w-7xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-600 border-8 border-black translate-x-8 translate-y-8 -z-10 group-hover:translate-x-12 group-hover:translate-y-12 transition-transform duration-500"></div>
          <div className="bg-yellow-400 border-8 border-black p-24 lg:p-48 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-v2 opacity-10"></div>
            <div className="absolute top-0 right-0 p-20 opacity-5 -rotate-12 scale-[2] group-hover:rotate-0 transition-transform duration-1000">
               <NexusLogo size="lg" color="bg-black" />
            </div>
            
            <div className="relative z-10 space-y-20">
              <h2 className="text-[clamp(4rem,15vw,10rem)] font-black leading-[0.8] tracking-tighter uppercase italic" 
                  dangerouslySetInnerHTML={{ __html: activeT.cta.h2 }} />
              
              <p className="text-4xl font-bold text-black max-w-4xl mx-auto italic border-y-8 border-black/10 py-12">
                {activeT.cta.p}
              </p>
              
              <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                <button 
                  className="text-5xl px-24 py-12 bg-black text-yellow-400 border-8 border-black font-black uppercase italic shadow-[20px_20px_0_0_rgba(59,130,246,1)] hover:translate-x-3 hover:translate-y-3 hover:shadow-none transition-all active:scale-95"
                  onClick={() => { soundEngine.playLaunch(); navigate('/login'); }}
                > 
                  {activeT.cta.btn}
                </button>
                <button 
                  className="text-2xl font-black uppercase underline decoration-[10px] underline-offset-[20px] hover:text-blue-600 transition-colors"
                  onClick={() => soundEngine.playPneumatic()}
                >
                  {activeT.cta.sales}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-48 px-8 border-t-[20px] border-black bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-32 relative z-10">
          <div className="md:col-span-5 space-y-12">
            <div className="flex items-center gap-6">
              <NexusLogo size="md" color="bg-black" />
              <span className="font-black text-5xl tracking-tighter uppercase italic">联图 Nexus</span>
            </div>
            <p className="text-3xl font-bold text-gray-500 max-w-md leading-tight italic">
              {activeT.footer.desc}
            </p>
            <div className="flex gap-8">
              {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                <div key={social} className="w-16 h-16 border-4 border-black bg-gray-50 hover:bg-black hover:text-white transition-all cursor-pointer flex items-center justify-center font-black text-sm uppercase shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Intelligence', links: ['Digital Fingerprint', 'Competition Radar', 'Policy Sandbox', 'War Room'] },
              { title: 'Resources', links: ['Documentation', 'API Access', 'Industry Reports', 'Support'] },
              { title: 'Company', links: ['About Nexus', 'Contact Us', 'Privacy', 'Legal'] }
            ].map((col, i) => (
              <div key={i} className="space-y-10">
                <h5 className="font-black uppercase tracking-[0.4em] text-sm text-blue-600 italic">{col.title}</h5>
                <ul className="flex flex-col gap-8 font-black uppercase text-sm italic">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-48 pt-16 border-t-8 border-black flex flex-col md:row justify-between items-center gap-12">
          <p className="font-black uppercase text-sm tracking-[0.5em] text-gray-400">{activeT.footer.copy}</p>
          <div className="flex gap-16 font-black uppercase text-sm tracking-widest text-gray-400">
             <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                SYSTEM_STATUS: NOMINAL
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;