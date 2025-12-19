import React from 'react';
import { Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Enterprise } from '../types';

interface EnterpriseCardProps {
  enterprise: Enterprise;
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
}

const EnterpriseCard: React.FC<EnterpriseCardProps> = ({ enterprise, onEdit, onView }) => {
  // Function to get status badge class based on implementation stage
  const getImplementationStageClass = (stage: string) => {
    switch(stage) {
      case 'pilot':
        return 'bg-yellow-100 text-yellow-800 neubrutalism-badge text-sm';
      case 'production':
        return 'bg-green-100 text-green-800 neubrutalism-badge text-sm';
      case 'scaled':
        return 'bg-blue-100 text-blue-800 neubrutalism-badge text-sm';
      default:
        return 'bg-gray-100 text-gray-800 neubrutalism-badge text-sm';
    }
  };

  // Function to get usage level class based on usage level
  const getUsageLevelClass = (level: string) => {
    switch(level) {
      case 'none':
        return 'bg-red-100 text-red-800 neubrutalism-badge text-sm';
      case 'evaluating':
        return 'bg-yellow-100 text-yellow-800 neubrutalism-badge text-sm';
      case 'production':
        return 'bg-green-100 text-green-800 neubrutalism-badge text-sm';
      case 'extensive':
        return 'bg-blue-100 text-blue-800 neubrutalism-badge text-sm';
      default:
        return 'bg-gray-100 text-gray-800 neubrutalism-badge text-sm';
    }
  };

  // Get the first AI application or null if none
  const firstAiApp = enterprise.aiApplications.length > 0 ? enterprise.aiApplications[0] : null;
  
  // Get Baidu AI usage info or null if none
  const baiduAiUsage = enterprise.baiduAiUsage;

  // Format implementation stage for display
  const formatImplementationStage = (stage: string) => {
    switch(stage) {
      case 'pilot': return '试点';
      case 'production': return '生产';
      case 'scaled': return '规模化';
      default: return stage;
    }
  };

  // Format usage level for display
  const formatUsageLevel = (level: string) => {
    switch(level) {
      case 'none': return '未使用';
      case 'evaluating': return '评估中';
      case 'production': return '生产使用';
      case 'extensive': return '广泛使用';
      default: return level;
    }
  };

  return (
    <div className="neubrutalism-card enterprise-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold">{enterprise.name}</h3>
            <span className="neubrutalism-badge bg-blue-100 text-blue-800 text-sm">
              {enterprise.industryType}
            </span>
          </div>
          <div className="space-y-1 text-base text-gray-600">
            <p>法定代表人: {enterprise.legalRep}</p>
            <p>员工数: {enterprise.employeeCount} | 年营收: {enterprise.annualRevenue}万</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView && onView(enterprise.id)}
            className="neubrutalism-button bg-gray-200 text-black text-base py-2 px-3"
            title="查看企业"
          >
            <Eye size={20} className="inline icon-md" />
          </button>
          <button
            onClick={() => onEdit && onEdit(enterprise.id)}
            className="neubrutalism-button bg-gray-200 text-black text-base py-2 px-3"
            title="编辑企业"
          >
            <Edit size={20} className="inline icon-md" />
          </button>
          <button className="neubrutalism-button bg-gray-200 text-black text-base py-2 px-3">
            <MoreHorizontal size={20} className="inline icon-md" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t-4 border-gray-900">
        <div className="flex flex-wrap gap-4 text-base">
          <div>
            <span className="text-gray-500">AI应用: </span>
            {firstAiApp ? (
              <span className="font-medium">
                {firstAiApp.aiScenario}
                <span className={`ml-2 ${getImplementationStageClass(firstAiApp.implementationStage)}`}>
                  {formatImplementationStage(firstAiApp.implementationStage)}
                </span>
              </span>
            ) : (
              <span className="font-medium text-gray-400">无</span>
            )}
          </div>
          <div>
            <span className="text-gray-500">百度AI使用: </span>
            {baiduAiUsage ? (
              <span className={`${getUsageLevelClass(baiduAiUsage.usageLevel)}`}>
                {formatUsageLevel(baiduAiUsage.usageLevel)}
              </span>
            ) : (
              <span className="font-medium text-gray-400">未使用</span>
            )}
          </div>
          <div>
            <span className="text-gray-500">更新: </span>
            <span>
              {new Date(enterprise.updatedAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseCard;