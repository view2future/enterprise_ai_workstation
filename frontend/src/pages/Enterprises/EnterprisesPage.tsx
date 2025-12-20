import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi, Enterprise, EnterpriseFilter } from '../../services/enterprise.service';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Save,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';

const EnterprisesPage: React.FC = () => {
  const [filters, setFilters] = useState<EnterpriseFilter>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState<any[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 获取企业列表
  const { data: enterprisesData, isLoading, error, refetch } = useQuery({
    queryKey: ['enterprises', filters],
    queryFn: () => enterpriseApi.getEnterprises(filters).then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const handleFilterChange = (key: keyof EnterpriseFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // 重置到第一页
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({});
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个企业吗？')) {
      try {
        await enterpriseApi.deleteEnterprise(id);
        queryClient.invalidateQueries({ queryKey: ['enterprises'] });
      } catch (error) {
        console.error('删除企业失败:', error);
      }
    }
  };

  // 高级筛选条件
  const [advancedFilters, setAdvancedFilters] = useState({
    注册资本_min: '',
    注册资本_max: '',
    参保人数_min: '',
    参保人数_max: '',
    行业: '',
    任务方向: '',
  });

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // 同步到主filters
    setFilters(prev => ({
      ...prev,
      [key as keyof EnterpriseFilter]: value,
      page: 0
    }));
  };

  // 保存筛选条件
  const saveCurrentFilter = () => {
    const filterName = prompt('请输入筛选条件名称:');
    if (filterName) {
      const newSavedFilter = {
        id: Date.now(),
        name: filterName,
        filters: { ...filters, ...advancedFilters }
      };
      setSavedFilters(prev => [...prev, newSavedFilter]);
    }
  };

  // 应用保存的筛选条件
  const applySavedFilter = (savedFilter: any) => {
    setFilters(savedFilter.filters);
    setAdvancedFilters({
      注册资本_min: savedFilter.filters.注册资本_min || '',
      注册资本_max: savedFilter.filters.注册资本_max || '',
      参保人数_min: savedFilter.filters.参保人数_min || '',
      参保人数_max: savedFilter.filters.参保人数_max || '',
      行业: savedFilter.filters.行业 || '',
      任务方向: savedFilter.filters.任务方向 || '',
    });
    refetch();
  };

  // 删除保存的筛选条件
  const deleteSavedFilter = (id: number) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  };

  if (error) {
    return <div className="p-6 text-red-600">获取企业数据失败: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">企业管理</h1>
          <p className="text-gray-600">管理区域AI产业企业数据</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <NeubrutalButton 
            variant="success"
            onClick={() => navigate('/enterprises/new')}
          >
            <Plus size={18} className="mr-2" />
            添加企业
          </NeubrutalButton>
          <NeubrutalButton 
            variant="primary"
            onClick={() => navigate('/import-export')}
          >
            <Download size={18} className="mr-2" />
            导出数据
          </NeubrutalButton>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <NeubrutalCard>
        <form onSubmit={handleSearch} className="space-y-4">
          {/* 基本筛选行 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <NeubrutalInput
                label="搜索"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="企业名称、背景、场景等"
                icon={<Search size={18} />}
              />
            </div>

            <div>
              <NeubrutalSelect
                label="飞桨/文心"
                value={filters.飞桨_文心 || ''}
                onChange={(e) => handleFilterChange('飞桨_文心', e.target.value)}
              >
                <option value="">全部</option>
                <option value="飞桨">飞桨</option>
                <option value="文心">文心</option>
              </NeubrutalSelect>
            </div>

            <div>
              <NeubrutalSelect
                label="优先级"
                value={filters.优先级 || ''}
                onChange={(e) => handleFilterChange('优先级', e.target.value)}
              >
                <option value="">全部</option>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </NeubrutalSelect>
            </div>

            <div>
              <NeubrutalSelect
                label="伙伴等级"
                value={filters.伙伴等级 || ''}
                onChange={(e) => handleFilterChange('伙伴等级', e.target.value)}
              >
                <option value="">全部</option>
                <option value="认证级">认证级</option>
                <option value="优选级">优选级</option>
                <option value="无">无</option>
              </NeubrutalSelect>
            </div>
          </div>

          {/* 高级筛选区域 */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <NeubrutalInput
                    label="注册资本(万) 最小值"
                    type="number"
                    value={advancedFilters.注册资本_min}
                    onChange={(e) => handleAdvancedFilterChange('注册资本_min', e.target.value)}
                    placeholder="最小值"
                  />
                </div>

                <div>
                  <NeubrutalInput
                    label="注册资本(万) 最大值"
                    type="number"
                    value={advancedFilters.注册资本_max}
                    onChange={(e) => handleAdvancedFilterChange('注册资本_max', e.target.value)}
                    placeholder="最大值"
                  />
                </div>

                <div>
                  <NeubrutalInput
                    label="参保人数 最小值"
                    type="number"
                    value={advancedFilters.参保人数_min}
                    onChange={(e) => handleAdvancedFilterChange('参保人数_min', e.target.value)}
                    placeholder="最小值"
                  />
                </div>

                <div>
                  <NeubrutalInput
                    label="参保人数 最大值"
                    type="number"
                    value={advancedFilters.参保人数_max}
                    onChange={(e) => handleAdvancedFilterChange('参保人数_max', e.target.value)}
                    placeholder="最大值"
                  />
                </div>

                <div>
                  <NeubrutalInput
                    label="行业"
                    value={advancedFilters.行业}
                    onChange={(e) => handleAdvancedFilterChange('行业', e.target.value)}
                    placeholder="行业关键词"
                  />
                </div>

                <div>
                  <NeubrutalInput
                    label="任务方向"
                    value={advancedFilters.任务方向}
                    onChange={(e) => handleAdvancedFilterChange('任务方向', e.target.value)}
                    placeholder="任务方向关键词"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮行 */}
          <div className="flex flex-wrap gap-3 pt-2">
            <NeubrutalButton 
              type="submit"
              variant="primary"
            >
              <Search size={18} className="mr-2" />
              搜索
            </NeubrutalButton>

            <NeubrutalButton
              type="button"
              onClick={handleClearFilters}
              variant="secondary"
            >
              <RotateCcw size={18} className="mr-2" />
              清除筛选
            </NeubrutalButton>

            <NeubrutalButton
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant={showAdvancedFilters ? "warning" : "secondary"}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              {showAdvancedFilters ? '收起高级筛选' : '高级筛选'}
            </NeubrutalButton>

            <NeubrutalButton
              type="button"
              onClick={saveCurrentFilter}
              variant="success"
            >
              <Save size={18} className="mr-2" />
              保存筛选
            </NeubrutalButton>
          </div>

          {/* 保存的筛选条件 */}
          {savedFilters.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">保存的筛选条件</h3>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                    <button
                      onClick={() => applySavedFilter(filter)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {filter.name}
                    </button>
                    <button
                      onClick={() => deleteSavedFilter(filter.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </NeubrutalCard>

      {/* 企业列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner text-4xl">⏳</div>
        </div>
      ) : (
        <NeubrutalCard>
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              共 <span className="font-medium">{enterprisesData?.total || 0}</span> 家企业
            </div>
            <div className="text-sm text-gray-700">
              已加载第 <span className="font-medium">{enterprisesData ? (enterprisesData.page * enterprisesData.limit) + 1 : 0}</span> -{' '}
              <span className="font-medium">
                {enterprisesData ? Math.min((enterprisesData.page + 1) * enterprisesData.limit, enterprisesData.total) : 0}
              </span> 条
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">企业名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">飞桨/文心</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">伙伴等级</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册资本</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参保人数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地区</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enterprisesData?.items.map((enterprise) => (
                  <tr key={enterprise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{enterprise.企业名称}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        enterprise.飞桨_文心 === '飞桨' 
                          ? 'bg-blue-100 text-blue-800' 
                          : enterprise.飞桨_文心 === '文心' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enterprise.飞桨_文心 || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enterprise.伙伴等级 || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enterprise.注册资本 ? `${(enterprise.注册资本 / 10000).toFixed(2)}万` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enterprise.参保人数 || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enterprise.base || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <NeubrutalButton
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/enterprises/${enterprise.id}`)}
                          title="查看详情"
                        >
                          <Eye size={16} />
                        </NeubrutalButton>
                        <NeubrutalButton
                          size="sm"
                          variant="success"
                          onClick={() => console.log('Edit', enterprise.id)}
                          title="编辑"
                        >
                          <Edit size={16} />
                        </NeubrutalButton>
                        <NeubrutalButton
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(enterprise.id)}
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </NeubrutalButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {enterprisesData && enterprisesData.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    显示第 <span className="font-medium">{(enterprisesData.page * enterprisesData.limit) + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min((enterprisesData.page + 1) * enterprisesData.limit, enterprisesData.total)}
                    </span>{' '}
                    条，共 <span className="font-medium">{enterprisesData.total}</span> 条
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <NeubrutalButton
                      onClick={() => handleFilterChange('page', Math.max(0, (filters.page || 0) - 1))}
                      disabled={filters.page === 0}
                      variant="secondary"
                      size="sm"
                      className="rounded-r-none"
                    >
                      <ChevronLeft size={18} />
                    </NeubrutalButton>
                    
                    {[...Array(Math.min(5, enterprisesData.totalPages))].map((_, i) => {
                      const pageNum = Math.max(0, Math.min(enterprisesData.totalPages - 1, 
                        Math.max(0, (filters.page || 0) - 2) + i));
                      
                      return (
                        <NeubrutalButton
                          key={pageNum}
                          onClick={() => handleFilterChange('page', pageNum)}
                          variant={pageNum === filters.page ? "primary" : "secondary"}
                          size="sm"
                          className={`${pageNum === filters.page ? 'z-10' : ''} ${i === 0 ? 'rounded-l-none' : ''} ${i === Math.min(5, enterprisesData.totalPages) - 1 ? 'rounded-r-none' : ''}`}
                        >
                          {pageNum + 1}
                        </NeubrutalButton>
                      );
                    })}
                    
                    <NeubrutalButton
                      onClick={() => handleFilterChange('page', Math.min(enterprisesData.totalPages - 1, (filters.page || 0) + 1))}
                      disabled={filters.page === enterprisesData.totalPages - 1}
                      variant="secondary"
                      size="sm"
                      className="rounded-l-none"
                    >
                      <ChevronRight size={18} />
                    </NeubrutalButton>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </NeubrutalCard>
      )}
    </div>
  );
};

export default EnterprisesPage;