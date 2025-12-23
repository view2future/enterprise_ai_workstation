import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, Report } from '../../services/report.service';
import { 
  FileText, Plus, Trash2, Clock, CheckCircle, AlertCircle,
  BarChart3, Calendar, Layers, ChevronRight, Archive, Search,
  Box, Globe, List, Zap, Maximize2, X, Download, FileCheck, ShieldCheck, Target
} from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';
import { useNavigate } from 'react-router-dom';
import { CommandNotification } from '../../components/common/CommandNotification';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();

  // 构建状态
  const [buildStatus, setBuildStatus] = useState({ isBuilding: false, progress: 0, step: '' });
  const [notifState, setNotifState] = useState({ isOpen: false, fileName: '' });

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

  const handleGenerate = () => {
    setIsGenerating(true);
    soundEngine.playPneumatic();
    const now = new Date();
    const dateTag = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    createReportMutation.mutate({
      ...reportConfig,
      title: reportConfig.title || `INTEL-${reportConfig.type}-${dateTag}`,
      description: `系统自动生成的 ${reportConfig.type} 级情报简报`
    });
  };

  // 统一的构建逻辑 (V3 编译器)
  const handleBuildAction = async (report: Report) => {
    soundEngine.playTick();
    setBuildStatus({ isBuilding: true, progress: 0, step: '初始化编译协议...' });
    setActiveReport(null); // 关闭预览窗

    try {
      const steps = [
        { p: 30, s: '正在解密全量资产记录...' },
        { p: 60, s: '正在渲染全息单页 (Vite V3)...' },
        { p: 90, s: '正在执行物理归档 /dist_reports...' }
      ];

      for (const step of steps) {
        await new Promise(r => setTimeout(r, 500));
        setBuildStatus(prev => ({ ...prev, progress: step.p, step: step.s }));
      }

      const response = await reportsApi.buildReport(report.id);
      setBuildStatus({ isBuilding: false, progress: 100, step: '完成' });
      setNotifState({ isOpen: true, fileName: response.data.fileName });
    } catch (err) {
      setBuildStatus({ isBuilding: false, progress: 0, step: '' });
      alert('构建失败：链路连接中断。');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredReports = reports?.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <CommandNotification
        isOpen={notifState.isOpen}
        onClose={() => setNotifState({ ...notifState, isOpen: false })}
        title="静态构建成功"
        message="离线情报卷宗已完成物理编译。全量数据已封装为单一 HTML 资产并保存至项目 dist_reports 目录下。"
        fileName={notifState.fileName}
      />

      <AnimatePresence>
        {buildStatus.isBuilding && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-gray-950/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-gray-900 border-4 border-blue-500 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <Box className="text-blue-400 animate-spin" size={32} />
                <h3 className="text-white font-black uppercase italic">Dossier_Compiler V2.0</h3>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${buildStatus.progress}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"></motion.div>
                </div>
                <div className="flex justify-between font-mono text-[9px]">
                  <span className="text-blue-400">{buildStatus.step}</span>
                  <span className="text-white">{buildStatus.progress}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end bg-gray-900 text-white p-8 border-b-8 border-blue-600 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">情报生产与归档中心</h1>
          <p className="font-bold text-blue-400 italic uppercase text-xs tracking-[0.3em] mt-2">Intelligence Archive & Production Terminal v3.0</p>
        </div>
        <div className="text-right"><p className="text-[10px] font-black text-gray-500 uppercase">库内情报总量</p><p className="text-3xl font-black italic">{reports?.length || 0}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <NeubrutalCard className="!bg-gray-50">
            <h2 className="text-xl font-black mb-6 uppercase italic">新建情报任务</h2>
            <div className="space-y-6">
              <NeubrutalSelect label="周期 (Period)" value={reportConfig.type} onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}>
                <option value="WEEKLY">周级</option><option value="MONTHLY">月级</option><option value="QUARTERLY">季级</option><option value="YEARLY">年级</option>
              </NeubrutalSelect>
              <NeubrutalInput label="代号 (ID)" value={reportConfig.title} onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})} placeholder="留空则自动生成" />
              <NeubrutalButton variant="primary" className="w-full py-4" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? '正在炼制...' : '启动生产任务'}
              </NeubrutalButton>
            </div>
          </NeubrutalCard>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Search className="text-gray-400" size={20} />
            <input type="text" placeholder="搜索代号..." className="flex-1 outline-none font-bold text-sm uppercase" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="space-y-4">
            {filteredReports?.map((report) => (
              <div key={report.id} className="group flex items-center gap-6 bg-white border-4 border-gray-900 p-4 hover:bg-blue-50 transition-all cursor-pointer relative overflow-hidden" onClick={() => setActiveReport(report)}>
                <div className={`w-2 h-12 ${report.type === 'YEARLY' ? 'bg-purple-600' : 'bg-blue-500'}`}></div>
                <div className="flex-1">
                  <h3 className="font-black text-lg tracking-tighter uppercase">{report.title}</h3>
                  <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400">
                    <Clock size={10} /> {new Date(report.createdAt).toLocaleString()}
                    <span className="text-green-600 uppercase font-black tracking-widest ml-4">STATUS: {report.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }} className="p-2 bg-purple-600 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Maximize2 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleBuildAction(report); }} className="p-2 bg-green-500 text-white border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="提取报告"><FileCheck size={16} /></button>
                  <button className="p-2 bg-white text-red-600 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 情报即时预览 HUD */}
      {activeReport && (
        <div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-3xl bg-white border-[12px] border-gray-900 shadow-[20px_20px_0px_0px_rgba(59,130,246,0.5)] overflow-hidden relative"
          >
            {/* 装饰性背景水印 */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none select-none font-black text-[12rem] italic leading-none rotate-12">
              {activeReport.type.substring(0, 2)}
            </div>

            {/* 头部：代号与状态 */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b-4 border-gray-900">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{activeReport.title}</h3>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Intelligence Asset Registry // Verified</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveReport(null)}
                className="p-2 border-2 border-gray-700 hover:bg-red-600 hover:border-white transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-5 gap-10">
              {/* 左侧：战术指标 */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-50 border-4 border-gray-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <Target size={12} className="text-blue-600" /> 覆盖能级分布
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: 'P0 核心节点', val: 150, color: 'bg-red-500' },
                      { label: '飞桨活跃节点', val: 210, color: 'bg-blue-500' },
                      { label: '文心渗透深度', val: '65%', color: 'bg-purple-500' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase">
                          <span>{item.label}</span>
                          <span className="font-black italic">{item.val}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-none overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: '70%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 border-2 border-gray-900 font-black italic text-[10px] uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Clock size={12} /> 归档时间: {new Date(activeReport.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* 右侧：情报摘要 */}
              <div className="md:col-span-3 space-y-8">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">情报综述 / Abstract</h4>
                  <p className="text-sm font-bold leading-relaxed text-gray-700 italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
                    {activeReport.description || '该报告通过对西南全域 526 家 AI 企业节点的深度扫描，提炼了本周期的能级跃迁趋势与技术底座渗透现状。'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed border-gray-200">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Security Level</p>
                    <p className="text-xs font-black text-gray-900">LEVEL_7_ACCESS</p>
                  </div>
                  <div className="p-4 border-2 border-dashed border-gray-200">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Report Context</p>
                    <p className="text-xs font-black text-blue-600">{activeReport.envScope}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮：指令区 */}
            <div className="p-8 bg-gray-50 border-t-4 border-gray-900 flex justify-end gap-6">
              <button 
                onClick={() => setActiveReport(null)}
                className="px-6 py-2 font-black uppercase text-xs hover:underline"
              >
                取消指令
              </button>
              <div className="flex gap-4">
                <NeubrutalButton 
                  variant="primary" 
                  onClick={() => navigate(`/reports/${activeReport.id}`)}
                  className="bg-indigo-600 text-white !py-3 !px-8"
                >
                  <Maximize2 size={18} className="mr-2"/> 进入数字化阅览室
                </NeubrutalButton>
                <NeubrutalButton 
                  variant="success" 
                  onClick={() => handleBuildAction(activeReport)}
                  className="!py-3 !px-8"
                >
                  <FileCheck size={18} className="mr-2"/> 提取报告
                </NeubrutalButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;