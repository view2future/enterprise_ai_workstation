import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
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

// --- Components ---

const Card3D = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useTransform(useMotionValue(0), [0, 100], [0, 100]); // Dummy transform to avoid error if not used, actual logic below
  // Simplified tilt effect for brevity and performance
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`perspective-1000 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage = ({ src, alt, speed = 1, className }: { src: string, alt: string, speed?: number, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed]);
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img 
        style={{ y }}
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover scale-110" 
      />
    </div>
  );
};

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
      nav: { features: '核心能力', showcase: '作战视图', ecosystem: '生态全景', launch: '启动控制台 _' },
      hero: { 
        tag: '联图 Nexus / 产业赋能中心', 
        h1: '产业赋能<br />智慧中枢', 
        p: '面向 AI 产业的终极战略决策操作系统。全自动数字指纹、政策雷达与智能供需匹配。', 
        start: '进入系统 ➔',
        init: 'nexus --mode enterprise --auth active'
      },
      features: {
        title: '核心战力',
        subtitle: 'THE ENGINE OF INDUSTRY DOMINANCE',
        items: [
          { 
            title: "全域数字指纹", 
            desc: "从26个维度深度刻画产业企业技术栈与发展轨迹，实时掌握核心竞争力。", 
            stats: "26D Profiling",
            icon: <Fingerprint className="w-8 h-8" />,
            color: "bg-blue-500",
            shadow: "shadow-[8px_8px_0_0_rgba(59,130,246,1)]"
          },
          { 
            title: "政策智研雷达", 
            desc: "毫秒级捕捉全球产业政策动态，利用AI沙盒模拟政策对产业生态的真实影响。", 
            stats: "Real-time Intel",
            icon: <Radio className="w-8 h-8" />,
            color: "bg-purple-600",
            shadow: "shadow-[8px_8px_0_0_rgba(147,51,234,1)]"
          },
          { 
            title: "智能撮合引擎", 
            desc: "基于大模型的精准资源供需匹配，连接技术供给侧与场景应用侧。", 
            stats: "LLM Powered",
            icon: <Bot className="w-8 h-8" />,
            color: "bg-emerald-500",
            shadow: "shadow-[8px_8px_0_0_rgba(16,185,129,1)]"
          }
        ]
      },
      showcase: {
        title: '作战指挥视图',
        subtitle: '全景数据驱动产业进阶',
        cards: [
          { title: '战略作战地图', desc: '基于地理信息的产业分布与技术生态热力图', img: '/assets/screenshot/war_map.png' },
          { title: '执行仪表盘', desc: '核心 KPI 监控与产业生态健康度分析', img: '/assets/screenshot/homepage1.png' },
          { title: '多维度产业分析', desc: '自动生成多维度行业分析报告与决策建议', img: '/assets/screenshot/report_detail.png' },
          { title: '生态资源全景', desc: '产业企业信息、技术生态与核心资源数据盘点', img: '/assets/screenshot/asset_management_home.png' }
        ]
      },
      experience: {
        h2: '全景可视化交互',
        p: '联图 Nexus 采用工业级可视化规范，让决策过程如同指挥现代战争般精准、直观。',
        f1: '指令中心 (Cmd+K)',
        f1d: '无死角触达全域数据，效率提升800%。',
        f2: '战略作战地图',
        f2d: '可视化产业分布，秒级定位核心生态位。',
        f3: '情报作战室',
        f3d: '多维数据交叉分析，实时还原产业真相。'
      },
      efficiency: {
        h2: '重塑决策效率',
        p: '告别滞后的静态报表。联图 Nexus 带来即时的数字化洞察与动态闭环。',
        items: ['情报处理速度提升12倍', '决策响应周期缩短85%', '零漏报的政策预警', '全自动化的资源盘点'],
        old: '传统调研模式',
        oldDesc: '静态报表，周级响应，信息孤岛。',
        nexus: '联图 Nexus',
        nexusDesc: '实时智研，秒级同步，智能闭环。',
      },
      cta: {
        h2: '构建您的<br />产业指挥中心',
        p: '加入数字化顶尖梯队，用联图 Nexus 开启智能决策新纪元。',
        btn: '立即启动 ➔',
        sales: '预约专家演示'
      },
      footer: {
        desc: '联图 Nexus：面向现代产业的高级智研决策操作系统，驱动产业数字化进阶。',
        copy: '© 2025 LIANTU NEXUS. ALL RIGHTS RESERVED.'
      }
    },
    en: {
      nav: { features: 'Capabilities', showcase: 'Visuals', ecosystem: 'Ecosystem', launch: 'Console _' },
      hero: { 
        tag: 'Liantu Nexus / Ecosystem Hub', 
        h1: 'INDUSTRY<br />INTELLIGENCE', 
        p: 'The ultimate strategic OS for AI industry. Automated fingerprinting, policy radar, and smart matching.', 
        start: 'Launch Console ➔',
        init: 'nexus --mode enterprise --auth active'
      },
      features: {
        title: 'Capabilities',
        subtitle: 'THE ENGINE OF INDUSTRY DOMINANCE',
        items: [
          { 
            title: "Digital Fingerprint", 
            desc: "Deep 26D profiling of enterprise tech stacks and growth trajectories.", 
            stats: "26D Profiling",
            icon: <Fingerprint className="w-8 h-8" />,
            color: "bg-blue-500",
            shadow: "shadow-[8px_8px_0_0_rgba(59,130,246,1)]"
          },
          { 
            title: "Policy Radar", 
            desc: "Millisecond tracking of global policies. AI sandbox simulation of impacts.", 
            stats: "Real-time Intel",
            icon: <Radio className="w-8 h-8" />,
            color: "bg-purple-600",
            shadow: "shadow-[8px_8px_0_0_rgba(147,51,234,1)]"
          },
          { 
            title: "Smart Matching", 
            desc: "LLM-driven supply & demand matching connecting tech to scenarios.", 
            stats: "LLM Powered",
            icon: <Bot className="w-8 h-8" />,
            color: "bg-emerald-500",
            shadow: "shadow-[8px_8px_0_0_rgba(16,185,129,1)]"
          }
        ]
      },
      showcase: {
        title: 'Command Center',
        subtitle: 'Panoramic Visual Intelligence',
        cards: [
          { title: 'Strategic War Map', desc: 'Geospatial distribution & tech heatmaps', img: '/assets/screenshot/war_map.png' },
          { title: 'Executive Dashboard', desc: 'KPI monitoring & ecosystem health', img: '/assets/screenshot/homepage1.png' },
          { title: 'Multi-dim Analysis', desc: 'Automatically generate multi-dimensional reports', img: '/assets/screenshot/report_detail.png' },
          { title: 'Ecosystem Panorama', desc: 'Industry info, tech ecosystem & resource inventory', img: '/assets/screenshot/asset_management_home.png' }
        ]
      },
      experience: {
        h2: 'Panoramic Visuals',
        p: 'Liantu Nexus employs industrial UI standards. Experience precision and intuition.',
        f1: 'Command Center (Cmd+K)',
        f1d: 'Zero-latency access to all data. 800% efficiency boost.',
        f2: 'Strategic War Map',
        f2d: 'Visualize distribution and identify core niches.',
        f3: 'Intelligence War Room',
        f3d: 'Cross-dimensional analysis for real-time truth.'
      },
      efficiency: {
        h2: 'Redefine Efficiency',
        p: 'End legacy reporting. Nexus brings instant digital insight and dynamic loops.',
        items: ['12x Faster Intel Processing', '85% Cycle Reduction', 'Zero-miss Policy Alerts', 'Automated Inventory'],
        old: 'Legacy Mode',
        oldDesc: 'Static reports, weekly updates, silos.',
        nexus: 'Liantu Nexus',
        nexusDesc: 'Live Intel, instant sync, smart loop.',
      },
      cta: {
        h2: 'BUILD YOUR<br />COMMAND CENTER',
        p: 'Join the digital elite. Unlock the era of smart decision-making with Liantu Nexus.',
        btn: 'Launch Now ➔',
        sales: 'Book Expert Demo'
      },
      footer: {
        desc: 'Liantu Nexus: Advanced intelligence OS for modern industry, driving digital evolution.',
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
          <span className="font-black text-3xl tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">联图 <span className="text-blue-600">NEXUS</span></span>
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

      {/* Live System Demo - Moved Before Showcase */}
      <section id="demo" className="py-24 px-8 max-w-7xl mx-auto">
         <div className="relative border-8 border-black bg-black p-4 md:p-8 shadow-[20px_20px_0_0_rgba(255,255,255,0.2)]">
             <div className="absolute -top-12 -left-4 bg-yellow-400 text-black px-8 py-2 font-black uppercase text-xl transform -rotate-2 border-4 border-black shadow-[5px_5px_0_0_rgba(0,0,0,1)] z-20">
                Live System Demo
             </div>
             <video 
                className="w-full h-auto border-4 border-white/20"
                controls
                autoPlay 
                muted 
                loop 
                playsInline
                poster="/assets/screenshot/homepage1.png"
             >
                <source src="/assets/video/demo_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
             </video>
         </div>
      </section>

      {/* Dynamic Showcase Section - REDESIGNED */}
      <section id="showcase" className="py-24 bg-black text-white border-y-[16px] border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-32 space-y-8">
             <h2 className="text-8xl font-black uppercase italic tracking-tighter leading-none text-neon-blue">{activeT.showcase.title}</h2>
             <p className="text-3xl font-bold text-gray-400 italic">{activeT.showcase.subtitle}</p>
          </div>

          {/* Main Feature: War Map - Always Colored */}
          <div className="mb-48 relative group">
             <div className="absolute inset-0 bg-blue-600 translate-x-4 translate-y-4 border-8 border-black -z-10 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform"></div>
             <div className="border-8 border-black bg-gray-900 relative overflow-hidden">
                <ParallaxImage 
                   src={activeT.showcase.cards[0].img} 
                   alt={activeT.showcase.cards[0].title}
                   className="aspect-[21/9] transition-all duration-700" // Removed grayscale
                />
                <div className="absolute bottom-0 left-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent w-full">
                   <div className="inline-block px-4 py-2 bg-blue-600 text-black font-black uppercase text-sm mb-4 transform -skew-x-12">Core Module</div>
                   <h3 className="text-4xl font-black uppercase italic mb-4">{activeT.showcase.cards[0].title}</h3>
                   <p className="text-xl text-gray-400 max-w-2xl font-bold">{activeT.showcase.cards[0].desc}</p>
                </div>
             </div>
          </div>

          {/* Big Stacked Visuals for Other Screenshots */}
          <div className="space-y-48">
             {activeT.showcase.cards.slice(1).map((card, i) => (
                <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                   {/* Text Side */}
                   <div className="lg:w-1/3 space-y-6 relative">
                      <div className="absolute -top-20 -left-10 text-[12rem] font-black text-white/5 pointer-events-none select-none italic">
                         0{i + 2}
                      </div>
                      <div className="w-20 h-2 bg-blue-600"></div>
                      <h3 className="text-5xl font-black uppercase italic leading-none">{card.title}</h3>
                      <p className="text-xl text-gray-400 font-bold leading-relaxed">{card.desc}</p>
                      <button className="px-8 py-3 border-4 border-white font-bold uppercase hover:bg-white hover:text-black transition-colors" onClick={() => navigate('/login')}>
                         Access Module
                      </button>
                   </div>

                   {/* Image Side - Big Parallax Card */}
                   <div className="lg:w-2/3 w-full">
                      <Card3D className="group w-full">
                         <div className="bg-[#111] border-8 border-white p-0 shadow-[20px_20px_0_0_rgba(59,130,246,1)] relative overflow-hidden hover:border-blue-500 transition-colors">
                            <div className="aspect-[16/10] overflow-hidden relative">
                               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                               <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            </div>
                         </div>
                      </Card3D>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-24 px-8 border-t-[20px] border-black bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12 relative z-10">
            <div className="flex items-center gap-4 scale-125">
              <NexusLogo size="md" color="bg-black" />
              <span className="font-black text-4xl tracking-tighter uppercase italic">联图 Nexus</span>
            </div>
            
            <div className="w-24 h-2 bg-black"></div>

            <p className="font-black uppercase text-sm tracking-[0.4em] text-gray-400">{activeT.footer.copy}</p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400 bg-gray-100 px-4 py-2 rounded border border-gray-300">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               SYSTEM STATUS: ONLINE
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;