import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Terminal, Globe, 
  CheckCircle2, Loader2, Link as LinkIcon, 
  ExternalLink, Fingerprint, Lock, ShieldAlert, X,
  FileText, Clipboard, ChevronLeft, ChevronRight, Minimize2,
  Table2, Download
} from 'lucide-react';
import axios from 'axios';

interface VeracityHUDProps {
  isOpen: boolean;
  onClose: () => void;
  enterpriseId?: number;
  enterpriseName?: string;
}

const FIELD_LABELS: Record<string, string> = {
  officialName: "公司全称",
  unifiedCode: "统一社会信用代码",
  legalRep: "法定代表人",
  registeredCapital: "注册资本",
  establishmentDate: "成立日期",
  companyType: "公司类型",
  listingStatus: "上市情况",
  mainBusiness: "主营业务",
  address: "注册地址",
  shareholder: "股东背景/隶属"
};

export const VeracityHUD: React.FC<VeracityHUDProps> = ({ isOpen, onClose, enterpriseId = 0, enterpriseName = '' }) => {
  const [status, setStatus] = useState<'idle' | 'hunting' | 'review' | 'locking' | 'success'>('idle');
  const [rawNames, setRawNames] = useState(enterpriseName || '');
  const [activeLog, setActiveLog] = useState<string[]>([]);
  const [trackedTaskIds, setTrackedTaskIds] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});

  // 轮询任务状态
  useEffect(() => {
    if (status !== 'hunting' || trackedTaskIds.length === 0) return;

    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 获取所有活跃任务
        const activeRes = await axios.get(`${import.meta.env.VITE_API_URL}/veracity/tasks/active`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const activeTasks = activeRes.data;
        const myActiveTasks = activeTasks.filter((t: any) => trackedTaskIds.includes(t.id));
        
        // 更新进度条
        const newProgress: Record<string, number> = {};
        myActiveTasks.forEach((t: any) => {
           newProgress[t.id] = t.progress;
           const logEntry = `[${t.targetName}] ${t.step} ... ${t.progress}%`;
           setActiveLog(prev => {
             // 简单的去重逻辑，避免刷屏
             if (prev.length > 0 && prev[prev.length - 1] === logEntry) return prev;
             return [...prev, logEntry].slice(-20); // 只保留最近20条
           });
        });
        setProgress(newProgress);

        if (myActiveTasks.length === 0) {
           // 所有任务都不在 active 列表中了，说明已全部完成 (或失败)
           // 获取最终结果
           const finalResults = [];
           for (const id of trackedTaskIds) {
             try {
               const res = await axios.get(`${import.meta.env.VITE_API_URL}/veracity/tasks/${id}`, {
                 headers: { Authorization: `Bearer ${token}` }
               });
               if (res.data.status === 'COMPLETED' && res.data.resultData) {
                 finalResults.push(res.data.resultData);
               } else if (res.data.status === 'FAILED') {
                 // 即使失败也记录一下
                 finalResults.push({
                   officialName: res.data.targetName,
                   source: 'FAILED',
                   mainBusiness: `任务失败: ${res.data.step}`
                 });
               }
             } catch (e) {
               console.error(`Failed to fetch result for task ${id}`, e);
             }
           }
           
           setResults(finalResults);
           setStatus('success');
           setActiveLog(prev => [...prev, '[SYSTEM] 批量情报作业已全部完成。']);
           setTrackedTaskIds([]); // 停止轮询
        }

      } catch (err) {
        console.error('Polling error', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [status, trackedTaskIds]);

  const startBatchHunt = async () => {
    const names = rawNames.split('\n').map(n => n.trim()).filter(n => n);
    if (names.length === 0) return;

    setStatus('hunting');
    setResults([]);
    setActiveLog(['[SYSTEM] 正在初始化批量深猎队列...', `[SYSTEM] 目标数量: ${names.length}`]);
    setTrackedTaskIds([]);
    setProgress({});
    
    try {
      const token = localStorage.getItem('token');
      // 调用新的批量接口
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/veracity/batch-hunt`, { names }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const tasks = res.data;
      const ids = tasks.map((t: any) => t.id);
      
      setTrackedTaskIds(ids);
      setActiveLog(prev => [...prev, '[SYSTEM] 任务已分发至云端计算节点，开始并行处理...']);
      
    } catch (error) {
      console.error('Batch hunt start failed:', error);
      setActiveLog(prev => [...prev, `[ERROR] 批量任务提交失败`]);
      setStatus('idle');
    }
  };

  const exportToCSV = () => {
    // 简单的 CSV 导出功能
    const headers = Object.keys(FIELD_LABELS).join(',');
    const rows = results.map(r => Object.keys(FIELD_LABELS).map(k => `"${r[k] || ''}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,\ufeff${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `veracity_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-950/90 backdrop-blur-2xl" onClick={onClose} />

      <motion.div
        layoutId="veracity-hud"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-6xl h-[85vh] bg-white border-[12px] border-gray-900 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="bg-gray-900 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-white">
            <ShieldCheck size={24} className="text-blue-400" />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold uppercase tracking-wide text-white leading-none">真值情报工场 // DEEP TRUTH HUD</h2>
              <span className="text-[10px] text-gray-400 font-mono mt-1">Google Search API + Gemini 1.5 Pro // BATCH MODE</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-black text-[10px] uppercase border-2 border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none transition-all"
            >
              <Minimize2 size={14} /> 后台运行
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* 左侧：控制台与日志 */}
          <div className="col-span-4 bg-gray-950 flex flex-col border-r border-gray-800">
             <div className="p-6 border-b border-gray-800 shrink-0">
               <label className="text-cyan-500 font-black text-xs uppercase mb-2 block tracking-widest">Target List (One per line)</label>
               <textarea 
                  disabled={status === 'hunting'}
                  value={rawNames} onChange={e => setRawNames(e.target.value)}
                  className="w-full h-32 bg-gray-900 text-white p-3 font-mono text-xs border border-gray-700 focus:border-cyan-500 outline-none resize-none"
                  placeholder="例如：&#10;腾讯科技（深圳）有限公司&#10;成都高新AI科技有限公司"
               />
               <div className="mt-4 flex gap-2">
                 <button 
                    disabled={status === 'hunting'}
                    onClick={startBatchHunt}
                    className={`flex-1 py-3 font-black text-xs uppercase tracking-widest border border-cyan-500 transition-all
                      ${status === 'hunting' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-500 hover:text-gray-900 shadow-[4px_4px_0_0_#06b6d4] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0'}
                    `}
                 >
                   {status === 'hunting' ? '正在执行...' : '启动批量深猎'}
                 </button>
                 {status === 'success' && (
                    <button onClick={() => { setStatus('idle'); setResults([]); setRawNames(''); setActiveLog([]); }} className="px-3 border border-gray-600 text-gray-400 hover:text-white">
                       重置
                    </button>
                 )}
               </div>
             </div>
             
             <div className="flex-1 p-6 overflow-y-auto font-mono text-[10px] space-y-2 bg-black/50 inner-shadow">
                <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">SYSTEM_OUTPUT_STREAM {'>>'}</div>
                {activeLog.map((log, i) => (
                  <div key={i} className="text-cyan-400/80 break-all border-l-2 border-cyan-900 pl-2">
                    <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))}
                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
             </div>
          </div>

          {/* 右侧：结果展示 */}
          <div className="col-span-8 bg-gray-50 flex flex-col relative overflow-hidden">
            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 <ShieldCheck size={300} />
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-8">
               {status === 'success' && results.length > 0 ? (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-2xl font-black text-gray-900 uppercase">Intelligence Report</h3>
                       <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 text-xs font-bold shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:shadow-[2px_2px_0_0_black] transition-all">
                          <Download size={14} /> 导出 CSV
                       </button>
                    </div>

                    <div className="grid gap-6">
                       {results.map((item, idx) => (
                          <div key={idx} className="bg-white border-2 border-gray-900 p-0 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] transition-shadow">
                             {/* Card Header */}
                             <div className="bg-gray-100 border-b-2 border-gray-900 p-4 flex justify-between items-start">
                                <div>
                                   <h4 className="font-bold text-lg text-gray-900">{item.officialName}</h4>
                                   <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 font-mono border border-blue-200">
                                        USCC: {item.unifiedCode}
                                      </span>
                                      {item.confidence && (
                                        <div className="flex items-center gap-1">
                                           <div className={`w-2 h-2 rounded-full ${item.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                           <span className="text-[10px] font-bold text-gray-500">
                                              可信度: {item.confidence}%
                                           </span>
                                        </div>
                                      )}
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="text-[10px] font-black uppercase text-gray-400">DATA SOURCE</div>
                                   <div className="text-xs font-bold text-blue-600">{item.source}</div>
                                </div>
                             </div>
                             
                             {/* Card Body */}
                             <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8">
                                <div className="space-y-4">
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-400 uppercase block">法定代表人</label>
                                      <div className="font-medium text-sm text-gray-900">{item.legalRep}</div>
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-400 uppercase block">注册资本</label>
                                      <div className="font-medium text-sm text-gray-900">{item.registeredCapital}</div>
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-400 uppercase block">成立日期</label>
                                      <div className="font-medium text-sm text-gray-900">{item.establishmentDate}</div>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-400 uppercase block">注册地址</label>
                                      <div className="font-medium text-sm text-gray-900 break-words">{item.address}</div>
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-bold text-gray-400 uppercase block">主营业务 (AI 提取)</label>
                                      <div className="font-medium text-sm text-gray-900 line-clamp-3 text-gray-600">{item.mainBusiness}</div>
                                   </div>
                                </div>
                             </div>

                             {/* Card Footer (Evidence) */}
                             {item.evidenceLinks && item.evidenceLinks.length > 0 && (
                                <div className="bg-blue-50/50 p-3 border-t border-gray-100 flex flex-wrap gap-3">
                                   <span className="text-[10px] font-bold text-blue-400 uppercase self-center flex items-center gap-1">
                                      <LinkIcon size={10} /> 证据溯源:
                                   </span>
                                   {item.evidenceLinks.map((link: any, i: number) => (
                                      <a 
                                        key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                        className="text-[10px] text-gray-500 hover:text-blue-600 hover:underline truncate max-w-[200px]"
                                      >
                                         [{i+1}] {link.url}
                                      </a>
                                   ))}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    {status === 'hunting' ? (
                       <>
                         <Loader2 size={48} className="animate-spin text-cyan-500" />
                         <p className="font-mono text-xs uppercase tracking-widest">正在进行全球数据检索与 AI 交叉验证...</p>
                       </>
                    ) : (
                       <>
                         <Table2 size={48} />
                         <p className="font-mono text-xs uppercase tracking-widest">请在左侧输入企业名单启动作业</p>
                       </>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};