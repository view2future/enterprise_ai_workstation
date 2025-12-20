import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// 为了演示，我们先使用基础的 React 状态，用户安装 framer-motion 后可启用动画效果
import { Download, Database, Loader2 } from 'lucide-react';
import { syncService } from '../../services/syncService';
import { syncUtils } from '../../utils/syncUtils';

export const DataCapsule: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(10);
    
    try {
      // 1. 获取数据
      setProgress(30);
      const { payload } = await syncService.fetchExportData();
      
      // 2. 打包加密
      setProgress(60);
      const blob = await syncUtils.pack(payload);
      
      // 3. 触发下载
      setProgress(90);
      const filename = `EAW_Data_${new Date().toISOString().split('T')[0]}.eap`;
      syncUtils.downloadEap(blob, filename);
      
      setProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('导出失败:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-900 border border-slate-700 rounded-2xl relative overflow-hidden group">
      {/* 背景粒子装饰 (伪代码) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-blue-600/20 border-2 border-blue-500/50 mb-6 ${isExporting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}>
          <Database className="w-10 h-10 text-blue-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">生成数据胶囊</h3>
          <p className="text-gray-600 mb-6 text-sm font-bold">
            将当前所有企业数据及 AI 画像打包为加密的 .eap 同步包，用于离线协作与多端数据对齐。
          </p>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
            isExporting 
            ? 'bg-slate-700 text-slate-300' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]'
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在提取数据 {progress}%
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              立即打包导出
            </>
          )}
        </button>
      </div>

      {/* 进度条动画 */}
      {isExporting && (
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      )}
    </div>
  );
};
