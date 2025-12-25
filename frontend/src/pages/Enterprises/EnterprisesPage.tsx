import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi, Enterprise, EnterpriseFilter } from '../../services/enterprise.service';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Building2,
  MapPin,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Zap,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  LayoutGrid,
  Trophy,
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NeubrutalCard, 
  NeubrutalButton, 
  NeubrutalInput, 
  NeubrutalSelect,
  NumberCounter 
} from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';

const EnterprisesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<EnterpriseFilter>({
    page: parseInt(searchParams.get('page') || '0'),
    limit: 10,
    searchTerm: searchParams.get('searchTerm') || '',
    region: searchParams.get('region') || '',
    clueStage: searchParams.get('clueStage') || '',
    expiry: searchParams.get('expiry') || '',
  });

  // 当 URL 参数变化时同步更新过滤器状态
  useEffect(() => {
    const stage = searchParams.get('clueStage') || '';
    const term = searchParams.get('searchTerm') || '';
    const region = searchParams.get('region') || '';
    const expiry = searchParams.get('expiry') || '';
    
    setFilters(prev => ({ 
      ...prev, 
      clueStage: stage, 
      searchTerm: term, 
      region: region,
      expiry: expiry,
      page: 0 
    }));
  }, [searchParams]);
  
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'kanban'>('table');
  const queryClient = useQueryClient();
  const isExpiryMode = searchParams.get('expiry') === 'soon';

  const { data: enterprisesData, isLoading } = useQuery({
    queryKey: ['enterprises', filters, isExpiryMode],
    queryFn: () => {
      if (isExpiryMode) {
        // 模拟过期过滤逻辑，实际应由后端支持 ?expirySoon=true
        return enterpriseApi.getEnterprises({ ...filters, limit: 100 }).then(res => ({
          ...res.data,
          items: res.data.items.filter((e: any) => isExpiringSoon(e.certExpiryDate))
        }));
      }
      return enterpriseApi.getEnterprises(filters).then(res => res.data);
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['enterprise-stats'],
    queryFn: () => enterpriseApi.getEnterpriseStats().then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => enterpriseApi.deleteEnterprise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprises'] });
      soundEngine.playSuccess();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (key: string, value: any) => {
    soundEngine.playTick();
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 0,
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要从战略库中永久抹除该企业档案吗？此操作不可逆。')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const STAGES = [
    { id: 'LEAD', label: '线索阶段 / LEAD', color: 'bg-slate-400', border: 'border-slate-500' },
    { id: 'EMPOWERING', label: '技术赋能 / EMPOWERING', color: 'bg-blue-400', border: 'border-blue-500' },
    { id: 'ADOPTED', label: '产品落地 / ADOPTED', color: 'bg-indigo-500', border: 'border-indigo-600' },
    { id: 'ECO_PRODUCT', label: '生态产品 / ECO-PRODUCT', color: 'bg-purple-600', border: 'border-purple-700' },
    { id: 'POWERED_BY', label: '品牌授权 / POWERED BY', color: 'bg-orange-500', border: 'border-orange-600' },
    { id: 'CASE_STUDY', label: '标杆案例 / CASE STUDY', color: 'bg-green-500', border: 'border-green-600' },
  ];

  // 检查是否证书即将过期 (90天内)
  const isExpiringSoon = (dateStr?: string | Date) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* V5 战略标题栏 */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-8 border-black pb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className={`px-3 py-1 font-black text-xs italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase ${isExpiryMode ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              {isExpiryMode ? 'EXPIRY_TASK_FORCE_V5.0' : 'RESOURCE_REGISTRY_V5.0'}
            </div>
            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isExpiryMode ? 'Critical_Maintenance_Mode' : 'Database_Access_Authorized'}</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic leading-none flex items-center gap-4">
            {isExpiryMode ? <Zap size={48} className="text-red-600" /> : <Building2 size={48} className="text-blue-600" />} 
            {isExpiryMode ? '伙伴证书效期维护' : '企业资源指挥部'}
          </h1>
        </div>
        {!isExpiryMode && (
          <div className="flex gap-4">
            <NeubrutalButton 
              variant="secondary" 
              size="md"
              onClick={() => { soundEngine.playTick(); /* Export logic */ }}
              className="flex items-center gap-2"
            >
              <Download size={18} /> 导出全量卷宗
            </NeubrutalButton>
            <Link to="/enterprises/new">
              <NeubrutalButton 
                variant="primary" 
                size="md"
                className="flex items-center gap-2"
              >
                <Plus size={18} /> 录入新节点
              </NeubrutalButton>
            </Link>
          </div>
        )}
      </div>

      {/* 转化漏斗实时监控面板 */}
      {!isExpiryMode && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map((stage, idx) => {
            const count = stats?.clueStageStats?.find((s: any) => s.stage === stage.id)?.value || 0;
            const isActive = filters.clueStage === stage.id;
            return (
              <motion.div
                key={stage.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handleFilterChange('clueStage', isActive ? '' : stage.id)}
                className={`cursor-pointer border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                <p className={`text-[10px] font-black uppercase mb-1 ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{stage.id}</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-black italic">
                    <NumberCounter value={count} />
                  </p>
                  <div className={`w-3 h-3 rotate-45 border-2 border-black ${stage.color}`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 战术过滤器 */}
      {!isExpiryMode && (
        <NeubrutalCard className="!p-4 bg-gray-50 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[300px]">
              <NeubrutalInput 
                placeholder="搜索企业标识、行业关键词、USCC码..." 
                icon={<Search size={20} />}
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
            
            <div className="w-48">
              <NeubrutalSelect 
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="">所有战区 / ALL REGIONS</option>
                <option value="SW">西南战区 (SW)</option>
                <option value="CN">华北战区 (CN)</option>
                <option value="CS">华南战区 (CS)</option>
                <option value="CE">华东战区 (CE)</option>
                <option value="CC">华中战区 (CC)</option>
              </NeubrutalSelect>
            </div>

            <div className="flex border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button 
                onClick={() => { soundEngine.playTick(); setViewMode('table'); }}
                className={`p-3 transition-all ${viewMode === 'table' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                title="表格视图"
              >
                <ArrowUpDown size={20} />
              </button>
              <button 
                onClick={() => { soundEngine.playTick(); setViewMode('kanban'); }}
                className={`p-3 transition-all ${viewMode === 'kanban' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                title="看板视图"
              >
                <LayoutGrid size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-yellow-400 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              <Terminal size={16} className="text-black" />
              <span className="text-xs font-black uppercase tracking-tighter">CMD+I 快速情报录入激活</span>
            </div>
          </div>
        </NeubrutalCard>
      )}

      {isExpiryMode && (
        <div className="bg-yellow-50 border-l-8 border-yellow-400 p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 text-yellow-900">
            <AlertCircle size={24} />
            <p className="font-black uppercase italic tracking-widest text-sm">Attention: 只显示 90 天内即将过期的伙伴证书</p>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NeubrutalCard className="!p-0 overflow-hidden bg-white border-8 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              {/* 顶部简易分页器 */}
              <div className="px-6 py-3 bg-gray-50 border-b-4 border-black flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-gray-500">
                      Page_Sector: <span className="text-black">{(filters.page || 0) + 1} / {Math.ceil((enterprisesData?.total || 0) / (filters.limit || 10)) || 1}</span>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-gray-400">
                      Total_Nodes: <span className="text-blue-600">{enterprisesData?.total || 0}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    disabled={filters.page === 0}
                    onClick={() => handleFilterChange('page', (filters.page || 0) - 1)}
                    className="p-1 border-2 border-black bg-white disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    disabled={!enterprisesData || (filters.page || 0) >= Math.ceil(enterprisesData.total / (filters.limit || 10)) - 1}
                    onClick={() => handleFilterChange('page', (filters.page || 0) + 1)}
                    className="p-1 border-2 border-black bg-white disabled:opacity-30 hover:bg-black hover:text-white transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-900 text-white border-b-8 border-black">
                  <tr>
                    <th className="px-4 py-5 text-xs font-black uppercase tracking-[0.2em] italic w-20 text-center">序号 / NO.</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] italic">企业主体 / IDENTITY</th>
                    {!isExpiryMode && <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] italic">所属战区 / REGION</th>}
                    {isExpiryMode ? (
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] italic text-red-400">效期状态 / EXPIRY STATUS</th>
                    ) : (
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] italic">当前能级 / ENERGY</th>
                    )}
                    {!isExpiryMode && <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] italic">同步状态 / SYNC</th>}
                    <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-[0.2em] italic">操作 / OPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y-4 divide-black">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-16 h-16 border-8 border-black border-t-blue-600 rounded-none animate-spin shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
                          <p className="text-xl font-black italic tracking-widest uppercase animate-pulse">Synchronizing_Neural_Grid...</p>
                        </div>
                      </td>
                    </tr>
                  ) : enterprisesData?.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <AlertCircle size={64} />
                          <p className="text-2xl font-black uppercase italic">未探测到目标节点</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    enterprisesData?.items.map((enterprise: Enterprise, index: number) => {
                      const stage = STAGES.find(s => s.id === enterprise.clueStage);
                      const warning = isExpiringSoon(enterprise.certExpiryDate);
                      const displayIndex = (filters.page || 0) * (filters.limit || 10) + index + 1;
                      
                      return (
                        <tr key={enterprise.id} className="hover:bg-blue-50 transition-colors group">
                          <td className="px-4 py-5 text-center font-mono font-black text-gray-400">
                            {displayIndex.toString().padStart(3, '0')}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div 
                                onClick={() => navigate(`/enterprises/${enterprise.id}`)}
                                className={`w-14 h-14 border-4 border-black flex items-center justify-center font-black text-xl italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-rotate-3 cursor-pointer ${enterprise.clueStage === 'POWERED_BY' ? 'bg-orange-500 text-white' : 'bg-white text-blue-600'}`}
                              >
                                {enterprise.clueStage === 'POWERED_BY' ? <Trophy size={28} /> : enterprise.enterpriseName.substring(0, 1)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link to={`/enterprises/${enterprise.id}`} className="text-xl font-black text-gray-900 uppercase tracking-tighter italic hover:text-blue-600 transition-colors">
                                    {enterprise.enterpriseName}
                                  </Link>
                                  {!isExpiryMode && enterprise.clueStage === 'POWERED_BY' && (
                                    <span className="bg-orange-100 text-orange-600 border-2 border-orange-600 px-2 py-0.5 text-[8px] font-black uppercase italic animate-pulse">Authorized Pioneer</span>
                                  )}
                                  {warning && (
                                    <div className="flex items-center gap-2">
                                      <AlertCircle size={16} className="text-red-600 animate-bounce" />
                                      <div className="px-2 py-0.5 border-2 border-black bg-red-500 text-white text-[8px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {(() => {
                                          const diff = new Date(enterprise.certExpiryDate!).getTime() - new Date().getTime();
                                          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                          return days > 0 ? `Expiry in ${days}D` : 'Expired';
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  {!isExpiryMode && (
                                    <>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{enterprise.industry || '通用行业'}</span>
                                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {enterprise.id}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          {!isExpiryMode && (
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-gray-100 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <MapPin size={12} className="text-blue-600" /> {enterprise.region} / {enterprise.base || 'N/A'}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-5">
                            {isExpiryMode ? (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-red-600 font-black italic">
                                  <Calendar size={14} />
                                  <span>{enterprise.certExpiryDate ? new Date(enterprise.certExpiryDate).toLocaleDateString() : '未知'}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">证书类型: 百度AI核心伙伴</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rotate-45 border-2 border-black ${stage?.color}`}></div>
                                <span className="text-xs font-black uppercase italic tracking-tighter">
                                  {stage?.label.split(' / ')[0]}
                                </span>
                              </div>
                            )}
                          </td>
                          {!isExpiryMode && (
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black text-gray-900 uppercase italic">
                                  {new Date(enterprise.updatedAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                  <span className="text-[8px] font-bold text-gray-400 uppercase">Veracity OK</span>
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2">
                              <Link to={`/enterprises/${enterprise.id}`}>
                                <button onClick={() => soundEngine.playTick()} className="p-2 border-2 border-black bg-white hover:bg-blue-600 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                                  <Eye size={20} />
                                </button>
                              </Link>
                              <Link to={`/enterprises/${enterprise.id}/edit`}>
                                <button onClick={() => soundEngine.playTick()} className="p-2 border-2 border-black bg-white hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                                  <Edit size={20} />
                                </button>
                              </Link>
                              <button 
                                onClick={() => handleDelete(enterprise.id)}
                                className="p-2 border-2 border-black bg-white hover:bg-red-600 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              
              {/* V4 分页控制台 */}
              <div className="px-8 py-6 bg-gray-900 border-t-8 border-black flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Activity size={20} className="text-blue-500" />
                  <p className="text-sm font-black uppercase tracking-widest italic">
                    Total_Nodes: <span className="text-blue-500">{enterprisesData?.total || 0}</span> // Registry_Page: {(filters.page || 0) + 1}
                  </p>
                </div>
                <div className="flex gap-4">
                  <NeubrutalButton 
                    variant="secondary" 
                    size="sm"
                    disabled={filters.page === 0}
                    onClick={() => handleFilterChange('page', (filters.page || 0) - 1)}
                    className="!shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] !bg-gray-800 !text-white !border-gray-700 hover:!bg-gray-700"
                  >
                    <ChevronLeft size={20} />
                  </NeubrutalButton>
                  <NeubrutalButton 
                    variant="secondary" 
                    size="sm"
                    disabled={!enterprisesData || (filters.page || 0) >= Math.ceil(enterprisesData.total / (filters.limit || 10)) - 1}
                    onClick={() => handleFilterChange('page', (filters.page || 0) + 1)}
                    className="!shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] !bg-gray-800 !text-white !border-gray-700 hover:!bg-gray-700"
                  >
                    <ChevronRight size={20} />
                  </NeubrutalButton>
                </div>
              </div>
            </NeubrutalCard>
          </motion.div>
        ) : (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex gap-6 overflow-x-auto pb-8 pt-4 custom-scrollbar"
          >
            {STAGES.map(stage => {
              const items = enterprisesData?.items.filter((e: Enterprise) => e.clueStage === stage.id);
              
              return (
                <div key={stage.id} className="flex flex-col gap-6 min-w-[320px] max-w-[320px]">
                  <div className={`p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${stage.color} flex items-center justify-between`}>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">{stage.label.split(' / ')[0]}</h3>
                    <span className="bg-white text-black px-2 py-0.5 text-xs font-black border-2 border-black">
                      {items?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4 min-h-[600px] bg-gray-100 border-4 border-dashed border-gray-300 p-3">
                    {items?.map((ent: Enterprise) => (
                      <motion.div
                        whileHover={{ rotate: -1, scale: 1.02 }}
                        key={ent.id}
                      >
                        <NeubrutalCard 
                          className="!p-4 bg-white cursor-pointer group hover:border-blue-600 transition-colors"
                          onClick={() => navigate(`/enterprises/${ent.id}`)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <p className="text-lg font-black text-gray-900 uppercase tracking-tighter italic leading-tight group-hover:text-blue-600">{ent.enterpriseName}</p>
                            {ent.clueStage === 'POWERED_BY' && <Trophy size={18} className="text-orange-500 shrink-0" />}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <MapPin size={12} className="text-blue-500" /> {ent.base || ent.region}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <Tag size={12} /> {ent.industry || '未分类'}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t-2 border-gray-100 flex justify-between items-center">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Sync_ID: {ent.id}</span>
                            <ArrowRight size={14} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </NeubrutalCard>
                      </motion.div>
                    ))}
                    
                    {items?.length === 0 && (
                      <div className="h-32 flex items-center justify-center opacity-20 italic font-bold uppercase text-xs text-center p-4">
                        Zero_Nodes_Detected_In_Stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 侧边快速翻页系统 (右侧) */}
      <div className="fixed right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden xl:flex">
        <div className="bg-blue-600 text-white px-2 py-1 border-2 border-black font-black text-[8px] uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 -rotate-90 origin-right translate-x-4">
          Navigator_V4
        </div>
        <button 
          disabled={filters.page === 0}
          onClick={() => { soundEngine.playTick(); handleFilterChange('page', (filters.page || 0) - 1); }}
          className="p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all disabled:opacity-30 active:translate-x-1 active:translate-y-1 active:shadow-none"
          title="Previous Sector"
        >
          <ChevronLeft size={24} className="rotate-90" />
        </button>
        <div className="bg-black text-white py-3 px-2 text-center border-4 border-black font-black text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          {(filters.page || 0) + 1}
        </div>
        <button 
          disabled={!enterprisesData || (filters.page || 0) >= Math.ceil(enterprisesData.total / (filters.limit || 10)) - 1}
          onClick={() => { soundEngine.playTick(); handleFilterChange('page', (filters.page || 0) + 1); }}
          className="p-4 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 active:translate-x-1 active:translate-y-1 active:shadow-none"
          title="Next Sector"
        >
          <ChevronRight size={24} className="rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default EnterprisesPage;