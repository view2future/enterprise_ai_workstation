
import React, { useState, useEffect } from 'react';
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
  Share2
} from 'lucide-react';
import { NeubrutalButton, NeubrutalCard } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../../utils/SoundUtility';

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
  
  // 下钻状态
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      // 模拟解密过程
      const timer = setTimeout(() => {
        setIsDecrypting(false);
        soundEngine.playSuccess();
        setTimeout(() => setShowContent(true), 500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, report]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = () => {
    if (report) {
      soundEngine.playTick();
      reportsApi.downloadReport(report.id, report.title);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="loading-spinner text-8xl mb-4 opacity-20">⚙️</div>
        <p className="font-black animate-pulse text-2xl tracking-tighter italic">正在从机密服务器提取档案...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-10 text-center">
        <NeubrutalCard className="max-w-md mx-auto border-red-500 !shadow-[10px_10px_0px_0px_rgba(239,68,68,1)]">
          <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-3xl font-black uppercase mb-4 italic tracking-tighter">访问拒绝 / 档案损坏</h2>
          <p className="text-gray-500 mb-8 font-bold leading-relaxed">无法找到指定编号的战术简报。可能该文件已被物理销毁、过期或当前账户权限不足以解密此级别的情报。</p>
          <NeubrutalButton onClick={() => navigate('/reports')} className="w-full">返回情报中心</NeubrutalButton>
        </NeubrutalCard>
      </div>
    );
  }

  // 渲染对应的模板
  const renderTemplate = () => {
    const props = { report, onDrillDown: handleDrillDown };
    switch (report.type) {
      case 'WEEKLY':
        return <WeeklyTemplate {...props} />;
      case 'MONTHLY':
        return <MonthlyTemplate {...props} />;
      case 'QUARTERLY':
        return <QuarterlyTemplate {...props} />;
      case 'YEARLY':
        return <YearlyTemplate {...props} />;
      default:
        return <MonthlyTemplate {...props} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* 滚动进度条 */}
      <div 
        className="fixed top-0 left-0 h-2 bg-blue-600 z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <IntelDrillDownDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        data={drillDownData} 
      />

      {/* 顶部工具栏 (HUD) */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-gray-900 p-4 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/reports')}
            className="p-3 border-4 border-gray-900 bg-white hover:bg-yellow-400 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase leading-tight italic">Top Secret</span>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{report.title}</h1>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
              ID: {report.id} // SEC_LVL: 07 // TYPE: {report.type} // ISSUED: {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border-4 border-gray-900 bg-blue-600 text-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <Download size={18} /> 提取物理文档
          </button>
          <button className="p-2 border-4 border-gray-900 bg-white hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none">
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* 解密层 */}
      {isDecrypting && (
        <div className="h-[80vh] flex flex-col items-center justify-center">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
            <Lock size={120} className="relative z-10 text-gray-900 animate-bounce" />
          </div>
          <div className="w-80 h-6 bg-white border-4 border-gray-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out]" style={{ width: '100%' }}></div>
          </div>
          <p className="mt-8 font-black uppercase text-sm tracking-[1em] italic animate-pulse">Decrypting Intelligence...</p>
        </div>
      )}

      {/* 报告内容展示区 */}
      {!isDecrypting && (
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="max-w-6xl mx-auto px-4 pt-12">
            <div className="flex items-center gap-3 mb-16 text-green-600 bg-green-50 inline-flex px-4 py-2 border-2 border-green-600 border-dashed">
              <Unlock size={18} />
              <span className="font-black text-xs uppercase tracking-widest italic animate-pulse">Access Granted: Full Intelligence Decrypted</span>
            </div>
            
            {renderTemplate()}
            
            <div className="mt-40 border-t-[16px] border-gray-900 pt-20 text-center pb-20">
              <p className="text-sm font-black text-gray-400 uppercase tracking-[1.5em] mb-10">End of Intelligence Briefing</p>
              <div className="flex justify-center gap-8 opacity-20">
                <div className="w-16 h-16 border-8 border-gray-900"></div>
                <div className="w-16 h-16 border-8 border-gray-900 rounded-full"></div>
                <div className="w-16 h-16 border-8 border-gray-900 rotate-45"></div>
              </div>
              <p className="mt-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
                Processed by Neural Analyzer v7.4.2 // (c) 2025 Enterprise AI Workstation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 返回顶部按钮 */}
      {showContent && (
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-10 right-10 p-4 bg-yellow-400 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all z-[90] ${scrollProgress > 10 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <ArrowLeft size={24} className="rotate-90" />
        </button>
      )}
    </div>
  );
};

export default ReportViewPage;
