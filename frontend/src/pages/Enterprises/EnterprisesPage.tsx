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
  RotateCcw,
  Target,
  LayoutTemplate,
  List,
  ArrowUpRight,
  Shield,
  Swords
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  ResponsiveContainer
} from 'recharts';
import { useCompareStore } from '../../store/useCompareStore';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const EnterprisesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const { selectedIds, addToCompare, removeFromCompare } = useCompareStore();

  // 初始化 filters 时直接读取 URL 参数
  const [filters, setFilters] = useState<EnterpriseFilter>(() => ({
    priority: searchParams.get('priority') || undefined,
    feijiangWenxin: searchParams.get('feijiangWenxin') || undefined,
    base: searchParams.get('base') || undefined,
    page: 0,
    limit: 50
  }));

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 监听 URL 参数变化并实时强制同步过滤器
  React.useEffect(() => {
    const rawBase = searchParams.get('base');
    const rawPriority = searchParams.get('priority');
    const rawTech = searchParams.get('feijiangWenxin');
    
    // 显式解码
    const base = rawBase ? decodeURIComponent(rawBase) : undefined;
    const priority = rawPriority ? decodeURIComponent(rawPriority) : undefined;
    const feijiangWenxin = rawTech ? decodeURIComponent(rawTech) : undefined;
    
    setFilters(prev => {
      if (prev.base !== base || prev.priority !== priority || prev.feijiangWenxin !== feijiangWenxin) {
        return {
          ...prev,
          base,
          priority,
          feijiangWenxin,
          page: 0
        };
      }
      return prev;
    });
  }, [searchParams]);

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
      page: key === 'page' ? value : 0 
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ['enterprises'] });
    refetch();
  };

  const handleClearFilters = () => {
    setFilters({ page: 0, limit: 50 });
    navigate('/enterprises', { replace: true });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个企业吗？')) {
      try {
        await enterpriseApi.deleteEnterprise(id);
        await queryClient.invalidateQueries({ queryKey: ['enterprises'] });
        alert('删除成功');
      } catch (error) {
        alert('删除失败');
      }
    }
  };

  if (error) return <div className="p-6 text-red-600 font-black uppercase">ERROR: FAULT DETECTED IN DATA STREAM</div>;

  return (
    <div className="space-y-6 relative pb-20">
      {/* 决策路径提示 */}
      {(filters.priority || filters.feijiangWenxin || filters.base) && (
        <div className="bg-yellow-100 border-4 border-gray-800 p-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <Target className="text-yellow-800" />
            <span className="font-black text-sm uppercase">当前指挥路径：</span>
            <div className="flex gap-2">
              {filters.priority && <span className="bg-gray-800 text-white px-2 py-0.5 text-[10px] rounded">PRIORITY: {filters.priority}</span>}
              {filters.base && <span className="bg-gray-800 text-white px-2 py-0.5 text-[10px] rounded">LOCATION: {filters.base}</span>}
            </div>
          </div>
          <button onClick={handleClearFilters} className="text-xs font-black underline">重置视图</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">企业资源管理</h1>
          <p className="text-gray-600 font-bold">ECOSYSTEM ASSET MANAGEMENT</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 border-4 border-gray-800 p-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setViewMode('table')} className={`p-2 font-black text-xs flex items-center gap-2 ${viewMode === 'table' ? 'bg-white' : 'text-gray-500'}`}><List size={14}/> 列表</button>
            <button onClick={() => setViewMode('kanban')} className={`p-2 font-black text-xs flex items-center gap-2 ${viewMode === 'kanban' ? 'bg-white' : 'text-gray-500'}`}><LayoutTemplate size={14}/> 看板</button>
          </div>
          <NeubrutalButton variant="success" onClick={() => navigate('/enterprises/new')}>
            <Plus size={18} className="mr-2" /> 录入资源
          </NeubrutalButton>
        </div>
      </div>

      <NeubrutalCard>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <NeubrutalInput label="指令搜索" value={filters.search || ''} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="名称、场景、代码..." icon={<Search size={18} />} />
            <NeubrutalSelect label="核心技术" value={filters.feijiangWenxin || ''} onChange={(e) => handleFilterChange('feijiangWenxin', e.target.value)}>
              <option value="">全部</option><option value="飞桨">飞桨</option><option value="文心">文心</option>
            </NeubrutalSelect>
            <NeubrutalSelect label="决策优先级" value={filters.priority || ''} onChange={(e) => handleFilterChange('priority', e.target.value)}>
              <option value="">全部</option><option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option>
            </NeubrutalSelect>
            <NeubrutalSelect label="伙伴等级" value={filters.partnerLevel || ''} onChange={(e) => handleFilterChange('partnerLevel', e.target.value)}>
              <option value="">全部</option><option value="认证级">认证级</option><option value="优选级">优选级</option><option value="无">无</option>
            </NeubrutalSelect>
          </div>
          <div className="flex gap-3">
            <NeubrutalButton type="submit" variant="primary"><Search size={18} className="mr-2"/> 执行搜索</NeubrutalButton>
            <NeubrutalButton type="button" variant="secondary" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}><SlidersHorizontal size={18} className="mr-2"/> 高级下钻</NeubrutalButton>
          </div>
        </form>
      </NeubrutalCard>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-2xl font-black">扫描中...</div>
      ) : viewMode === 'table' ? (
        <div className="space-y-4">
          {/* 顶部简易分页 */}
          {enterprisesData && enterprisesData.totalPages > 1 && (
            <div className="flex justify-between items-center bg-white border-4 border-gray-800 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-bottom-2">
              <span className="text-[10px] font-black uppercase">指挥部快速导航 / PAGE {filters.page! + 1} OF {enterprisesData.totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('page', Math.max(0, (filters.page || 0) - 1))}
                  disabled={filters.page === 0}
                  className="px-3 py-1 border-2 border-gray-800 hover:bg-gray-100 disabled:opacity-30 transition-all font-black text-[10px] active-gravity"
                >
                  PREV
                </button>
                <button
                  onClick={() => handleFilterChange('page', Math.min(enterprisesData.totalPages - 1, (filters.page || 0) + 1))}
                  disabled={filters.page === enterprisesData.totalPages - 1}
                  className="px-3 py-1 border-2 border-gray-800 hover:bg-gray-100 disabled:opacity-30 transition-all font-black text-[10px] active-gravity"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}

          <NeubrutalCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-4 divide-gray-800">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-4 w-10"></th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase">资产名称</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase">技术栈</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase">能级</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase">调用量 (月)</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase">地区</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-gray-100">
                  {enterprisesData?.items.map((enterprise) => (
                    <tr key={enterprise.id} className="hover:bg-blue-50 transition-colors group/row">
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(enterprise.id)}
                          onChange={(e) => e.target.checked ? addToCompare(enterprise) : removeFromCompare(enterprise.id)}
                          className="w-5 h-5 border-4 border-gray-800 rounded-none cursor-pointer accent-red-600"
                        />
                      </td>
                      <td className="px-6 py-4 relative">
                        <div className="text-sm font-black text-gray-900 border-b-2 border-dashed border-gray-300 inline-block cursor-help hover:border-blue-600">
                          {enterprise.enterpriseName}
                        </div>
                        <div className="hidden group-hover/row:block absolute left-full top-0 ml-4 z-[60] w-64 animate-in fade-in slide-in-from-left-2">
                          <NeubrutalCard className="!p-4 !bg-white !shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-4">
                            <p className="text-[10px] font-black uppercase mb-4 text-blue-600">战略资产画像</p>
                            <div className="h-40 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={150}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                                  { subject: '技术力', A: enterprise.ernieModelType?.includes('4.0') ? 100 : (enterprise.paddleUsageLevel === '深度定制' ? 90 : 60) },
                                                                  { subject: '活跃度', A: Math.min(100, (Number(enterprise.avgMonthlyApiCalls) / 500000) * 100) },
                                                                  { subject: '荣誉感', A: (enterprise.baiduCertificates as any)?.length > 0 ? 100 : 40 },
                                                                  { subject: '成熟度', A: enterprise.aiImplementationStage === '全面生产' ? 100 : (enterprise.aiImplementationStage === '试点运行' ? 70 : 40) },
                                                                  { subject: '影响力', A: enterprise.priority === 'P0' ? 100 : (enterprise.partnerLevel === '认证级' ? 80 : 50) },
                                                                ]}>                                  <PolarGrid stroke="#1e293b" />
                                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                  <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </NeubrutalCard>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black px-2 py-0.5 border-2 border-gray-800 rounded-full bg-blue-100 uppercase">{enterprise.feijiangWenxin}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-gray-800 rounded-lg ${enterprise.priority === 'P0' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{enterprise.priority}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-xs">
                        {Number(enterprise.avgMonthlyApiCalls).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-gray-600 uppercase tracking-widest">{enterprise.base}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/enterprises/${enterprise.id}`)} className="p-2 border-2 border-gray-800 hover:bg-gray-800 hover:text-white transition-all"><Eye size={14}/></button>
                          <button onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)} className="p-2 border-2 border-gray-800 hover:bg-blue-600 hover:text-white transition-all"><Edit size={14}/></button>
                          <button onClick={() => handleDelete(enterprise.id)} className="p-2 border-2 border-gray-800 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 底部简易分页 */}
            {enterprisesData && enterprisesData.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t-4 border-gray-800">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-gray-700">
                      显示范围 <span className="text-blue-600">{(enterprisesData.page * enterprisesData.limit) + 1}</span> -{' '}
                      <span className="text-blue-600">
                        {Math.min((enterprisesData.page + 1) * enterprisesData.limit, enterprisesData.total)}
                      </span> / 共 <span className="text-gray-900">{enterprisesData.total}</span> 核心资产
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-none shadow-sm -space-x-1">
                      <button onClick={() => handleFilterChange('page', Math.max(0, (filters.page || 0) - 1))} disabled={filters.page === 0} className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-100 disabled:opacity-50 font-black"><ChevronLeft size={16} /></button>
                      {[...Array(enterprisesData.totalPages)].map((_, i) => {
                        if (i < (filters.page || 0) - 2 || i > (filters.page || 0) + 2) return null;
                        return (
                          <button key={i} onClick={() => handleFilterChange('page', i)} className={`px-4 py-2 border-2 border-gray-800 font-black text-xs transition-all ${i === filters.page ? 'bg-gray-800 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>{i + 1}</button>
                        );
                      })}
                      <button onClick={() => handleFilterChange('page', Math.min(enterprisesData.totalPages - 1, (filters.page || 0) + 1))} disabled={filters.page === enterprisesData.totalPages - 1} className="p-2 border-2 border-gray-800 bg-white hover:bg-gray-100 disabled:opacity-50 font-black"><ChevronRight size={16} /></button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </NeubrutalCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {['需求调研', '试点运行', '全面生产', '持续优化'].map(stage => (
            <div key={stage} className="flex flex-col gap-4">
              <div className="bg-gray-800 text-white p-3 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                <span className="font-black text-[10px] uppercase tracking-widest">{stage}</span>
                <span className="bg-blue-600 text-[10px] px-2 py-0.5 border-2 border-white rounded font-black">
                  {enterprisesData?.items.filter(e => e.aiImplementationStage === stage).length || 0}
                </span>
              </div>
              <div className="space-y-4 min-h-[500px] p-2 bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl">
                {enterprisesData?.items.filter(e => e.aiImplementationStage === stage).map(ent => (
                  <div key={ent.id} onClick={() => navigate(`/enterprises/${ent.id}`)} className="p-4 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group relative overflow-hidden">
                    {/* MINI GENOME BACKGROUND */}
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Fingerprint size={80} className="text-blue-600" />
                    </div>
                    
                    <h3 className="font-black text-sm mb-2 group-hover:text-blue-600 relative z-10">{ent.enterpriseName}</h3>
                    <div className="flex gap-2 mb-3 relative z-10">
                      <span className={`text-[8px] font-black px-1 border-2 border-gray-800 ${ent.priority === 'P0' ? 'bg-red-100' : 'bg-gray-50'}`}>{ent.priority}</span>
                      <span className="text-[8px] font-black px-1 border-2 border-gray-800 bg-blue-100">{ent.feijiangWenxin}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter relative z-10">CALLS: {Number(ent.avgMonthlyApiCalls).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 right-10 z-[70] animate-in slide-in-from-bottom-10">
          <button 
            onClick={() => navigate('/dashboard/war-room')}
            className="group relative bg-red-600 text-white p-6 border-4 border-gray-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active-gravity"
          >
            <div className="flex flex-col items-center">
              <Swords size={32} className="animate-pulse" />
              <span className="text-xs font-black mt-2 uppercase">进入态势对比室</span>
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-white text-red-600 border-4 border-gray-900 flex items-center justify-center font-black rounded-full text-lg shadow-lg">
                {selectedIds.length}
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default EnterprisesPage;