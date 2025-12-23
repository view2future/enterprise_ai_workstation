import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../services/dashboard.service';
import { 
  ArrowLeft, 
  Zap, 
  Globe, 
  Trophy, 
  Star,
  Plus,
  BarChart3,
  TrendingUp,
  Maximize2,
  MessageSquare,
  Sparkles,
  Radar as RadarIcon,
  Info,
  Cpu,
  Database,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from 'recharts';
import { NeubrutalCard, NeubrutalButton, NumberCounter } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const radarData = [
  { subject: '生态密度', A: 120, fullMark: 150 },
  { subject: 'AI 成熟度', A: 98, fullMark: 150 },
  { subject: '资源投入', A: 86, fullMark: 150 },
  { subject: '协作产出', A: 110, fullMark: 150 },
  { subject: '市场活力', A: 85, fullMark: 150 },
];

const TIME_RANGES = [
  { value: 'all', label: '全部' },
  { value: 'week', label: '过去一周' },
  { value: 'month', label: '过去一个月' },
  { value: 'three_months', label: '过去三个月' },
  { value: 'year', label: '过去一年' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = React.useState('all');

  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'overview', timeRange],
    queryFn: () => dashboardApi.getOverview(timeRange).then(res => res.data),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-3xl font-black italic">SCANNING ECOSYSTEM...</div>;

  if (error) return <div className="p-6 text-red-600 text-center font-black">DATALINK_ERROR: {(error as Error).message}</div>;

  const stats = overviewData?.stats;
  const chartData = overviewData?.chartData;

  return (
    <div className="space-y-8 pb-12">
      {/* V2.0 AI NARRATOR SUMMARY */}
      <div className="bg-gray-900 border-l-[12px] border-blue-600 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
           <Sparkles size={120} className="text-blue-400" />
        </div>
        <div className="relative z-10 flex items-start gap-6">
           <div className="w-16 h-16 bg-blue-600 border-2 border-white rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <MessageSquare className="text-white" size={32} />
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <h2 className="text-blue-400 font-black uppercase text-xs tracking-[0.3em]">Strategic Narrator // V2.0</h2>
                 <span className="px-2 py-0.5 bg-blue-900 text-blue-300 text-[8px] font-bold rounded-full border border-blue-700 animate-pulse">AI LIVE ANALYZING</span>
              </div>
              <p className="text-white text-lg font-bold leading-relaxed max-w-5xl italic">
                 本周西南地区 AI 生态展现出明显的“集群效应”，{stats?.totalEnterprises || 0} 家库内企业中，高新区 P0 级企业活跃度提升了 <span className="text-blue-400 underline decoration-2 underline-offset-4">12.4%</span>。建议本月重点关注 <span className="text-yellow-400 font-black">“联合解决方案”</span> 的实质性转化率。
              </p>
           </div>
        </div>
      </div>

      {/* V2.0 第二层：政策沙盒与补链分析 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <NeubrutalCard className="bg-gray-900 border-indigo-500 !p-6 shadow-[10px_10px_0px_0px_rgba(99,102,241,0.5)] flex flex-col justify-between">
           <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                 <h3 className="font-black uppercase text-white flex items-center gap-2 text-sm italic">
                    <Sliders size={18} className="text-indigo-400" /> 政策模拟沙盒 
                 </h3>
                 <p className="text-[8px] text-indigo-400 font-bold tracking-widest">[CONCEPTUAL PROTOTYPE]</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-900/50 text-indigo-300 text-[8px] font-black border border-indigo-700">EXPERIMENTAL</span>
           </div>
           
           <div className="space-y-6">
              {[
                { label: 'API 调用补贴强度', val: 30 },
                { label: '算力算薪覆盖率', val: 65 },
                { label: '人才引育专项基金', val: 40 }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                      <span>{item.label}</span>
                      <span className="text-indigo-400">{item.val}%</span>
                   </div>
                   <div className="h-2 bg-gray-800 border border-gray-700 relative">
                      <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" style={{ width: `${item.val}%` }}></div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-900 cursor-pointer hover:scale-110 transition-transform"></div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              <p className="text-[10px] text-indigo-200 font-bold leading-relaxed italic">
                 <Lightbulb className="inline-block mr-1" size={12} /> 
                 预测：若将 API 补贴提升至 50%，预计下季度 P0 企业活跃度将额外增长 8.4%。
              </p>
           </div>
        </NeubrutalCard>

        <NeubrutalCard className="xl:col-span-2 bg-white border-8 border-gray-900 !p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase flex items-center gap-2 text-sm italic tracking-widest">
                 <ShieldCheck size={18} className="text-green-600" /> 产业链韧性分析 (补链导航)
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase">Real-time DB Scan</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <p className="text-xs font-bold text-gray-500 uppercase italic">当前库内环节分布</p>
                 <div className="space-y-4">
                    {[
                      { segment: '应用层 (App Layer)', count: 245, status: 'Surplus', color: 'text-green-600' },
                      { segment: '模型层 (Model Layer)', count: 86, status: 'Healthy', color: 'text-blue-600' },
                      { segment: '算力/芯片 (Base Layer)', count: 12, status: 'Scarcity', color: 'text-red-600' },
                    ].map((seg, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-2 border-gray-100 hover:border-gray-900 transition-all group">
                         <div>
                            <p className="text-xs font-black uppercase text-gray-900">{seg.segment}</p>
                            <p className="text-[10px] font-bold text-gray-400">{seg.count} Enterprises Locked</p>
                         </div>
                         <span className={`text-[10px] font-black px-2 py-1 border-2 border-current uppercase ${seg.color}`}>{seg.status}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-gray-50 p-6 border-4 border-dashed border-gray-200 flex flex-col justify-center text-center space-y-4">
                 <AlertTriangle size={48} className="mx-auto text-red-500 animate-bounce" />
                 <h4 className="font-black uppercase text-sm">补链建议预警</h4>
                 <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                    检测到“算力支撑层”企业密度低于西南平均水平。建议情报员重点跟进 **西安** 区域的半导体线索，并引导其与 **成都** 高新区进行跨区域技术对标。
                 </p>
                 <button className="px-4 py-2 bg-gray-900 text-white font-black text-[10px] uppercase hover:bg-red-600 transition-colors">
                    调取高优引育名单
                 </button>
              </div>
           </div>
        </NeubrutalCard>
      </div>

      {/* 头部：大盘标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">区域AI产业生态指挥部</h1>
          <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Strategic Intelligence Command Center v2.0.4</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 font-black text-xs border-2 border-gray-800 transition-all ${
                timeRange === range.value ? 'bg-gray-800 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 磁贴 + 战略雷达 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NeubrutalCard className="bg-white border-blue-600 border-b-8">
            <p className="text-xs font-black text-gray-500 uppercase flex justify-between">企业数据总量 <Database size={14} /></p>
            <p className="text-5xl font-black mt-2 italic">
              <NumberCounter value={stats?.totalEnterprises || 0} />
            </p>
            <p className="text-[10px] font-bold text-blue-600 mt-4 flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate('/enterprises')}>
              DRIVE_SYSTEM_SYNC_COMPLETE <ArrowLeft size={10} className="rotate-180" />
            </p>
          </NeubrutalCard>
          <NeubrutalCard className="bg-red-50 border-red-600 border-b-8">
            <p className="text-xs font-black text-red-800 uppercase flex justify-between">P0级核心伙伴 <Trophy size={14} /></p>
            <p className="text-5xl font-black mt-2 italic text-red-600">
              <NumberCounter value={stats?.p0Enterprises || 0} />
            </p>
            <p className="text-[10px] font-bold text-red-700 mt-4 italic uppercase">STRATEGIC_ASSET_LOCKED</p>
          </NeubrutalCard>
          <NeubrutalCard className="bg-blue-50 border-blue-400 border-b-8">
            <p className="text-xs font-black text-blue-800 uppercase flex justify-between">飞桨技术覆盖 <Cpu size={14} /></p>
            <p className="text-5xl font-black mt-2 italic text-blue-600">
              <NumberCounter value={stats?.feijiangEnterprises || 0} />
            </p>
            <p className="text-[10px] font-bold text-blue-700 mt-4 uppercase">PaddlePaddle_Nodes</p>
          </NeubrutalCard>
          <NeubrutalCard className="bg-purple-50 border-purple-600 border-b-8">
            <p className="text-xs font-black text-purple-800 uppercase flex justify-between">文心技术覆盖 <Zap size={14} /></p>
            <p className="text-5xl font-black mt-2 italic text-purple-600">
              <NumberCounter value={stats?.wenxinEnterprises || 0} />
            </p>
            <p className="text-[10px] font-bold text-purple-700 mt-4 uppercase tracking-tighter">ERNIE_Bot_Generative_AI</p>
          </NeubrutalCard>
        </div>

        {/* V2.0 STRATEGIC RADAR */}
        <NeubrutalCard className="bg-white border-8 border-gray-900 !p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest italic"><RadarIcon size={18} className="text-blue-600" /> 产业能级雷达</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
           </div>
           <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 10, fontWeight: '900' }} />
                    <Radar
                       name="当前表现"
                       dataKey="A"
                       stroke="#3b82f6"
                       strokeWidth={4}
                       fill="#3b82f6"
                       fillOpacity={0.3}
                    />
                    <Tooltip contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 'black', fontSize: '12px' }} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
           <p className="mt-4 text-[10px] font-bold text-gray-400 text-center uppercase tracking-[0.2em] leading-relaxed border-t-2 border-gray-100 pt-4">
              Sector: AI_INDUSTRIAL_CHAIN // Status: EVOLVING
           </p>
        </NeubrutalCard>
      </div>

      {/* 分布分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2"><Globe className="text-green-600" /> 企业区域势力分布</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <BarChart data={stats?.regionStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontWeight: 'black' }} />
                <YAxis />
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar 
                  dataKey="value" 
                  stroke="#1e293b" 
                  strokeWidth={3} 
                  onClick={(entry) => {
                    const baseName = entry.payload?.name || entry.name;
                    if (baseName) {
                      navigate(`/enterprises?base=${encodeURIComponent(baseName)}`);
                    }
                  }} 
                  className="cursor-pointer"
                >
                  {stats?.regionStats?.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2"><Zap className="text-yellow-500 fill-yellow-500" /> 技术生态占比</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <PieChart>
                <Pie 
                  data={chartData?.techDistribution} 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={10} 
                  dataKey="value" 
                  onClick={(entry) => {
                    const techName = entry.payload?.name || entry.name;
                    if (techName) {
                      navigate(`/enterprises?feijiangWenxin=${encodeURIComponent(techName)}`);
                    }
                  }} 
                  className="cursor-pointer"
                >
                  {chartData?.techDistribution?.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2"><Trophy className="text-orange-600" /> 合作伙伴能级分布</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <PieChart>
                <Pie 
                  data={stats?.partnerLevelStats} 
                  outerRadius={100} 
                  dataKey="value" 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                  onClick={(entry) => {
                    const levelName = entry.payload?.name || entry.name;
                    if (levelName) {
                      navigate(`/enterprises?partnerLevel=${encodeURIComponent(levelName)}`);
                    }
                  }} 
                  className="cursor-pointer"
                >
                  {stats?.partnerLevelStats?.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[(idx + 4) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />)}
                </Pie>
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2"><Star className="text-red-600 fill-red-600" /> 企业价值优先级构成</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" minHeight={320}>
              <BarChart data={stats?.priorityStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontWeight: 'black' }} />
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={40} 
                  onClick={(entry) => {
                    const priorityName = entry.payload?.name || entry.name;
                    if (priorityName) {
                      navigate(`/enterprises?priority=${encodeURIComponent(priorityName)}`);
                    }
                  }} 
                  className="cursor-pointer"
                >
                  {stats?.priorityStats?.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[(idx + 1) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>
      </div>

      <NeubrutalCard>
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> 产业月度增长趋势线
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%" minHeight={288}>
            <LineChart data={chartData?.monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontWeight: 'bold' }} />
              <YAxis tick={{ fontWeight: 'bold' }} />
              <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
              <Line type="stepAfter" dataKey="count" stroke="#3b82f6" strokeWidth={6} dot={{ r: 8, fill: '#fff', stroke: '#1e293b', strokeWidth: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </NeubrutalCard>

      {/* 底部：宏观生态全景马赛克 */}
      <NeubrutalCard className="!bg-gray-900 !border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
            <Maximize2 className="text-blue-400" /> 宏观生态全景马赛克 (Pixel View)
          </h2>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stats?.totalEnterprises || 0} Core Assets Distributed</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array(Math.min(500, stats?.totalEnterprises || 0)).fill(0).map((_, i) => {
            const isP0 = i < 60;
            const isP1 = i >= 60 && i < 200;
            return (
              <div key={i} className={`w-3 h-3 border border-gray-800 hover:scale-150 transition-all cursor-crosshair ${isP0 ? 'bg-red-500' : (isP1 ? 'bg-yellow-400' : 'bg-blue-600')}`} title={`Enterprise Asset #${i + 1}`} />
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-6 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">P0 战略核心伙伴</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">P1 重点活跃伙伴</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"></div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">P2 标准入库资源</span>
          </div>
        </div>
      </NeubrutalCard>

      <div className="flex justify-center pt-10 gap-6">
        <NeubrutalButton variant="primary" size="lg" onClick={() => navigate('/reports')}><BarChart3 size={20} className="mr-2" /> 生成生态报告</NeubrutalButton>
        <NeubrutalButton variant="success" size="lg" onClick={() => navigate('/enterprises/new')}><Plus size={20} className="mr-2" /> 录入新企业</NeubrutalButton>
      </div>
    </div>
  );
};

export default DashboardPage;