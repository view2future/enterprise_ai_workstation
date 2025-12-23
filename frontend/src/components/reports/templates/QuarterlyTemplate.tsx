import React from 'react';
import { Report } from '../../../services/report.service';
import { 
  Target, TrendingUp, Award, Zap, ShieldCheck, Rocket, PieChart, Cpu, BarChart3, 
  Search, Info, CheckCircle, Map, Layers, ArrowRight
} from 'lucide-react';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, XAxis, YAxis, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

const mockQuarterlyData = {
  qualityMetrics: [
    { label: "高新技术企业 (isHighTech)", value: "128", percent: "24%", trend: "+5" },
    { label: "专精特新企业 (isSpecialized)", value: "56", percent: "10%", trend: "+2" },
    { label: "联合方案产出 (jointSolutions)", value: "42", percent: "核心指标", trend: "+12" },
  ],
  implementationStages: [
    { stage: '方案规划 (aiImplementationStage)', count: 45, color: '#94a3b8' },
    { stage: '模型开发 (aiImplementationStage)', count: 86, color: '#60a5fa' },
    { stage: '生产部署 (aiImplementationStage)', count: 120, color: '#3b82f6' },
    { stage: '规模化应用 (aiImplementationStage)', count: 32, color: '#1d4ed8' },
  ]
};

interface QuarterlyTemplateProps {
  report: Report;
  onDrillDown: (title: string, type: 'enterprise' | 'list', items: any[]) => void;
}

const QuarterlyTemplate: React.FC<QuarterlyTemplateProps> = ({ report, onDrillDown }) => {
  const currentQuarter = Math.ceil((new Date(report.createdAt).getMonth() + 1) / 3);
  
  return (
    <div className="space-y-24 pb-20 animate-in fade-in zoom-in duration-700">
      
      {/* SECTION: TITLE HERO */}
      <div className="text-center relative py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gray-900 -z-10 opacity-20"></div>
        <div className="inline-block px-12 py-5 bg-purple-600 text-white border-8 border-gray-900 font-black uppercase text-3xl -rotate-2 mb-10 shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] italic tracking-tighter">
          Q{currentQuarter} 季度高质量发展战略研报
        </div>
        <h2 className="text-9xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">季度战略复盘</h2>
        <p className="mt-10 text-2xl font-bold text-gray-500 uppercase tracking-[0.8em]">Strategic Excellence & Implementation Index</p>
      </div>

      {/* SECTION 1: 高质量发展矩阵 (isHighTech, isSpecialized, jointSolutions) */}
      <section>
        <div className="flex items-center gap-6 mb-12">
           <Layers className="text-purple-600" size={48} />
           <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">01. 生态高质量指标矩阵 (Quality Matrix)</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {mockQuarterlyData.qualityMetrics.map((m, i) => (
            <div 
              key={i} 
              className="bg-white border-8 border-gray-900 p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all"
              onClick={() => onDrillDown(m.label, 'list', [])}
            >
              <div className="absolute -right-6 -bottom-6 text-gray-100 group-hover:text-purple-50 transition-colors">
                 <ShieldCheck size={160} />
              </div>
              <div className="relative z-10">
                 <p className="text-sm font-black uppercase text-gray-600 mb-4 tracking-widest leading-tight">{m.label}</p>
                 <div className="flex items-baseline gap-4 mb-6">
                    <h4 className="text-7xl font-black italic text-gray-900">{m.value}</h4>
                    <span className="text-green-600 font-black text-xl italic">{m.trend} ↑</span>
                 </div>
                 <span className="px-4 py-1 bg-gray-900 text-white border-4 border-gray-900 font-black text-sm uppercase italic shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]">
                    库内占比: {m.percent}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: AI 落地成熟度深度拆解 (aiImplementationStage) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         <NeubrutalCard className="bg-gray-50 border-8 border-gray-900 !p-12 shadow-[15px_15px_0px_0px_rgba(59,130,246,1)]">
            <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 text-gray-900 italic tracking-tighter underline decoration-blue-500 decoration-8 underline-offset-8">
               <Rocket className="text-blue-600" /> AI 落地成熟度分布 (Maturity Index)
            </h3>
            <div className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={mockQuarterlyData.implementationStages} margin={{ left: 60, right: 40 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ddd" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="stage" type="category" tick={{fontSize: 10, fontWeight: 'black', fill: '#000'}} width={180} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 'black'}} />
                     <Bar dataKey="count" radius={[0, 8, 8, 0]} label={{ position: 'right', fill: '#000', fontWeight: 'black', fontSize: 16 }}>
                        {mockQuarterlyData.implementationStages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={4} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="mt-10 text-sm font-bold uppercase text-gray-600 italic text-center leading-relaxed">
               * 基于 `aiImplementationStage` 字段聚合。目前生态已从试验阶段 (Pilot) 全面转向规模化应用阶段 (Scaled Application)。
            </p>
         </NeubrutalCard>

         <div className="flex flex-col gap-10">
            <NeubrutalCard className="bg-yellow-400 border-8 border-gray-900 !p-10 flex flex-col justify-center grow shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
               <div className="flex items-center gap-6 mb-8">
                  <Cpu size={64} className="text-gray-900" />
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">技术渗透结论</h3>
               </div>
               <p className="text-2xl font-bold text-gray-900 leading-relaxed mb-10 italic">
                  本季度 **文心一言 (ERNIE)** 与 **飞桨 (Paddle)** 的协同效应显著，特别是在“生产部署”阶段的企业中，复合增长率达到了 **34.2%**。这直接印证了成都 AI 生态的“底座化”转型非常成功。
               </p>
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                     <p className="text-xs font-black uppercase text-gray-600 mb-2">季度技术渗透增量</p>
                     <p className="text-4xl font-black italic text-gray-900">+15.4%</p>
                  </div>
                  <div className="p-6 bg-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                     <p className="text-xs font-black uppercase text-gray-600 mb-2">核心伙伴质量评分</p>
                     <p className="text-4xl font-black italic text-blue-600">A+ Grade</p>
                  </div>
               </div>
            </NeubrutalCard>
            
            <NeubrutalCard className="bg-white border-8 border-gray-900 !p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6">
               <div className="p-4 bg-gray-100 border-4 border-gray-900 shrink-0">
                  <CheckCircle size={32} className="text-green-600" />
               </div>
               <div>
                  <h4 className="font-black uppercase italic text-lg mb-1">季度合规扫描完成</h4>
                  <p className="text-sm font-bold text-gray-600 uppercase">100% Data Integrity // clueInTime Audit Passed</p>
               </div>
            </NeubrutalCard>
         </div>
      </section>

      {/* SECTION 3: 季度决策建议 (Executive Strategy) */}
      <section className="bg-gray-900 text-white p-20 border-l-[40px] border-purple-600 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-5xl">
           <div className="flex items-center gap-8 mb-16">
              <BarChart3 className="text-yellow-400" size={64} />
              <h3 className="text-6xl font-black uppercase italic tracking-tighter leading-none">核心决策建议 (Executive Advisory)</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-10 relative pl-12 border-l-8 border-purple-500/30">
                 <h4 className="text-3xl font-black uppercase text-blue-400 italic mb-6 underline decoration-blue-500/30 decoration-8 underline-offset-8">产业空间分布优化 (base)</h4>
                 <p className="text-xl font-bold text-gray-300 leading-loose">
                    虽然高新区仍是生态核心，但数据穿透显示，**武侯区** 和 **成华区** 在传统制造 AI 化转型的垂直赛道上表现出极强的爆发力。下季度建议在这两个区域建立“二级技术赋能中心”，以承接日益增长的模型本地化需求。
                 </p>
                 <button className="flex items-center gap-3 font-black text-xs uppercase text-blue-400 hover:text-white transition-colors">
                    查看详细区域对比报告 <TrendingUp size={16} />
                 </button>
              </div>
              <div className="space-y-10 relative pl-12 border-l-8 border-yellow-500/30">
                 <h4 className="text-3xl font-black uppercase text-yellow-400 italic mb-6 underline decoration-yellow-500/30 decoration-8 underline-offset-8">伙伴能级跃迁策略 (level)</h4>
                 <p className="text-xl font-bold text-gray-300 leading-loose">
                    当前“无等级”企业基数庞大（占库内 65%）。分析发现其中有 15% 的企业已具备向“普通伙伴”跃迁的 API 活跃度条件。建议发起“能级跃迁专项计划”，通过定向配额补贴，在本年度内将核心伙伴总数推升至 100 家以上。
                 </p>
                 <button className="flex items-center gap-3 font-black text-xs uppercase text-yellow-400 hover:text-white transition-colors">
                    调取目标提升清单 <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER CHECKLIST */}
      <div className="p-16 border-8 border-gray-900 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none italic font-black text-8xl rotate-12">STRATEGY</div>
         <div className="space-y-8 relative z-10">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">下季度启动准备清单 (Next Steps)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {[
                 "更新全量 API 负载监控模型 (avgMonthlyApiCalls)",
                 "完成对 24 家 P0 重点企业的实地审计 (lastAuditTime)",
                 "启动成都 AI 产业开发者补贴政策宣讲",
                 "基于 industry 字段重构垂直领域推荐算法"
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => onDrillDown(item, 'list', [])}>
                    <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-black text-xs group-hover:bg-purple-600 transition-colors">{i+1}</div>
                    <span className="font-black text-sm uppercase text-gray-700 group-hover:text-gray-900 underline decoration-gray-100 decoration-4">{item}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="shrink-0 text-center space-y-4">
            <p className="text-xs font-black uppercase text-gray-500 italic tracking-[0.5em] mb-4">Strategic Authentication</p>
            <div className="w-64 h-24 border-8 border-gray-900 flex items-center justify-center italic font-black text-3xl bg-gray-100 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] relative">
               <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full border-2 border-gray-900"></div>
               SYSTEM_APPROVED
            </div>
         </div>
      </div>
    </div>
  );
};

export default QuarterlyTemplate;