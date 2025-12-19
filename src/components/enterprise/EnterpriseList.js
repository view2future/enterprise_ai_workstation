/**
 * 企业管理组件
 * 实现企业列表、详情、编辑等功能
 */

const React = require('react');

const EnterpriseList = ({ enterprises, loading, pagination, onPageChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const handleSearch = () => {
    onSearch(searchTerm);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="enterprise-list">
      {/* 搜索和筛选栏 */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md neubrutal-border">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="搜索企业名称、背景或场景..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border-2 border-gray-300 rounded-lg neubrutal-input"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg neubrutal-button"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          <button className="px-4 py-3 bg-green-500 text-white rounded-lg neubrutal-button whitespace-nowrap">
            <i className="fas fa-plus mr-2"></i>添加企业
          </button>
          <button className="px-4 py-3 bg-gray-500 text-white rounded-lg neubrutal-button whitespace-nowrap">
            <i className="fas fa-download mr-2"></i>导出
          </button>
        </div>
      </div>

      {/* 企业列表 */}
      <div className="grid grid-cols-1 gap-4">
        {enterprises.map((enterprise) => (
          <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
        ))}
      </div>

      {/* 分页 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className={`px-4 py-2 rounded-lg neubrutal-button ${
                pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              上一页
            </button>
            
            <span className="px-4 py-2">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded-lg neubrutal-button ${
                pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EnterpriseCard = ({ enterprise }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-800 p-4 neubrutal-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{enterprise.企业名称}</h3>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">优先级:</span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                enterprise.优先级 === 'P0' ? 'bg-red-100 text-red-800' :
                enterprise.优先级 === 'P1' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {enterprise.优先级}
              </span>
            </div>
            <div>
              <span className="font-medium">飞桨/文心:</span>
              <span className="ml-1 text-blue-600">{enterprise['飞桨_文心']}</span>
            </div>
            <div>
              <span className="font-medium">地区:</span>
              <span className="ml-1">{enterprise.base}</span>
            </div>
            <div>
              <span className="font-medium">参保人数:</span>
              <span className="ml-1">{enterprise.参保人数}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {enterprise.企业背景}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <button className="p-2 bg-blue-500 text-white rounded-lg neubrutal-button">
            <i className="fas fa-edit"></i>
          </button>
          <button className="p-2 bg-red-500 text-white rounded-lg neubrutal-button">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const EnterpriseDetail = ({ enterprise, onBack }) => {
  if (!enterprise) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>企业未找到</div>
      </div>
    );
  }

  return (
    <div className="enterprise-detail">
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-700 neubrutal-button px-4 py-2"
        >
          <i className="fas fa-arrow-left mr-2"></i>返回列表
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{enterprise.企业名称}</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg neubrutal-button">
              <i className="fas fa-edit mr-2"></i>编辑
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg neubrutal-button">
              <i className="fas fa-history mr-2"></i>变更日志
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">基本信息</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">统一社会信用代码:</span>
                <p className="text-gray-900">{enterprise.统一社会信用代码 || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">基地:</span>
                <p className="text-gray-900">{enterprise.base || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">注册资本:</span>
                <p className="text-gray-900">{enterprise.注册资本 ? `${enterprise.注册资本}万元` : '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">参保人数:</span>
                <p className="text-gray-900">{enterprise.参保人数 || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">优先级:</span>
                <span className={`ml-2 px-3 py-1 rounded-full ${
                  enterprise.优先级 === 'P0' ? 'bg-red-100 text-red-800' :
                  enterprise.优先级 === 'P1' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {enterprise.优先级}
                </span>
              </div>
            </div>
          </div>

          {/* AI应用信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">AI应用信息</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">飞桨/文心:</span>
                <p className="text-gray-900">{enterprise['飞桨_文心'] || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">伙伴等级:</span>
                <p className="text-gray-900">{enterprise.伙伴等级 || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">生态AI产品:</span>
                <p className="text-gray-900">{enterprise['生态ai产品'] || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">任务方向:</span>
                <p className="text-gray-900">{enterprise['任务方向'] || '未填写'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">使用场景:</span>
                <p className="text-gray-900">{enterprise['使用场景'] || '未填写'}</p>
              </div>
            </div>
          </div>

          {/* 企业背景 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">企业背景</h3>
            <p className="text-gray-900 whitespace-pre-line">{enterprise.企业背景 || '未填写'}</p>
          </div>

          {/* 行业信息 */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">行业信息</h3>
            <div className="flex flex-wrap gap-2">
              {enterprise.行业 && Array.isArray(enterprise.行业) && enterprise.行业.map((industry, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {industry}
                </span>
              ))}
              {(!enterprise.行业 || enterprise.行业.length === 0) && (
                <span className="text-gray-500">未填写行业信息</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = {
  EnterpriseList,
  EnterpriseDetail
};