import React, { useState, useCallback } from 'react';
import { Upload, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { syncUtils } from '../../utils/syncUtils';
import { syncService } from '../../services/syncService';

export const SyncPortal: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'ready' | 'syncing' | 'success' | 'error'>('idle');
  const [packageData, setPackageData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.eap') || file.type === 'application/octet-stream')) {
      await processFile(file);
    } else {
      setStatus('error');
      setErrorMessage('无效的文件格式。请上传 .eap 数据包。');
    }
  };

  const processFile = async (file: File) => {
    setStatus('scanning');
    try {
      // 模拟 X 光扫描效果延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const unpacked = await syncUtils.unpack(file as any);
      setPackageData(unpacked);
      setStatus('ready');
    } catch (error) {
      console.error('解包失败:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '解析文件失败');
    }
  };

  const handleSync = async () => {
    if (!packageData) return;
    
    setStatus('syncing');
    try {
      const results = await syncService.importData(packageData.payload);
      console.log('同步结果:', results);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage('同步到数据库时发生错误');
    }
  };

  return (
    <div className="p-8 bg-slate-900 border border-slate-700 rounded-2xl relative overflow-hidden">
      {/* 扫描线动画 */}
      {status === 'scanning' && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="h-[2px] w-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan-move"></div>
        </div>
      )}

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative z-10 border-2 border-dashed rounded-xl p-12 flex flex-col items-center transition-all ${
          isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-800/50'
        }`}
      >
        {status === 'idle' && (
          <>
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
              <Upload className="text-slate-400 w-8 h-8" />
            </div>
            <p className="text-white font-medium mb-2">数据同步传送门</p>
            <p className="text-slate-400 text-sm text-center">拖入 .eap 胶囊文件进行对接</p>
          </>
        )}

        {status === 'scanning' && (
          <>
            <div className="w-16 h-16 rounded-full bg-cyan-900/30 flex items-center justify-center mb-4 border border-cyan-500/50">
              <ShieldCheck className="text-cyan-400 w-8 h-8 animate-pulse" />
            </div>
            <p className="text-cyan-400 font-medium">正在解析 AI 脉络...</p>
            <p className="text-slate-400 text-sm">正在验证 SHA-256 数据完整性</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <CheckCircle2 className="text-green-400 w-16 h-16 mb-4" />
            <p className="text-white font-medium mb-2">对接就绪</p>
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg mb-6 text-sm text-slate-300">
              包含 {packageData.metadata.recordCount} 条记录 | 导出时间: {new Date(packageData.metadata.exportTimestamp).toLocaleString()}
            </div>
            <button
              onClick={handleSync}
              className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-colors"
            >
              开始融合数据
            </button>
          </>
        )}

        {status === 'syncing' && (
          <>
            <Loader2 className="text-blue-400 w-16 h-16 mb-4 animate-spin" />
            <p className="text-blue-400 font-medium">正在融合...</p>
            <p className="text-slate-400 text-sm">正在写入本地数据库并处理冲突</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4 border border-green-500">
              <CheckCircle2 className="text-green-400 w-8 h-8" />
            </div>
            <p className="text-green-400 font-medium mb-2">同步完成</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              继续同步其他数据包
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="text-red-400 w-16 h-16 mb-4" />
            <p className="text-red-400 font-medium mb-2">对接失败</p>
            <p className="text-slate-400 text-sm mb-6">{errorMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2 bg-slate-700 text-white rounded-full text-sm"
            >
              重试
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes scan-move {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-move {
          position: absolute;
          animation: scan-move 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
