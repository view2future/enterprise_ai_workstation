import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { importExportApi, ImportResult } from '../../services/import-export.service';
import { Download, Upload, FileText, AlertCircle, CheckCircle, Info, Shield, Share2, X } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';
import SyncSection from './SyncSection';

const ImportExportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'sync'>('standard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // 获取导入模板
  const { data: importTemplate, isLoading: isTemplateLoading } = useQuery({
    queryKey: ['import-template'],
    queryFn: () => importExportApi.getImportTemplate().then(res => res.data),
    refetchOnWindowFocus: false,
  });

  // 导出数据
  const exportMutation = useMutation({
    mutationFn: (filters?: any) => importExportApi.exportEnterprises(filters),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `企业数据导出_${new Date().toLocaleDateString('zh-CN')}.xlsx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('导出失败:', error);
      alert('导出失败，请确保后端服务正常运行');
    }
  });

  // 导入数据
  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      setIsScanning(true);
      for(let i=0; i<=100; i+=25) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      return importExportApi.importEnterprises(file);
    },
    onSuccess: (result) => {
      setImportResult(result.data);
      setShowResult(true);
      setSelectedFile(null);
      setIsScanning(false);
      setImportProgress(0);
    },
    onError: (error) => {
      console.error('导入失败:', error);
      setIsScanning(false);
      alert('导入失败，请检查文件格式');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setImportResult(null);
        setShowResult(false);
      } else {
        alert('请上传CSV格式的文件');
      }
    }
  };

  const handleImportSubmit = () => {
    if (!selectedFile) {
      alert('请先选择一个 CSV 文件');
      return;
    }
    importMutation.mutate(selectedFile);
  };

  const handleDownloadTemplate = () => {
    if (!importTemplate) {
      alert('导入模板尚未加载完成，请稍后');
      return;
    }
    const headers = importTemplate.fields.map(field => field.name).join(',');
    const sampleRow = importTemplate.sampleData[0] 
      ? Object.values(importTemplate.sampleData[0]).join(',')
      : '';
    
    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '企业数据导入模板.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">数据交换中心</h1>
          <p className="font-bold opacity-70">INTELLIGENT DATA EXCHANGE & ALIGNMENT</p>
        </div>
        
        <div className="flex bg-gray-200 border-4 border-gray-800 p-1">
          <button 
            onClick={() => setActiveTab('standard')}
            className={`px-4 py-2 text-xs font-black uppercase transition-all ${activeTab === 'standard' ? 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'text-gray-500 hover:text-gray-800'}`}
          >
            标准传输
          </button>
          <button 
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2 text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'sync' ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5 border-2 border-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Share2 size={14} /> 离线同步
          </button>
        </div>
      </div>

      {activeTab === 'sync' ? (
        <SyncSection />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NeubrutalCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 border-4 border-gray-800"><Download size={24} className="text-blue-600" /></div>
              <div>
                <h2 className="text-xl font-black uppercase">战略资产导出</h2>
                <p className="text-[10px] font-bold text-gray-500">EXCEL REPORT GENERATION</p>
              </div>
            </div>
            <p className="mb-8 text-sm font-bold leading-relaxed">一键生成包含全量 30+ 扩展字段的深度决策报表，自动对齐物理列名与业务同义词。</p>
            
            <NeubrutalButton 
              onClick={() => exportMutation.mutate(undefined)}
              disabled={exportMutation.isPending}
              className="w-full py-4 text-lg"
            >
              {exportMutation.isPending ? '封装数据流...' : '发起全量导出任务'}
            </NeubrutalButton>
            
            <div className="mt-6 p-4 bg-blue-50 border-4 border-dashed border-blue-200 flex items-start gap-3">
              <Info size={18} className="text-blue-800 flex-shrink-0" />
              <p className="text-xs text-blue-800 font-bold leading-tight">导出的资产包已包含线索入库时间分布及文心大模型应用矩阵。</p>
            </div>
          </NeubrutalCard>

          <NeubrutalCard className={isScanning ? 'animate-pulse' : ''}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 border-4 border-gray-800"><Upload size={24} className="text-green-600" /></div>
              <div>
                <h2 className="text-xl font-black uppercase">智能治理工作台</h2>
                <p className="text-[10px] font-bold text-gray-500">SMART ALIGNMENT LAB</p>
              </div>
            </div>
            
            {!isScanning ? (
              <div className="space-y-6">
                <label htmlFor="file-upload" className="block">
                  <div className="border-4 border-dashed border-gray-300 p-8 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center group">
                    <FileText size={48} className="mx-auto text-gray-300 group-hover:text-blue-500 mb-4 transition-all" />
                    <span className="font-black text-sm uppercase block tracking-tighter">
                      {selectedFile ? selectedFile.name : '扫描并载入 CSV 数据源'}
                    </span>
                  </div>
                </label>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />

                <div className="grid grid-cols-2 gap-4">
                  <NeubrutalButton onClick={handleDownloadTemplate} variant="secondary" size="md">下载协议模板</NeubrutalButton>
                  <NeubrutalButton onClick={handleImportSubmit} disabled={!selectedFile} variant="success" size="md">启动智能治理</NeubrutalButton>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-6 scanline-effect bg-gray-900 border-4 border-gray-800 rounded-none relative overflow-hidden">
                <div className="relative z-10 p-4">
                  <div className="loading-spinner text-6xl mx-auto mb-6">⚙️</div>
                  <p className="font-black text-2xl uppercase text-white tracking-tighter">正在重组数据 DNA</p>
                  <p className="text-blue-400 font-bold text-[10px] uppercase mb-8">RECONSTRUCTING ASSET STRUCTURE...</p>
                  <div className="w-full bg-gray-800 border-2 border-blue-500 h-4 p-0.5">
                    <div className="bg-blue-500 h-full" style={{ width: `${importProgress}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </NeubrutalCard>
        </div>
      )}

      {showResult && importResult && (
        <NeubrutalCard className="!bg-gray-50 !border-green-600 border-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black uppercase flex items-center gap-2">
              <CheckCircle className="text-green-600" /> 治理任务已完成
            </h3>
            <button onClick={() => setShowResult(false)}><X /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border-4 border-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-4xl font-black text-green-600">{importResult.success}</p>
              <p className="text-[10px] font-black uppercase mt-2">资产成功入库</p>
            </div>
            <div className="p-6 bg-white border-4 border-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <p className="text-4xl font-black text-red-600">{importResult.failed}</p>
              <p className="text-[10px] font-black uppercase mt-2">拦截异常数据</p>
            </div>
            <div className="p-6 bg-gray-800 text-white border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
              <p className="text-xs font-bold leading-tight">系统已自动应用 256 位加密校验，确保区域产业数据不可篡改。</p>
            </div>
          </div>
        </NeubrutalCard>
      )}

      {/* 说明区域 */} 
      {activeTab === 'standard' && importTemplate && (
        <NeubrutalCard>
          <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-gray-100 pb-2">导入协议规范</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-4 divide-gray-800">
              <thead className="bg-gray-100">
                <tr className="divide-x-4 divide-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase">协议字段</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase">约束类型</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase text-center">强制项</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase">逻辑定义</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-gray-100 font-bold text-sm">
                {importTemplate.fields.slice(0, 8).map((field, index) => (
                  <tr key={index} className="divide-x-2 divide-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-black text-blue-600">{field.name}</td>
                    <td className="px-6 py-4 font-mono text-xs uppercase text-gray-500">{field.type}</td>
                    <td className="px-6 py-4 text-center">
                      {field.required ? <span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] rounded">REQUIRED</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs opacity-80">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeubrutalCard>
      )}
    </div>
  );
};

export default ImportExportPage;
