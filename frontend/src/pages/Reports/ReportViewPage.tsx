import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsApi, Report } from '../../services/report.service';
import { 
  ArrowLeft, 
  Download, 
  ShieldAlert, 
  Lock, 
  Unlock,
  Maximize2,
  Printer,
  Share2,
  Box,
  FileCheck
} from 'lucide-react';
import { NeubrutalButton, NeubrutalCard } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';
import { CommandNotification } from '../../components/common/CommandNotification';
import { motion, AnimatePresence } from 'framer-motion';

// 导入模板
import WeeklyTemplate from '../../components/reports/templates/WeeklyTemplate';
import MonthlyTemplate from '../../components/reports/templates/MonthlyTemplate';
import QuarterlyTemplate from '../../components/reports/templates/QuarterlyTemplate';
import YearlyTemplate from '../../components/reports/templates/YearlyTemplate';
import IntelDrillDownDrawer, { DrillDownData } from '../../components/reports/IntelDrillDownDrawer';

const ReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  
  const [notifState, setNotifState] = useState({
    isOpen: false,
    fileName: '',
    filePath: ''
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);

  const handleDrillDown = (title: string, type: 'enterprise' | 'list', items: any[]) => {
    setDrillDownData({ title, type, items });
    setIsDrawerOpen(true);
    soundEngine.playTick();
  };

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getReport(Number(id)).then(res => res.data),
    enabled: !!id,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && report) {
      const timer = setTimeout(() => {
        setIsDecrypting(false);
        soundEngine.playSuccess();
        setTimeout(() => setShowContent(true), 500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, report]);

  const [buildStatus, setBuildStatus] = useState({
    isBuilding: false,
    progress: 0,
    step: ''
  });

  const handleBuildReport = async () => {
    if (report) {
      soundEngine.playTick();
      setBuildStatus({ isBuilding: true, progress: 0, step: '初始化构建协议...' });
      
      try {
        // 模拟进度流
        const steps = [
          { p: 20, s: '正在解密全量资产记录...' },
          { p: 45, s: '正在注入全息渲染模版...' },
          { p: 75, s: '正在编译单一 HTML 卷宗...' },
          { p: 90, s: '正在执行物理归档 /dist_reports...' }
        ];

        for (const step of steps) {
          await new Promise(r => setTimeout(r, 600));
          setBuildStatus(prev => ({ ...prev, progress: step.p, step: step.s }));
        }

        const response = await reportsApi.buildReport(report.id);
        const { fileName, filePath } = response.data;
        
        setBuildStatus({ isBuilding: false, progress: 100, step: '完成' });
        setNotifState({ isOpen: true, fileName, filePath });
      } catch (err) {
        console.error('Holographic build failed:', err);
        setBuildStatus({ isBuilding: false, progress: 0, step: '' });
        alert('构建失败：服务器物理链路中断。');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="loading-spinner text-8xl mb-4 opacity-20">⚙️</div>
        <p className="font-black animate-pulse text-2xl tracking-tighter italic">正在调取情报档案...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-10 text-center">
        <NeubrutalCard className="max-w-md mx-auto border-red-500">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4 italic tracking-tighter">访问拒绝</h2>
          <NeubrutalButton onClick={() => navigate('/reports')} className="w-full">返回情报中心</NeubrutalButton>
        </NeubrutalCard>
      </div>
    );
  }

  const renderTemplate = () => {
    const props = { report, onDrillDown: handleDrillDown };
    switch (report.type) {
      case 'WEEKLY': return <WeeklyTemplate {...props} />;
      case 'MONTHLY': return <MonthlyTemplate {...props} />;
      case 'QUARTERLY': return <QuarterlyTemplate {...props} />;
      case 'YEARLY': return <YearlyTemplate {...props} />;
      default: return <MonthlyTemplate {...props} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      <div className="fixed top-0 left-0 h-2 bg-blue-600 z-[100] transition-all duration-100" style={{ width: `${scrollProgress}%` }}></div>

      <IntelDrillDownDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} data={drillDownData} />

      <CommandNotification
        isOpen={notifState.isOpen}
        onClose={() => setNotifState({ ...notifState, isOpen: false })}
        title="静态构建成功"
        message={`离线情报卷宗已完成物理编译。全量数据已封装为单一 HTML 资产并保存至项目 dist_reports 目录下。`}
        fileName={notifState.fileName}
      />

      {/* 构建进度 HUD */}
      <AnimatePresence>
        {buildStatus.isBuilding && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-gray-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-gray-900 border-4 border-blue-500 p-8 shadow-[0_0_50px_rgba(59,130,246,0.5)]"
            >
              <div className="flex items-center gap-4 mb-8">
                <Box className="text-blue-400 animate-spin" size={32} />
                <div>
                  <h3 className="text-white font-black uppercase italic tracking-tighter">Dossier_Compiler V2.0</h3>
                  <p className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">Compiling intelligence artifacts...</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-gray-800 border-2 border-gray-700 p-1 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${buildStatus.progress}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"
                  ></motion.div>
                </div>
                
                <div className="flex justify-between font-mono text-[9px]">
                  <span className="text-blue-400 animate-pulse">{buildStatus.step}</span>
                  <span className="text-white">{buildStatus.progress}%</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 opacity-20 font-mono text-[7px] text-gray-500">
                [SYSTEM]: EXECUTING BINARY_MERGE... OK<br/>
                [SYSTEM]: MAPPING NODES (526/526)... OK
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-gray-900 p-4 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/reports')} className="p-3 border-4 border-gray-900 bg-white hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase leading-tight italic">Top Secret</span>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{report.title}</h1>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID: {report.id} // BUILD_MODE: PHYSICAL_HTML</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleBuildReport} 
            disabled={isBuilding}
            className={`flex items-center gap-2 px-4 py-2 border-4 border-gray-900 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isBuilding ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 text-white hover:shadow-none hover:translate-x-1 hover:translate-y-1'}`}
          >
            {isBuilding ? <Box className="animate-spin" size={18} /> : <FileCheck size={18} />}
            {isBuilding ? '正在编译卷宗...' : '提取报告'}
          </button>
          <button className="p-2 border-4 border-gray-900 bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><Printer size={20} /></button>
        </div>
      </div>

      {!isDecrypting && (
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="max-w-6xl mx-auto px-4 pt-12">
            <div className="flex items-center gap-3 mb-16 text-green-600 bg-green-50 inline-flex px-4 py-2 border-2 border-green-600 border-dashed">
              <Unlock size={18} />
              <span className="font-black text-xs uppercase tracking-widest italic animate-pulse">Access Granted: Full Intelligence Decrypted</span>
            </div>
            {renderTemplate()}
            <div className="mt-40 border-t-[16px] border-gray-900 pt-20 text-center pb-20 opacity-50 italic uppercase tracking-widest text-[10px]">End of Intelligence Briefing // (c) 2025 Enterprise AI Workstation</div>
          </div>
        </div>
      )}

      {isDecrypting && (
        <div className="h-[80vh] flex flex-col items-center justify-center">
          <Lock size={120} className="text-gray-900 animate-bounce mb-8" />
          <p className="font-black uppercase text-sm tracking-[1em] italic animate-pulse text-gray-400">Decrypting Intelligence...</p>
        </div>
      )}
    </div>
  );
};

export default ReportViewPage;
