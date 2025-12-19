/**
 * 高级筛选组件
 * 实现PRD中描述的筛选功能
 */

const React = require('react');

const AdvancedFilter = ({ onFilter, initialFilters = {} }) => {
  const [filters, setFilters] = React.useState({
    飞桨_文心: initialFilters['飞桨_文心'] || '',
    优先级: initialFilters['优先级'] || '',
    伙伴等级: initialFilters['伙伴等级'] || '',
    base: initialFilters.base || '',
    // 添加更多字段根据PRD需求
    ...initialFilters
  });
  
  const [activeConditions, setActiveConditions] = React.useState([]);

  // 添加筛选条件
  const addCondition = (field, value = '') => {
    const newCondition = {
      id: Date.now(),
      field,
      value,
      operator: 'eq', // 默认操作符
      type: getFieldType(field) // 根据字段类型确定输入组件
    };
    setActiveConditions([...activeConditions, newCondition]);
  };

  // 更新筛选条件
  const updateCondition = (id, updates) => {
    setActiveConditions(
      activeConditions.map(condition => 
        condition.id === id ? { ...condition, ...updates } : condition
      )
    );
  };

  // 删除筛选条件
  const removeCondition = (id) => {
    setActiveConditions(activeConditions.filter(condition => condition.id !== id));
  };

  // 获取字段类型
  const getFieldType = (field) => {
    const enumFields = ['飞桨_文心', '优先级', '伙伴等级'];
    const rangeFields = ['注册资本', '参保人数'];
    const dateFields = ['线索入库时间'];
    
    if (enumFields.includes(field)) return 'enum';
    if (rangeFields.includes(field)) return 'range';
    if (dateFields.includes(field)) return 'date';
    return 'text';
  };

  // 应用筛选
  const applyFilters = () => {
    const finalFilters = {};
    
    // 将条件转换为API可用的格式
    activeConditions.forEach(condition => {
      if (condition.value !== '' && condition.value !== null && condition.value !== undefined) {
        finalFilters[condition.field] = condition.value;
      }
    });
    
    // 包含基础筛选
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        finalFilters[key] = filters[key];
      }
    });
    
    onFilter(finalFilters);
  };

  // 预设筛选模板
  const presetTemplates = [
    { name: '高优先级客户', conditions: [{ field: '优先级', value: 'P0' }] },
    { name: '飞桨用户', conditions: [{ field: '飞桨_文心', value: '飞桨' }] },
    { name: '文心用户', conditions: [{ field: '飞桨_文心', value: '文心' }] },
    { name: '成都企业', conditions: [{ field: 'base', value: '成都' }] }
  ];

  // 应用预设模板
  const applyTemplate = (template) => {
    setActiveConditions(template.conditions.map(condition => ({
      ...condition,
      id: Date.now() + condition.field,
      operator: condition.operator || 'eq',
      type: getFieldType(condition.field)
    })));
  };

  return (
    <div className="advanced-filter bg-white rounded-lg border-2 border-gray-800 p-6 neubrutal-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">高级筛选</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg neubrutal-button">
            保存为模板
          </button>
          <button 
            onClick={applyFilters}
            className="px-4 py-2 bg-green-500 text-white rounded-lg neubrutal-button"
          >
            应用筛选
          </button>
        </div>
      </div>

      {/* 预设模板 */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">预设模板</h3>
        <div className="flex flex-wrap gap-2">
          {presetTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm neubrutal-button hover:bg-gray-300"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* 基础筛选 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">飞桨/文心</label>
          <select
            value={filters['飞桨_文心']}
            onChange={(e) => setFilters({...filters, '飞桨_文心': e.target.value})}
            className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input"
          >
            <option value="">全部</option>
            <option value="飞桨">飞桨</option>
            <option value="文心">文心</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-1">优先级</label>
          <select
            value={filters['优先级']}
            onChange={(e) => setFilters({...filters, '优先级': e.target.value})}
            className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input"
          >
            <option value="">全部</option>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-1">伙伴等级</label>
          <select
            value={filters['伙伴等级']}
            onChange={(e) => setFilters({...filters, '伙伴等级': e.target.value})}
            className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input"
          >
            <option value="">全部</option>
            <option value="认证级">认证级</option>
            <option value="优选级">优选级</option>
            <option value="无">无</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-1">基地</label>
          <input
            type="text"
            value={filters.base}
            onChange={(e) => setFilters({...filters, base: e.target.value})}
            placeholder="如：成都"
            className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input"
          />
        </div>
      </div>

      {/* 动态筛选条件 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">筛选条件</h3>
          <button
            onClick={() => addCondition('飞桨_文心')}
            className="text-blue-500 flex items-center"
          >
            <i className="fas fa-plus mr-1"></i> 添加条件
          </button>
        </div>

        {activeConditions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            暂无筛选条件，点击"添加条件"开始
          </div>
        ) : (
          <div className="space-y-3">
            {activeConditions.map((condition) => (
              <FilterCondition
                key={condition.id}
                condition={condition}
                onUpdate={updateCondition}
                onRemove={removeCondition}
              />
            ))}
          </div>
        )}
      </div>

      {/* 筛选条件构建器 */}
      <div className="border-t border-gray-300 pt-4">
        <h3 className="font-medium mb-3">添加新条件</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">字段</label>
            <select 
              className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm"
              onChange={(e) => addCondition(e.target.value)}
            >
              <option value="">选择字段</option>
              <option value="飞桨_文心">飞桨/文心</option>
              <option value="优先级">优先级</option>
              <option value="伙伴等级">伙伴等级</option>
              <option value="base">基地</option>
              <option value="注册资本">注册资本</option>
              <option value="参保人数">参保人数</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">操作符</label>
            <select className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm">
              <option value="eq">等于</option>
              <option value="ne">不等于</option>
              <option value="gt">大于</option>
              <option value="lt">小于</option>
              <option value="like">包含</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">值</label>
            <input 
              type="text" 
              placeholder="输入值"
              className="w-full p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="w-full py-2 bg-blue-500 text-white rounded-lg neubrutal-button text-sm"
              onClick={() => {
                // 需要从上面的输入框获取值来创建条件
                addCondition('飞桨_文心');
              }}
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 单个筛选条件组件
const FilterCondition = ({ condition, onUpdate, onRemove }) => {
  const fieldOptions = [
    { value: '飞桨_文心', label: '飞桨/文心' },
    { value: '优先级', label: '优先级' },
    { value: '伙伴等级', label: '伙伴等级' },
    { value: 'base', label: '基地' },
    { value: '注册资本', label: '注册资本' },
    { value: '参保人数', label: '参保人数' },
  ];

  const operatorOptions = [
    { value: 'eq', label: '=' },
    { value: 'ne', label: '≠' },
    { value: 'gt', label: '>' },
    { value: 'lt', label: '<' },
    { value: 'like', label: '包含' },
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <select
        value={condition.field}
        onChange={(e) => onUpdate(condition.id, { field: e.target.value })}
        className="p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm"
      >
        {fieldOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={condition.operator}
        onChange={(e) => onUpdate(condition.id, { operator: e.target.value })}
        className="p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm"
      >
        {operatorOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type={condition.type === 'date' ? 'date' : 'text'}
        value={condition.value || ''}
        onChange={(e) => onUpdate(condition.id, { value: e.target.value })}
        placeholder="值"
        className="flex-1 p-2 border-2 border-gray-300 rounded-lg neubrutal-input text-sm"
      />

      <button
        onClick={() => onRemove(condition.id)}
        className="p-2 bg-red-500 text-white rounded-lg neubrutal-button"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

module.exports = AdvancedFilter;