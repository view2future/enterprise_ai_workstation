
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report } from '../../services/report.service';
import { 
  FileText, Plus, Trash2, Clock, CheckCircle, AlertCircle,
  BarChart3, Calendar, Layers, ChevronRight, Archive, Search,
  Box, Globe, List, Zap, Maximize2, X, FileCheck, ShieldCheck, Target,
  TrendingUp, Activity, Cpu, MoreHorizontal, Filter, ArrowUpRight, Database, Fingerprint
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';
import { useNavigate } from 'react-router-dom';
import { CommandNotification } from '../../components/common/CommandNotification';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  const [buildStatus, setBuildStatus] = useState({ isBuilding: false, progress: 0, step: '' });
  const [notifState, setNotifState] = useState({ isOpen: false, fileName: '' });

  // 1. 默认选中所有 4 个模块
  const [reportConfig, setReportConfig] = useState({
    type: 'MONTHLY',
    modules: ['summary', 'region', 'details', 'tech'] as string[]
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.getAllReports().then(res => res.data),
  });

  const createReportMutation = useMutation({
    mutationFn: (data: any) => reportsApi.generateReport(data),
    onSuccess: () => {
      soundEngine.playSuccess();
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsGenerating(false);
    }
  });

  const generateAutoTitle = (type: string) => {
    const now = new Date();
    const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const typeMap: Record<string, string> = { 'WEEKLY': 'WK', 'MONTHLY': 'MO', 'QUARTERLY': 'QT', 'YEARLY': 'YR' };
    const prefix = `SWAI${typeMap[type] || 'RP'}${dateTag}`;
    const sameDayReports = reports?.filter(r => r.title.startsWith(prefix)) || [];
    const index = sameDayReports.length;
    return index === 0 ? prefix : `${prefix}-${index}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    soundEngine.playPneumatic();
    const autoTitle = generateAutoTitle(reportConfig.type);
    createReportMutation.mutate({
      ...reportConfig,
      title: autoTitle,
      description: `联图智研系统自动生成的全量情报档案。`
    });
  };

  const handleBuildAction = async (report: Report) => {
    soundEngine.playTick();
    setBuildStatus({ isBuilding: true, progress: 0, step: '初始化编译协议...' });
    setActiveReport(null);
    try {
      const steps = [
        { p: 30, s: '解密全量资产记录...' },
        { p: 60, s: '渲染全息单页 (V3)...' },
        { p: 90, s: '执行物理归档...' }
      ];
      for (const step of steps) {
        await new Promise(r => setTimeout(r, 400));
        setBuildStatus(prev => ({ ...prev, progress: step.p, step: step.s }));
      }
      const response = await reportsApi.buildReport(report.id);
      setBuildStatus({ isBuilding: false, progress: 100, step: '完成' });
      setNotifState({ isOpen: true, fileName: response.data.fileName });
    } catch (err) {
      setBuildStatus({ isBuilding: false, progress: 0, step: '' });
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredReports = useMemo(() => {
    return reports?.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || r.type === filterType;
      return matchSearch && matchType;
    });
  }, [reports, searchTerm, filterType]);

  const groupedReports = useMemo(() => {
    if (!filteredReports) return [];
    const groups: { label: string; items: Report[] }[] = [];
    filteredReports.forEach(report => {
      const date = new Date(report.createdAt);
      const today = new Date();
      let label = "";
      if (date.toDateString() === today.toDateString()) label = "今天 (TODAY)";
      else if (new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toDateString() === date.toDateString()) label = "昨天 (YESTERDAY)";
      else label = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      const existingGroup = groups.find(g => g.label === label);
      if (existingGroup) existingGroup.items.push(report);
      else groups.push({ label, items: [report] });
    });
    return groups;
  }, [filteredReports]);

  return (
    <div className="space-y-0 min-h-screen bg-white">
      <CommandNotification
        isOpen={notifState.isOpen}
        onClose={() => setNotifState({ ...notifState, isOpen: false })}
        title="物理归档成功"
        message="情报卷宗已完成编译并保存至 /dist_reports 目录。"
        fileName={notifState.fileName}
      />

      {/* 1. 宽屏背景装饰 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-grid-v2"></div>
      </div>

      <AnimatePresence>
        {buildStatus.isBuilding && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg p-10 border-8 border-blue-600 bg-gray-900 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
              <div className="flex items-center gap-6 mb-10">
                <Box className="text-blue-400 animate-spin" size={48} />
                <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter">Compiler_Matrix v3.5</h3>
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-gray-800 border-2 border-gray-700 p-1">
                  <motion.div animate={{ width: `${buildStatus.progress}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"></motion.div>
                </div>
                <div className="flex justify-between font-mono text-xs uppercase">
                  <span className="text-blue-400">{buildStatus.step}</span>
                  <span className="text-white font-black">{buildStatus.progress}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. 顶部巨幕 HUD (利用全宽) */}
      <div className="bg-gray-950 text-white p-12 border-b-[16px] border-blue-600 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none italic font-black text-[15rem] leading-none -rotate-6">NEXUS</div>
        <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 border-4 border-white rotate-3 shadow-lg"><Archive size={40} /></div>
              <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">情报档案馆</h1>
            </div>
            <p className="text-blue-400 text-sm font-black uppercase tracking-[0.5em] pl-2 flex items-center gap-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              SWAI Strategic Intelligence Matrix & Archive Terminal
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8 w-full xl:w-auto">
            <div className="bg-white/5 border-4 border-white/10 p-6 flex flex-col justify-center min-w-[160px] relative overflow-hidden group hover:bg-white/10 transition-all">
              <span className="text-[10px] font-black text-gray-500 uppercase mb-2">情报存量总额</span>
              <span className="text-5xl font-black italic text-white">{reports?.length || 0}</span>
              <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-20 transition-opacity"><Database size={60}/></div>
            </div>
            <div className="bg-purple-600/20 border-4 border-purple-500/30 p-6 flex flex-col justify-center min-w-[160px] relative overflow-hidden group hover:bg-purple-600/30 transition-all">
              <span className="text-[10px] font-black text-purple-400 uppercase mb-2">待物理提取项</span>
              <span className="text-5xl font-black italic text-purple-400">{reports?.filter(r => r.status !== 'ready').length || 0}</span>
              <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-20 transition-opacity"><Zap size={60}/></div>
            </div>
            <div className="bg-blue-600 border-4 border-gray-900 p-6 flex flex-col justify-center min-w-[160px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black text-white/60 uppercase mb-2 text-center">系统同步率</span>
              <span className="text-5xl font-black italic text-white text-center">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-10 grid grid-cols-1 xl:grid-cols-12 gap-12 pt-12 relative z-10">
        
        {/* 3. 左侧控制台 (3/12 宽度) */}
        <div className="xl:col-span-3">
          <div className="sticky top-32 space-y-8">
            <NeubrutalCard className="!p-10 !bg-gray-50 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase italic tracking-tighter">
                <div className="p-3 bg-gray-900 text-white border-4 border-white shadow-md"><Plus size={24} /></div>
                新建情报任务
              </h2>
              
              <div className="space-y-10">
                <NeubrutalSelect 
                  label="情报能级 (Protocol Level)" 
                  value={reportConfig.type} 
                  onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
                  className="!py-4 text-lg font-black"
                >
                  <option value="WEEKLY">WK - 战术周报</option>
                  <option value="MONTHLY">MO - 运营月报</option>
                  <option value="QUARTERLY">QT - 战略季报</option>
                  <option value="YEARLY">YR - 宏观年报</option>
                </NeubrutalSelect>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest italic">模块装配 (ALL ACTIVE)</label>
                    <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">PRO V3</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'summary', icon: <FileText size={12}/>, label: '战略摘要' },
                      { id: 'region', icon: <Globe size={12}/>, label: '区域分布' },
                      { id: 'details', icon: <List size={12}/>, label: '资产清单' },
                      { id: 'tech', icon: <Cpu size={12}/>, label: '技术矩阵' }
                    ].map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setReportConfig(prev => ({
                            ...prev,
                            modules: prev.modules.includes(mod.id) ? prev.modules.filter(m => m !== mod.id) : [...prev.modules, mod.id]
                          }));
                        }}
                        className={`flex items-center justify-between p-3 border-4 font-black text-[10px] uppercase transition-all ${
                          reportConfig.modules.includes(mod.id) 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)]' 
                            : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">{mod.icon} {mod.label}</div>
                        {reportConfig.modules.includes(mod.id) && <CheckCircle size={10} className="text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="group w-full bg-blue-600 hover:bg-white text-white hover:text-gray-900 border-4 border-gray-900 p-6 font-black uppercase italic tracking-[0.3em] text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all active:translate-x-2 active:translate-y-2"
                >
                  {isGenerating ? '正在炼制中...' : '生产情报 ➔'}
                </button>
              </div>
            </NeubrutalCard>

            <div className="bg-yellow-400 border-4 border-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={20} />
                  <span className="font-black uppercase italic text-xs tracking-tighter">自动加密逻辑已就绪</span>
               </div>
               <p className="text-[10px] font-bold leading-relaxed text-gray-900">
                  所有产出文件将按照 SWAI 2025 协议进行哈希混淆，确保情报在物理传输过程中的绝对安全。
               </p>
            </div>
          </div>
        </div>

        {/* 4. 右侧档案馆情报流 (9/12 宽度) */}
        <div className="xl:col-span-9 space-y-12 pb-20">
          
          {/* 高级过滤工具栏 */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                placeholder="键入代号或关键词进行深度搜索 (SEARCH)..." 
                className="w-full pl-16 pr-8 py-6 bg-white border-8 border-gray-900 font-black text-xl uppercase outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {['ALL', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-6 py-2 border-4 border-gray-900 font-black text-[10px] uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    filterType === t ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 情报流 */}
          <div className="relative pl-12 border-l-[12px] border-gray-100 space-y-20">
            {groupedReports.length === 0 ? (
              <div className="py-40 text-center border-8 border-dashed border-gray-100 bg-gray-50/50">
                <Archive size={100} className="mx-auto text-gray-200 mb-8 animate-pulse" />
                <p className="font-black text-gray-300 text-4xl uppercase italic tracking-tighter">Archive Empty</p>
              </div>
            ) : (
              groupedReports.map((group) => (
                <div key={group.label} className="relative">
                  {/* 时间节点 */}
                  <div className="absolute -left-[64px] top-0 w-14 h-14 bg-gray-950 border-8 border-white rounded-full flex items-center justify-center z-10 shadow-2xl">
                    <Clock size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic text-gray-900 mb-10 tracking-widest pl-4 border-l-8 border-yellow-400">
                    {group.label}
                  </h3>
                  
                  <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
                    {group.items.map((report) => (
                      <motion.div 
                        whileHover={{ y: -5, x: -5 }}
                        key={report.id}
                        className="group bg-white border-8 border-gray-900 p-8 hover:bg-blue-50 transition-all cursor-pointer relative shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        onClick={() => setActiveReport(report)}
                      >
                        {/* 状态印戳 */}
                        {report.status === 'ready' && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white border-4 border-gray-900 px-3 py-1 font-black text-[10px] uppercase rotate-12 z-20 shadow-lg">
                            Archive_Ready
                          </div>
                        )}

                        <div className="flex flex-col h-full justify-between gap-10">
                          <div>
                            <div className="flex items-center gap-4 mb-4">
                              <span className={`w-4 h-4 rounded-none ${
                                report.type === 'YEARLY' ? 'bg-yellow-500' : 
                                report.type === 'QUARTERLY' ? 'bg-purple-600' : 
                                'bg-blue-600'
                              }`}></span>
                              <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{report.type} Intelligence Unit</span>
                            </div>
                            <h4 className="text-4xl font-black tracking-tighter uppercase text-gray-900 group-hover:text-blue-600 mb-4 truncate italic">
                              {report.title}
                            </h4>
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 border-2 border-gray-900">
                                  <Calendar size={14} /> {new Date(report.createdAt).toLocaleDateString()}
                               </div>
                               <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase italic">
                                  <Fingerprint size={14} /> SEC_LEVEL: 07
                               </div>
                            </div>
                          </div>

                          {/* 简易指标分析 UX */}
                          <div className="grid grid-cols-3 gap-4 py-6 border-y-4 border-dashed border-gray-100">
                             <div className="text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">节点覆盖</p>
                                <p className="font-black italic text-lg">1,245</p>
                             </div>
                             <div className="text-center border-x-2 border-gray-100">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">数据完备度</p>
                                <p className="font-black italic text-lg text-green-600">100%</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">技术渗透</p>
                                <p className="font-black italic text-lg text-blue-600">A+</p>
                             </div>
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <div className="flex items-center gap-2 font-black text-xs text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">
                               详情探测 <ArrowUpRight size={16} />
                            </div>
                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all scale-90 origin-right">
                              <button 
                                onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }}
                                className="p-4 bg-indigo-600 text-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                              >
                                <Maximize2 size={24} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleBuildAction(report); }}
                                className="p-4 bg-green-500 text-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                              >
                                <FileCheck size={24} />
                              </button>
                              <button 
                                className="p-4 bg-white text-red-600 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                              >
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 情报预览 HUD 保持现状但宽度同步 */}
      {activeReport && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-8 backdrop-blur-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl bg-white border-[16px] border-gray-900 shadow-[40px_40px_0px_0px_rgba(59,130,246,0.5)] overflow-hidden relative">
            <div className="bg-gray-900 text-white p-10 flex justify-between items-center border-b-[12px] border-gray-900">
              <div className="flex items-center gap-8">
                <NexusLogo size="lg" color="bg-blue-600" />
                <div>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{activeReport.title}</h3>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.6em] mt-4">西南AI产业智研情报资产 // AUTHENTICATED</p>
                </div>
              </div>
              <button onClick={() => setActiveReport(null)} className="p-4 border-4 border-gray-700 hover:bg-red-600 hover:border-white transition-all"><X size={32} /></button>
            </div>
            
            <div className="p-16 grid grid-cols-1 md:grid-cols-5 gap-16">
              <div className="md:col-span-2 space-y-10">
                <NeubrutalCard className="!bg-gray-50 border-8 !shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] !p-10">
                  <p className="text-sm font-black text-gray-400 uppercase mb-8 tracking-widest flex items-center gap-3"><Target size={20} className="text-blue-600" /> 核心能级监控</p>
                  <div className="space-y-8">
                    {[
                      { label: 'P0 核心节点', val: '150+', color: 'bg-red-500' },
                      { label: '飞桨活跃底座', val: '210+', color: 'bg-blue-600' },
                      { label: '文心渗透深度', val: '65%', color: 'bg-purple-600' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase"><span>{item.label}</span><span className="italic text-lg">{item.val}</span></div>
                        <div className="h-4 bg-gray-200 rounded-none overflow-hidden border-2 border-gray-900 p-0.5">
                          <div className={`h-full ${item.color}`} style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </NeubrutalCard>
              </div>
              <div className="md:col-span-3 space-y-12">
                <div className="space-y-6">
                  <h4 className="text-lg font-black uppercase text-gray-400 tracking-widest italic flex items-center gap-3"><List size={20}/> 情报综述 / Abstract</h4>
                  <p className="text-3xl font-bold leading-relaxed text-gray-800 border-l-[16px] border-blue-600 pl-10 py-4 bg-blue-50/30 italic">
                    {activeReport.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-10 pt-10 border-t-4 border-gray-100">
                  <div className="bg-gray-900 text-white p-6 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Security Level</p><p className="text-xl font-black italic tracking-tighter">LVL_7_TOP_SECRET</p></div>
                  <div className="bg-white text-gray-900 p-6 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Report Domain</p><p className="text-xl font-black text-blue-600 italic tracking-tighter">{activeReport.envScope}</p></div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-gray-50 border-t-[12px] border-gray-900 flex justify-end gap-8">
              <button onClick={() => setActiveReport(null)} className="px-10 py-4 font-black uppercase text-sm hover:underline tracking-widest">取消当前指令</button>
              <NeubrutalButton variant="primary" onClick={() => navigate(`/reports/${activeReport.id}`)} className="!py-5 !px-16 text-2xl bg-indigo-600 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">在线研读档案 ➔</NeubrutalButton>
              <NeubrutalButton variant="success" onClick={() => handleBuildAction(activeReport)} className="!py-5 !px-16 text-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">物理提取情报 ➔</NeubrutalButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
