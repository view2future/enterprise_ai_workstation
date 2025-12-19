import React, { useState, useEffect } from 'react';
import { mockEnterprises } from '../utils/mockData';
import EnterpriseCard from '../components/EnterpriseCard';
import { Plus, Download, Filter, Search, Eye, Edit } from 'lucide-react';
import { Enterprise } from '../types';

const EnterprisesPage: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(mockEnterprises);
  const [filteredEnterprises, setFilteredEnterprises] = useState<Enterprise[]>(mockEnterprises);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Apply filtering when search or filters change
  useEffect(() => {
    let result = [...enterprises];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(enterprise => 
        enterprise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enterprise.legalRep.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enterprise.industryType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply industry filter
    if (selectedIndustry) {
      result = result.filter(enterprise => 
        enterprise.industryType === selectedIndustry
      );
    }
    
    // Apply region filter
    if (selectedRegion) {
      result = result.filter(enterprise => 
        enterprise.region === selectedRegion
      );
    }
    
    setFilteredEnterprises(result);
  }, [searchQuery, selectedIndustry, selectedRegion, enterprises]);

  // Get unique industries and regions for filter options
  const industries = [...new Set(enterprises.map(e => e.industryType))];
  const regions = [...new Set(enterprises.map(e => e.region))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">企业管理</h1>
          <p className="text-gray-600">管理区域内的AI产业企业数据</p>
        </div>
        <div className="flex gap-2">
          <button className="neubrutalism-button bg-blue-600 text-white flex items-center">
            <Plus size={18} className="mr-2" />
            添加企业
          </button>
          <button className="neubrutalism-button bg-gray-200 text-black flex items-center">
            <Download size={18} className="mr-2" />
            导出
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索企业名称、法定代表人或行业..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neubrutalism-input w-full pl-10"
            />
          </div>
        </div>
        
        <div className="lg:col-span-6 flex gap-2">
          <div className="flex-1">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="neubrutalism-select w-full"
            >
              <option value="">所有行业</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="neubrutalism-select w-full"
            >
              <option value="">所有区域</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="neubrutalism-button bg-gray-200 text-black flex items-center"
          >
            <Filter size={18} className="mr-2" />
            高级筛选
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilter && (
        <div className="neubrutalism-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">子行业</label>
              <select className="neubrutalism-select w-full">
                <option value="">所有子行业</option>
                <option value="智能制造">智能制造</option>
                <option value="数据分析">数据分析</option>
                <option value="计算机视觉">计算机视觉</option>
                <option value="自然语言处理">自然语言处理</option>
                <option value="医疗AI">医疗AI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">员工规模</label>
              <select className="neubrutalism-select w-full">
                <option value="">所有规模</option>
                <option value="1-50">1-50人</option>
                <option value="51-100">51-100人</option>
                <option value="101-200">101-200人</option>
                <option value="200+">200人以上</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">AI应用阶段</label>
              <select className="neubrutalism-select w-full">
                <option value="">所有阶段</option>
                <option value="pilot">试点</option>
                <option value="production">生产</option>
                <option value="scaled">规模化</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">百度AI使用</label>
              <select className="neubrutalism-select w-full">
                <option value="">全部</option>
                <option value="none">未使用</option>
                <option value="evaluating">评估中</option>
                <option value="production">生产使用</option>
                <option value="extensive">广泛使用</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="neubrutalism-button bg-gray-200 text-black">
              重置
            </button>
            <button className="neubrutalism-button bg-blue-600 text-white">
              应用筛选
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          显示 {filteredEnterprises.length} 家企业中的 {filteredEnterprises.length}
        </p>
        <div className="text-sm text-gray-600">
          已排序: 最近更新
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEnterprises.map(enterprise => (
          <EnterpriseCard 
            key={enterprise.id} 
            enterprise={enterprise} 
            onEdit={(id) => console.log('Edit enterprise:', id)}
            onView={(id) => console.log('View enterprise:', id)}
          />
        ))}
      </div>
      
      {filteredEnterprises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">未找到匹配的企业</div>
          <p className="text-gray-500">请尝试调整您的搜索条件或筛选选项</p>
        </div>
      )}
    </div>
  );
};

export default EnterprisesPage;