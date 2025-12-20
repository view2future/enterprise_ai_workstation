
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompareStore } from '../../store/useCompareStore';
import { 
  ArrowLeft, 
  Swords, 
  Trophy, 
  Zap, 
  Target, 
  Shield, 
  Download,
  Trash2,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

const WarRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Swords size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black uppercase">对比室空无一人</h1>
        <p className="text-gray-500 mb-8 font-bold">请先在企业管理页面勾选需要对比的合作伙伴。</p>
        <NeubrutalButton onClick={() => navigate('/enterprises')}>前往选调伙伴</NeubrutalButton>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* 头部导航 */}
      <div className="flex items-center justify-between bg-red-600 text-white p-8 border-4 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/enterprises')} className="p-2 border-2 border-white hover:bg-red-700 active-gravity transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">战争态势对比室</h1>
            <p className="text-red-100 font-bold opacity-80 uppercase tracking-widest text-xs">WAR ROOM: STRATEGIC BENCHMARKING</p>
          </div>
        </div>
        <div className="flex gap-4">
          <NeubrutalButton variant="secondary" size="sm" onClick={clearCompare} className="border-white text-red-600 font-black">
            清空序列
          </NeubrutalButton>
          <NeubrutalButton variant="warning" size="sm" className="border-white" onClick={() => navigate('/reports')}>
            <Download size={16} className="mr-2" /> 生成对比简报
          </NeubrutalButton>
        </div>
      </div>

      {/* 第一部分：核心战力横向对比 (API 活跃度) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <NeubrutalCard className="lg:col-span-2">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
            <Zap className="text-blue-600 fill-blue-600" /> API 实时活跃度对标 (月均)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareList.map(e => ({ name: e.enterpriseName, value: Number(e.avgMonthlyApiCalls) }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ border: '4px solid #1e293b' }} />
                <Bar dataKey="value" stroke="#1e293b" strokeWidth={3}>
                  {compareList.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeubrutalCard>

        <NeubrutalCard className="bg-gray-900 text-white">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
            <Target className="text-red-500" /> 决策建议
          </h2>
          <div className="space-y-6">
            <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
              基于选定的 {compareList.length} 家样本，系统检测到 "{compareList.sort((a,b) => Number(b.avgMonthlyApiCalls) - Number(a.avgMonthlyApiCalls))[0].enterpriseName}" 在算力消耗上具有压倒性优势。
            </p>
            <div className="p-4 border-2 border-dashed border-gray-700 rounded-lg">
              <p className="text-[10px] font-black uppercase text-blue-400 mb-2">建议行动</p>
              <p className="text-xs font-bold text-white">优先为该标杆伙伴配置文心 4.0 专属优化资源。</p>
            </div>
          </div>
        </NeubrutalCard>
      </div>

      {/* 第二部分：详细参数矩阵 */}
      <div className="overflow-x-auto">
        <table className="w-full border-4 border-gray-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
          <thead>
            <tr className="bg-gray-800 text-white divide-x-2 divide-gray-700">
              <th className="p-6 text-xs font-black uppercase tracking-widest">属性对比</th>
              {compareList.map(e => (
                <th key={e.id} className="p-6 relative group">
                  <span className="text-sm font-black uppercase block truncate w-40 mx-auto">{e.enterpriseName}</span>
                  <button 
                    onClick={() => removeFromCompare(e.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white border-2 border-gray-900 flex items-center justify-center rounded-full hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={14}/>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-gray-800">
            <tr className="divide-x-2 divide-gray-100">
              <td className="p-4 font-black bg-gray-50 text-xs uppercase">技术底座</td>
              {compareList.map(e => (
                <td key={e.id} className="p-4 font-bold text-sm">
                  <span className="bg-blue-100 border-2 border-blue-800 px-2 py-1 rounded text-xs">{e.ernieModelType || '飞桨深度'}</span>
                </td>
              ))}
            </tr>
            <tr className="divide-x-2 divide-gray-100">
              <td className="p-4 font-black bg-gray-50 text-xs uppercase">伙伴能级</td>
              {compareList.map(e => (
                <td key={e.id} className="p-4 font-bold">
                  <span className={`px-3 py-1 border-2 border-gray-800 font-black italic ${e.priority === 'P0' ? 'bg-red-600 text-white' : 'bg-white'}`}>
                    {e.priority}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="divide-x-2 divide-gray-100">
              <td className="p-4 font-black bg-gray-50 text-xs uppercase">生态荣誉</td>
              {compareList.map(e => (
                <td key={e.id} className="p-4">
                  <div className="flex flex-wrap justify-center gap-1">
                    {(e.baiduCertificates as string[])?.slice(0, 2).map(c => (
                      <span key={c} className="bg-yellow-100 border border-yellow-800 text-[8px] font-black px-1 rounded">{c}</span>
                    )) || '-'}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="divide-x-2 divide-gray-100">
              <td className="p-4 font-black bg-gray-50 text-xs uppercase">落地阶段</td>
              {compareList.map(e => (
                <td key={e.id} className="p-4 font-bold text-xs uppercase">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-20 bg-gray-200 h-2 border border-gray-800 overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: e.aiImplementationStage === '全面生产' ? '100%' : '50%' }}></div>
                    </div>
                    <span>{e.aiImplementationStage}</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarRoomPage;
