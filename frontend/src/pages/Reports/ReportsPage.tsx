
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report } from '../../services/report.service';
import { 
  FileText, 
  Plus, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Archive,
  Search,
  Box,
  Globe,
  List,
  Zap,
  Maximize2,
  X
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';

import { useNavigate } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  // 报告配置状态
  const [reportConfig, setReportConfig] = useState({
    title: '',
    type: 'MONTHLY',
    modules: ['summary', 'details'] as string[]
  });

  // 自动命名函数
  const generateAutoTitle = (type: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900); // 3位随机码
    
    const typeMap: Record<string, string> = {
      'WEEKLY': 'WK',
      'MONTHLY': 'MO',
      'QUARTERLY': 'QT',
      'YEARLY': 'YR'
    };

    return `${typeMap[type] || 'RP'}·CD·${year}${month}${day}·${random}`;
  };

  // 当类型改变时，如果标题为空或包含旧代号，则更新标题
  const handleTypeChange = (newType: string) => {
    setReportConfig(prev => ({
      ...prev,
      type: newType,
      title: generateAutoTitle(newType)
    }));
  };

  // 初始化标题
  React.useEffect(() => {
    if (!reportConfig.title) {
      setReportConfig(prev => ({ ...prev, title: generateAutoTitle(prev.type) }));
    }
  }, []);

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

  const toggleModule = (mod: string) => {
    setReportConfig(prev => ({
      ...prev,
      modules: prev.modules.includes(mod) 
        ? prev.modules.filter(m => m !== mod) 
        : [...prev.modules, mod]
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    soundEngine.playPneumatic();
    createReportMutation.mutate({
      ...reportConfig,
      description: `系统自动生成的 ${reportConfig.type} 级情报简报`
    });
  };

  const handleDownload = (report: Report) => {
    soundEngine.playTick();
    reportsApi.downloadReport(report.id, report.title);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports?.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end bg-gray-900 text-white p-8 border-b-8 border-blue-600 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">情报生产与归档中心</h1>
          <p className="font-bold text-blue-400 italic uppercase text-xs tracking-[0.3em] mt-2">Intelligence Archive & Production Terminal v3.0</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-500 uppercase">库内情报总量</p>
            <p className="text-3xl font-black italic">{reports?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：情报积木组装 (控制台) */}
        <div className="lg:col-span-1 space-y-6">
          <NeubrutalCard className="!bg-gray-50">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase italic">
              <Plus className="text-blue-600" /> 新建情报任务
            </h2>
            <div className="space-y-6">
              <NeubrutalSelect 
                label="任务周期 (Task Period)" 
                value={reportConfig.type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="WEEKLY">周级 (WEEKLY)</option>
                <option value="MONTHLY">月级 (MONTHLY)</option>
                <option value="QUARTERLY">季级 (QUARTERLY)</option>
                <option value="YEARLY">年级 (YEARLY)</option>
              </NeubrutalSelect>

              <NeubrutalInput 
                label="情报代号 (Auto-Generated)" 
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({...prev, title: e.target.value}))}
              />
              
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase text-gray-500">组件装配 (Modules)</label>
                {[
                  { id: 'summary', label: '战略摘要', icon: Zap },
                  { id: 'region', label: '区域分布', icon: Globe },
                  { id: 'details', label: '资产详单', icon: List },
                  { id: 'tech', label: '技术矩阵', icon: Box },
                ].map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`w-full flex items-center justify-between p-2 border-2 transition-all ${
                      reportConfig.modules.includes(mod.id)
                        ? 'bg-blue-600 border-gray-900 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-[10px] uppercase">
                      <mod.icon size={12} /> {mod.label}
                    </div>
                    {reportConfig.modules.includes(mod.id) && <CheckCircle size={12} />}
                  </button>
                ))}
              </div>

              <NeubrutalButton 
                variant="primary" 
                className="w-full py-4" 
                onClick={handleGenerate}
                disabled={isGenerating || !reportConfig.title}
              >
                {isGenerating ? '正在炼制...' : '启动生产任务'}
              </NeubrutalButton>
            </div>
          </NeubrutalCard>
        </div>

        {/* 右侧：情报档案馆 (列表流) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="搜索情报代号、类型或日期..." 
              className="flex-1 outline-none font-bold text-sm uppercase"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-100 text-[10px] font-black border-2 border-gray-900 uppercase">All Intel</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredReports?.length === 0 ? (
              <div className="py-20 text-center border-4 border-dashed border-gray-200">
                <Archive size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="font-black text-gray-300 uppercase">没有找到匹配的情报档案</p>
              </div>
            ) : (
              filteredReports?.map((report) => (
                <div 
                  key={report.id}
                  className="group flex items-center gap-6 bg-white border-4 border-gray-900 p-4 hover:bg-blue-50 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => setActiveReport(report)}
                >
                  <div className={`w-2 h-12 ${
                    report.type === 'YEARLY' ? 'bg-purple-600' : 
                    report.type === 'QUARTERLY' ? 'bg-yellow-400' : 
                    'bg-blue-500'
                  }`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-lg tracking-tighter uppercase group-hover:text-blue-600">{report.title}</h3>
                      <span className="px-2 py-0.5 border-2 border-gray-900 text-[8px] font-black uppercase">
                        {report.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                        <Clock size={10} /> {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase">
                        <CheckCircle size={10} /> STATUS: {report.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }}
                      className="p-2 bg-purple-600 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                      className="p-2 bg-green-500 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      className="p-2 bg-white text-red-600 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* 状态印戳 */}
                  {report.status === 'ready' && (
                    <div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none rotate-12">
                      <Archive size={80} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 情报组装动效全屏遮罩 (Scheme 1) */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 flex flex-col items-center justify-center p-10 backdrop-blur-md">
          <div className="w-full max-w-md text-center space-y-10">
            <div className="relative">
              <div className="loading-spinner text-8xl mx-auto opacity-20">⚙️</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Box size={48} className="text-blue-500 animate-bounce" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">情报炼制中...</h2>
              <p className="text-blue-400 font-bold mt-2 animate-pulse uppercase text-xs tracking-[0.3em]">Assembling Intelligence Modules</p>
            </div>
            {/* 模拟掉落的像素块 */}
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-4 h-4 bg-blue-500 animate-bounce`} style={{ animationDelay: `${i*0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HUD 即时预览层 (Scheme 2) */}
      {activeReport && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl animate-in zoom-in duration-200">
            <NeubrutalCard className="!p-0 overflow-hidden !shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-8">
              <div className="bg-gray-800 text-white p-6 border-b-4 border-gray-900 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">{activeReport.title}</h3>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Strategic Insight Preview</p>
                </div>
                <button onClick={() => setActiveReport(null)} className="p-2 border-2 border-white hover:bg-red-600 transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 bg-white grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase">核心战态摘要</p>
                  <div className="p-4 bg-gray-50 border-2 border-gray-800 rounded-lg">
                    <p className="text-xs font-bold leading-relaxed">{activeReport.description || '无详细情报描述'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase">数据构成</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(activeReport.filters || '{}')?.modules?.map((m: string) => (
                      <span key={m} className="px-2 py-1 bg-blue-100 border-2 border-blue-800 text-[10px] font-black uppercase">{m}</span>
                    )) || <span className="text-[10px] font-bold italic">STANDARD PACKAGE</span>}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t-4 border-gray-800 flex justify-end gap-4">
                <NeubrutalButton variant="secondary" onClick={() => setActiveReport(null)}>关闭预览</NeubrutalButton>
                {activeReport.status === 'ready' && (
                  <>
                    <NeubrutalButton 
                      variant="primary" 
                      onClick={() => navigate(`/reports/${activeReport.id}`)}
                      className="bg-purple-600 text-white"
                    >
                      <Maximize2 size={18} className="mr-2" /> 进入数字化阅览室
                    </NeubrutalButton>
                    <NeubrutalButton variant="success" onClick={() => handleDownload(activeReport)}>
                      <Download size={18} className="mr-2" /> 提取物理文档
                    </NeubrutalButton>
                  </>
                )}
              </div>
            </NeubrutalCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
