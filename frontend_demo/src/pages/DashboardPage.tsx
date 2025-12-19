import React from 'react';
import { mockEnterprises, mockTasks } from '../utils/mockData';
import EnterpriseCard from '../components/EnterpriseCard';
import TaskCard from '../components/TaskCard';
import DashboardCharts from '../components/DashboardCharts';
import { Eye, Download, Calendar, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Get the most recently updated enterprises
  const recentEnterprises = [...mockEnterprises]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">仪表板</h1>
        <p className="text-gray-600 dark:text-gray-400">区域AI产业企业数据总览</p>
      </div>

      {/* KPI Cards and Charts */}
      <DashboardCharts />

      {/* Recent Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">最近活动</h2>
            <a href="#" className="text-blue-600 dark:text-blue-400 text-sm">查看全部</a>
          </div>
          <div className="space-y-3">
            {recentEnterprises.map(enterprise => (
              <div key={enterprise.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium dark:text-white">{enterprise.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(enterprise.updatedAt).toLocaleDateString('zh-CN')} - 更新了企业信息
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">待办任务</h2>
            <a href="#" className="text-blue-600 dark:text-blue-400 text-sm">查看全部</a>
          </div>
          <div className="space-y-3">
            {mockTasks.slice(0, 3).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;