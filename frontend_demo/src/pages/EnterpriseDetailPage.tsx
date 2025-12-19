import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEnterprises } from '../utils/mockData';
import { Edit, Save, X, Users, Building, MapPin, Phone, Mail, Globe, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Enterprise } from '../types';

const EnterpriseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const enterpriseId = parseInt(id || '0');
  const enterprise = mockEnterprises.find(e => e.id === enterpriseId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Enterprise>(enterprise ? { ...enterprise } : mockEnterprises[0]);
  const [activeTab, setActiveTab] = useState('basic');

  if (!enterprise) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">企业未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">抱歉，未找到ID为 {id} 的企业信息</p>
        <button 
          onClick={() => navigate('/enterprises')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回企业列表
        </button>
      </div>
    );
  }

  const handleSave = () => {
    console.log('Saving enterprise:', formData);
    setIsEditing(false);
    // In a real app, you would make an API call here
  };

  const handleCancel = () => {
    setFormData({ ...enterprise });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatImplementationStage = (stage: string) => {
    switch(stage) {
      case 'pilot': return '试点';
      case 'production': return '生产';
      case 'scaled': return '规模化';
      default: return stage;
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">{isEditing ? '编辑企业' : '企业详情'}</h1>
          <p className="text-gray-600 dark:text-gray-400">企业基本信息和相关数据</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center"
              >
                <X size={18} className="mr-2" />
                取消
              </button>
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Save size={18} className="mr-2" />
                保存
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Edit size={18} className="mr-2" />
              编辑
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {['basic', 'financing', 'ai', 'baidu', 'operations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab === 'basic' && '基本信息'}
              {tab === 'financing' && '融资信息'}
              {tab === 'ai' && 'AI应用'}
              {tab === 'baidu' && '百度AI使用'}
              {tab === 'operations' && '运营标签'}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">企业名称 *</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-lg font-semibold dark:text-white">{enterprise.name}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">统一社会信用代码</label>
              {isEditing ? (
                <input
                  type="text"
                  name="unifiedCode"
                  value={formData.unifiedCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.unifiedCode}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">法定代表人</label>
              {isEditing ? (
                <input
                  type="text"
                  name="legalRep"
                  value={formData.legalRep}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.legalRep}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">注册资本 (万元)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="registeredCapital"
                  value={formData.registeredCapital}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.registeredCapital} 万元</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">注册日期</label>
              {isEditing ? (
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate.split('T')[0]}
                  onChange={(e) => setFormData({...formData, registrationDate: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{new Date(enterprise.registrationDate).toLocaleDateString('zh-CN')}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">经营状态</label>
              {isEditing ? (
                <input
                  type="text"
                  name="businessStatus"
                  value={formData.businessStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.businessStatus}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">行业类型</label>
              {isEditing ? (
                <select
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="人工智能">人工智能</option>
                  <option value="大数据">大数据</option>
                  <option value="云计算">云计算</option>
                  <option value="物联网">物联网</option>
                  <option value="其他">其他</option>
                </select>
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.industryType}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">子行业</label>
              {isEditing ? (
                <input
                  type="text"
                  name="subIndustry"
                  value={formData.subIndustry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.subIndustry}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所在区域</label>
              {isEditing ? (
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="华东">华东</option>
                  <option value="华北">华北</option>
                  <option value="华南">华南</option>
                  <option value="华中">华中</option>
                  <option value="西南">西南</option>
                  <option value="西北">西北</option>
                  <option value="东北">东北</option>
                </select>
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.region}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所在城市</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.city}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">员工数量</label>
              {isEditing ? (
                <input
                  type="number"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.employeeCount} 人</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年营收 (万元)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.annualRevenue} 万元</div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系人</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.contactPerson}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系电话</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.contactPhone}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">联系邮箱</label>
              {isEditing ? (
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.contactEmail}</div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">备注</label>
              {isEditing ? (
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="text-gray-900 dark:text-white">{enterprise.remarks}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Financing Info Tab */}
      {activeTab === 'financing' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">融资信息</h3>
          {enterprise.financings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">轮次</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">融资金额(万元)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">融资日期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">投资方</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">融资后估值(万元)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {enterprise.financings.map(finance => (
                    <tr key={finance.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{finance.round}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{finance.amountRaised}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(finance.financingDate).toLocaleDateString('zh-CN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{finance.investorNames}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{finance.valuationAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无融资信息
            </div>
          )}
        </div>
      )}

      {/* AI Applications Tab */}
      {activeTab === 'ai' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">AI应用信息</h3>
          {enterprise.aiApplications.length > 0 ? (
            <div className="space-y-4">
              {enterprise.aiApplications.map(app => (
                <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI应用场景</p>
                      <p className="font-medium dark:text-white">{app.aiScenario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">实施阶段</p>
                      <p className="font-medium dark:text-white">{formatImplementationStage(app.implementationStage)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">应用描述</p>
                      <p className="font-medium dark:text-white">{app.aiApplicationDesc}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">部署日期</p>
                      <p className="font-medium dark:text-white">{new Date(app.deploymentDate).toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">预估ROI</p>
                      <p className="font-medium dark:text-white">{app.estimatedRoi}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">遇到的挑战</p>
                      <p className="font-medium dark:text-white">{app.challengesEncountered}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无AI应用信息
            </div>
          )}
        </div>
      )}

      {/* Baidu AI Usage Tab */}
      {activeTab === 'baidu' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">百度AI使用情况</h3>
          {enterprise.baiduAiUsage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">使用产品</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {enterprise.baiduAiUsage?.baiduAiProductsUsed.map((product, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">使用级别</p>
                <p className="mt-1 font-medium dark:text-white">{enterprise.baiduAiUsage ? formatUsageLevel(enterprise.baiduAiUsage.usageLevel) : 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">采用日期</p>
                <p className="mt-1 font-medium dark:text-white">
                  {enterprise.baiduAiUsage ? new Date(enterprise.baiduAiUsage.adoptionDate).toLocaleDateString('zh-CN') : 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">主要用例</p>
                <p className="mt-1 font-medium dark:text-white">{enterprise.baiduAiUsage?.primaryUseCase || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">满意度</p>
                <div className="mt-1 flex items-center">
                  {enterprise.baiduAiUsage && [...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < enterprise.baiduAiUsage!.satisfactionRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  {enterprise.baiduAiUsage && (
                    <span className="ml-2 text-gray-900 dark:text-white">{enterprise.baiduAiUsage!.satisfactionRating}/5</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">备注</p>
                <p className="mt-1 font-medium dark:text-white">{enterprise.baiduAiUsage?.notes || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              该企业暂未使用百度AI产品
            </div>
          )}
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === 'operations' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">运营标签</h3>
          {enterprise.operationalTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {enterprise.operationalTags.map(tag => (
                <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {tag.tagName}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无运营标签
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnterpriseDetailPage;