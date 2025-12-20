import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { importExportApi, ImportResult } from '../../services/import-export.service';
import { Download, Upload, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';

const ImportExportPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);

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
      link.setAttribute('download', `企业数据导出_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  });

  // 导入数据
  const importMutation = useMutation({
    mutationFn: (file: File) => importExportApi.importEnterprises(file),
    onSuccess: (result) => {
      setImportResult(result.data);
      setShowResult(true);
      setSelectedFile(null);
    },
    onError: (error) => {
      console.error('导入失败:', error);
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
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleDownloadTemplate = () => {
    if (importTemplate) {
      // 创建CSV模板内容
      const headers = importTemplate.fields.map(field => field.name).join(',');
      const sampleRow = importTemplate.sampleData[0] 
        ? Object.values(importTemplate.sampleData[0]).join(',')
        : '';
      
      const csvContent = `${headers}\n${sampleRow}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '企业数据导入模板.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
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
            <h2 className="text-lg font-semibold">数据导出</h2>
          </div>
          <p className="text-gray-600 mb-4">导出企业数据到Excel文件</p>
          
          <NeubrutalButton 
            onClick={() => exportMutation.mutate(undefined)}
            disabled={exportMutation.isPending}
            className="w-full"
          >
            {exportMutation.isPending ? (
              <>
                <span className="loading-spinner mr-2">⏳</span>
                导出中...
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
            <p className="text-sm text-blue-800">
              提示：导出的数据包含所有企业信息，支持按条件筛选后导出
            </p>
          </div>
        </NeubrutalCard>

        {/* 导入区域 */}
        <NeubrutalCard>
          <div className="flex items-center gap-2 mb-4">
            <Upload size={20} />
            <h2 className="text-lg font-semibold">数据导入</h2>
          </div>
          <p className="text-gray-600 mb-4">从CSV文件导入企业数据</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择CSV文件
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="file-upload"
                  className="flex-1 cursor-pointer"
                >
                  <NeubrutalButton variant="secondary" className="w-full">
                    {selectedFile ? selectedFile.name : '选择CSV文件'}
                  </NeubrutalButton>
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  已选择: {selectedFile.name}
                </p>
              )}
            </div>

            <NeubrutalButton 
              onClick={handleDownloadTemplate}
              disabled={isTemplateLoading}
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              下载导入模板
            </NeubrutalButton>

            <NeubrutalButton
              onClick={handleImportSubmit}
              disabled={!selectedFile || importMutation.isPending}
              variant={selectedFile && !importMutation.isPending ? "success" : "secondary"}
              className="w-full"
            >
              {importMutation.isPending ? (
                <>
                  <span className="loading-spinner mr-2">⏳</span>
                  导入中...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  开始导入
                </>
              )}
            </NeubrutalButton>
          </div>

          {showResult && importResult && (
            <div className="mt-4 p-4 rounded-lg border-2 border-gray-800">
              <h3 className="font-semibold mb-2">导入结果</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <span>成功: {importResult.success}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-600" />
                  <span>失败: {importResult.failed}</span>
                </div>
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-red-700 mb-1">错误详情:</p>
                  <ul className="text-xs text-red-600 max-h-32 overflow-y-auto">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="truncate">{error}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>... 还有 {importResult.errors.length - 5} 个错误</li>
                    )}
                  </ul>
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