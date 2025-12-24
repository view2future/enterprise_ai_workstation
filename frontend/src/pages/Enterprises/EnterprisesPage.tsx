import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi, Enterprise, EnterpriseFilter } from '../../services/enterprise.service';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  LayoutTemplate, 
  List, 
  Fingerprint, 
  Clock, 
  Truck, 
  Package,
  Swords,
  ExternalLink
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

  const isExpiryMode = searchParams.get('expiry') === 'soon';

  const [filters, setFilters] = useState<EnterpriseFilter>(() => ({
    priority: searchParams.get('priority') || undefined,
    feijiangWenxin: searchParams.get('feijiangWenxin') || undefined,
    base: searchParams.get('base') || undefined,
    clueStage: searchParams.get('clueStage') || undefined,
    expiry: (searchParams.get('expiry') as any) || undefined,
    page: 0,
    limit: 50
  }));

  const getRemainingDays = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  React.useEffect(() => {
    const rawBase = searchParams.get('base');
    const rawPriority = searchParams.get('priority');
    const rawTech = searchParams.get('feijiangWenxin');
    const rawExpiry = searchParams.get('expiry');
    const rawStage = searchParams.get('clueStage');
    
    setFilters(prev => ({
      ...prev,
      base: rawBase ? decodeURIComponent(rawBase) : undefined,
      priority: rawPriority ? decodeURIComponent(rawPriority) : undefined,
      feijiangWenxin: rawTech ? decodeURIComponent(rawTech) : undefined,
      clueStage: rawStage ? decodeURIComponent(rawStage) : undefined,
      expiry: rawExpiry as any,
      page: 0
    }));
  }, [searchParams]);

  const { data: enterprisesData, isLoading, error, refetch } = useQuery({
    queryKey: ['enterprises', filters],
    queryFn: () => enterpriseApi.getEnterprises(filters).then(res => res.data),
    refetchOnWindowFocus: false,
  });

  const handleNavigateToDetail = (id: number) => {
    const expiryParam = isExpiryMode ? '?expiry=soon' : '';
    navigate(`/enterprises/${id}${expiryParam}`);
  };

  const handleFilterChange = (key: keyof EnterpriseFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 0 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleClearFilters = () => {
    navigate('/enterprises', { replace: true });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个企业吗？')) {
      try {
        await enterpriseApi.deleteEnterprise(id);
        queryClient.invalidateQueries({ queryKey: ['enterprises'] });
      } catch (error) {}
    }
  };

  if (error) return <div className="p-10 text-red-600 font-black uppercase">ERROR: DATALINK_FAULT</div>;

  return (
    <div className="space-y-6 relative pb-20">
      {/* 战术状态条 */}
      {(filters.priority || filters.feijiangWenxin || filters.base || isExpiryMode || filters.clueStage) && (
        <div className={`border-4 border-gray-900 p-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-4 ${isExpiryMode ? 'bg-orange-500 text-white' : 'bg-yellow-100 text-gray-900'}`}>
          <div className="flex items-center gap-2">
            <Target className={isExpiryMode ? 'text-white' : 'text-yellow-800'} />
            <span className="font-black text-sm uppercase">{isExpiryMode ? '战术任务：即将到期资产履约处理' : '当前筛选路径：'}</span>
            <div className="flex gap-2">
              {filters.priority && <span className="bg-black text-white px-2 py-0.5 text-[10px] rounded">P: {filters.priority}</span>}
              {filters.base && <span className="bg-black text-white px-2 py-0.5 text-[10px] rounded">L: {filters.base}</span>}
              {filters.clueStage && <span className="bg-blue-600 text-white px-2 py-0.5 text-[10px] rounded uppercase">STAGE: {filters.clueStage}</span>}
              {isExpiryMode && <span className="bg-white text-orange-600 px-2 py-0.5 text-[10px] font-black rounded tracking-tighter italic uppercase">Expiry_Command_Active</span>}
            </div>
          </div>
          <button onClick={handleClearFilters} className="text-xs font-black underline uppercase tracking-widest">Reset View</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            {isExpiryMode ? '伙伴授牌管理指挥部' : '企业资源管理'}
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest leading-tight">
            {isExpiryMode ? 'Partner Certification & Logistics Command' : 'Ecosystem Asset Matrix V4.0'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 border-4 border-gray-900 p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setViewMode('table')} className={`p-2 font-black text-[10px] uppercase flex items-center gap-2 transition-all ${viewMode === 'table' ? 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-500'}`}><List size={12}/> List</button>
            <button onClick={() => setViewMode('kanban')} className={`p-2 font-black text-[10px] uppercase flex items-center gap-2 transition-all ${viewMode === 'kanban' ? 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-500'}`}><LayoutTemplate size={12}/> Pipeline</button>
          </div>
          <NeubrutalButton variant="success" onClick={() => navigate('/enterprises/new')}>
            <Plus size={18} className="mr-2" /> 录入新资源
          </NeubrutalButton>
        </div>
      </div>

      {!isExpiryMode && (
        <NeubrutalCard>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <NeubrutalInput label="指令搜索" value={filters.search || ''} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="名称、场景..." icon={<Search size={18} />} />
            <NeubrutalSelect label="核心技术" value={filters.feijiangWenxin || ''} onChange={(e) => handleFilterChange('feijiangWenxin', e.target.value)}>
              <option value="">全部</option><option value="飞桨">飞桨</option><option value="文心">文心</option>
            </NeubrutalSelect>
            <NeubrutalSelect label="决策优先级" value={filters.priority || ''} onChange={(e) => handleFilterChange('priority', e.target.value)}>
              <option value="">全部</option><option value="P0">P0</option><option value="P1">P1</option><option value="P2">P2</option>
            </NeubrutalSelect>
            <NeubrutalSelect label="线索阶段" value={filters.clueStage || ''} onChange={(e) => handleFilterChange('clueStage', e.target.value)}>
              <option value="">全部</option>
              <option value="LEAD">初识线索</option>
              <option value="EMPOWERING">技术赋能</option>
              <option value="ADOPTED">产品落地</option>
              <option value="ECO_PRODUCT">生态产出</option>
              <option value="POWERED_BY">品牌授权</option>
              <option value="CASE_STUDY">标杆案例</option>
            </NeubrutalSelect>
            <div className="flex items-end">
              <NeubrutalButton type="submit" variant="primary" className="w-full font-black uppercase text-xs">执行全域扫描_</NeubrutalButton>
            </div>
          </form>
        </NeubrutalCard>
      )}

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-xl font-black italic animate-pulse tracking-widest uppercase">Fetching_Data_Stream...</div>
      ) : viewMode === 'table' ? (
        <NeubrutalCard className="p-0 overflow-hidden border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-4 divide-gray-900">
              <thead className={isExpiryMode ? "bg-orange-600 text-white" : "bg-gray-800 text-white"}>
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-black uppercase w-16">#</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest">资产名称</th>
                  {isExpiryMode ? (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-32"><div className="flex items-center gap-2"><Clock size={14}/> 效期至</div></th>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-40">剩余天数</th>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-32">状态</th>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-48">快递单号</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-32">技术栈</th>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase w-24">能级</th>
                      <th className="px-6 py-4 text-left text-xs font-black uppercase text-right w-32">月调用量</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-black uppercase w-32">地区</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase w-48">指令控制</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-gray-100">
                {enterprisesData?.items.map((enterprise, index) => {
                  const days = getRemainingDays(enterprise.certExpiryDate);
                  const sequenceNumber = (filters.page || 0) * (filters.limit || 50) + index + 1;
                  return (
                    <tr key={enterprise.id} className="hover:bg-gray-50 transition-colors group/row">
                      <td className="px-4 py-5 text-center font-mono text-xs font-black text-gray-400">
                        {sequenceNumber.toString().padStart(3, '0')}
                      </td>
                      <td className="px-6 py-5">
                        <div 
                          className="text-base font-black text-gray-900 border-b-2 border-dashed border-gray-300 inline-block cursor-pointer hover:text-blue-600 hover:border-blue-600 transition-all"
                          onClick={() => handleNavigateToDetail(enterprise.id)}
                        >
                          {enterprise.enterpriseName}
                        </div>
                      </td>
                      
                      {isExpiryMode ? (
                        <>
                          <td className="px-6 py-5 font-mono font-bold text-sm text-gray-600">
                            {enterprise.certExpiryDate ? new Date(enterprise.certExpiryDate).toLocaleDateString() : '---'}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[10px] font-black italic px-2 py-1 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${days && days < 30 ? 'bg-red-500 text-white animate-pulse' : (days && days < 90 ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white')}`}>
                              {days !== null ? `${days} DAYS LEFT` : '---'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[8px] font-black px-2 py-1 border-2 border-gray-900 uppercase ${(enterprise as any).shippingStatus === 'RECEIVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {(enterprise as any).shippingStatus || 'PENDING'}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-mono text-xs font-black text-gray-400">
                            {(enterprise as any).trackingNumber || 'WAITING'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-black px-2 py-0.5 border-2 border-gray-900 bg-blue-100 rounded-full uppercase">{enterprise.feijiangWenxin}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[10px] font-black px-2 py-0.5 border-2 border-gray-900 ${enterprise.priority === 'P0' ? 'bg-red-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}>{enterprise.priority}</span>
                          </td>
                          <td className="px-6 py-5 text-right font-mono font-bold text-sm text-gray-700">
                            {Number(enterprise.avgMonthlyApiCalls).toLocaleString()}
                          </td>
                        </>
                      )}

                      <td className="px-6 py-5">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{enterprise.base}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleNavigateToDetail(enterprise.id)} className="p-2 border-2 border-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none" title="查看卷宗"><Eye size={14}/></button>
                          <button onClick={() => navigate(`/enterprises/${enterprise.id}/edit`)} className="p-2 border-2 border-gray-900 bg-white hover:bg-blue-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none" title="修改属性"><Edit size={14}/></button>
                          <button onClick={() => handleDelete(enterprise.id)} className="p-2 border-2 border-gray-900 bg-white hover:bg-red-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none" title="注销节点"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </NeubrutalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {(isExpiryMode 
            ? [
                { id: 'PENDING', label: '待对接 (INIT)', color: 'bg-gray-800' },
                { id: 'PROCESSING', label: '制作中 (PROD)', color: 'bg-blue-600' },
                { id: 'SHIPPED', label: '已发货 (TRANSIT)', color: 'bg-orange-500' },
                { id: 'RECEIVED', label: '已签收 (DONE)', color: 'bg-green-600' }
              ]
            : [
                { id: '需求调研', label: '需求调研', color: 'bg-gray-800' },
                { id: '试点运行', label: '试点运行', color: 'bg-gray-800' },
                { id: '全面生产', label: '全面生产', color: 'bg-gray-800' },
                { id: '持续优化', label: '持续优化', color: 'bg-gray-800' }
              ]
          ).map(stage => {
            const items = isExpiryMode 
              ? enterprisesData?.items.filter(e => ((e as any).shippingStatus || 'PENDING') === stage.id)
              : enterprisesData?.items.filter(e => e.aiImplementationStage === stage.id);

            return (
              <div key={stage.id} className="flex flex-col gap-4">
                <div className={`${stage.color} text-white p-3 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center`}>
                  <span className="font-black text-[10px] uppercase tracking-widest">{stage.label}</span>
                  <span className="bg-white text-gray-900 text-[10px] px-2 py-0.5 border-2 border-gray-900 rounded font-black">
                    {items?.length || 0}
                  </span>
                </div>
                <div className="space-y-4 min-h-[500px] p-2 bg-gray-50 border-4 border-dashed border-gray-300 rounded-2xl">
                  {items?.map(ent => {
                    const days = getRemainingDays(ent.certExpiryDate);
                    return (
                      <div key={ent.id} onClick={() => handleNavigateToDetail(ent.id)} className="p-4 bg-white border-4 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group relative overflow-hidden">
                        {isExpiryMode && (
                          <div className={`absolute top-0 right-0 w-2 h-full ${days && days < 30 ? 'bg-red-500 animate-pulse' : (days && days < 90 ? 'bg-yellow-400' : 'bg-green-500')}`}></div>
                        )}
                        <h3 className="font-black text-sm mb-2 group-hover:text-blue-600 relative z-10 pr-4">{ent.enterpriseName}</h3>
                        
                        {isExpiryMode ? (
                          <div className="space-y-2 relative z-10">
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase">
                              <Clock size={10} /> {ent.certExpiryDate ? new Date(ent.certExpiryDate).toLocaleDateString() : 'NO_DATE'}
                            </div>
                            {(ent as any).trackingNumber && (
                              <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase">
                                <Package size={10} /> {(ent as any).trackingNumber}
                              </div>
                            )}
                            <div className="text-[10px] font-black italic text-red-600">
                              {days !== null ? `${days} DAYS LEFT` : ''}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2 mb-3 relative z-10">
                              <span className={`text-[8px] font-black px-1 border-2 border-gray-800 ${ent.priority === 'P0' ? 'bg-red-100' : 'bg-gray-50'}`}>{ent.priority}</span>
                              <span className="text-[8px] font-black px-1 border-2 border-gray-800 bg-blue-100">{ent.feijiangWenxin}</span>
                            </div>
                            <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter relative z-10">CALLS: {Number(ent.avgMonthlyApiCalls).toLocaleString()}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 分页控制 */}
      <div className="flex justify-center mt-10">
        <div className="flex border-4 border-gray-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <button onClick={() => handleFilterChange('page', Math.max(0, (filters.page || 0) - 1))} disabled={filters.page === 0} className="p-3 border-r-4 border-gray-900 hover:bg-gray-100 disabled:opacity-30 transition-colors"><ChevronLeft size={20}/></button>
          <div className="flex items-center px-6 font-black text-[10px] uppercase tracking-widest bg-gray-50">PAGE {filters.page! + 1} / {enterprisesData?.totalPages || 1}</div>
          <button onClick={() => handleFilterChange('page', Math.min((enterprisesData?.totalPages || 1) - 1, (filters.page || 0) + 1))} disabled={filters.page === (enterprisesData?.totalPages || 1) - 1} className="p-3 border-l-4 border-gray-900 hover:bg-gray-100 disabled:opacity-30 transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default EnterprisesPage;
