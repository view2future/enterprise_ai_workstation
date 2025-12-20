
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../services/dashboard.service';
import { 
  Cpu, 
  ArrowLeft, 
  Zap, 
  Layers, 
  BarChart, 
  Database,
  Search,
  Filter
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
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

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const TechRadarPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: radarData, isLoading } = useQuery({
    queryKey: ['dashboard', 'tech-radar'],
    queryFn: () => dashboardApi.getTechRadar().then(res => res.data),
  });

  if (isLoading) return <div className="p-10 text-center text-2xl font-black">正在解析技术矩阵...</div>;

  return (
    <div className="space-y-8">
      {/* 头部：专题维度 */}
      <div className="flex items-center justify-between bg-purple-900 text-white p-8 border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-purple-800 border-2 border-white transition-all active:translate-y-1">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">AI 技术渗透雷达</h1>
            <p className="text-purple-200 font-bold opacity-80 underline decoration-purple-400">TECHNOLOGY ADOPTION RADAR</p>
          </div>
        </div>
        <div className="hidden lg:block text-right">
          <p className="text-sm font-black opacity-60">数据源：实时生产环境</p>
          <p className="text-2xl font-black">526 <small className="text-xs">NODES</small></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 文心大模型能级分析 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Zap className="fill-purple-600 text-purple-600" /> 文心一言模型版本能级
          </h2>
          <div className="h-80">
            {radarData?.ernieModels?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={radarData.ernieModels.map((m: any) => ({ name: m.ernieModelType || '通用型', value: m._count._all }))}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    onClick={(data) => navigate(`/enterprises?ernieModelType=${data.name}`)}
                    className="cursor-pointer"
                  >
                    {radarData.ernieModels.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#1e293b" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ border: '4px solid #1e293b', fontWeight: 'bold' }} />
                  <Legend iconType="diamond" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">暂无模型数据</div>
            )}
          </div>
        </NeubrutalCard>

        {/* API 调用阶梯分布 */}
        <NeubrutalCard className="bg-blue-50">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <BarChart className="text-blue-600" /> 生态 API 活跃度阶梯
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={radarData?.apiTiers}
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tier" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis tick={{ fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar dataKey="count" fill="#3b82f6" stroke="#1e293b" strokeWidth={3}>
                  {radarData?.apiTiers?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        {/* 飞桨赋能深度图谱 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Layers className="text-green-600" /> 飞桨 PaddlePaddle 行业赋能深度
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                layout="vertical"
                data={radarData?.paddleLevels?.map((l: any) => ({ name: l.paddleUsageLevel || '标准调用', value: l._count._all }))}
                margin={{ left: 40 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fontWeight: 'black' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar dataKey="value" stroke="#1e293b" strokeWidth={2}>
                  {radarData?.paddleLevels?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        {/* 技术底座部署模式 */}
        <NeubrutalCard>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-orange-900">
            <Database className="text-orange-600" /> 推理算力部署模式分布
          </h2>
          <div className="space-y-6 mt-4">
            {radarData?.computeTypes?.map((c: any, idx: number) => (
              <div key={idx} className="p-5 border-4 border-gray-800 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center group hover:-translate-y-1 transition-all">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">部署模式</p>
                  <p className="text-lg font-black text-gray-800 uppercase">{c.inferenceComputeType || '公有云部署'}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">{c._count._all}</p>
                  <p className="text-[10px] font-bold text-gray-500">企业节点数</p>
                </div>
              </div>
            ))}
          </div>
        </NeubrutalCard>
      </div>
    </div>
  );
};

export default TechRadarPage;
