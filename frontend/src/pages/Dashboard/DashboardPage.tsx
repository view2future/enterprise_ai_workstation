import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, ChartData } from '../../services/dashboard.service';
import { 
  Eye, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Activity as ActivityIcon
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const DashboardPage: React.FC = () => {
  const { data: overviewData, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardApi.getOverview().then(res => res.data),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">获取仪表板数据失败: {(error as Error).message}</div>;
  }

  const stats = overviewData?.stats;
  const chartData = overviewData?.chartData;
  const recentActivities = overviewData?.recentActivities || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">仪表板</h1>
        <p className="text-gray-600">区域AI产业企业数据总览</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeubrutalCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">企业总数</p>
              <p className="text-2xl font-bold mt-1">{stats?.totalEnterprises || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <TrendingUp size={12} className="mr-1" />
              {stats?.overallGrowthRate || '0%'} vs 上月
            </span>
          </p>
        </NeubrutalCard>

        <NeubrutalCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">P0优先级企业</p>
              <p className="text-2xl font-bold mt-1">{stats?.p0Enterprises || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-800">
              <BarChart3 size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <TrendingUp size={12} className="mr-1" />
              +0% vs 上月
            </span>
          </p>
        </NeubrutalCard>

        <NeubrutalCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">使用飞桨企业</p>
              <p className="text-2xl font-bold mt-1">{stats?.feijiangEnterprises || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
              <Eye size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <TrendingUp size={12} className="mr-1" />
              +0% vs 上月
            </span>
          </p>
        </NeubrutalCard>

        <NeubrutalCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">使用文心企业</p>
              <p className="text-2xl font-bold mt-1">{stats?.wenxinEnterprises || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-800">
              <Download size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <TrendingUp size={12} className="mr-1" />
              +0% vs 上月
            </span>
          </p>
        </NeubrutalCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 优先级分布饼图 */}
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">企业优先级分布</h2>
          {chartData?.capitalDistribution && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={stats?.priorityStats?.map((stat, index) => ({
                      name: stat.优先级,
                      value: stat.count,
                    })) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats?.priorityStats?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} 家`, '数量']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </NeubrutalCard>

        {/* 飞桨文心分布柱状图 */}
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">飞桨/文心使用分布</h2>
          {chartData?.industryDistribution && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.feijiangWenxinStats?.map(stat => ({
                    name: stat.飞桨_文心,
                    value: stat.count,
                  })) || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 家`, '数量']} />
                  <Legend />
                  <Bar dataKey="value" name="企业数量" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </NeubrutalCard>
      </div>

      {/* 月度趋势和最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 月度趋势图 */}
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">企业增长趋势</h2>
          {chartData?.monthlyTrendData && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData.monthlyTrendData.map(item => ({
                    name: item.month,
                    value: item.count,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} 家`, '新增企业']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="新增企业数" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </NeubrutalCard>

        {/* 最近活动 */}
        <NeubrutalCard>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">最近活动</h2>
            <NeubrutalButton variant="secondary" size="sm">
              查看全部
            </NeubrutalButton>
          </div>
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded-full mt-1">
                  <ActivityIcon size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.updatedAt).toLocaleDateString('zh-CN')} - {activity.description}
                  </p>
                  {activity.priority && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                      activity.priority === 'P0' 
                        ? 'bg-red-100 text-red-800' 
                        : activity.priority === 'P1' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {activity.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">暂无活动记录</p>
            )}
          </div>
        </NeubrutalCard>
      </div>

      {/* 地区和伙伴等级分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 地区分布 */}
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">地区分布</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.regionStats?.map(stat => ({
                  name: stat.base,
                  value: stat.count,
                })) || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} 家`, '数量']} />
                <Legend />
                <Bar dataKey="value" name="企业数量" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        {/* 伙伴等级分布 */}
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">伙伴等级分布</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stats?.partnerLevelStats?.map((stat, index) => ({
                    name: stat.伙伴等级,
                    value: stat.count,
                  })) || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats?.partnerLevelStats?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} 家`, '数量']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>
      </div>

      {/* 快速操作按钮 */}
      <div className="flex flex-wrap gap-4 justify-center">
        <NeubrutalButton variant="primary">
          <BarChart3 size={18} className="mr-2" />
          生成报告
        </NeubrutalButton>
        <NeubrutalButton variant="secondary">
          <Download size={18} className="mr-2" />
          导出数据
        </NeubrutalButton>
        <NeubrutalButton variant="success">
          <Eye size={18} className="mr-2" />
          查看详情
        </NeubrutalButton>
      </div>
    </div>
  );
};

export default DashboardPage;