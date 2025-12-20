
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
  BarChart3
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
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

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

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ['dashboard', 'overview', timeRange],
    queryFn: () => dashboardApi.getOverview(timeRange).then(res => res.data),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-3xl font-black">正在加载生态大盘...</div>;

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
          <p className="text-4xl font-black mt-2">{stats?.totalEnterprises}</p>
          <p className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1 cursor-pointer" onClick={() => navigate('/enterprises')}>
            查看全量明细 <ArrowLeft size={12} className="rotate-180" />
          </p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-red-50">
          <p className="text-xs font-black text-red-800 uppercase">P0级核心伙伴</p>
          <p className="text-4xl font-black text-red-900 mt-2">{stats?.p0Enterprises}</p>
          <p className="text-xs font-bold text-red-700 mt-4 italic">战略级深度合作企业</p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-blue-50">
          <p className="text-xs font-black text-blue-800 uppercase">飞桨技术覆盖</p>
          <p className="text-4xl font-black text-blue-900 mt-2">{stats?.feijiangEnterprises}</p>
          <p className="text-xs font-bold text-blue-700 mt-4">PaddlePaddle 赋能数</p>
        </NeubrutalCard>
        <NeubrutalCard className="bg-purple-50">
          <p className="text-xs font-black text-purple-800 uppercase">文心技术覆盖</p>
          <p className="text-4xl font-black text-purple-900 mt-2">{stats?.wenxinEnterprises}</p>
          <p className="text-xs font-bold text-purple-700 mt-4">ERNIE Bot 应用数</p>
        </NeubrutalCard>
      </div>

      {/* 第二层：核心大盘图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. 企业区域分布 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2">
            <Globe className="text-green-600" /> 企业区域势力分布
          </h2>
          <div className="h-80">
            {stats?.regionStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.regionStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontWeight: 'black', fontSize: 12 }} />
                  <YAxis />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ border: '4px solid #1e293b' }} />
                  <Bar dataKey="value" fill="#10b981" stroke="#1e293b" strokeWidth={3} onClick={(d) => navigate(`/enterprises?base=${d.name}`)} className="cursor-pointer">
                    {stats.regionStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">暂无区域分布数据</div>
            )}
          </div>
        </NeubrutalCard>

        {/* 2. 技术生态占比 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2">
            <Zap className="text-yellow-500 fill-yellow-500" /> 技术生态占比 (飞桨 vs 文心)
          </h2>
          <div className="h-80">
            {chartData?.techDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.techDistribution}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={10}
                    dataKey="value"
                    onClick={(d) => navigate(`/enterprises?feijiangWenxin=${d.name}`)}
                    className="cursor-pointer"
                  >
                    {chartData.techDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '4px solid #1e293b', fontWeight: 'bold' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">暂无技术占比数据</div>
            )}
          </div>
        </NeubrutalCard>

        {/* 3. 伙伴等级分布 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2">
            <Trophy className="text-orange-600" /> 合作伙伴能级分布
          </h2>
          <div className="h-80">
            {stats?.partnerLevelStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.partnerLevelStats}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    onClick={(d) => navigate(`/enterprises?partnerLevel=${d.name}`)}
                    className="cursor-pointer"
                  >
                    {stats.partnerLevelStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">暂无等级分布数据</div>
            )}
          </div>
        </NeubrutalCard>

        {/* 4. 价值优先级分布 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-4 border-gray-100 pb-2">
            <Star className="text-red-600 fill-red-600" /> 企业价值优先级构成
          </h2>
          <div className="h-80">
            {stats?.priorityStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.priorityStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontWeight: 'black' }} />
                  <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40} onClick={(d) => navigate(`/enterprises?priority=${d.name}`)} className="cursor-pointer">
                    {stats.priorityStats.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} stroke="#1e293b" strokeWidth={3} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">暂无优先级数据</div>
            )}
          </div>
        </NeubrutalCard>
      </div>

      {/* 底部增长趋势 */}
      <NeubrutalCard>
        <h2 className="text-xl font-black mb-6">产业月度增长趋势线</h2>
        <div className="h-72">
          {chartData?.monthlyTrendData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontWeight: 'bold' }} />
                <YAxis tick={{ fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ border: '4px solid #1e293b', fontWeight: 'bold' }} />
                <Line 
                  type="stepAfter" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={6} 
                  dot={{ r: 8, fill: '#fff', stroke: '#1e293b', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">暂无趋势数据</div>
          )}
        </div>
      </NeubrutalCard>

      <div className="flex justify-center pt-10 gap-6">
        <NeubrutalButton variant="primary" size="lg" onClick={() => navigate('/reports')}>
          <BarChart3 size={20} className="mr-2" /> 生成生态报告
        </NeubrutalButton>
        <NeubrutalButton variant="success" size="lg" onClick={() => navigate('/enterprises/new')}>
          <Plus size={20} className="mr-2" /> 录入新企业
        </NeubrutalButton>
      </div>
    </div>
  );
};

export default DashboardPage;
