import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi, Enterprise } from '../../services/enterprise.service';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Edit, Download, Building2, MapPin, 
  Link as LinkIcon, Cpu, Zap, Trophy, Award, 
  BarChart as BarChartIcon, Lock, Unlock, 
  Sparkles, Radar as RadarIcon, Fingerprint,
  Activity, History, FileText, ShieldCheck, Copy,
  Truck, Package, Calendar, CheckCircle2, AlertTriangle,
  ArrowRight, Save, Loader2
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';

import { VeracityHUD } from '../../components/veracity/VeracityHUD';
import { Toast } from '../../components/common/Toast';
import { soundEngine } from '../../utils/SoundUtility';

const EnterpriseDetailPageV2: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const enterpriseId = Number(id);
  
  // 检查是否是从预警页面进入的“处理模式”
  const isOpsMode = new URLSearchParams(location.search).get('expiry') === 'soon';

  const [isDecrypting, setIsDecrypting] = useState(true);
  const [isVeracityOpen, setIsVeracityOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 物流表单状态
  const [editLogistics, setEditLogistics] = useState({
    shippingStatus: '',
    trackingNumber: '',
    logisticsNotes: '',
    awardStatus: ''
  });

  const { data: enterprise, isLoading, error } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => enterpriseApi.getEnterprise(enterpriseId).then(res => res.data),
    enabled: !!id,
    onSuccess: (data) => {
      setEditLogistics({
        shippingStatus: (data as any).shippingStatus || 'PENDING',
        trackingNumber: (data as any).trackingNumber || '',
        logisticsNotes: (data as any).logisticsNotes || '',
        awardStatus: (data as any).awardStatus || '未授牌'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => enterpriseApi.updateEnterprise(enterpriseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['enterprise', enterpriseId]);
      setToastMsg('指挥指令已同步至内核');
      setShowToast(true);
      soundEngine.playSuccess();
    }
  });

  const handleCopyName = () => {
    if (enterprise?.enterpriseName) {
      navigator.clipboard.writeText(enterprise.enterpriseName);
      setToastMsg('企业名称已复制到剪切板');
      setShowToast(true);
      soundEngine.playSuccess();
    }
  };

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

  // 效期计算
  const daysLeft = enterprise.certExpiryDate 
    ? Math.ceil((new Date(enterprise.certExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Toast 
        show={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />
      <VeracityHUD 
        isOpen={isVeracityOpen} 
        onClose={() => setIsVeracityOpen(false)} 
        enterpriseId={enterpriseId} 
        enterpriseName={enterprise.enterpriseName} 
      />
      
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
      <div className={`border-b-4 border-gray-900 p-6 sticky top-0 z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm transition-colors ${isOpsMode ? 'bg-orange-50' : 'bg-white'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 bg-gray-900 flex items-center justify-center shrink-0 border-4 rotate-3 ${isOpsMode ? 'border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]' : 'border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]'}`}>
            {isOpsMode ? <AlertTriangle className="text-orange-400" size={32} /> : <Fingerprint className="text-blue-400" size={32} />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter italic ${isOpsMode ? 'bg-orange-600 text-white' : 'bg-red-600 text-white'}`}>
                {isOpsMode ? '战术任务: 资质续期' : '机密级档案'}
              </span>
              <h1 
                className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-3 group"
                onClick={handleCopyName}
              >
                {enterprise.enterpriseName}
                <Copy size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span className={daysLeft && daysLeft < 90 ? 'text-red-600 animate-pulse' : ''}>
                效期余量: {daysLeft !== null ? `${daysLeft} 天` : '未录入'}
              </span>
              <span>•</span>
              <span>阶段: {enterprise.clueStage || 'LEAD'}</span>
              <span>•</span>
              <span className="text-blue-600">等级: {enterprise.partnerLevel || '尚未认证'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {isOpsMode && (
            <button 
              onClick={() => navigate(`/enterprises/${id}`)}
              className="px-4 py-2 border-4 border-gray-900 bg-white text-gray-900 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              退出任务模式
            </button>
          )}
          <NeubrutalButton variant="secondary" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>
            <Edit size={16} className="mr-2" /> 修改词条
          </NeubrutalButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* OPS MODE: LOGISTICS CONTROL TOWER */}
        <AnimatePresence>
          {isOpsMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <NeubrutalCard className="bg-white border-orange-500 border-8 !p-8 shadow-[15px_15px_0px_0px_rgba(249,115,22,1)]">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
                      <Truck className="text-orange-600" size={32} /> 伙伴授牌管理指挥部
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partner Certification & Logistics Command Tower</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gray-900 text-white font-black text-xs uppercase italic">
                      Task_ID: RE-{id}-{new Date().getFullYear()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">当前授牌状态</label>
                    <select 
                      value={editLogistics.awardStatus}
                      onChange={(e) => setEditLogistics({...editLogistics, awardStatus: e.target.value})}
                      className="w-full p-3 border-4 border-gray-900 font-black uppercase bg-white focus:ring-0"
                    >
                      <option value="未授牌">未授牌</option>
                      <option value="已授牌">已授牌</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">证书寄送状态</label>
                    <select 
                      value={editLogistics.shippingStatus}
                      onChange={(e) => setEditLogistics({...editLogistics, shippingStatus: e.target.value})}
                      className="w-full p-3 border-4 border-gray-900 font-black uppercase bg-white focus:ring-0"
                    >
                      <option value="PENDING">待对接 (PENDING)</option>
                      <option value="PROCESSING">制作中 (PROCESSING)</option>
                      <option value="SHIPPED">已发货 (SHIPPED)</option>
                      <option value="RECEIVED">已签收 (RECEIVED)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">快递单号 (顺丰/EMS)</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        value={editLogistics.trackingNumber}
                        onChange={(e) => setEditLogistics({...editLogistics, trackingNumber: e.target.value})}
                        className="w-full p-3 pl-10 border-4 border-gray-900 font-black focus:ring-0"
                        placeholder="输入物流追踪码..."
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500">战术备注 (物流/更新说明)</label>
                    <input 
                      type="text"
                      value={editLogistics.logisticsNotes}
                      onChange={(e) => setEditLogistics({...editLogistics, logisticsNotes: e.target.value})}
                      className="w-full p-3 border-4 border-gray-900 font-bold focus:ring-0"
                      placeholder="记录此次更新的关键细节..."
                    />
                  </div>
                  <div className="flex items-end">
                    <NeubrutalButton 
                      variant="primary" 
                      className="w-full py-3 h-[52px]" 
                      onClick={() => updateMutation.mutate(editLogistics)}
                      disabled={updateMutation.isLoading}
                    >
                      {updateMutation.isLoading ? <Loader2 className="animate-spin mx-auto" /> : <><Save size={18} className="mr-2" /> 同步指令</>}
                    </NeubrutalButton>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-orange-100 border-4 border-dashed border-orange-300 grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="flex items-center gap-4">
                      <Calendar className="text-orange-600" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-orange-800">最后更新日期</p>
                        <p className="text-xs font-bold">{(enterprise as any).lastRenewalDate ? new Date((enterprise as any).lastRenewalDate).toLocaleDateString() : '尚未执行更新'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 border-l-4 border-orange-200 pl-6">
                      <CheckCircle2 className="text-green-600" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-orange-800">查收状态</p>
                        <p className="text-xs font-bold">{(enterprise as any).receiptStatus === 'RECEIVED' ? '已确认送达' : '等待签收'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-orange-800 font-black italic text-xs justify-end">
                      PROTOCOL_V4_READY <ArrowRight size={14} />
                   </div>
                </div>
              </NeubrutalCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ORIGINAL CONTENT (NARRATIVE, TECH STACK, RADAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Narrative Summary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900 text-white p-8 border-l-[16px] border-blue-600 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={150} />
              </div>
              <h3 className="text-blue-400 font-black uppercase text-xs tracking-[0.4em] mb-6 flex items-center gap-2">
                <FileText size={14} /> 情报综述 // V4.0
              </h3>
              <p className="text-xl font-bold leading-relaxed italic text-blue-50">
                "{enterprise.enterpriseName} 目前处于线索转化的 <span className="text-yellow-400 underline underline-offset-8">{enterprise.clueStage || 'LEAD'}</span> 阶段。
                情报显示其来源于 <span className="text-blue-400">{enterprise.clueSource || '未知'}</span> ({enterprise.clueSourceDetail || '常规导入'})。
                {enterprise.isPoweredBy ? ' 该企业已正式通过 Powered By 品牌授权核准。' : ''}"
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-gray-800">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">入库时间</p>
                  <p className="text-lg font-black italic">{enterprise.clueInTime || '2025-01-01'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">资质有效期</p>
                  <p className={`text-lg font-black ${daysLeft && daysLeft < 90 ? 'text-red-500' : 'text-green-400'}`}>
                    {enterprise.certExpiryDate ? new Date(enterprise.certExpiryDate).toLocaleDateString() : '永久有效'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 mb-1">PB 授权范围</p>
                  <p className="text-lg font-black text-blue-400">{enterprise.isPoweredBy ? '全栈 AI 授权' : '尚未授权'}</p>
                </div>
              </div>
            </div>

            {/* V4.0 Business & Logistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NeubrutalCard className="bg-white border-blue-600 border-b-8">
                <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={18} /> 品牌授权与荣誉
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">授牌状态</span>
                    <span className={`font-black italic ${enterprise.awardStatus === '已授牌' ? 'text-green-600' : 'text-gray-400'}`}>{enterprise.awardStatus || '未授牌'}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">授牌地点</span>
                    <span className="font-black text-xs">{enterprise.awardLocation || '等待预约'}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">PB 授权产品</span>
                    <span className="font-black text-xs text-blue-600">{enterprise.pbAuthInfo || '---'}</span>
                  </div>
                </div>
              </NeubrutalCard>

              <NeubrutalCard className="bg-white border-purple-600 border-b-8">
                <h4 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
                  <Zap className="text-purple-600" size={18} /> 技术渗透载荷 (V4.0)
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">线索阶段</span>
                    <span className="font-black italic text-purple-600">{enterprise.clueStage}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">业务方向</span>
                    <span className="font-black text-xs text-right">{enterprise.taskDirection || '全量 AI 应用'}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">落地场景</span>
                    <span className="font-black text-xs text-right italic">{enterprise.usageScenario || '探索中'}</span>
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
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: '模型深度', A: enterprise.ernieModelType ? 85 : 20 },
                  { subject: '数据规模', A: enterprise.employeeCount ? 70 : 30 },
                  { subject: '算力投入', A: enterprise.inferenceComputeType ? 90 : 40 },
                  { subject: '转化潜力', A: enterprise.clueStage === 'EMPOWERING' ? 95 : 60 },
                  { subject: '活跃频次', A: Number(enterprise.avgMonthlyApiCalls) > 100000 ? 95 : 50 },
                ]}>
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
                {enterprise.isPoweredBy ? '98%' : '74%'}
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
                  { date: enterprise.clueUpdateTime?.split('T')[0] || '2025-12-20', event: 'V4.0 战术画像更新', type: '战略升级', user: 'System' },
                  { date: '2025-11-15', event: '线索状态变更为 EMPOWERING', type: '漏斗追踪', user: '分析师' },
                  { date: '2025-10-02', event: `来源追溯: ${enterprise.clueSource}`, type: '初始录入', user: 'API' },
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