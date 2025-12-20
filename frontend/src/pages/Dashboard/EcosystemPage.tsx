
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../services/dashboard.service';
import { 
  Trophy, 
  ArrowLeft, 
  Award, 
  Calendar, 
  Users, 
  TrendingUp,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const EcosystemPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: ecoData, isLoading } = useQuery({
    queryKey: ['dashboard', 'ecosystem-health'],
    queryFn: () => dashboardApi.getEcosystem().then(res => res.data),
  });

  if (isLoading) return <div className="p-10 text-center text-2xl font-black">正在解析生态图谱...</div>;

  const topMetrics = ecoData?.topLevelMetrics;

  return (
    <div className="space-y-8">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NeubrutalButton variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
          </NeubrutalButton>
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase">伙伴生态健康图谱</h1>
            <p className="text-gray-600 font-bold">专题钻取：合作深度、荣誉勋章及联合增长分析</p>
          </div>
        </div>
        <div>
          <span className="text-xs font-black bg-green-100 text-green-800 px-3 py-1 border-2 border-green-800 rounded-full">LEVEL 2 DRILL-DOWN</span>
        </div>
      </div>

      {/* 顶层战略计数器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NeubrutalCard className="bg-yellow-50 border-yellow-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500 text-white border-2 border-gray-800 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <p className="text-2xl font-black">{topMetrics?.certificates}</p>
              <p className="text-xs font-bold text-yellow-800 uppercase">生态认证证书总数</p>
            </div>
          </div>
        </NeubrutalCard>
        <NeubrutalCard className="bg-blue-50 border-blue-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 text-white border-2 border-gray-800 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-black">{topMetrics?.solutions}</p>
              <p className="text-xs font-bold text-blue-800 uppercase">联合发布解决方案</p>
            </div>
          </div>
        </NeubrutalCard>
        <NeubrutalCard className="bg-red-50 border-red-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500 text-white border-2 border-gray-800 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-2xl font-black">{topMetrics?.events}</p>
              <p className="text-xs font-bold text-red-800 uppercase">大型活动参与人次</p>
            </div>
          </div>
        </NeubrutalCard>
      </div>

      {/* 深度分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. 项目身份分布 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Star className="text-yellow-600" /> 合作伙伴项目身份能级
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ecoData?.partnerTypes?.map((p: any) => ({ name: p.partnerProgramType, value: p._count._all }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis />
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar dataKey="value" stroke="#1e293b" strokeWidth={3}>
                  {ecoData?.partnerTypes?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        {/* 2. 资本绑定度 */}
        <NeubrutalCard className="bg-green-50">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-green-900">
            <Users className="text-green-600" /> 资本协同与投资占比
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ecoData?.ventureStats?.map((v: any) => ({ name: v.isBaiduVenture ? '百度投资企业' : '非投资企业', value: v._count._all }))}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                >
                  <Cell fill="#10b981" stroke="#1e293b" strokeWidth={3} />
                  <Cell fill="#e2e8f0" stroke="#1e293b" strokeWidth={3} />
                </Pie>
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>
      </div>

      <NeubrutalCard className="bg-gray-900 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <TrendingUp className="text-green-400" /> 生态赋能建议
            </h2>
            <p className="text-gray-400 font-bold max-w-xl">
              当前 12.5% 的 P0 级企业尚未获得架构师认证，建议在下季度发起针对性的技术专项赋能计划，提升生态含金量。
            </p>
          </div>
          <NeubrutalButton variant="warning" size="lg" className="border-white" onClick={() => navigate('/reports')}>
            生成生态健康分析简报
          </NeubrutalButton>
        </div>
      </NeubrutalCard>
    </div>
  );
};

export default EcosystemPage;
