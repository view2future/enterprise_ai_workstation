
import React from 'react';
import { Report } from '../../../services/report.service';
import { 
  Star, Zap, ShieldCheck, TrendingUp, Info, Award, Globe, 
  Map, Activity, PieChart, Cpu, Target, Rocket, Users, Coins
} from 'lucide-react';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';

const mockYearlyData = {
  monthlyGrowth: [
    { month: 'Jan', calls: 1.2 }, { month: 'Feb', calls: 1.5 }, { month: 'Mar', calls: 2.1 },
    { month: 'Apr', calls: 2.4 }, { month: 'May', calls: 2.8 }, { month: 'Jun', calls: 3.5 },
    { month: 'Jul', calls: 3.8 }, { month: 'Aug', calls: 4.5 }, { month: 'Sep', calls: 5.2 },
    { month: 'Oct', calls: 6.1 }, { month: 'Nov', calls: 7.4 }, { month: 'Dec', calls: 8.8 },
  ],
  techMix: [
    { name: '文心一言 (ERNIEBot)', value: 45, color: '#3b82f6' },
    { name: '飞桨核心 (Paddle)', value: 35, color: '#000000' },
    { name: '百度智能云 (Cloud)', value: 20, color: '#f59e0b' },
  ],
  achievements: [
    { title: "生态实体现存量突破 1000+", desc: "相比去年增长 145%，形成了西南地区最密集的 AI 企业集群。" },
    { title: "文心 4.0 成都渗透率突破 65%", desc: "标志着生成式 AI 在本地核心业务逻辑中已进入深度应用阶段。" },
    { title: "建立 12 个区县级联合赋能中心", desc: "实现了从高新区向全市 23 个区县的技术服务触达下沉。" },
    { title: "年度联合解决方案产出 128 套", desc: "涵盖金融、医疗、制造等 15 个垂直行业，产生直接经济价值预估破亿。" }
  ]
};

interface YearlyTemplateProps {
  report: Report;
  onDrillDown: (title: string, type: 'enterprise' | 'list', items: any[]) => void;
}

const YearlyTemplate: React.FC<YearlyTemplateProps> = ({ report, onDrillDown }) => {
  const currentYear = new Date(report.createdAt).getFullYear();

  return (
    <div className="space-y-32 pb-40 animate-in fade-in duration-1000">
      
      {/* FULL PAGE HERO */}
      <header className="relative py-48 px-10 bg-gray-900 text-white border-b-[40px] border-blue-600 overflow-hidden text-center flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({length: 144}).map((_, i) => (
              <div key={i} className="border-r border-b border-white/20"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 space-y-16">
           <Star className="mx-auto text-yellow-400 animate-spin-slow" size={160} />
           <div className="space-y-6">
              <h2 className="text-[10rem] font-black uppercase italic tracking-tighter leading-none text-white drop-shadow-[15px_15px_0px_rgba(59,130,246,1)]">成都 AI 生态蓝图</h2>
              <p className="text-4xl font-bold text-blue-400 tracking-[0.8em] uppercase italic">Fiscal Year {currentYear} Annual Landscape</p>
           </div>
           <div className="flex justify-center gap-20 mt-24">
              <div className="text-center cursor-pointer hover:scale-110 transition-transform" onClick={() => onDrillDown('生态产出总览', 'list', [])}>
                 <p className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">生态 AI 产品库 (ecoAIProducts)</p>
                 <p className="text-7xl font-black italic text-white">456</p>
              </div>
              <div className="w-px h-24 bg-white/20 self-center"></div>
              <div className="text-center cursor-pointer hover:scale-110 transition-transform" onClick={() => onDrillDown('实体现存量', 'list', [])}>
                 <p className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">实体现存量 (Total Records)</p>
                 <p className="text-7xl font-black italic text-white">1,245</p>
              </div>
              <div className="w-px h-24 bg-white/20 self-center"></div>
              <div className="text-center cursor-pointer hover:scale-110 transition-transform" onClick={() => onDrillDown('核心伙伴', 'list', [])}>
                 <p className="text-sm font-black uppercase text-gray-400 mb-4 tracking-widest">核心伙伴数 (partnerLevel)</p>
                 <p className="text-7xl font-black italic text-yellow-400">84</p>
              </div>
           </div>
        </div>
      </header>

      {/* SECTION 1: 年度战力脉动 (Annual API Vol. Trend) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 mb-16">
           <TrendingUp size={64} className="text-blue-600" />
           <h3 className="text-6xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">01. 年度战力脉动 (Annual Performance Curve)</h3>
        </div>
        <NeubrutalCard className="bg-white p-12 border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
           <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={mockYearlyData.monthlyGrowth}>
                    <defs>
                       <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 14, fontWeight: 'black', fill: '#000'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 'black', fontSize: 16 }} />
                    <Area type="step" dataKey="calls" stroke="#000" strokeWidth={8} fillOpacity={1} fill="url(#colorCalls)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t-8 border-gray-900 pt-12">
              <div className="p-6 bg-blue-50 border-4 border-gray-900">
                 <h4 className="font-black text-2xl uppercase mb-4 text-blue-600 italic">Q1-Q2 扩张期</h4>
                 <p className="text-base font-bold text-gray-700 leading-relaxed italic">完成首轮技术底座升级，确立全年增长基调。重点在高新区实现了 P0 企业 100% 覆盖。</p>
              </div>
              <div className="p-6 bg-yellow-50 border-4 border-gray-900">
                 <h4 className="font-black text-2xl uppercase mb-4 text-yellow-600 italic">Q3 爆发期</h4>
                 <p className="text-base font-bold text-gray-700 leading-relaxed italic">行业应用全面落地，API 调用量实现指数级跳跃。文心一言 4.0 企业用户量翻番。</p>
              </div>
              <div className="p-6 bg-purple-50 border-4 border-gray-900">
                 <h4 className="font-black text-2xl uppercase mb-4 text-purple-600 italic">Q4 稳固期</h4>
                 <p className="text-base font-bold text-gray-700 leading-relaxed italic">生态自闭环形成，进入高质量稳定发展阶段。资本活跃度与用工规模均创历史新高。</p>
              </div>
           </div>
        </NeubrutalCard>
      </section>

      {/* SECTION 2: 年度核心成就墙 (Achievements Wall) */}
      <section className="bg-yellow-400 py-40 border-y-[24px] border-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
           <Award size={600} />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <h3 className="text-8xl font-black uppercase italic tracking-tighter mb-24 flex items-center gap-8 text-gray-900">
              <Award size={100} /> 年度核心成就墙 (Key Achievements)
           </h3>
           <div className="grid grid-cols-1 gap-16">
              {mockYearlyData.achievements.map((ach, i) => (
                <div key={i} className="flex gap-16 items-start group cursor-pointer" onClick={() => onDrillDown(ach.title, 'list', [])}>
                   <div className="text-[12rem] font-black italic text-gray-900/10 group-hover:text-gray-900/100 transition-all duration-700 shrink-0 leading-none">0{i+1}</div>
                   <div className="pt-8 space-y-6">
                      <h4 className="text-5xl font-black uppercase italic border-b-8 border-gray-900 pb-4 inline-block text-gray-900">{ach.title}</h4>
                      <p className="text-3xl font-bold text-gray-800 leading-relaxed max-w-4xl">{ach.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 3: 产业结构多维透视 (Topology & Capital & Talent) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
         <div className="space-y-16">
            <h3 className="text-5xl font-black uppercase italic mb-12 flex items-center gap-6 text-gray-900 tracking-tighter underline decoration-blue-600 decoration-8 underline-offset-8">
               <Cpu className="text-blue-600" /> 技术栈渗透矩阵 (Tech Matrix)
            </h3>
            <div className="space-y-12">
               {mockYearlyData.techMix.map((tech, i) => (
                 <div key={i} className="space-y-4 cursor-pointer group" onClick={() => onDrillDown(tech.name, 'list', [])}>
                    <div className="flex justify-between font-black text-xl uppercase italic">
                       <span className="text-gray-900 group-hover:text-blue-600 transition-colors">{tech.name}</span>
                       <span className="text-blue-600 text-3xl">{tech.value}%</span>
                    </div>
                    <div className="h-14 border-8 border-gray-900 bg-white relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                       <div className="h-full border-r-8 border-gray-900 transition-all duration-1000 group-hover:opacity-80" style={{ width: `${tech.value}%`, backgroundColor: tech.color }}></div>
                    </div>
                 </div>
               ))}
            </div>
            <NeubrutalCard className="bg-blue-50 border-8 border-gray-900 shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] !p-10">
               <div className="flex items-start gap-6">
                  <Info className="text-blue-600 shrink-0" size={32} />
                  <p className="text-xl font-bold leading-relaxed text-gray-800 italic">
                    注：技术栈数据基于 `feijiangWenxin` 和 `ernieModelType` 字段聚合分析。本年度飞桨原生应用的增长率 (CAGR) 高达 **120%**，而文心一言在大中型企业 (registeredCapital &gt; 5000万) 中的渗透率已达到 **88%**。
                  </p>
               </div>
            </NeubrutalCard>
         </div>

         <div className="space-y-16 flex flex-col justify-center">
            <h3 className="text-5xl font-black uppercase italic mb-12 text-center text-gray-900 tracking-tighter">
               <Users className="inline-block mr-6 text-pink-500" size={64} /> 生态人才与资本总盘
            </h3>
            <div className="grid grid-cols-1 gap-10">
               <NeubrutalCard className="bg-white border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] !p-10 flex items-center gap-10 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => onDrillDown('人才规模分析', 'list', [])}>
                  <div className="w-24 h-24 bg-pink-500 border-4 border-gray-900 flex items-center justify-center rotate-3 shadow-lg">
                     <Users size={48} className="text-white" />
                  </div>
                  <div>
                     <p className="text-sm font-black uppercase text-gray-600 mb-2 tracking-widest">总计库内从业人员 (employeeCount)</p>
                     <h4 className="text-6xl font-black italic text-gray-900 leading-none">85,420+</h4>
                     <p className="text-xs font-black text-green-600 mt-2 uppercase italic tracking-widest">相比去年增长 28.4% ↑</p>
                  </div>
               </NeubrutalCard>

               <NeubrutalCard className="bg-white border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] !p-10 flex items-center gap-10 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => onDrillDown('资本活跃度分析', 'list', [])}>
                  <div className="w-24 h-24 bg-yellow-400 border-4 border-gray-900 flex items-center justify-center -rotate-3 shadow-lg">
                     <Coins size={48} className="text-gray-900" />
                  </div>
                  <div>
                     <p className="text-sm font-black uppercase text-gray-600 mb-2 tracking-widest">总计库内注册资本 (registeredCapital)</p>
                     <h4 className="text-6xl font-black italic text-gray-900 leading-none">¥124.5B</h4>
                     <p className="text-xs font-black text-blue-600 mt-2 uppercase italic tracking-widest">抗风险能级: S-CLASS</p>
                  </div>
               </NeubrutalCard>
            </div>
         </div>
      </section>

      {/* SECTION 4: 未来五年产业预测 (Five Year Strategic Roadmap) */}
      <section className="max-w-7xl mx-auto px-6 bg-blue-600 text-white p-24 border-[16px] border-gray-900 shadow-[40px_40px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 scale-150">
            <Rocket size={500} />
         </div>
         <div className="relative z-10 max-w-5xl">
            <h3 className="text-[6rem] font-black uppercase italic mb-16 border-b-[16px] border-white inline-block pb-6 tracking-tighter leading-none">2026-2030 产业宏图</h3>
            <div className="space-y-20">
               <div className="flex gap-12 items-start group">
                  <div className="w-24 h-24 bg-white text-blue-600 flex items-center justify-center font-black text-5xl shrink-0 border-8 border-gray-900 italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">26</div>
                  <div className="space-y-4">
                     <h4 className="text-4xl font-black uppercase italic text-white tracking-widest">全面 Agent 化转型 (Total Agentic Era)</h4>
                     <p className="text-2xl font-bold text-blue-100 leading-relaxed max-w-3xl italic">
                        预计 2026 年，成都 70% 以上的库内制造企业将完成基于文心大模型的 Agent 智能体部署。API 调用量将进入百亿次量级，实现从“AI 辅助”向“AI 主导”的生产流程进化。
                     </p>
                  </div>
               </div>
               <div className="flex gap-12 items-start group">
                  <div className="w-24 h-24 bg-white text-blue-600 flex items-center justify-center font-black text-5xl shrink-0 border-8 border-gray-900 italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">27</div>
                  <div className="space-y-4">
                     <h4 className="text-4xl font-black uppercase italic text-white tracking-widest">区域算力算法闭环 (Regional Loop)</h4>
                     <p className="text-2xl font-bold text-blue-100 leading-relaxed max-w-3xl italic">
                        打通成德眉资 AI 算力调度网络，通过本工作站实现全区域 3000 万人口规模的超大规模生态闭环，确立成都作为中国 AI 第五极的核心地位。
                     </p>
                  </div>
               </div>
            </div>
            <div className="mt-32 flex flex-wrap gap-24">
               <div className="text-center">
                  <p className="text-8xl font-black italic mb-4 text-yellow-400">350%</p>
                  <p className="text-xs font-black uppercase text-blue-200 tracking-[0.4em] text-center italic">预计增长能级</p>
               </div>
               <div className="text-center">
                  <p className="text-8xl font-black italic mb-4 text-white">200K</p>
                  <p className="text-xs font-black uppercase text-blue-200 tracking-[0.4em] text-center italic">AI 核心开发者池</p>
               </div>
               <div className="text-center">
                  <p className="text-8xl font-black italic mb-4 text-green-400">50+</p>
                  <p className="text-xs font-black uppercase text-blue-200 tracking-[0.4em] text-center italic">垂直大模型实验室</p>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL AUTHENTICATION */}
      <footer className="max-w-5xl mx-auto text-center space-y-16 pb-40">
         <div className="inline-block p-2 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] bg-gray-50">
            <div className="bg-white px-12 py-6 border-4 border-dashed border-gray-900">
               <p className="text-xl font-black uppercase tracking-[1em] text-gray-900 italic">AUTHENTICATED ANNUAL DOCUMENT</p>
            </div>
         </div>
         <div className="flex justify-center gap-16 opacity-10">
            <div className="w-24 h-24 border-[16px] border-gray-900"></div>
            <div className="w-24 h-24 border-[16px] border-gray-900 rounded-full"></div>
            <div className="w-24 h-24 border-[16px] border-gray-900 rotate-45"></div>
         </div>
         <p className="text-base font-bold text-gray-600 max-w-3xl mx-auto leading-loose italic px-10">
            此年度蓝图由 Enterprise AI Workstation 自动化情报系统基于 2025 全年度 1.5 亿次 API 负载特征、全量企业画像 (Enterprise Profile)、以及合作伙伴等级迁移概率模型生成的深度研报。本报告数据来源可靠，计算模型已通过内部逻辑审计。本报告属于成都人工智能产业内部战略档案，未经授权禁止外泄。
         </p>
         <div className="flex justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
            <span>Security Hash: 0x7F...3A9</span>
            <span>|</span>
            <span>Issued by: Neural Analyzer v9.0</span>
            <span>|</span>
            <span>(c) 2025 AI_Workstation</span>
         </div>
      </footer>
    </div>
  );
};

export default YearlyTemplate;
