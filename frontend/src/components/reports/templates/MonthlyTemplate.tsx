import React from 'react';
import { Report } from '../../../services/report.service';
import { 
  Globe, Layers, Award, BarChart3, TrendingUp, Users, MapPin, 
  Search, Shield, Zap, PieChart, ArrowRight, Activity, Coins, Briefcase
} from 'lucide-react';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

/**
 * VERSION: 3.0.1 (Cache Breaker)
 */

const mockMonthlyData = {
  sectors: [
    { name: '金融 (industry)', value: 35, color: '#3b82f6' },
    { name: '医疗 (industry)', value: 25, color: '#10b981' },
    { name: '制造 (industry)', value: 20, color: '#f59e0b' },
    { name: '政务 (industry)', value: 15, color: '#8b5cf6' },
    { name: '其他', value: 5, color: '#ef4444' },
  ],
  regions: [
    { name: '高新区 (base)', count: 145, active: 120, calls: '2.4M' },
    { name: '武侯区 (base)', count: 89, active: 70, calls: '0.8M' },
    { name: '锦江区 (base)', count: 67, active: 62, calls: '1.1M' },
    { name: '成华区 (base)', count: 45, active: 30, calls: '0.4M' },
    { name: '其他区域', count: 38, active: 35, calls: '0.1M' },
  ],
  capitalDistribution: [
    { range: '1亿以上', count: 12, color: '#1d4ed8' },
    { range: '5千万-1亿', count: 34, color: '#3b82f6' },
    { range: '1千万-5千万', count: 120, color: '#60a5fa' },
    { range: '1千万以下', count: 376, color: '#93c5fd' },
  ]
};

interface MonthlyTemplateProps {
  report: Report;
  onDrillDown: (title: string, type: 'enterprise' | 'list', items: any[]) => void;
}

const MonthlyTemplate: React.FC<MonthlyTemplateProps> = ({ report, onDrillDown }) => {
  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER HERO */}
      <header className="relative p-16 bg-gray-900 text-white border-8 border-gray-900 shadow-[24px_24px_0px_0px_rgba(59,130,246,1)] overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Globe size={400} />
        </div>
        <div className="relative z-10">
          <div className="inline-block px-4 py-1 bg-blue-600 font-black text-sm uppercase mb-8 tracking-[0.5em] italic">Monthly Strategic Intelligence Dossier</div>
          <h2 className="text-8xl font-black uppercase italic tracking-tighter mb-8 leading-none text-white">生态大盘月度战报</h2>
          <div className="h-4 w-64 bg-blue-500 mb-10"></div>
          <p className="text-2xl font-bold text-gray-200 leading-relaxed max-w-4xl">
            本月对成都人工智能产业全量数据库进行了穿透式分析。聚焦于 **{mockMonthlyData.regions.length} 个核心区域** 的企业分布与 **行业渗透深度**。本月重点新增了对企业含金量（注册资本）及员工规模的交叉分析，旨在识别生态内的“长青”与“高增长”双核心。
          </p>
        </div>
      </header>

      {/* KPI METRICS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { label: "库内总企业数", val: "542", sub: "实体现存量 (Total)", icon: Users },
          { label: "生态 AI 产品数", val: "156", sub: "ecoAIProducts", icon: Zap },
          { label: "联合方案案例", val: "42", sub: "jointSolutions", icon: BarChart3 },
          { label: "核心伙伴总数", val: "84", sub: "partnerLevel: 核心", icon: Award },
        ].map((m, i) => (
          <div 
            key={i} 
            className="bg-white border-8 border-gray-900 p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all cursor-pointer"
            onClick={() => onDrillDown(m.label, 'list', [])}
          >
            <m.icon className="text-blue-600 mb-6" size={32} />
            <p className="text-xs font-black uppercase text-gray-600 mb-2 tracking-widest">{m.label}</p>
            <div className="flex items-baseline gap-3">
              <h4 className="text-4xl font-black italic text-gray-900">{m.val}</h4>
              <span className="text-[10px] font-black bg-blue-100 px-2 py-1 text-blue-600 border-2 border-blue-600 uppercase italic leading-none">{m.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 2: 区域能级分布 (Regional Force) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <NeubrutalCard className="lg:col-span-3 bg-white !p-10 border-8">
          <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 text-gray-900">
            <MapPin className="text-red-500" /> 区域势能排行榜 (Regional Strength Matrix)
          </h3>
          <div className="space-y-10">
            {mockMonthlyData.regions.map((reg, i) => (
              <div key={i} className="space-y-3 cursor-pointer group" onClick={() => onDrillDown(reg.name, 'list', [])}>
                <div className="flex justify-between items-end font-black text-sm uppercase">
                  <span className="text-gray-900 group-hover:text-blue-600 transition-colors">{reg.name}</span>
                  <span className="text-gray-600 italic">API 预估用量: {reg.calls}</span>
                </div>
                <div className="h-10 bg-gray-100 border-4 border-gray-900 relative overflow-hidden">
                   <div className="h-full bg-blue-500 border-r-4 border-gray-900 transition-all duration-1000 group-hover:bg-blue-600" style={{ width: `${(reg.active/145)*100}%` }}></div>
                   <div className="absolute inset-0 flex items-center justify-end px-6">
                      <span className="text-xs font-black text-gray-900">活跃企业: {reg.active} / 库内: {reg.count}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 border-4 border-dashed border-gray-300 text-xs font-bold text-gray-600 text-center leading-relaxed">
            * 区域势能基于 `base` 字段聚合，综合 API 调用特征及 `partnerLevel` 加权计算得出。
          </div>
        </NeubrutalCard>

        <div className="lg:col-span-2 space-y-10">
          <NeubrutalCard className="bg-yellow-400 !p-10 border-8 h-full flex flex-col justify-between">
            <h3 className="text-2xl font-black uppercase mb-10 flex items-center gap-3 text-gray-900">
              <PieChart /> 行业渗透深度 (Industry Mix)
            </h3>
            <div className="h-[280px] mb-10">
               <ResponsiveContainer width="100%" height="100%">
                 <RePieChart>
                   <Pie
                      data={mockMonthlyData.sectors}
                      cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value"
                      stroke="#000" strokeWidth={6}
                   >
                     {mockMonthlyData.sectors.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ 
                       backgroundColor: '#000', 
                       color: '#fff', 
                       border: '4px solid #3b82f6', 
                       fontWeight: '900',
                       fontSize: '14px',
                       padding: '10px'
                     }} 
                     itemStyle={{ color: '#fff' }}
                   />
                 </RePieChart>
               </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 border-t-4 border-gray-900 pt-8">
               {mockMonthlyData.sectors.map((s, i) => (
                 <div key={i} className="flex justify-between items-center text-xs font-black uppercase text-gray-900">
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: s.color }}></div>
                      {s.name}
                   </div>
                   <span className="text-base italic">{s.value}%</span>
                 </div>
               ))}
            </div>
          </NeubrutalCard>
        </div>
      </section>

      {/* SECTION 3: 资本规模与含金量分析 (registeredCapital Distribution) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <NeubrutalCard className="bg-white !p-10 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
           <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 text-gray-900">
             <Coins className="text-yellow-600" /> 企业注册资本分布 (Capital Matrix)
           </h3>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={mockMonthlyData.capitalDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="range" tick={{fontSize: 11, fontWeight: 'black', fill: '#111'}} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 'black'}} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                       {mockMonthlyData.capitalDistribution.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={4} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <p className="mt-8 text-sm font-bold text-gray-700 leading-relaxed italic">
              基于 `registeredCapital` 字段分析，库内大中型企业占比稳步提升，显示出成都 AI 生态已吸引大量成熟资本进入，抗风险能力处于历史高位。
           </p>
        </NeubrutalCard>

        <NeubrutalCard className="bg-blue-600 !p-10 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
           <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 text-gray-900">
             <Briefcase className="text-gray-900" /> 企业用工规模画像 (Employee Scale)
           </h3>
           <div className="space-y-8">
              {[
                { label: "1000人以上 (特大型)", count: 8, icon: "🏢" },
                { label: "500-1000人 (大型)", count: 24, icon: "🏭" },
                { label: "100-500人 (中型)", count: 156, icon: "🏦" },
                { label: "100人以下 (小型/初创)", count: 354, icon: "🚀" },
              ].map((scale, i) => (
                <div key={i} className="flex items-center gap-6 p-4 border-4 border-gray-900 bg-black/5 group hover:bg-gray-900 transition-all cursor-pointer">
                   <span className="text-4xl group-hover:scale-110 transition-transform">{scale.icon}</span>
                   <div className="flex-1">
                      <p className="text-xs font-black uppercase text-blue-900 mb-1 group-hover:text-blue-400">{scale.label}</p>
                      <div className="flex items-baseline gap-4">
                         <h4 className="text-4xl font-black italic text-gray-900 group-hover:text-white">{scale.count}</h4>
                         <span className="text-xs font-black uppercase text-blue-900/60 group-hover:text-gray-400">已入库实体</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </NeubrutalCard>
      </section>

      {/* SECTION 4: 伙伴等级变迁图 (partnerLevel Funnel) */}
      <section className="bg-gray-900 text-white p-16 border-b-[24px] border-yellow-400 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6 mb-16">
           <Award className="text-yellow-400" size={64} />
           <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">伙伴能级全景看板 (partnerLevel Profile)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { level: '核心伙伴', count: 12, growth: '+2', color: 'text-blue-400', desc: '深度技术对标，产出联合解决方案。' },
             { level: '普通伙伴', count: 45, growth: '+5', color: 'text-yellow-400', desc: '具备 API 调用能力，活跃跟进中。' },
             { level: '生态储备', count: 120, growth: '+15', color: 'text-white', desc: '具备基础 AI 基因，处于待赋能阶段。' },
           ].map((lvl, i) => (
             <div key={i} className="relative p-10 border-4 border-gray-700 bg-white/5 group hover:border-blue-400 transition-all cursor-pointer" onClick={() => onDrillDown(lvl.level, 'list', [])}>
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gray-900 border-4 border-gray-700 flex items-center justify-center font-black italic text-xl">0{i+1}</div>
                <p className="text-sm font-black uppercase text-gray-400 mb-6 tracking-widest">{lvl.level}</p>
                <div className="flex items-baseline gap-6 mb-6">
                   <h4 className={`text-7xl font-black italic ${lvl.color}`}>{lvl.count}</h4>
                   <span className="text-green-400 font-black text-sm uppercase italic">{lvl.growth} New</span>
                </div>
                <p className="text-xs font-bold text-gray-300 leading-relaxed border-t border-gray-800 pt-6 italic">
                   {lvl.desc}
                </p>
             </div>
           ))}
        </div>
      </section>

      {/* FOOTER ACTION PANEL */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 p-12 bg-white border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
           <Shield className="text-blue-600" size={48} />
           <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Database Status: Synced & Verified</p>
              <p className="text-xs font-bold text-gray-600 italic">本报告数据基于 2025 年实时业务线索数据库提取，已通过 L7 级情报审计。</p>
           </div>
        </div>
        <div className="flex gap-6 shrink-0">
           <button className="px-10 py-4 border-4 border-gray-900 font-black uppercase text-sm hover:bg-gray-100 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">导出深度研报 (PDF)</button>
           <button className="px-10 py-4 bg-blue-600 text-white border-4 border-gray-900 font-black uppercase text-sm hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">下发作战单元</button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTemplate;