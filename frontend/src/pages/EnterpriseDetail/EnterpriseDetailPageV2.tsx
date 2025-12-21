import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enterpriseApi, Enterprise } from '../../services/enterprise.service';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Edit, Download, Building2, MapPin, 
  Link as LinkIcon, Cpu, Zap, Trophy, Award, 
  BarChart as BarChartIcon, Lock, Unlock, 
  Sparkles, Radar as RadarIcon, Fingerprint,
  Activity, History, FileText
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';

const EnterpriseDetailPageV2: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const enterpriseId = Number(id);
  const [isDecrypting, setIsDecrypting] = useState(true);

  const { data: enterprise, isLoading, error } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => enterpriseApi.getEnterprise(enterpriseId).then(res => res.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (!isLoading && enterprise) {
      const timer = setTimeout(() => setIsDecrypting(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, enterprise]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-6 font-black uppercase text-gray-400 tracking-[0.3em]">正在调取情报卷宗...</p>
      </div>
    );
  }

  if (error || !enterprise) {
    return (
      <div className="p-10 text-center">
        <NeubrutalCard className="max-w-md mx-auto border-red-500">
          <Shield size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-black uppercase mb-4">访问拒绝 / 未找到记录</h2>
          <NeubrutalButton onClick={() => navigate('/enterprises')}>返回资源注册库</NeubrutalButton>
        </NeubrutalCard>
      </div>
    );
  }

  // 模拟技术指纹数据
  const genomeData = [
    { subject: '模型深度', A: enterprise.ernieModelType ? 85 : 20 },
    { subject: '数据规模', A: enterprise.employeeCount ? 70 : 30 },
    { subject: '算力投入', A: enterprise.inferenceComputeType ? 90 : 40 },
    { subject: '赋能产出', A: Array.isArray(enterprise.jointSolutions) ? 75 : 15 },
    { subject: '活跃频次', A: Number(enterprise.avgMonthlyApiCalls) > 100000 ? 95 : 50 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <AnimatePresence>
        {isDecrypting && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center"
          >
            <Lock size={80} className="text-blue-500 animate-bounce mb-8" />
            <div className="w-64 h-2 bg-gray-800 border border-gray-700 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2 }}
                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"
              ></motion.div>
            </div>
            <p className="mt-6 font-mono text-xs text-blue-400 animate-pulse uppercase tracking-[0.5em]">正在解密情报资产...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER HUD */}
      <div className="bg-white border-b-4 border-gray-900 p-6 sticky top-0 z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-900 flex items-center justify-center shrink-0 border-4 border-blue-500 rotate-3">
            <Fingerprint className="text-blue-400" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter italic">机密级档案</span>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">{enterprise.enterpriseName}</h1>
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>系统编号: {enterprise.id}</span>
              <span>•</span>
              <span>信用代码: {enterprise.unifiedSocialCreditCode || '等待录入'}</span>
              <span>•</span>
              <span className="text-blue-600">状态: 节点活跃</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <NeubrutalButton variant="secondary" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>
            <Edit size={16} className="mr-2" /> 修改词条
          </NeubrutalButton>
          <button className="bg-blue-600 text-white border-4 border-gray-900 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* TOP ROW: NARRATIVE & GENOME */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Narrative Summary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 text-white p-8 border-l-[16px] border-blue-600 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={150} />
              </div>
              <h3 className="text-blue-400 font-black uppercase text-xs tracking-[0.4em] mb-6 flex items-center gap-2">
                <FileText size={14} /> 情报综述 // V2.0
              </h3>
              <p className="text-xl font-bold leading-relaxed italic text-blue-50">
                "{enterprise.enterpriseName} 是 {enterprise.base} 地区 AI 生态中的重要节点。
                该企业在 {Array.isArray(enterprise.industry) ? (enterprise.industry as any).primary : '相关'} 领域深耕多年，
                目前正处于 <span className="text-yellow-400 underline underline-offset-8">{enterprise.aiImplementationStage || '初步探索'}</span> 阶段。
                通过接入 <span className="text-blue-400">{enterprise.ernieModelType || '百度AI底座'}</span>，其业务逻辑已实现初步智能化转型。"
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-gray-800">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">规模指数</p>
                  <p className="text-lg font-black">{enterprise.employeeCount || '---'} 人员</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">资本能级</p>
                  <p className="text-lg font-black text-green-400">¥{(Number(enterprise.registeredCapital) / 10000).toFixed(0)} 万</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">研发节点</p>
                  <p className="text-lg font-black">{enterprise.techStaffCount || '---'} 研发</p>
                </div>
              </div>
            </div>

            {/* Tech Stack Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NeubrutalCard className="bg-white border-blue-600 border-b-8">
                <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
                  <Cpu className="text-blue-600" size={18} /> 飞桨技术渗透 (Paddle)
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">应用深度</span>
                    <span className="font-black italic text-blue-600">{enterprise.paddleUsageLevel || '未检测到'}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">活跃模型库</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(enterprise.paddleModels) ? (enterprise.paddleModels as string[]).map(m => (
                        <span key={m} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 uppercase">{m}</span>
                      )) : <span className="text-xs italic text-gray-300">暂无模型记录</span>}
                    </div>
                  </div>
                </div>
              </NeubrutalCard>

              <NeubrutalCard className="bg-white border-purple-600 border-b-8">
                <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
                  <Zap className="text-purple-600" size={18} /> 文心大模型应用 (ERNIE)
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">引擎版本</span>
                    <span className="font-black italic text-purple-600">{enterprise.ernieModelType || '等待适配'}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">核心应用场景</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(enterprise.ernieAppScenarios) ? (enterprise.ernieAppScenarios as string[]).map(s => (
                        <span key={s} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-200 uppercase">{s}</span>
                      )) : <span className="text-xs italic text-gray-300">独立运行</span>}
                    </div>
                  </div>
                </div>
              </NeubrutalCard>
            </div>
          </div>

          {/* AI Genome Radar */}
          <NeubrutalCard className="bg-white border-8 border-gray-900 !p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase text-sm italic tracking-widest flex items-center gap-2">
                <RadarIcon className="text-blue-600" size={18} /> AI 基因特质指纹
              </h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genomeData}>
                  <PolarGrid stroke="#e5e7eb" strokeWidth={2} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 10, fontWeight: '900' }} />
                  <Radar
                    name={enterprise.enterpriseName}
                    dataKey="A"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 pt-8 border-t-4 border-gray-900 text-center">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2">生态契合度评分</p>
              <p className="text-5xl font-black italic text-gray-900">
                {Math.floor(genomeData.reduce((acc, curr) => acc + curr.A, 0) / 5)}%
              </p>
            </div>
          </NeubrutalCard>
        </div>

        {/* BOTTOM ROW: ACTIVITIES & INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Detailed Background */}
          <div className="lg:col-span-1 space-y-8">
            <NeubrutalCard className="bg-yellow-400 !p-8 border-8 border-gray-900">
              <h3 className="font-black uppercase text-sm mb-6 flex items-center gap-2 text-gray-900">
                <History size={18} /> 历史情报背景
              </h3>
              <p className="text-xs font-bold text-gray-900 leading-relaxed italic mb-8">
                {enterprise.enterpriseBackground || '暂无该企业的历史异动情报记录。'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                    <MapPin className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-gray-600">办公枢纽</p>
                    <p className="text-[10px] font-black text-gray-900">{enterprise.officeAddress || '全球注册库'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                    <LinkIcon className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-gray-600">数字门户</p>
                    <a href={`http://${enterprise.website}`} target="_blank" className="text-[10px] font-black text-blue-800 underline uppercase">{enterprise.website || '离线状态'}</a>
                  </div>
                </div>
              </div>
            </NeubrutalCard>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2">
            <NeubrutalCard className="bg-white border-8 border-gray-900 !p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black uppercase text-sm mb-8 flex items-center gap-2">
                <Activity size={18} className="text-red-600" /> 运营活动时间线
              </h3>
              <div className="space-y-6">
                {[
                  { date: '2025-12-20', event: '注册资料核验通过', type: '系统自检', user: '自动代理' },
                  { date: '2025-11-15', event: '检测到 API 调用峰值', type: '负载监控', user: '系统监控' },
                  { date: '2025-10-02', event: 'Q3 季度联合方案评审', type: '生态伙伴', user: '分析师' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 relative group">
                    {i !== 2 && <div className="absolute left-[19px] top-10 bottom-[-24px] w-1 bg-gray-100 group-hover:bg-blue-100 transition-colors"></div>}
                    <div className="w-10 h-10 rounded-full border-4 border-gray-900 bg-white flex items-center justify-center z-10 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <span className="text-[10px] font-black italic">{i+1}</span>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-xs uppercase text-gray-900">{item.event}</h4>
                        <span className="text-[8px] font-bold text-gray-400">{item.date}</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">操作员: {item.user} // 环节: {item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeubrutalCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDetailPageV2;
