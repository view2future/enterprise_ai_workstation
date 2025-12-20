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
  Maximize2
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
  Line
} from 'recharts';
import { NeubrutalCard, NeubrutalButton, NumberCounter } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

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

  if (isLoading) return <div className="flex justify-center items-center h-screen text-3xl font-black">正在加载生态大盘...</div>;

  if (error) return <div className="p-6 text-red-600 text-center font-black">获取大盘数据失败: {(error as Error).message}</div>;

  const stats = overviewData?.stats;
  const chartData = overviewData?.chartData;

  return (
    <div className="space-y-6">
      {/* 头部：大盘标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">区域AI产业生态大盘</h1>
          <p className="text-gray-600 font-bold">ECOSYSTEM COMPREHENSIVE OVERVIEW</p>
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

      {/* 第一层：KPI 磁贴 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeubrutalCard className="bg-white">
          <p className="text-xs font-black text-gray-500 uppercase">企业数据总量</p>
          <p className="text-4xl font-black mt-2">
            <NumberCounter value={stats?.totalEnterprises || 0} />
          </p>
          <p className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1 cursor-pointer" onClick={() => navigate('/enterprises')}>
            查看全量明细 <ArrowLeft size={12} className="rotate-180" />
          </p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-red-50">
          <p className="text-xs font-black text-red-800 uppercase">P0级核心伙伴</p>
          <p className="text-4xl font-black mt-2">
            <NumberCounter value={stats?.p0Enterprises || 0} />
          </p>
          <p className="text-xs font-bold text-red-700 mt-4 italic">战略级深度合作企业</p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-blue-50">
          <p className="text-xs font-black text-blue-800 uppercase">飞桨技术覆盖</p>
          <p className="text-4xl font-black mt-2">
            <NumberCounter value={stats?.feijiangEnterprises || 0} />
          </p>
          <p className="text-xs font-bold text-blue-700 mt-4">PaddlePaddle 赋能数</p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-purple-50">
          <p className="text-xs font-black text-purple-800 uppercase">文心技术覆盖</p>
          <p className="text-4xl font-black mt-2">
            <NumberCounter value={stats?.wenxinEnterprises || 0} />
          </p>
          <p className="text-xs font-bold text-purple-700 mt-4">ERNIE Bot 应用数</p>
        </NeubrutalCard>
      </div>

      {/* 第二层：分布分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2"><Globe className="text-green-600" /> 企业区域势力分布</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
            <ResponsiveContainer width="100%" height="100%">
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
            <ResponsiveContainer width="100%" height="100%">
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
            <ResponsiveContainer width="100%" height="100%">
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
          <ResponsiveContainer width="100%" height="100%">
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
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">500 Core Assets Distributed</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array(500).fill(0).map((_, i) => {
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