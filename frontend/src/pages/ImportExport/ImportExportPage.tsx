import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { importExportApi, ImportResult } from '../../services/import-export.service';
import { Download, Upload, FileText, AlertCircle, CheckCircle, Info, Shield } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';

const ImportExportPage: React.FC = () => {
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
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `企业数据导出_${new Date().toLocaleDateString('zh-CN')}.xlsx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert('导出成功');
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
      // 前端体验优化：模拟智能扫描和治理过程
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
    // 触发 Mutation，内部会处理 isScanning 状态
    importMutation.mutate(selectedFile);
  };

  const handleDownloadTemplate = () => {
    if (!importTemplate) {
      alert('导入模板尚未加载完成，请稍后');
      return;
    }
    // 创建 CSV 模板并下载
    const headers = importTemplate.fields.map(field => field.name).join(',');
    const sampleRow = importTemplate.sampleData[0] 
      ? Object.values(importTemplate.sampleData[0]).join(',')
      : '';
    
    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // 增加 BOM 防止中文乱码
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">数据导入导出</h1>
        <p className="text-gray-600">管理企业数据的导入和导出</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 导出区域 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-4">
            <Download size={20} />
            <h2 className="text-lg font-bold">战略决策导出</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm font-bold">导出包含全量扩展字段的专业 Excel 报表。</p>
          
          <NeubrutalButton 
            onClick={() => exportMutation.mutate(undefined)}
            disabled={exportMutation.isPending}
            className="w-full py-3"
          >
            {exportMutation.isPending ? (
              <>
                <span className="loading-spinner mr-2">⏳</span>
                正在封装数据...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                导出所有企业数据
              </>
            )}
          </NeubrutalButton>
          
          <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg flex items-start gap-2">
            <Info size={16} className="text-blue-800 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 font-bold">
              提示：导出的报表已针对“辅助决策”优化，包含 BigInt 自动转换和中文表头映射。
            </p>
          </div>
        </NeubrutalCard>

        {/* 导入区域 */}
        <NeubrutalCard className={isScanning ? 'animate-pulse' : ''}>
          <div className="flex items-center gap-2 mb-4">
            <Upload size={20} className={isScanning ? 'animate-bounce' : ''} />
            <h2 className="text-lg font-bold">智能导入工作台</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm font-bold">自动识别表头同义词，并智能补全缺失的企业画像。</p>
          
          <div className="space-y-4">
            {!isScanning ? (
              <>
                <div className="flex items-center gap-2">
                  <label htmlFor="file-upload" className="flex-1">
                    <div className="border-4 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-800 transition-colors cursor-pointer text-center group">
                      <FileText size={32} className="mx-auto text-gray-400 group-hover:text-gray-800 mb-2" />
                      <span className="font-bold text-gray-600 group-hover:text-gray-800">
                        {selectedFile ? selectedFile.name : '点击选择 CSV 文件'}
                      </span>
                    </div>
                  </label>
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <NeubrutalButton onClick={handleDownloadTemplate} variant="secondary" size="sm">
                    下载标准模板
                  </NeubrutalButton>
                  <NeubrutalButton
                    onClick={handleImportSubmit}
                    disabled={!selectedFile}
                    variant="success"
                    size="sm"
                  >
                    开始智能导入
                  </NeubrutalButton>
                </div>
              </>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="loading-spinner text-5xl mx-auto">⚙️</div>
                <p className="font-black text-xl uppercase">正在进行数据治理...</p>
                <div className="w-full bg-gray-200 border-4 border-gray-800 h-8 rounded-full overflow-hidden p-1">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
                </div>
                <p className="text-xs font-bold text-gray-500">正在分析表头并执行 20+ 个维度的字段对齐...</p>
              </div>
            )}
          </div>

          {showResult && importResult && (
            <div className="mt-6 p-4 rounded-xl border-4 border-gray-800 bg-gray-50">
              <h3 className="font-black mb-4 flex items-center gap-2 uppercase">
                <Shield size={18} className="text-green-600" /> 导入作业报告
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-green-100 border-2 border-green-800 rounded-lg text-center">
                  <p className="text-2xl font-black text-green-900">{importResult.success}</p>
                  <p className="text-xs font-bold uppercase">入库成功</p>
                </div>
                <div className="p-3 bg-red-100 border-2 border-red-800 rounded-lg text-center">
                  <p className="text-2xl font-black text-red-900">{importResult.failed}</p>
                  <p className="text-xs font-bold uppercase">失败条数</p>
                </div>
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-black text-red-800 uppercase flex items-center gap-1">
                    <AlertCircle size={14} /> 治理异常日志
                  </p>
                  <div className="bg-white border-2 border-gray-800 p-2 rounded-lg max-h-40 overflow-y-auto font-mono text-[10px] leading-tight text-red-600">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="py-1 border-b border-gray-100 last:border-0">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </NeubrutalCard>
      </div>

      {/* 导入模板说明 */}
      {importTemplate && (
        <NeubrutalCard>
          <h2 className="text-lg font-semibold mb-4">导入模板说明</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必填</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {importTemplate.fields.map((field, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{field.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.required ? '是' : '否'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {importTemplate.sampleData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">示例数据</h3>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                {JSON.stringify(importTemplate.sampleData[0], null, 2)}
              </pre>
            </div>
          )}
        </NeubrutalCard>
      )}
    </div>
  );
};

export default ImportExportPage;