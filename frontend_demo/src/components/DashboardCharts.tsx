import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockEnterprises, industryDistribution, aiScenarioDistribution, monthlyTrendData } from '../utils/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardCharts = () => {
  // Calculate additional metrics
  const totalEnterprises = mockEnterprises.length;
  const enterprisesWithAI = mockEnterprises.filter(e => e.aiApplications.length > 0).length;
  const enterprisesWithBaiduAI = mockEnterprises.filter(e => e.baiduAiUsage && e.baiduAiUsage.usageLevel !== 'none').length;
  const highPotentialEnterprises = mockEnterprises.filter(e =>
    e.operationalTags.some(tag => ['高潜力', '重点关注', '重点合作'].includes(tag.tagName))
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neubrutalism-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">企业总数</p>
              <p className="text-2xl font-bold mt-1">{totalEnterprises}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              +12% vs 上月
            </span>
          </p>
        </div>

        <div className="neubrutalism-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">已应用AI企业</p>
              <p className="text-2xl font-bold mt-1">{enterprisesWithAI}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              +8% vs 上月
            </span>
          </p>
        </div>

        <div className="neubrutalism-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">使用百度AI</p>
              <p className="text-2xl font-bold mt-1">{enterprisesWithBaiduAI}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              +15% vs 上月
            </span>
          </p>
        </div>

        <div className="neubrutalism-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-600">高潜力企业</p>
              <p className="text-2xl font-bold mt-1">{highPotentialEnterprises}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <span className="inline-flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              +5% vs 上月
            </span>
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution Chart */}
        <div className="neubrutalism-card p-4">
          <h2 className="text-lg font-bold mb-4">行业分布</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {industryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} 家`, '数量']}
                  labelFormatter={(name) => `行业: ${name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Scenario Distribution Chart */}
        <div className="neubrutalism-card p-4">
          <h2 className="text-lg font-bold mb-4">AI应用场景分布</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={aiScenarioDistribution}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} 家`, '数量']}
                  labelFormatter={(name) => `场景: ${name}`}
                />
                <Legend />
                <Bar dataKey="value" name="企业数量" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="neubrutalism-card p-4">
        <h2 className="text-lg font-bold mb-4">月度趋势</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTrendData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} 家`, '企业数量']}
                labelFormatter={(name) => `月份: ${name}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="新增企业数" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;