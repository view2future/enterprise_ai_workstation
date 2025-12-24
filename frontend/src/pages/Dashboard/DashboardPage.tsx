import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardApi } from '../../services/dashboard.service';
import { 
  ShieldCheck, Zap, Trophy, Star, TrendingUp, 
  Terminal, Database, Fingerprint, AlertCircle, 
  Clock, MapPin, BarChart3, Globe, Activity,
  ChevronRight, ArrowRight, Layers, LayoutGrid,
  ExternalLink, Search, X, Radar as RadarIcon,
  Maximize2, Medal, SlidersHorizontal, Focus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, LabelList
} from 'recharts';
import { NeubrutalCard, NeubrutalButton, NumberCounter } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { enterpriseApi } from '../../services/enterprise.service';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const TIME_RANGES = [
  { id: 'week', label: '1W', title: '最近一周' },
  { id: 'two_weeks', label: '2W', title: '最近两周' },
  { id: 'month', label: '1M', title: '最近一月' },
  { id: 'three_months', label: '3M', title: '最近三月' },
  { id: 'half_year', label: '6M', title: '最近半年' },
  { id: 'year', label: '1Y', title: '最近一年' },
  { id: 'three_years', label: '3Y', title: '最近三年' },
  { id: 'all', label: 'ALL', title: '全量历史' },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');
  const [showStageList, setShowStageList] = useState<string | null>(null);

  // 判定当前是微观还是宏观模式
  const isMicro = ['week', 'two_weeks', 'month'].includes(timeRange);
  const isMacro = ['year', 'three_years', 'all'].includes(timeRange);

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['dashboard', 'overview', timeRange],
    queryFn: () => dashboardApi.getOverview(timeRange).then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: stageEnterprises } = useQuery({
    queryKey: ['enterprises', 'stage', showStageList],
    queryFn: () => enterpriseApi.getEnterprises({ clueStage: showStageList as any, limit: 10 }).then(res => res.data.items),
    enabled: !!showStageList
  });

  const { data: pbEnterprises } = useQuery({
    queryKey: ['enterprises', 'pb_pioneers_wall'],
    queryFn: () => enterpriseApi.getEnterprises({ clueStage: 'POWERED_BY', limit: 12 }).then(res => res.data.items),
  });

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="w-24 h-24 border-8 border-black border-t-blue-600 rounded-none animate-spin mb-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"></div>
      <p className="text-3xl font-black italic tracking-widest animate-pulse uppercase">Modulating_Temporal_View...</p>
    </div>
  );

  const stats = overviewData?.stats;
  const chartData = overviewData?.chartData;

  const radarData = stats?.partnerLevelStats?.map((p: any) => ({
    subject: `${p.name} (${p.value})`,
    A: p.value,
    fullMark: Math.max(...(stats.partnerLevelStats.map((s: any) => s.value))) * 1.2
  })) || [];

  const STAGES = [
    { id: 'LEAD', label: '初识线索 / LEAD', color: 'bg-slate-400', hover: 'hover:bg-slate-500' },
    { id: 'EMPOWERING', label: '技术赋能 / EMPOWERING', color: 'bg-blue-400', hover: 'hover:bg-blue-500' },
    { id: 'ADOPTED', label: '产品落地 / ADOPTED', color: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
    { id: 'ECO_PRODUCT', label: '生态产出 / ECO-PRODUCT', color: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    { id: 'POWERED_BY', label: '品牌授权 / POWERED BY', color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
    { id: 'CASE_STUDY', label: '标杆案例 / CASE STUDY', color: 'bg-green-500', hover: 'hover:bg-green-600' },
  ];

  return (
    <div className="space-y-10 pb-20">
      
      {/* V4.1 预警栏 */}
      {(stats?.expiryWarnings || 0) > 0 && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => navigate('/enterprises?expiry=soon')}
          className="bg-red-600 border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-pointer group hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center gap-6 text-white">
            <AlertCircle size={32} className="animate-bounce" />
            <div>
              <p className="font-black uppercase text-lg italic tracking-widest leading-tight">High Priority: Certificate Expiry Alert</p>
              <p className="text-sm font-bold opacity-90">检测到 {stats?.expiryWarnings} 家伙伴证书即将在 3 个月内到期。点击立即进入指挥部执行续期指令 ➔</p>
            </div>
          </div>
          <ArrowRight className="text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={32} />
        </motion.div>
      )}
      
      {/* 顶部时间维度切换 HUD */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <Focus className="text-blue-600" />
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Perspective_Mode</p>
            <h2 className="text-xl font-black uppercase italic italic">{isMicro ? '微观战术视角 / TACTICAL' : isMacro ? '宏观战略大盘 / STRATEGIC' : '能级转化监测 / CONVERSION'}</h2>
          </div>
        </div>
        <div className="flex bg-gray-100 border-4 border-black p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={`px-4 py-2 font-black text-xs transition-all ${timeRange === r.id ? 'bg-black text-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'text-gray-500 hover:text-black'}`}
              title={r.title}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 动态 HUD 指标 */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b-8 border-black pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-blue-600 text-white px-3 py-1 font-black text-xs italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
              {timeRange} Intelligence Focus
            </div>
            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temporal_Shift_Active</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">西南AI产业生态大盘 / SW AI ECOSYSTEM</h1>
        </div>
        <div className="flex gap-4 text-right">
          <div 
            onClick={() => navigate('/enterprises')}
            className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-all active:translate-y-1 active:shadow-none"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{isMicro ? '本期新增线索 / NEW LEADS' : '累计覆盖节点 / TOTAL NODES'}</p>
            <p className="text-3xl font-black italic text-blue-600">
              <NumberCounter value={stats?.totalEnterprises || 0} />
            </p>
          </div>
          <div 
            onClick={() => navigate('/enterprises?expiry=soon')}
            className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-all active:translate-y-1 active:shadow-none"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">效期预警节点 / EXPIRY WARNING</p>
            <p className="text-3xl font-black italic text-red-600">{stats?.expiryWarnings || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 交互式漏斗 - 核心视角 */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-black uppercase italic flex items-center gap-3 text-gray-900">
              <TrendingUp className="text-blue-600" /> {isMacro ? '全周期转化全景 / LIFECYCLE CONVERSION' : '实时转化渗透流水线 / REAL-TIME PIPELINE'}
            </h3>
            <span className="text-[10px] font-bold text-gray-400 italic underline decoration-2 uppercase tracking-widest italic">Temporal_Drill_Down_Ready</span>
          </div>
          
          <div className="relative pt-10 pb-20 px-10 bg-gray-50 border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] min-h-[500px]">
            <div className="flex flex-col gap-2">
              {STAGES.map((stage, idx) => {
                const count = stats?.clueStageStats?.find((s: any) => s.stage === stage.id)?.value || 0;
                const width = 100 - (idx * 8); 
                return (
                  <motion.div 
                    key={stage.id}
                    whileHover={{ scale: 1.02, x: 10 }}
                    onClick={() => setShowStageList(stage.id)}
                    className={`relative cursor-pointer group flex items-center h-16 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${stage.color} ${stage.hover}`}
                    style={{ width: `${width}%`, marginLeft: `${idx * 4}%` }}
                  >
                    <div className="absolute -left-12 flex flex-col items-center">
                       <span className="font-black italic text-gray-300 text-2xl">0{idx+1}</span>
                    </div>
                    <div className="px-6 flex justify-between items-center w-full">
                      <span className="text-white font-black uppercase italic tracking-tighter text-lg">{stage.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="bg-white text-black px-3 py-1 font-black text-xl border-2 border-black">
                          {count}
                        </span>
                        <ArrowRight size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {showStageList && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-4 z-50 bg-white border-8 border-black shadow-[30px_30px_0px_0px_rgba(59,130,246,1)] p-8 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter">阶段穿透：{STAGES.find(s => s.id === showStageList)?.label}</h4>
                    <button onClick={() => setShowStageList(null)} className="p-2 border-4 border-black hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {stageEnterprises?.map((ent: any) => (
                      <div key={ent.id} onClick={() => navigate(`/enterprises/${ent.id}`)} className="p-4 border-4 border-black hover:bg-blue-50 cursor-pointer flex justify-between items-center group transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 bg-blue-600 rotate-45"></div>
                          <span className="font-black text-lg uppercase tracking-tighter">{ent.enterpriseName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black bg-gray-100 px-2 py-1 border-2 border-black uppercase">{ent.base}</span>
                          <ExternalLink size={16} className="text-blue-600 opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <NeubrutalButton variant="primary" className="w-full text-xl py-4" onClick={() => navigate(`/enterprises?clueStage=${showStageList}`)}>进入全量指挥视图 ➔</NeubrutalButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 侧边：评述与脉动 (微观视角下更丰富) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 border-l-[12px] border-blue-600 p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Terminal size={100} className="text-blue-400" />
            </div>
            <div className="relative z-10 space-y-4 text-white">
              <div className="flex items-center gap-3">
                 <h2 className="text-blue-400 font-black uppercase text-[10px] tracking-[0.3em]">Command Narrator</h2>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-base font-bold leading-relaxed italic">
                 {isMicro 
                   ? `本${TIME_RANGES.find(t=>t.id===timeRange)?.title}线索流入平稳，重点聚焦成都高新区的 P0 级异动。` 
                   : `长期趋势显示，西南战区 AI 密度已实现结构性跨越，Powered By 授权占比显著提升。`}
              </p>
            </div>
          </div>

          {isMicro && (
            <NeubrutalCard className="bg-white border-8 border-black !p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2 tracking-widest">
                <Activity size={18} className="text-blue-600" /> 战术实时脉动 / TACTICAL PULSE
              </h3>
              <div className="space-y-6">
                {(overviewData as any)?.recentActivities?.slice(0, 6).map((act: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-2 h-2 mt-1.5 bg-gray-300 group-hover:bg-blue-600 shrink-0 rotate-45 transition-all"></div>
                    <div>
                      <p className="text-xs font-black uppercase leading-tight hover:text-blue-600 cursor-pointer truncate w-48">{act.name}</p>
                      <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Event: 更新 // Status: Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeubrutalCard>
          )}

          {!isMicro && (
            <NeubrutalCard className="bg-white border-8 border-black !p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest italic text-gray-900">
                  <RadarIcon size={18} className="text-blue-600" /> 长期等级迁移 / LEVEL MIGRATION
                </h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#111', fontSize: 10, fontWeight: '900' }} />
                    <Radar name="数量" dataKey="A" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </NeubrutalCard>
          )}
        </div>
      </div>

      {/* 生态大盘图表矩阵 - 动态布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        
        {/* 技术分布 (始终显示) */}
        <NeubrutalCard className="bg-white border-8 border-black !p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3 text-gray-900">
            <Layers className="text-purple-600" /> 技术生态结构 / TECH ECOSYSTEM
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.techDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontWeight: 'black', fill: '#000' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', fontWeight: 'black' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={4}>
                  {chartData?.techDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.name === '飞桨' ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                  <LabelList dataKey="value" position="top" style={{ fontWeight: 'black', fill: '#000', fontSize: '14px' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-4 text-center">
            技术栈覆盖量统计 (含交叉使用企业)
          </p>
        </NeubrutalCard>

        {/* 区域热力 (宏观重要) */}
        <NeubrutalCard className={`bg-white border-8 border-black !p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${isMicro ? 'opacity-50' : ''}`}>
          <h3 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3 text-gray-900">
            <MapPin className="text-green-600" /> 区域分布热力 / REGIONAL HEATMAP
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.regionStats?.slice(0, 6)} layout="vertical" margin={{ left: 30, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontWeight: 'black', fontSize: 10, fill: '#111' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '4px solid #000' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} stroke="#000" strokeWidth={2}>
                  <LabelList dataKey="value" position="right" style={{ fontWeight: 'black', fill: '#000', fontSize: '12px' }} />
                  {stats?.regionStats?.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[(idx + 2) % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        {/* 增长动力线 (宏观重要) */}
        <NeubrutalCard className="bg-white border-8 border-black !p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-8">
            <h3 className="text-lg font-black uppercase italic flex items-center gap-3 text-gray-900">
              <TrendingUp className="text-blue-600" /> {isMicro ? '短期波动率 / SHORT-TERM VOLATILITY' : '长期增长动力 / LONG-TERM GROWTH'}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
              {isMicro ? 'Micro_Tactical_Volatility' : 'Strategic_Growth_Momentum'} // V4.2
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontWeight: 'black', fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', fontWeight: '900' }} 
                  itemStyle={{ color: '#000', fontSize: '14px' }}
                  labelStyle={{ color: '#666', fontSize: '10px', marginBottom: '4px' }}
                  cursor={{ stroke: '#000', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={6} 
                  dot={{ r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#3b82f6', stroke: '#000', strokeWidth: 4 }}
                >
                   <LabelList dataKey="count" position="top" style={{ fontWeight: 'black', fill: '#3b82f6', fontSize: '10px' }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

      </div>

      {/* PB 荣誉墙 (中长周期重要) */}
      <NeubrutalCard className="bg-gray-950 border-black !p-12 shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-blue-500 animate-pulse" size={56} /> 
              <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none flex items-center whitespace-nowrap">
                <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">POWERED BY</span>
                <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">授权先锋</span>
                <span className="text-orange-500/60 text-2xl ml-4 font-black">/ AUTHORIZED PIONEERS</span>
              </h2>
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs pl-16">Strategic Authorized Entities MATRIX</p>
          </div>
          <button onClick={() => navigate('/enterprises?clueStage=POWERED_BY')} className="px-8 py-4 bg-blue-600 border-4 border-black text-white font-black uppercase italic text-sm shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3">
            查看全量授权清单 <ChevronRight />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {pbEnterprises?.slice(0, 8).map((ent: any) => (
            <motion.div key={ent.id} whileHover={{ y: -12, scale: 1.02 }} onClick={() => navigate(`/enterprises/${ent.id}`)} className="bg-gray-900 border-4 border-gray-800 p-8 flex flex-col items-center text-center group cursor-pointer hover:border-orange-500 hover:bg-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="w-20 h-20 bg-black border-4 border-gray-700 rounded-full flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all relative">
                <Medal size={36} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Star size={12} className="text-black fill-current" />
                </div>
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tighter leading-tight mb-3 group-hover:text-orange-400">{ent.enterpriseName}</h4>
              <div className="text-[9px] font-black text-gray-500 group-hover:text-orange-500 uppercase tracking-widest border border-gray-800 px-3 py-1 italic">Authorized Partner</div>
            </motion.div>
          ))}
        </div>
      </NeubrutalCard>

      {/* 底部全景马赛克 (宏观核心) */}
      <NeubrutalCard className="!bg-black !border-black !p-12 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4 leading-none">
              <Maximize2 className="text-blue-500" size={36} /> 宏观生态全景马赛克 / MACRO MOSAIC <span className="text-gray-500 font-mono text-xs">(Pixel View)</span>
            </h2>
            <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px]">Strategic Node Matrix Visualization</p>
          </div>
          <div className="flex gap-8 items-center bg-gray-900/50 p-4 border-2 border-white/5">
             <span className="text-xl font-mono font-black text-blue-500">{stats?.totalEnterprises || 0} <span className="text-xs text-gray-600 uppercase">Nodes_Locked</span></span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 opacity-90 p-6 bg-gray-900/30 border-4 border-white/5">
          {Array(Math.min(1000, stats?.totalEnterprises || 0)).fill(0).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.001 }} className={`w-3.5 h-3.5 border border-black/40 hover:scale-150 hover:z-10 hover:border-white transition-all cursor-crosshair ${i < (stats?.p0Enterprises || 0) ? 'bg-red-600' : 'bg-blue-600'}`} />
          ))}
        </div>
      </NeubrutalCard>

    </div>
  );
};

export default DashboardPage;