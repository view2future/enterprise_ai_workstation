import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report } from '../../services/report.service';
import { 
  FileText, Plus, Trash2, Clock, CheckCircle, AlertCircle,
  BarChart3, Calendar, Layers, ChevronRight, Archive, Search,
  Box, Globe, List, Zap, Maximize2, X, FileCheck, ShieldCheck, Target,
  TrendingUp, Activity, Cpu, MoreHorizontal, Filter, ArrowUpRight, Database, Fingerprint,
  Lock, Unlock, ShieldAlert, Eye, Loader2, Sparkles, Terminal, Download
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalSelect, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';
import { useNavigate } from 'react-router-dom';
import { CommandNotification } from '../../components/common/CommandNotification';
import { motion, AnimatePresence } from 'framer-motion';
import { NexusLogo } from '../../components/ui/neubrutalism/NexusLogo';

// 赛博解密背景组件
const DecryptionOverlay: React.FC<{ progress: number; step: string }> = ({ progress, step }) => {
  const [binaryLines, setBinaryLines] = useState<string[]>([]);

  useEffect(() => {
    const lines = Array(30).fill(0).map(() => 
      Array(10).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')
    );
    setBinaryLines(lines);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[6000] bg-black overflow-hidden flex items-center justify-center">
      {/* 流式二进制背景 */}
      <div className="absolute inset-0 opacity-20 font-mono text-[10px] text-blue-500 leading-none p-4 grid grid-cols-6 gap-4">
        {binaryLines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ y: -100 }}
            animate={{ y: 1000 }}
            transition={{ duration: Math.random() * 5 + 2, repeat: Infinity, ease: 'linear' }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* 扫描线动效 */}
      <motion.div 
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-1 bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
      />

      {/* 核心控制台 */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 w-full max-w-2xl px-10"
      >
        <div className="bg-gray-900 border-8 border-blue-600 p-12 shadow-[30px_30px_0px_0px_rgba(59,130,246,0.3)]">
          <div className="flex items-center gap-8 mb-12">
            <div className="p-4 bg-blue-600 border-4 border-white shadow-lg">
              <Terminal className="text-white" size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">Intelligence Extraction</h3>
              <p className="text-blue-400 font-mono text-sm tracking-[0.4em] uppercase">Protocol: L7_DECRYPTION_ACTIVE</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-6 bg-gray-800 border-4 border-gray-700 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)]"
              />
            </div>
            <div className="flex justify-between items-end font-mono">
              <div className="space-y-1">
                <p className="text-blue-400 text-xs uppercase font-black tracking-widest">{step}</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-500 text-[8px] uppercase tracking-widest">Encrypting_Local_Data_Node...</p>
                </div>
              </div>
              <p className="text-white text-6xl font-black italic tracking-tighter leading-none">{progress}%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  const [buildStatus, setBuildStatus] = useState({ isBuilding: false, progress: 0, step: '' });
  const [notifState, setNotifState] = useState({ isOpen: false, fileName: '' });

  // V4.0 加密逻辑
  const [isEncryptEnabled, setIsEncryptEnabled] = useState(false);
  const [reportPassword, setReportPassword] = useState('swai2025');

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
      password: isEncryptEnabled ? reportPassword : null,
      description: `联图智研系统自动生成的全量情报档案。${isEncryptEnabled ? ' [已应用访问加密]' : ''}`
    });
  };

  const handleBuildAction = async (report: Report) => {
    soundEngine.playTick();
    setBuildStatus({ isBuilding: true, progress: 0, step: '正在建立握手协议...' });
    setActiveReport(null);
    try {
      const steps = [
        { p: 20, s: '正在执行 L7 级数据脱敏...' },
        { p: 45, s: '解密全量资产记录...' },
        { p: 70, s: '注入动态语义脑图...' },
        { p: 90, s: '执行物理归档与哈希混淆...' }
      ];
      for (const step of steps) {
        await new Promise(r => setTimeout(r, 600));
        setBuildStatus(prev => ({ ...prev, progress: step.p, step: step.s }));
      }
      const response = await reportsApi.buildReport(report.id);
      setBuildStatus({ isBuilding: false, progress: 100, step: '完成' });
      setNotifState({ isOpen: true, fileName: response.data.fileName });
      soundEngine.playSuccess();
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

      <AnimatePresence>
        {buildStatus.isBuilding && (
          <DecryptionOverlay progress={buildStatus.progress} step={buildStatus.step} />
        )}
      </AnimatePresence>

      {/* 顶部巨幕 HUD */}
      <div className="bg-gray-950 text-white p-12 border-b-[16px] border-blue-600 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none italic font-black text-[15rem] leading-none -rotate-6">NEXUS</div>
        <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 border-4 border-white rotate-3 shadow-lg"><Archive size={40} /></div>
              <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">情报档案馆</h1>
            </div>
            <p className="text-blue-400 text-sm font-black uppercase tracking-[0.5em] pl-2 flex items-center gap-3 text-shadow-blue">
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
            <div className="bg-blue-600 border-4 border-gray-900 p-6 flex flex-col justify-center min-w-[160px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black text-white/60 uppercase mb-2 text-center">系统同步率</span>
              <span className="text-5xl font-black italic text-white text-center">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-10 grid grid-cols-1 xl:grid-cols-12 gap-12 pt-12 relative z-10">
        
        {/* 左侧控制台 */}
        <div className="xl:col-span-3">
          <div className="sticky top-32 space-y-8">
            <NeubrutalCard className="!p-10 !bg-gray-50 border-8 border-gray-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase italic tracking-tighter text-gray-900">
                <div className="p-3 bg-gray-900 text-white border-4 border-white shadow-md"><Plus size={24} /></div>
                新建情报任务
              </h2>
              
              <div className="space-y-8">
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

                {/* V4.0 加密交互 */}
                <div className="p-6 bg-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={isEncryptEnabled}
                          onChange={(e) => setIsEncryptEnabled(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 border-4 border-black transition-colors ${isEncryptEnabled ? 'bg-blue-600' : 'bg-white'}`}>
                          {isEncryptEnabled && <CheckCircle size={14} className="text-white mx-auto" />}
                        </div>
                      </div>
                      <span className="font-black uppercase text-xs italic tracking-tighter flex items-center gap-2">
                        {isEncryptEnabled ? <Lock size={14} className="text-blue-600" /> : <Unlock size={14} className="text-gray-400" />}
                        启动访问限制保护
                      </span>
                   </label>

                   <AnimatePresence>
                     {isEncryptEnabled && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <NeubrutalInput 
                           label="访问密钥" 
                           value={reportPassword} 
                           onChange={(e) => setReportPassword(e.target.value)} 
                           placeholder="输入解密密码..."
                         />
                         <p className="text-[8px] font-bold text-gray-400 mt-2 italic uppercase">Default: swai2025 // Level: AES-256</p>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                <div className="space-y-6">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest italic">模块装配 (ALL ACTIVE)</label>
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
                  {isGenerating ? '正在解析数据流...' : '生产情报 ➔'}
                </button>
              </div>
            </NeubrutalCard>
          </div>
        </div>

        {/* 右侧档案馆情报流 */}
        <div className="xl:col-span-9 space-y-12 pb-20">
          
          {/* 搜索工具栏 */}
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
          </div>

          <div className="relative pl-12 border-l-[12px] border-gray-100 space-y-20">
            {groupedReports.map((group) => (
              <div key={group.label} className="relative">
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
                      {report.password && (
                        <div className="absolute top-4 left-4 text-blue-600 flex items-center gap-2">
                          <Lock size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Encrypted_Asset</span>
                        </div>
                      )}
                      
                      {report.status === 'ready' && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white border-4 border-gray-900 px-3 py-1 font-black text-[10px] uppercase rotate-12 z-20 shadow-lg">
                          Archive_Ready
                        </div>
                      )}

                      <div className="flex flex-col h-full justify-between gap-10">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <span className={`w-4 h-4 ${report.type === 'YEARLY' ? 'bg-yellow-500' : 'bg-blue-600'}`}></span>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{report.type} Unit</span>
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

                        <div className="flex justify-between items-center pt-4">
                          <div className="flex items-center gap-2 font-black text-xs text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4 uppercase tracking-widest">
                             Dossier Probe <ArrowUpRight size={16} />
                          </div>
                          <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all scale-90 origin-right">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleBuildAction(report); }}
                              className="p-4 bg-green-500 text-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                              title="物理提取 HTML 情报"
                            >
                              <Download size={24} />
                            </button>
                            <button className="p-4 bg-white text-red-600 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                              <Trash2 size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 情报预览 HUD */}
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
                  <div className="space-y-8 text-gray-900">
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
                <div className="space-y-6 text-gray-900">
                  <h4 className="text-lg font-black uppercase text-gray-400 tracking-widest italic flex items-center gap-3"><List size={20}/> 情报综述 / Abstract</h4>
                  <p className="text-3xl font-bold leading-relaxed border-l-[16px] border-blue-600 pl-10 py-4 bg-blue-50/30 italic">
                    {activeReport.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-10 pt-10 border-t-4 border-gray-100">
                  <div className="bg-gray-900 text-white p-6 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"><p className="text-[10px] font-black text-gray-500 uppercase mb-2">Security Level</p><p className="text-xl font-black italic tracking-tighter">LVL_7_TOP_SECRET</p></div>
                  <div className="bg-white text-gray-900 p-6 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Access Status</p>
                    <div className="flex items-center gap-2 text-xl font-black text-blue-600 italic tracking-tighter">
                      {activeReport.password ? <><Lock size={18}/> 已加密</> : <><Unlock size={18}/> 开放查阅</>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-gray-50 border-t-[12px] border-gray-900 flex justify-end gap-8">
              <button onClick={() => setActiveReport(null)} className="px-10 py-4 font-black uppercase text-sm hover:underline tracking-widest text-gray-900">取消当前指令</button>
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