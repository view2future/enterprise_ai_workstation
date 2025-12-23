import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enterpriseApi, Enterprise } from '../../services/enterprise.service';
import { 
  Eye, 
  Edit, 
  Download, 
  Calendar, 
  Users, 
  Building2, 
  Coins, 
  MapPin, 
  Phone, 
  Mail,
  Link as LinkIcon,
  Shield,
  Cpu,
  Zap,
  Trophy,
  Award,
  BarChart as BarChartIcon,
  Copy
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { Toast } from '../../components/common/Toast';
import { soundEngine } from '../../utils/SoundUtility';

const EnterpriseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const enterpriseId = Number(id);
  const [showToast, setShowToast] = React.useState(false);

  const { data: enterprise, isLoading, error } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => enterpriseApi.getEnterprise(enterpriseId).then(res => res.data),
    enabled: !!id,
  });

  const handleCopyName = () => {
    if (enterprise?.enterpriseName) {
      navigator.clipboard.writeText(enterprise.enterpriseName);
      setShowToast(true);
      soundEngine.playSuccess();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">获取企业数据失败: {(error as Error).message}</div>;
  }

  if (!enterprise) {
    return <div className="p-6 text-gray-600">企业不存在</div>;
  }

  return (
    <div className="space-y-6">
      <Toast 
        show={showToast} 
        message="企业名称已复制到剪切板" 
        onClose={() => setShowToast(false)} 
      />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 
              className="text-3xl font-extrabold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2 group"
              onClick={handleCopyName}
              title="点击复制企业名称"
            >
              {enterprise.enterpriseName}
              <Copy size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
            </h1>
            {enterprise.isHighTech && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 border-2 border-blue-800 font-bold rounded">高新企业</span>
            )}
            {enterprise.isSpecialized && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 border-2 border-purple-800 font-bold rounded">专精特新</span>
            )}
          </div>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <Shield size={16} /> 统一社会信用代码: {enterprise.unifiedSocialCreditCode || '未录入'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeubrutalButton variant="secondary" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>
            <Edit size={18} className="mr-2" /> 编辑
          </NeubrutalButton>
          <NeubrutalButton variant="success">
            <Download size={18} className="mr-2" /> 导出
          </NeubrutalButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基础画像板块 */}
        <NeubrutalCard className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="text-blue-600" /> 企业画像
          </h2>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">法定代表人</p>
              <p className="text-lg font-bold">{enterprise.legalRepresentative || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">企业类型</p>
              <p className="font-bold">{enterprise.enterpriseType || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">年度营收规模</p>
              <p className="font-bold text-green-700">{enterprise.annualRevenue || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">研发团队规模</p>
              <p className="font-bold">{enterprise.techStaffCount ? `${enterprise.techStaffCount} 人` : '-'}</p>
            </div>
            <div className="pt-4 border-t-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">官方渠道</p>
              <div className="flex flex-col gap-2">
                <a href={`http://${enterprise.website}`} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline font-bold">
                  <LinkIcon size={16} /> {enterprise.website || '暂无官网'}
                </a>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} /> {enterprise.officeAddress || '-'}
                </p>
              </div>
            </div>
          </div>
        </NeubrutalCard>

        {/* 百度AI技术板块 */}
        <NeubrutalCard className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Cpu className="text-purple-600" /> 百度AI技术矩阵
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <h3 className="text-purple-900 font-extrabold flex items-center gap-2 mb-3">
                  <Zap size={18} /> 文心一言应用
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-purple-700 uppercase">当前版本</p>
                    <p className="text-lg font-black">{enterprise.ernieModelType || '未应用'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-700 uppercase">核心应用场景</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(enterprise.ernieAppScenarios) ? (enterprise.ernieAppScenarios as string[]).map((s: string) => (
                        <span key={s} className="bg-white px-2 py-0.5 border-2 border-purple-800 text-xs font-bold rounded">{s}</span>
                      )) : '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <h3 className="text-blue-900 font-extrabold flex items-center gap-2 mb-3">
                  <BarChartIcon size={18} /> 飞桨 PaddlePaddle
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase">应用深度</p>
                    <p className="text-lg font-black">{enterprise.paddleUsageLevel || '未应用'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase">主要模型</p>
                    <p className="text-sm font-bold">{Array.isArray(enterprise.paddleModels) ? (enterprise.paddleModels as string[]).join(' / ') : '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-4 border-gray-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-gray-500 uppercase">月均调用量</p>
                  <p className="text-xl font-black">{Number(enterprise.avgMonthlyApiCalls || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 border-4 border-gray-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-gray-500 uppercase">提示词模板</p>
                  <p className="text-xl font-black">{enterprise.promptTemplateCount || 0}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">算力部署模式</p>
                <span className="bg-gray-800 text-white px-3 py-1 text-sm font-bold rounded-lg">{enterprise.inferenceComputeType || '-'}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">AI落地当前阶段</p>
                <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-gray-800 p-0.5">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: enterprise.aiImplementationStage === '全面生产' ? '100%' : '50%' }}></div>
                </div>
                <p className="text-xs font-black mt-1 text-right">{enterprise.aiImplementationStage || '-'}</p>
              </div>
            </div>
          </div>
        </NeubrutalCard>
      </div>

      {/* 生态合作板块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeubrutalCard>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-600" /> 生态合作与荣誉
          </h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 border-2 border-yellow-800 rounded-full">
                <Award className="text-yellow-800" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">项目身份</p>
                <p className="text-lg font-black">{enterprise.partnerProgramType || '普通伙伴'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold mb-2 text-gray-700">百度AI认证证书</h4>
                <ul className="list-disc list-inside text-sm font-medium space-y-1 text-gray-800">
                  {Array.isArray(enterprise.baiduCertificates) ? enterprise.baiduCertificates.map((c: string) => <li key={c}>{c}</li>) : <li>暂无证书</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2 text-gray-700">联合解决方案</h4>
                <ul className="list-disc list-inside text-sm font-medium space-y-1 text-blue-700">
                  {Array.isArray(enterprise.jointSolutions) ? enterprise.jointSolutions.map((s: string) => <li key={s}>{s}</li>) : <li>暂无联合方案</li>}
                </ul>
              </div>
            </div>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-red-600" /> 活动与培训记录
          </h2>
          <div className="space-y-4">
            {Array.isArray(enterprise.eventParticipation) && enterprise.eventParticipation.map((e: any, idx: number) => (
              <div key={idx} className="p-3 border-2 border-gray-800 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.date} • 角色：{e.role}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 font-bold border-2 border-red-800 rounded">会议记录</span>
              </div>
            ))}
            {Array.isArray(enterprise.trainingRecord) && enterprise.trainingRecord.map((t: any, idx: number) => (
              <div key={idx} className="p-3 border-2 border-gray-800 bg-blue-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{t.course}</p>
                  <p className="text-xs text-gray-500">{t.date} • 技术培训</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 font-bold border-2 border-blue-800 rounded">已参训</span>
              </div>
            ))}
            {(!enterprise.eventParticipation && !enterprise.trainingRecord) && (
              <p className="text-gray-500 italic text-center py-4">暂无历史活动记录</p>
            )}
          </div>
        </NeubrutalCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">企业详细背景</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{enterprise.enterpriseBackground || '暂无企业背景信息'}</p>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">系统操作</h2>
          <div className="flex flex-wrap gap-3">
            <NeubrutalButton variant="primary" className="w-full sm:w-auto" onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)}>
              <Edit size={18} className="mr-2" /> 编辑企业
            </NeubrutalButton>
            <NeubrutalButton variant="success" className="w-full sm:w-auto">
              <Download size={18} className="mr-2" /> 导出详情
            </NeubrutalButton>
          </div>
        </NeubrutalCard>
      </div>
    </div>
  );
};

export default EnterpriseDetailPage;