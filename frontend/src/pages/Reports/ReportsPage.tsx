
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
  X
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';

const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  // 报告配置状态
  const [reportConfig, setReportConfig] = useState({
    title: '',
    type: 'MONTHLY',
    modules: ['summary', 'details'] as string[]
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">情报生产车间</h1>
          <p className="font-bold text-gray-500 italic uppercase text-xs">Intelligence Production Factory v2.0</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-gray-800 text-white border-4 border-gray-900 font-black text-xs uppercase">
            已存库情报: {reports?.length || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：情报配置（积木组装） */}
        <NeubrutalCard className="lg:col-span-1">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
            <Layers className="text-blue-600" /> 情报积木组装
          </h2>
          <div className="space-y-6">
            <NeubrutalInput 
              label="简报代号" 
              placeholder="例如：西南Q3综述..." 
              value={reportConfig.title}
              onChange={(e) => setReportConfig(prev => ({...prev, title: e.target.value}))}
            />
            
            <NeubrutalSelect 
              label="任务周期" 
              value={reportConfig.type}
              onChange={(e) => setReportConfig(prev => ({...prev, type: e.target.value}))}
            >
              <option value="WEEKLY">周级 (WEEKLY)</option>
              <option value="MONTHLY">月级 (MONTHLY)</option>
              <option value="QUARTERLY">季级 (QUARTERLY)</option>
              <option value="YEARLY">年级 (YEARLY)</option>
            </NeubrutalSelect>

            <div className="space-y-3">
              <label className="block text-sm font-black uppercase">选择数据模块</label>
              {[
                { id: 'summary', label: '战略决策概要', icon: Zap },
                { id: 'region', label: '区域态势分布', icon: Globe },
                { id: 'details', label: '全量资产详单', icon: List },
                { id: 'tech', label: '技术渗透矩阵', icon: Box },
              ].map(mod => (
                <button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`w-full flex items-center justify-between p-3 border-4 transition-all ${
                    reportConfig.modules.includes(mod.id)
                      ? 'bg-blue-600 border-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs">
                    <mod.icon size={14} /> {mod.label}
                  </div>
                  {reportConfig.modules.includes(mod.id) && <CheckCircle size={14} />}
                </button>
              ))}
            </div>

            <NeubrutalButton 
              variant="primary" 
              className="w-full py-4 text-lg" 
              onClick={handleGenerate}
              disabled={isGenerating || !reportConfig.title}
            >
              {isGenerating ? '正在炼制中...' : '生产情报'}
            </NeubrutalButton>
          </div>
        </NeubrutalCard>

        {/* 右侧：战术档案库 (Archive) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive size={20} />
            <h2 className="text-xl font-black uppercase">战术档案库</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports?.map((report) => (
              <div 
                key={report.id}
                className="group relative bg-white border-4 border-gray-800 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
                onClick={() => setActiveReport(report)}
              >
                {/* READY 印戳视觉 */}
                {report.status === 'ready' && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white border-4 border-gray-900 px-2 py-1 font-black text-[10px] uppercase rotate-12 z-10 shadow-lg">
                    READY
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 border-2 border-gray-800">
                    <FileText size={24} className="text-gray-800" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-black text-sm uppercase truncate mb-1">{report.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{report.type} INTEL</p>
                    <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-gray-500">
                      <Clock size={10} /> {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-100">
                  <span className="text-[10px] font-black text-blue-600 underline">查看详情</span>
                  {report.status === 'ready' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownload(report); }}
                      className="p-2 bg-gray-800 text-white border-2 border-gray-900 hover:bg-blue-600 transition-colors"
                    >
                      <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                  <NeubrutalButton variant="success" onClick={() => handleDownload(activeReport)}>
                    <Download size={18} className="mr-2" /> 提取物理文档
                  </NeubrutalButton>
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
