import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, FileText, AlertCircle, CheckCircle, XCircle, Clock, Info } from 'lucide-react';
import { mockEnterprises } from '../utils/mockData';

const ImportExportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [importJobs, setImportJobs] = useState([
    {
      id: 1,
      fileName: '企业数据_202311.xlsx',
      status: 'completed',
      totalRows: 500,
      processedRows: 500,
      successRows: 480,
      errorRows: 20,
      errorMessage: null,
      createdAt: '2023-11-15T10:30:00Z',
      completedAt: '2023-11-15T10:35:00Z',
    },
    {
      id: 2,
      fileName: 'AI应用数据.csv',
      status: 'failed',
      totalRows: 200,
      processedRows: 150,
      successRows: 140,
      errorRows: 10,
      errorMessage: '数据格式错误',
      createdAt: '2023-11-10T09:15:00Z',
      completedAt: '2023-11-10T09:20:00Z',
    },
    {
      id: 3,
      fileName: '融资信息.xlsx',
      status: 'processing',
      totalRows: 300,
      processedRows: 180,
      successRows: 180,
      errorRows: 0,
      errorMessage: null,
      createdAt: '2023-11-20T14:20:00Z',
      completedAt: null,
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
          // Add a new import job to the list
          const newJob = {
            id: importJobs.length + 1,
            fileName: selectedFile.name,
            status: 'completed',
            totalRows: 250,
            processedRows: 250,
            successRows: 240,
            errorRows: 10,
            errorMessage: null,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
          };
          setImportJobs([newJob, ...importJobs]);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownloadTemplate = () => {
    alert('下载模板功能将在实际实现中提供下载链接');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">数据导入导出</h1>
        <p className="text-gray-600 dark:text-gray-400">批量导入企业数据或导出当前数据</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {['import', 'export', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab === 'import' && '数据导入'}
              {tab === 'export' && '数据导出'}
              {tab === 'history' && '导入历史'}
            </button>
          ))}
        </nav>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">数据导入</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              通过Excel或CSV文件批量导入企业数据。支持多种字段格式，系统会自动匹配和验证数据。
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                上传文件
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">点击上传</span> 或拖拽文件到此处
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      支持 Excel (.xlsx, .xls) 和 CSV (.csv) 文件
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm truncate">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({formatFileSize(selectedFile.size)})</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                下载模板
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadStatus === 'uploading'}
                className={`flex items-center px-4 py-2 text-white rounded-lg ${
                  !selectedFile || uploadStatus === 'uploading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Upload className="h-4 w-4 mr-2" />
                开始上传
              </button>
            </div>
            
            {/* Upload Progress */}
            {uploadStatus === 'uploading' && (
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">上传进度</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Upload Status Message */}
            {uploadStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-200">上传成功!</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    文件已成功上传，后台处理正在进行中。
                  </p>
                </div>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-200">上传失败!</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    文件上传失败，请检查文件格式或稍后重试。
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">导入配置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  字段映射
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  将文件列映射到系统字段
                </p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">文件列</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">系统字段</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-4 py-2 text-sm font-medium dark:text-white">A</td>
                        <td className="px-4 py-2">
                          <select className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>企业名称</option>
                            <option>法定代表人</option>
                            <option>注册资本</option>
                            <option>注册日期</option>
                            <option>行业类型</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm font-medium dark:text-white">B</td>
                        <td className="px-4 py-2">
                          <select className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>法定代表人</option>
                            <option>企业名称</option>
                            <option>注册资本</option>
                            <option>注册日期</option>
                            <option>行业类型</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm font-medium dark:text-white">C</td>
                        <td className="px-4 py-2">
                          <select className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>注册资本</option>
                            <option>企业名称</option>
                            <option>法定代表人</option>
                            <option>注册日期</option>
                            <option>行业类型</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  导入选项
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="updateExisting"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="updateExisting" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      更新已存在的记录
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendNotifications"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      导入完成后发送通知
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">数据导出</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">导出选项</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    数据范围
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>当前筛选结果</option>
                    <option>所有企业</option>
                    <option>已选企业 (0)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    导出格式
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="excel"
                        name="format"
                        value="excel"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="excel" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Excel (.xlsx)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="csv"
                        name="format"
                        value="csv"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="csv" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        CSV (.csv)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    包含字段
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="space-y-2">
                      {[
                        "企业名称", "统一社会信用代码", "法定代表人", 
                        "注册资本", "注册日期", "经营状态", 
                        "行业类型", "子行业", "所在区域", 
                        "所在城市", "员工数量", "年营收", 
                        "联系人", "联系电话", "联系邮箱", 
                        "备注", "动态属性"
                      ].map((field, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`field-${index}`}
                            defaultChecked
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`field-${index}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            {field}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">预览</h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">企业名称</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">行业类型</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">年营收</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockEnterprises.slice(0, 5).map(enterprise => (
                      <tr key={enterprise.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{enterprise.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{enterprise.industryType}</td>
                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{enterprise.annualRevenue}万</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <button className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <Download className="h-5 w-5 mr-2" />
                  导出数据 ({mockEnterprises.length} 条记录)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">导入历史</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">文件名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">总行数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">成功/失败</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">开始时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {importJobs.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{job.fileName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {job.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                        {job.status === 'failed' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                        {job.status === 'processing' && <Clock className="h-5 w-5 text-yellow-500 mr-2" />}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          job.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {job.status === 'completed' ? '已完成' : job.status === 'failed' ? '失败' : '处理中'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {job.totalRows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <span className="text-green-600 dark:text-green-400">{job.successRows}</span> / 
                        <span className="text-red-600 dark:text-red-400"> {job.errorRows}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(job.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        详情
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExportPage;