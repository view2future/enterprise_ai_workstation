/**
 * 完整仪表盘组件
 * 实现PRD中描述的Dashboard功能
 */

const React = require('react');

const Dashboard = () => {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // 模拟获取仪表盘数据
  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 实际项目中这里会调用API
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = {
        totalEnterprises: 526,
        enterprisesWithAI: 518, // 具备AI应用的企业数
        enterprisesWithBaiduAI: 489, // 使用百度AI的企业数
        newEnterprisesLast30Days: 42, // 最近30天新增企业数
        priorityDistribution: [
          { stage: 'P0', count: 89, percentage: 16.9 },
          { stage: 'P1', count: 227, percentage: 43.2 },
          { stage: 'P2', count: 210, percentage: 39.9 }
        ],
        industryDistribution: [
          { industry: '金融科技', count: 36, percentage: 6.8 },
          { industry: '法律科技', count: 32, percentage: 6.1 },
          { industry: '人工智能', count: 31, percentage: 5.9 },
          { industry: '文旅科技', count: 31, percentage: 5.9 },
          { industry: '物流科技', count: 30, percentage: 5.7 },
          { industry: '智能制造', count: 29, percentage: 5.5 }
        ],
        scenarioDistribution: [
          { scenario: '工业视觉检测', count: 25, percentage: 4.8 },
          { scenario: '图像识别处理', count: 24, percentage: 4.6 },
          { scenario: '语音识别', count: 22, percentage: 4.2 },
          { scenario: '智能合约开发', count: 22, percentage: 4.2 },
          { scenario: '智能监控系统', count: 22, percentage: 4.2 },
          { scenario: 'OCR识别', count: 21, percentage: 4 }
        ],
        maturityDistribution: [
          { level: '探索期', count: 278, percentage: 52.8 },
          { level: '试点期', count: 159, percentage: 30.2 },
          { level: '规模化应用', count: 89, percentage: 16.9 }
        ],
        trendData: [
          { month: '1月', count: 320 },
          { month: '2月', count: 345 },
          { month: '3月', count: 367 },
          { month: '4月', count: 398 },
          { month: '5月', count: 415 },
          { month: '6月', count: 432 },
          { month: '7月', count: 441 },
          { month: '8月', count: 458 },
          { month: '9月', count: 476 },
          { month: '10月', count: 492 },
          { month: '11月', count: 508 },
          { month: '12月', count: 526 }
        ]
      };
      
      setDashboardData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-10">
        <p>无法加载仪表盘数据</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg neubrutal-button"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI产业数据概览</h1>
        <p className="text-gray-600">区域AI产业企业发展态势分析</p>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="企业总数" 
          value={dashboardData.totalEnterprises} 
          icon="fa-building" 
          color="blue"
        />
        <StatCard 
          title="AI应用企业" 
          value={dashboardData.enterprisesWithAI} 
          subtitle={`${((dashboardData.enterprisesWithAI / dashboardData.totalEnterprises) * 100).toFixed(1)}%`}
          icon="fa-brain" 
          color="green"
        />
        <StatCard 
          title="百度AI用户" 
          value={dashboardData.enterprisesWithBaiduAI} 
          subtitle={`${((dashboardData.enterprisesWithBaiduAI / dashboardData.totalEnterprises) * 100).toFixed(1)}%`}
          icon="fa-microchip" 
          color="purple"
        />
        <StatCard 
          title="新增企业(30天)" 
          value={dashboardData.newEnterprisesLast30Days} 
          icon="fa-chart-line" 
          color="yellow"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 行业分布 */}
        <ChartCard 
          title="按行业分布" 
          data={dashboardData.industryDistribution}
          type="bar"
          onDrillDown={(industry) => alert(`钻取到 ${industry} 行业: 显示详细企业列表`)}
        />
        
        {/* AI场景分布 */}
        <ChartCard 
          title="AI应用场景分布" 
          data={dashboardData.scenarioDistribution}
          type="horizontal-bar"
          onDrillDown={(scenario) => alert(`钻取到 ${scenario} 场景: 显示详细企业列表`)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* AI成熟度分布 */}
        <ChartCard 
          title="AI技术成熟度分布" 
          data={dashboardData.maturityDistribution}
          type="pie"
          onDrillDown={(level) => alert(`钻取到 ${level}: 显示详细企业列表`)}
        />
        
        {/* 优先级分布 */}
        <ChartCard 
          title="企业优先级分布" 
          data={dashboardData.priorityDistribution}
          type="pie"
          onDrillDown={(stage) => alert(`钻取到 ${stage} 企业: 显示详细企业列表`)}
        />
      </div>

      {/* 趋势图 */}
      <div className="mb-6">
        <ChartCard 
          title="企业增长趋势 (近12个月)" 
          data={dashboardData.trendData}
          type="line"
          xAxisKey="month"
          yAxisKey="count"
          onDrillDown={(month) => alert(`钻取到 ${month}: 显示该月新增企业`)}
        />
      </div>
    </div>
  );
};

// 统计卡片组件
const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-500 shadow-[6px_6px_0_0_#3b82f6]",
    green: "bg-green-100 text-green-800 border-green-500 shadow-[6px_6px_0_0_#10b981]",
    purple: "bg-purple-100 text-purple-800 border-purple-500 shadow-[6px_6px_0_0_#8b5cf6]",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-500 shadow-[6px_6px_0_0_#f59e0b]"
  };

  return (
    <div className={`bg-white rounded-lg border-4 p-6 neubrutal-card ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="p-4 rounded-lg bg-gray-100 border-2 border-gray-300">
          <i className={`fas ${icon} text-2xl`}></i>
        </div>
      </div>
    </div>
  );
};

// 图表卡片组件
const ChartCard = ({ title, data, type, xAxisKey = 'industry', yAxisKey = 'count', onDrillDown }) => {
  return (
    <div className="bg-white rounded-lg border-4 border-gray-800 p-6 neubrutal-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <button className="border-2 border-gray-400 px-3 py-1 rounded text-sm font-bold neubrutal-button">
          <i className="fas fa-download mr-1"></i>导出
        </button>
      </div>
      
      <div className="h-64 flex items-center justify-center">
        {type === 'bar' && <BarChart data={data} onDrillDown={onDrillDown} />}
        {type === 'horizontal-bar' && <HorizontalBarChart data={data} onDrillDown={onDrillDown} />}
        {type === 'pie' && <PieChart data={data} onDrillDown={onDrillDown} />}
        {type === 'line' && <LineChart data={data} xAxisKey={xAxisKey} yAxisKey={yAxisKey} onDrillDown={onDrillDown} />}
      </div>
      
      {type !== 'line' && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {data.slice(0, 5).map((item, index) => {
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            return (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm">{item[xAxisKey]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 柱状图组件
const BarChart = ({ data, onDrillDown }) => {
  const maxValue = Math.max(...data.map(item => item.count), 1);
  
  return (
    <div className="w-full h-full flex items-end space-x-1 justify-center">
      {data.map((item, index) => {
        const height = (item.count / maxValue) * 80; // 80% of container height
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
        
        return (
          <div 
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onDrillDown(item.industry || item.scenario || item.level || item.stage)}
            style={{ width: `${80 / data.length}%` }}
          >
            <div 
              className="w-full rounded-t hover:opacity-90 transition"
              style={{ 
                height: `${height}%`, 
                backgroundColor: colors[index % colors.length],
                minHeight: '5px'
              }}
            ></div>
            <div className="text-xs mt-1 text-center truncate w-full">
              {item.industry || item.scenario || item.level || item.stage}
            </div>
            <div className="text-xs font-bold">{item.count}</div>
          </div>
        );
      })}
    </div>
  );
};

// 水平柱状图组件
const HorizontalBarChart = ({ data, onDrillDown }) => {
  const maxValue = Math.max(...data.map(item => item.count), 1);
  
  return (
    <div className="w-full h-full flex flex-col justify-center space-y-2">
      {data.map((item, index) => {
        const width = (item.count / maxValue) * 90; // 90% of container width
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
        
        return (
          <div 
            key={index}
            className="flex items-center cursor-pointer"
            onClick={() => onDrillDown(item.scenario)}
          >
            <div className="text-xs w-24 truncate mr-2 text-right">
              {item.scenario}
            </div>
            <div 
              className="h-6 rounded-r flex items-center justify-end pr-2 text-white text-xs font-bold"
              style={{ 
                width: `${width}%`, 
                backgroundColor: colors[index % colors.length],
                minWidth: '5px'
              }}
            >
              {item.count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 饼图组件
const PieChart = ({ data, onDrillDown }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  
  let startAngle = 0;
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const angle = (item.count / total) * 360;
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          // 计算弧线路径
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
          
          const x1 = 96 + 96 * Math.cos(startAngleRad);
          const y1 = 96 + 96 * Math.sin(startAngleRad);
          
          const x2 = 96 + 96 * Math.cos(endAngleRad);
          const y2 = 96 + 96 * Math.sin(endAngleRad);
          
          const pathData = [
            `M 96,96`,
            `L ${x1},${y1}`,
            `A 96,96 0 ${largeArcFlag},1 ${x2},${y2}`,
            `Z`
          ].join(' ');
          
          startAngle += angle;
          
          return (
            <svg
              key={index}
              className="absolute top-0 left-0 w-full h-full cursor-pointer"
              viewBox="0 0 192 192"
              onClick={() => onDrillDown(item.level || item.stage)}
            >
              <path 
                d={pathData} 
                fill={colors[index % colors.length]} 
                stroke="white" 
                strokeWidth="2"
              />
            </svg>
          );
        })}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-lg font-bold">{total}</div>
          <div className="text-xs text-gray-600">总计</div>
        </div>
      </div>
    </div>
  );
};

// 折线图组件
const LineChart = ({ data, xAxisKey, yAxisKey, onDrillDown }) => {
  if (!data || data.length === 0) return <div className="text-gray-500">暂无数据</div>;
  
  const maxValue = Math.max(...data.map(item => item[yAxisKey]), 1);
  const minValue = Math.min(...data.map(item => item[yAxisKey]), 0);
  const range = maxValue - minValue;
  
  // 计算数据点坐标
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100; // 百分比位置
    const y = 100 - ((item[yAxisKey] - minValue) / range) * 100; // 翻转Y轴
    return { x, y, value: item[yAxisKey], label: item[xAxisKey] };
  });
  
  // 生成路径
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`
  ).join(' ');
  
  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* 网格线 */}
        {[0, 25, 50, 75, 100].map((y, index) => (
          <line
            key={index}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#e5e7eb"
            strokeWidth="0.1"
          />
        ))}
        
        {/* 折线 */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* 数据点 */}
        {points.map((point, index) => (
          <g 
            key={index}
            onClick={() => onDrillDown(point.label)}
            className="cursor-pointer hover:opacity-80"
          >
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="1.5"
              fill="#3b82f6"
            />
            <text
              x={`${point.x}%`}
              y={`${point.y - 3}%`}
              textAnchor="middle"
              fontSize="3"
              fill="#4b5563"
            >
              {point.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

module.exports = Dashboard;