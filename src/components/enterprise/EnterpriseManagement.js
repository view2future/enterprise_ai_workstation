/**
 * 企业管理页面组件
 * 整合企业管理的所有功能
 */

const React = require('react');

const useEnterprise = () => {
  const [enterprises, setEnterprises] = React.useState([]);
  const [selectedEnterprise, setSelectedEnterprise] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  // 获取企业列表
  const fetchEnterprises = async (page = 1, searchTerm = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search: searchTerm,
        sort: 'id',
        order: 'DESC'
      });

      const response = await fetch(`/api/enterprises?${params}`);
      const result = await response.json();

      if (result.success) {
        setEnterprises(result.data);
        setPagination(result.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('获取企业列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 搜索企业
  const searchEnterprises = (searchTerm) => {
    fetchEnterprises(1, searchTerm);
  };

  // 分页改变
  const handlePageChange = (page) => {
    fetchEnterprises(page);
  };

  // 选择企业查看详情
  const selectEnterprise = (enterprise) => {
    setSelectedEnterprise(enterprise);
  };

  // 返回列表
  const goBackToList = () => {
    setSelectedEnterprise(null);
  };

  // 初始化加载
  React.useEffect(() => {
    fetchEnterprises(currentPage);
  }, []);

  return {
    enterprises,
    selectedEnterprise,
    loading,
    pagination,
    fetchEnterprises,
    searchEnterprises,
    handlePageChange,
    selectEnterprise,
    goBackToList,
    currentPage
  };
};

const EnterpriseManagement = () => {
  const {
    enterprises,
    selectedEnterprise,
    loading,
    pagination,
    searchEnterprises,
    handlePageChange,
    selectEnterprise,
    goBackToList
  } = useEnterprise();

  return (
    <div className="enterprise-management p-6">
      <h1 className="text-3xl font-bold mb-6">企业管理</h1>
      
      {selectedEnterprise ? (
        <EnterpriseDetail 
          enterprise={selectedEnterprise} 
          onBack={goBackToList} 
        />
      ) : (
        <EnterpriseList 
          enterprises={enterprises}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSearch={searchEnterprises}
        />
      )}
    </div>
  );
};

// 导出组件
module.exports = EnterpriseManagement;