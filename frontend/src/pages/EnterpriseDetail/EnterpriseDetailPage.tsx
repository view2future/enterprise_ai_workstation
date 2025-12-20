import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enterpriseApi, Enterprise } from '../../services/enterprise.service';
import { Eye, Edit, Download, Calendar, Users, Building2, Coins, MapPin, Phone, Mail } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton } from '../../components/ui/neubrutalism/NeubrutalComponents';

const EnterpriseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const enterpriseId = Number(id);

  const { data: enterprise, isLoading, error } = useQuery({
    queryKey: ['enterprise', enterpriseId],
    queryFn: () => enterpriseApi.getEnterprise(enterpriseId).then(res => res.data),
    enabled: !!id,
  });

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">企业详情</h1>
          <p className="text-gray-600">{enterprise.企业名称}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeubrutalButton variant="secondary">
            <Edit size={18} className="mr-2" />
            编辑
          </NeubrutalButton>
          <NeubrutalButton variant="success">
            <Download size={18} className="mr-2" />
            导出
          </NeubrutalButton>
        </div>
      </div>

      {/* 企业基本信息卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">企业基本信息</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">企业名称</p>
                <p className="font-semibold text-lg">{enterprise.企业名称}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">飞桨/文心</p>
                <p className="font-semibold">
                  {enterprise.飞桨_文心 || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600 font-bold text-lg">P</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">优先级</p>
                <p className="font-semibold">
                  <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    enterprise.优先级 === 'P0' 
                      ? 'bg-red-100 text-red-800' 
                      : enterprise.优先级 === 'P1' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : enterprise.优先级 === 'P2' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enterprise.优先级 || '-'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">参保人数</p>
                <p className="font-semibold">{enterprise.参保人数?.toLocaleString() || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">注册资本</p>
                <p className="font-semibold">
                  {enterprise.注册资本 
                    ? `${(enterprise.注册资本 / 10000).toFixed(2)}万` 
                    : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">线索入库时间</p>
                <p className="font-semibold">{enterprise.线索入库时间 || '-'}</p>
              </div>
            </div>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">联系信息</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">联系人信息</p>
                <p className="font-medium whitespace-pre-wrap">{enterprise.联系人信息 || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg mt-1">
                <MapPin size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">地区</p>
                <p className="font-medium">{enterprise.base || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg mt-1">
                <Eye size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">伙伴等级</p>
                <p className="font-medium">{enterprise.伙伴等级 || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg mt-1">
                <Download size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">生态AI产品</p>
                <p className="font-medium">{enterprise.生态AI产品 || '-'}</p>
              </div>
            </div>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">业务信息</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">任务方向</p>
              <p className="font-medium">{enterprise.任务方向 || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">使用场景</p>
              <p className="font-medium">{enterprise.使用场景 || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">行业信息</p>
              <pre className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                {JSON.stringify(enterprise.行业, null, 2) || '暂无行业信息'}
              </pre>
            </div>
          </div>
        </NeubrutalCard>
      </div>

      {/* 企业背景 */}
      <NeubrutalCard>
        <h2 className="text-lg font-semibold mb-4">企业背景</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{enterprise.企业背景 || '暂无企业背景信息'}</p>
        </div>
      </NeubrutalCard>

      {/* 更新历史 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">更新历史</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-1 bg-blue-100 rounded-full">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">最后更新</p>
                <p className="text-sm text-gray-600">
                  {new Date(enterprise.updated_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-1 bg-green-100 rounded-full">
                <Users size={16} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">创建时间</p>
                <p className="text-sm text-gray-600">
                  {new Date(enterprise.created_at).toLocaleString('zh-CN')}
                </p>
              </div>
            </div>
          </div>
        </NeubrutalCard>

        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">操作</h2>
          <div className="flex flex-wrap gap-3">
            <NeubrutalButton variant="primary" className="w-full sm:w-auto">
              <Edit size={18} className="mr-2" />
              编辑企业
            </NeubrutalButton>
            <NeubrutalButton variant="success" className="w-full sm:w-auto">
              <Download size={18} className="mr-2" />
              导出详情
            </NeubrutalButton>
            <NeubrutalButton variant="danger" className="w-full sm:w-auto">
              <Eye size={18} className="mr-2" />
              查看关联
            </NeubrutalButton>
          </div>
        </NeubrutalCard>
      </div>
    </div>
  );
};

export default EnterpriseDetailPage;