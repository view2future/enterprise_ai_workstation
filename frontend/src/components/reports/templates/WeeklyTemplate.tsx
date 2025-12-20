import React from 'react';
import { Report } from '../../../services/report.service';
import { 
  Zap, TrendingUp, Target, Activity, AlertCircle, TrendingDown, 
  ArrowUpRight, MousePointer2, ShieldCheck, Cpu, MessageSquare, 
  Briefcase, Filter, Info, UserPlus, FileEdit, Clock, CheckSquare,
  BarChart, Users, Settings, AlertTriangle
} from 'lucide-react';
import { NeubrutalCard } from '../../ui/neubrutalism/NeubrutalComponents';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart as ReBarChart, Bar, Cell, ComposedChart, Line
} from 'recharts';

const mockWeeklyDetailed = {
  summary: "本周成都 AI 生态在 API 调用活跃度上呈现显著增长。特别是高新区的新入库 P0 级企业，其平均调用量远超全量均值，显示出极强的业务爆发力。文心一言在金融与政务场景的渗透率持续提升。建议下周重点关注武侯区几家 P1 级企业的技术对接延迟问题。",
  stats: [
    { label: "本周新入库", value: "12", sub: "实体新增", color: "bg-yellow-400" },
    { label: "线索更新", value: "45", sub: "属性完善", color: "bg-blue-400" },
    { label: "生态产品储备", value: "28", sub: "ecoAIProducts", color: "bg-pink-400" },
    { label: "高价值跟进", value: "08", sub: "P0/P1 Targets", color: "bg-green-400" },
  ],
  dailyPulse: [
    { day: 'Mon', calls: 120, events: 5 }, { day: 'Tue', calls: 150, events: 8 }, 
    { day: 'Wed', calls: 190, events: 12 }, { day: 'Thu', calls: 140, events: 4 },
    { day: 'Fri', calls: 165, events: 9 }, { day: 'Sat', calls: 80, events: 2 },
    { day: 'Sun', calls: 75, events: 1 },
  ],
  topTargets: [
    { name: "锦江金融大脑", base: "锦江区", priority: "P0", calls: "245k", tech: "文心 4.0", status: '活跃' },
    { name: "成都智算中心", base: "高新区", priority: "P0", calls: "189k", tech: "飞桨核心", status: '活跃' },
    { name: "武侯数字政府", base: "武侯区", priority: "P1", calls: "156k", tech: "文心 3.5", status: '待跟进' },
    { name: "高新视觉科技", base: "高新区", priority: "P1", calls: "134k", tech: "飞桨深度", status: '活跃' },
  ]
};

interface WeeklyTemplateProps {
  report: Report;
  onDrillDown: (title: string, type: 'enterprise' | 'list', items: any[]) => void;
}

const WeeklyTemplate: React.FC<WeeklyTemplateProps> = ({ report, onDrillDown }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      {/* SECTION 1: 战态指标概览 */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-3 h-10 bg-gray-900"></div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">01. 核心 KPI 仪表盘 (Weekly Performance)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockWeeklyDetailed.stats.map((stat, i) => (
            <NeubrutalCard 
              key={i} 
              className={`${stat.color} !p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-x-1 hover:-translate-y-1 transition-all group`}
              onClick={() => onDrillDown(stat.label, 'list', [])}
            >
              <p className="text-[10px] font-black uppercase text-gray-900/60 mb-2">{stat.label}</p>
              <h4 className="text-5xl font-black italic text-gray-900 mb-2 group-hover:underline decoration-4">{stat.value}</h4>
              <p className="text-[10px] font-bold text-gray-900/50 uppercase tracking-widest">{stat.sub}</p>
            </NeubrutalCard>
          ))}
        </div>
      </section>

      {/* SECTION 2: 每日动态轨迹 (Daily Activity Pulse) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <NeubrutalCard className="lg:col-span-2 bg-white !p-8">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black uppercase flex items-center gap-3 text-gray-900">
                <Activity className="text-blue-600" /> 每日活跃脉动 (Daily Pulse)
              </h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600"></div>
                    <span className="text-[10px] font-black uppercase">API 调用 (k)</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase">重要事件数</span>
                 </div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={mockWeeklyDetailed.dailyPulse}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'black'}} />
                    <YAxis yAxisId="left" hide />
                    <YAxis yAxisId="right" hide />
                    <Tooltip contentStyle={{backgroundColor: '#000', color: '#fff', border: 'none'}} />
                    <Bar yAxisId="left" dataKey="calls" fill="#3b82f6" radius={[4,4,0,0]} />
                    <Line yAxisId="right" type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={4} dot={{r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </NeubrutalCard>

        <div className="lg:col-span-1 space-y-8">
           <NeubrutalCard className="bg-gray-900 text-white !p-8 h-full flex flex-col justify-between border-b-[12px] border-blue-600">
              <div>
                 <h3 className="font-black uppercase mb-8 text-blue-400 italic text-xl tracking-widest flex items-center gap-2">
                    <MessageSquare size={24} /> 情报官深度评述
                 </h3>
                 <div className="relative p-6 border-2 border-blue-500/50 bg-black/40">
                    <p className="text-base font-bold leading-loose text-white">
                      {mockWeeklyDetailed.summary}
                    </p>
                 </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800 flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 flex items-center justify-center font-black italic text-white border-2 border-white">AI</div>
                 <div>
                    <p className="text-xs font-black uppercase text-white tracking-widest">System Automator</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Weekly Tactical Analyst</p>
                 </div>
              </div>
           </NeubrutalCard>
        </div>
      </section>

      {/* SECTION 3: 重点监控矩阵 (Priority Targets) */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <Target className="text-red-600" size={32} />
             <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">02. 高价值监控矩阵 (Target Matrix)</h3>
          </div>
          <div className="flex gap-4">
             <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase">SYNCED: 100%</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-8 border-gray-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <thead className="bg-gray-100 border-b-8 border-gray-900">
              <tr>
                <th className="p-5 text-left font-black uppercase text-sm italic">目标代号 (enterpriseName)</th>
                <th className="p-5 text-left font-black uppercase text-sm">所属区域 (base)</th>
                <th className="p-5 text-left font-black uppercase text-sm">优先级 (priority)</th>
                <th className="p-5 text-left font-black uppercase text-sm">技术栈趋势</th>
                <th className="p-5 text-center font-black uppercase text-sm">实时状态</th>
                <th className="p-5 text-right font-black uppercase text-sm italic">月均 API 负载</th>
              </tr>
            </thead>
            <tbody>
              {mockWeeklyDetailed.topTargets.map((target, i) => (
                <tr 
                  key={i} 
                  className="border-b-4 border-gray-100 hover:bg-yellow-50 transition-all cursor-pointer group"
                  onClick={() => onDrillDown(target.name, 'enterprise', [target])}
                >
                  <td className="p-5 font-black text-lg uppercase text-gray-900 group-hover:text-blue-600 underline decoration-dashed decoration-2 underline-offset-4">{target.name}</td>
                  <td className="p-5 text-xs font-black uppercase text-gray-500">{target.base}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 border-4 border-gray-900 text-xs font-black uppercase ${target.priority === 'P0' ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                      {target.priority}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       <Cpu size={14} className="text-gray-400" />
                       <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-tighter">{target.tech}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border-2 ${target.status === '活跃' ? 'border-green-600 text-green-600 bg-green-50' : 'border-yellow-600 text-yellow-600 bg-yellow-50'}`}>
                      {target.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-black text-xl italic text-gray-900">{target.calls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: 生态风险扫描 (Risk Radar) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <NeubrutalCard className="bg-pink-500 !p-8 border-8 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-gray-900">
           <div className="flex items-center gap-4 mb-8">
              <AlertTriangle size={40} className="text-gray-900" />
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">异常波动扫描 (Risk Radar)</h3>
           </div>
           <div className="space-y-6">
              {[
                { label: "API 调用异常下跌企业", count: 3, level: "中风险", color: "bg-yellow-400" },
                { label: "线索入库逾期未跟进", count: 15, level: "高风险", color: "bg-red-500" },
                { label: "核心 P0 伙伴活跃度降级", count: 1, level: "立即干预", color: "bg-white" },
              ].map((risk, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-4 border-gray-900 bg-white/40">
                   <span className="font-black text-sm uppercase text-gray-900">{risk.label}</span>
                   <div className="flex items-center gap-3">
                      <span className="text-3xl font-black italic text-gray-900">{risk.count}</span>
                      <span className={`px-2 py-1 ${risk.color} text-gray-900 text-[10px] font-black border-2 border-gray-900 uppercase`}>{risk.level}</span>
                   </div>
                </div>
              ))}
           </div>
        </NeubrutalCard>

        <NeubrutalCard className="bg-yellow-400 !p-8 border-8 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center gap-4 mb-8">
              <Settings size={40} className="text-gray-900" />
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">资源分配建议 (Resources)</h3>
           </div>
           <div className="space-y-4">
              {[
                { task: "技术支持部: 对接锦江金融大脑", hours: "16h" },
                { task: "市场运营部: 高新区新入库回访", hours: "24h" },
                { task: "安全审计组: 季度数据脱敏检查", hours: "8h" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-4 border-gray-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                   <span className="font-black text-xs uppercase text-gray-600">{item.task}</span>
                   <span className="font-black text-lg italic text-gray-900">{item.hours}</span>
                </div>
              ))}
              <div className="pt-4">
                 <button className="w-full py-3 bg-gray-900 text-white font-black uppercase text-xs hover:bg-blue-600 transition-all border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">发起资源调度申请</button>
              </div>
           </div>
        </NeubrutalCard>
      </section>

      {/* SECTION 5: 下周行动协议 */}
      <section className="bg-blue-600 p-12 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] text-white">
        <h3 className="text-4xl font-black uppercase italic mb-10 flex items-center gap-4">
          <Briefcase size={40} /> 03. 下周行动协议 (Action Protocol)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="font-black text-lg uppercase text-blue-200 border-b-2 border-blue-400 pb-2">关键跟进事项 (Next Week Priority)</p>
            {[
              "对高新区新入库的 3 家 P0 企业进行实地技术交流",
              "协调锦江区金融大脑项目的 API 配额提升申请",
              "完善武侯区政务大模型应用案例的线索入库 (clueInTime)",
              "组织成华区开发者沙龙，重点推介飞桨底座"
            ].map((task, i) => (
              <div key={i} className="flex items-start gap-5 bg-blue-700/50 p-5 border-2 border-blue-400 hover:bg-blue-700 transition-colors">
                <div className="w-8 h-8 border-4 border-white flex items-center justify-center font-black text-sm shrink-0">{i+1}</div>
                <p className="font-bold text-base leading-relaxed">{task}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-end items-end space-y-8 text-right">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-blue-200 mb-1 tracking-widest">报告生成终端</p>
              <p className="text-4xl font-black italic uppercase text-white tracking-tighter underline decoration-yellow-400 decoration-8">INTEL TERMINAL X</p>
            </div>
            <div className="p-4 bg-white border-8 border-gray-900 rotate-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)]">
               <div className="w-32 h-32 border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-200 font-black text-[10px] text-center gap-2">
                  <ShieldCheck size={40} />
                  CONFIDENTIAL<br/>STAMPED
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER METADATA */}
      <footer className="pt-20 border-t-8 border-gray-100 flex flex-wrap gap-12 opacity-50 pb-10">
        <div className="flex items-center gap-3">
           <Info size={18} className="text-gray-900" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Confidence: 99.8% // Data Integrity: SHA-256 Verified</span>
        </div>
        <div className="flex items-center gap-3">
           <Filter size={18} className="text-gray-900" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Filters: active=true, priority=[P0,P1]</span>
        </div>
        <div className="flex items-center gap-3 text-gray-900">
           <UserPlus size={18} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Source: Real-time Enterprise Database Matrix</span>
        </div>
      </footer>
    </div>
  );
};

export default WeeklyTemplate;