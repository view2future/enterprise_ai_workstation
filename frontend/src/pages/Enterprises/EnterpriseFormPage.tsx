
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi, Enterprise } from '../../services/enterprise.service';
import { 
  Save, 
  ArrowLeft, 
  Building2, 
  User, 
  MapPin, 
  Activity,
  Cpu,
  Zap,
  ShieldCheck,
  Globe,
  Briefcase
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';

const EnterpriseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Enterprise>>({
    enterpriseName: '',
    feijiangWenxin: '',
    priority: 'P2',
    partnerLevel: '无',
    base: '成都',
    registeredCapital: 0,
    employeeCount: 0,
    enterpriseBackground: '',
    taskDirection: '',
    contactInfo: '',
    usageScenario: '',
    status: 'active',
    // 扩展字段初始化
    unifiedSocialCreditCode: '',
    legalRepresentative: '',
    enterpriseType: '科技初创',
    annualRevenue: '',
    techStaffCount: 0,
    isHighTech: false,
    isSpecialized: false,
    website: '',
    officeAddress: '',
    paddleUsageLevel: '',
    ernieModelType: '',
    avgMonthlyApiCalls: 0,
    aiImplementationStage: '试点运行'
  });

  // 如果是编辑模式，获取企业详情
  const { data: enterprise, isLoading } = useQuery({
    queryKey: ['enterprise', id],
    queryFn: () => enterpriseApi.getEnterprise(Number(id)).then(res => res.data),
    enabled: isEdit,
  });

  useEffect(() => {
    if (enterprise) {
      setFormData({
        ...enterprise,
        registeredCapital: Number(enterprise.registeredCapital || 0),
        employeeCount: Number(enterprise.employeeCount || 0),
        avgMonthlyApiCalls: Number(enterprise.avgMonthlyApiCalls || 0),
        techStaffCount: Number(enterprise.techStaffCount || 0)
      });
    }
  }, [enterprise]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Enterprise>) => 
      isEdit 
        ? enterpriseApi.updateEnterprise(Number(id), data)
        : enterpriseApi.createEnterprise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] });
      navigate('/enterprises');
    },
    onError: (error: any) => {
      alert(`保存失败: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleChange = (field: keyof Enterprise, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return <div className="flex justify-center items-center h-64 text-2xl">⏳ 加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NeubrutalButton variant="secondary" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </NeubrutalButton>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? '编辑企业' : '新增企业'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-24">
        {/* 1. 核心运营信息 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-800 pb-2">
            <Building2 className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">1. 核心运营信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeubrutalInput
              label="企业名称"
              value={formData.enterpriseName}
              onChange={(e) => handleChange('enterpriseName', e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <NeubrutalSelect
                label="优先级"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </NeubrutalSelect>
              <NeubrutalSelect
                label="飞桨/文心"
                value={formData.feijiangWenxin}
                onChange={(e) => handleChange('feijiangWenxin', e.target.value)}
              >
                <option value="">未选择</option>
                <option value="飞桨">飞桨</option>
                <option value="文心">文心</option>
              </NeubrutalSelect>
            </div>
            <NeubrutalInput
              label="地区"
              value={formData.base}
              onChange={(e) => handleChange('base', e.target.value)}
            />
            <NeubrutalSelect
              label="伙伴等级"
              value={formData.partnerLevel}
              onChange={(e) => handleChange('partnerLevel', e.target.value)}
            >
              <option value="无">无</option>
              <option value="认证级">认证级</option>
              <option value="优选级">优选级</option>
            </NeubrutalSelect>
          </div>
        </NeubrutalCard>

        {/* 2. 详细工商画像 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-800 pb-2">
            <ShieldCheck className="text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">2. 详细工商画像</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeubrutalInput
              label="统一社会信用代码"
              value={formData.unifiedSocialCreditCode}
              onChange={(e) => handleChange('unifiedSocialCreditCode', e.target.value)}
              placeholder="9151..."
            />
            <NeubrutalInput
              label="法定代表人"
              value={formData.legalRepresentative}
              onChange={(e) => handleChange('legalRepresentative', e.target.value)}
            />
            <NeubrutalSelect
              label="企业类型"
              value={formData.enterpriseType}
              onChange={(e) => handleChange('enterpriseType', e.target.value)}
            >
              <option value="科技初创">科技初创</option>
              <option value="民营中型">民营中型</option>
              <option value="民营大型">民营大型</option>
              <option value="国有企业">国有企业</option>
              <option value="外资企业">外资企业</option>
            </NeubrutalSelect>
            <NeubrutalInput
              label="年度营收规模"
              value={formData.annualRevenue}
              onChange={(e) => handleChange('annualRevenue', e.target.value)}
              placeholder="如：5000万-1亿"
            />
            <NeubrutalInput
              label="研发团队人数"
              type="number"
              value={formData.techStaffCount}
              onChange={(e) => handleChange('techStaffCount', Number(e.target.value))}
            />
            <NeubrutalInput
              label="官方网站"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="www.example.com"
            />
            <div className="flex gap-8 items-center pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isHighTech} 
                  onChange={(e) => handleChange('isHighTech', e.target.checked)}
                  className="w-5 h-5 border-2 border-gray-800"
                />
                <span className="font-bold text-gray-800">高新企业</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isSpecialized} 
                  onChange={(e) => handleChange('isSpecialized', e.target.checked)}
                  className="w-5 h-5 border-2 border-gray-800"
                />
                <span className="font-bold text-gray-800">专精特新</span>
              </label>
            </div>
          </div>
        </NeubrutalCard>

        {/* 3. 百度AI技术矩阵 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-800 pb-2">
            <Cpu className="text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">3. 百度AI技术矩阵</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeubrutalSelect
              label="文心大模型版本"
              value={formData.ernieModelType}
              onChange={(e) => handleChange('ernieModelType', e.target.value)}
            >
              <option value="">未应用</option>
              <option value="ERNIE 4.0">ERNIE 4.0</option>
              <option value="ERNIE 3.5">ERNIE 3.5</option>
              <option value="ERNIE Speed">ERNIE Speed</option>
              <option value="ERNIE Lite">ERNIE Lite</option>
            </NeubrutalSelect>
            <NeubrutalSelect
              label="飞桨应用深度"
              value={formData.paddleUsageLevel}
              onChange={(e) => handleChange('paddleUsageLevel', e.target.value)}
            >
              <option value="">未应用</option>
              <option value="基础调用">基础调用</option>
              <option value="模型微调">模型微调</option>
              <option value="深度定制">深度定制</option>
            </NeubrutalSelect>
            <NeubrutalInput
              label="月均 API 调用量"
              type="number"
              value={formData.avgMonthlyApiCalls}
              onChange={(e) => handleChange('avgMonthlyApiCalls', Number(e.target.value))}
            />
            <NeubrutalSelect
              label="AI 落地阶段"
              value={formData.aiImplementationStage}
              onChange={(e) => handleChange('aiImplementationStage', e.target.value)}
            >
              <option value="需求调研">需求分析</option>
              <option value="试点运行">试点运行</option>
              <option value="全面生产">全面生产</option>
              <option value="持续优化">持续优化</option>
            </NeubrutalSelect>
          </div>
        </NeubrutalCard>

        {/* 4. 业务描述与联系方式 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-800 pb-2">
            <Briefcase className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">4. 业务描述与联系方式</h2>
          </div>
          <div className="space-y-6">
            <NeubrutalInput
              label="联系人信息 (姓名/职务/电话)"
              value={formData.contactInfo}
              onChange={(e) => handleChange('contactInfo', e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">企业详细背景</label>
                <textarea
                  className="w-full border-4 border-gray-800 p-3 min-h-[120px] font-sans text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={formData.enterpriseBackground}
                  onChange={(e) => handleChange('enterpriseBackground', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">主要使用场景</label>
                <textarea
                  className="w-full border-4 border-gray-800 p-3 min-h-[80px] font-sans text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={formData.usageScenario}
                  onChange={(e) => handleChange('usageScenario', e.target.value)}
                />
              </div>
            </div>
          </div>
        </NeubrutalCard>

        {/* 悬浮操作栏 */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t-4 border-gray-800 p-4 flex gap-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
          <NeubrutalButton 
            type="submit" 
            variant="success" 
            className="flex-1 text-lg py-3"
            disabled={mutation.isPending}
          >
            <Save size={24} className="mr-2" />
            {mutation.isPending ? '正在保存到数据库...' : `提交并更新企业数据`}
          </NeubrutalButton>
          <NeubrutalButton 
            type="button" 
            variant="secondary" 
            className="px-10"
            onClick={() => navigate('/enterprises')}
          >
            取消
          </NeubrutalButton>
        </div>
      </form>
    </div>
  );
};

export default EnterpriseFormPage;
