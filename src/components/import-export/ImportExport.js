/**
 * 数据导入导出组件
 * 实现数据导入、导出功能
 */

const React = require('react');

const ImportExport = () => {
  const [activeTab, setActiveTab] = React.useState('import'); // 'import' or 'export'
  const [importProgress, setImportProgress] = React.useState(null);
  const [exportProgress, setExportProgress] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 处理文件上传
  const handleImport = async () => {
    if (!selectedFile) {
      alert('请先选择文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setImportProgress({ status: 'uploading', message: '正在上传文件...', percentage: 0 });

    try {
      // 模拟上传过程
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 模拟延迟
        setImportProgress({
          status: 'uploading',
          message: '正在上传文件...',
          percentage: i * 10
        });
      }

      // 假设上传成功，开始处理
      setImportProgress({ status: 'processing', message: '正在处理数据...', percentage: 50 });

      // 模拟处理过程
      for (let i = 5; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
        setImportProgress({
          status: 'processing',
          message: '正在处理数据...',
          percentage: 50 + (i * 5)
        });
      }

      setImportProgress({
        status: 'success',
        message: '数据导入成功!',
        percentage: 100,
        results: { imported: 500, duplicates: 12, errors: 3 }
      });

      // 重置状态
      setTimeout(() => {
        setImportProgress(null);
        setSelectedFile(null);
        document.getElementById('import-file-input').value = '';
      }, 3000);
    } catch (error) {
      setImportProgress({
        status: 'error',
        message: `导入失败: ${error.message}`,
        percentage: 0
      });
    }
  };

  // 处理数据导出
  const handleExport = async (format = 'xlsx', selectedEnterprises = []) => {
    setExportProgress({ status: 'preparing', message: '正在准备导出数据...', percentage: 0 });

    try {
      // 模拟准备过程
      for (let i = 0; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 模拟延迟
        setExportProgress({
          status: 'preparing',
          message: '正在准备导出数据...',
          percentage: i * 10
        });
      }

      // 模拟生成文件过程
      setExportProgress({ status: 'generating', message: `正在生成${format}文件...`, percentage: 50 });

      for (let i = 5; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 模拟延迟
        setExportProgress({
          status: 'generating',
          message: `正在生成${format}文件...`,
          percentage: 50 + (i * 5)
        });
      }

      setExportProgress({
        status: 'complete',
        message: '导出完成! 文件已下载.',
        percentage: 100
      });

      // 模拟文件下载
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = '#'; // 在实际实现中，这里会是API返回的文件URL
        a.download = `enterprise_data_${new Date().toISOString().slice(0, 10)}.${format}`;
        a.click();
        setExportProgress(null);
      }, 1000);
    } catch (error) {
      setExportProgress({
        status: 'error',
        message: `导出失败: ${error.message}`,
        percentage: 0
      });
    }
  };

  return (
    <div className="import-export p-6">
      <h1 className="text-3xl font-bold mb-6">数据导入导出</h1>
      
      {/* Tab切换 */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`py-3 px-6 font-medium text-lg ${
            activeTab === 'import' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('import')}
        >
          <i className="fas fa-file-import mr-2"></i>数据导入
        </button>
        <button
          className={`py-3 px-6 font-medium text-lg ${
            activeTab === 'export' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('export')}
        >
          <i className="fas fa-file-export mr-2"></i>数据导出
        </button>
      </div>

      {/* 导入功能 */}
      {activeTab === 'import' && (
        <div className="import-section">
          <div className="bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card mb-6">
            <h2 className="text-xl font-bold mb-4">批量导入企业数据</h2>
            
            <div className="mb-6">
              <p className="mb-3">请按照以下模板格式准备数据：</p>
              <div className="flex space-x-4">
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg neubrutal-button"
                  onClick={() => {
                    // 模拟下载模板
                    alert('正在下载导入模板...');
                  }}
                >
                  <i className="fas fa-download mr-2"></i>下载Excel模板
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg neubrutal-button"
                  onClick={() => {
                    // 显示字段映射说明
                    alert('字段映射说明：企业名称、飞桨_文心、线索入库时间等，请参考PRD文档');
                  }}
                >
                  <i className="fas fa-info-circle mr-2"></i>字段映射说明
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                选择Excel/CSV文件
              </label>
              <div className="flex items-center">
                <input 
                  type="file" 
                  id="import-file-input"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {selectedFile && (
                <p className="mt-2 text-gray-600">已选择: {selectedFile.name}</p>
              )}
            </div>
            
            <button
              onClick={handleImport}
              disabled={!selectedFile}
              className={`px-6 py-3 rounded-lg neubrutal-button ${
                selectedFile ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-upload mr-2"></i>开始导入
            </button>
          </div>

          {/* 导入进度显示 */}
          {importProgress && (
            <div className="bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">
                  {importProgress.status === 'error' ? (
                    <span className="text-red-600"><i className="fas fa-exclamation-triangle mr-2"></i>{importProgress.message}</span>
                  ) : importProgress.status === 'success' ? (
                    <span className="text-green-600"><i className="fas fa-check-circle mr-2"></i>{importProgress.message}</span>
                  ) : (
                    <span><i className="fas fa-sync animate-spin mr-2"></i>{importProgress.message}</span>
                  )}
                </h3>
                <span className="text-gray-500">{importProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    importProgress.status === 'error' ? 'bg-red-500' : 
                    importProgress.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} 
                  style={{ width: `${importProgress.percentage}%` }}
                ></div>
              </div>
              
              {importProgress.results && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p>导入结果: 成功 {importProgress.results.imported} 条, 重复 {importProgress.results.duplicates} 条, 错误 {importProgress.results.errors} 条</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 导出功能 */}
      {activeTab === 'export' && (
        <div className="export-section">
          <div className="bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card mb-6">
            <h2 className="text-xl font-bold mb-4">导出企业数据</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  导出格式
                </label>
                <div className="flex space-x-4">
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg neubrutal-button"
                    onClick={() => handleExport('xlsx')}
                  >
                    <i className="fas fa-file-excel mr-2"></i>Excel (.xlsx)
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg neubrutal-button"
                    onClick={() => handleExport('csv')}
                  >
                    <i className="fas fa-file-csv mr-2"></i>CSV (.csv)
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  预设模板
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm neubrutal-button">
                    基础信息模板
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm neubrutal-button">
                    AI应用模板
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm neubrutal-button">
                    融资信息模板
                  </button>
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm neubrutal-button">
                    运营活动模板
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                导出范围
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="exportScope" value="all" defaultChecked className="mr-2" />
                  <span>全部企业</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="exportScope" value="filtered" className="mr-2" />
                  <span>当前筛选结果</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="exportScope" value="selected" className="mr-2" />
                  <span>手动选择</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                自定义导出字段
              </label>
              <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    '企业名称', '飞桨_文心', '线索入库时间', '线索更新时间', 
                    '伙伴等级', '生态ai产品', '优先级', 'base', 
                    '注册资本', '参保人数', '企业背景', '行业', 
                    '任务方向', '联系人信息', '使用场景'
                  ].map((field) => (
                    <label key={field} className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 导出进度显示 */}
          {exportProgress && (
            <div className="bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">
                  {exportProgress.status === 'error' ? (
                    <span className="text-red-600"><i className="fas fa-exclamation-triangle mr-2"></i>{exportProgress.message}</span>
                  ) : exportProgress.status === 'complete' ? (
                    <span className="text-green-600"><i className="fas fa-check-circle mr-2"></i>{exportProgress.message}</span>
                  ) : (
                    <span><i className="fas fa-sync animate-spin mr-2"></i>{exportProgress.message}</span>
                  )}
                </h3>
                <span className="text-gray-500">{exportProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    exportProgress.status === 'error' ? 'bg-red-500' : 
                    exportProgress.status === 'complete' ? 'bg-green-500' : 'bg-blue-500'
                  }`} 
                  style={{ width: `${exportProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

module.exports = ImportExport;