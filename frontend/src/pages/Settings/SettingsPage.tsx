import React, { useState } from 'react';
import { 
  User, 
  Key, 
  Shield, 
  Database, 
  Settings, 
  Lock, 
  Globe, 
  Bell, 
  Mail, 
  UserCircle, 
  CreditCard, 
  FileText, 
  BarChart3,
  Users,
  Save,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from '../../components/common/UserManagement';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'account', label: '账户设置', icon: UserCircle },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'data', label: '数据管理', icon: Database },
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'system', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
        <p className="text-gray-600">管理您的账户和系统配置</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边栏 */}
        <div className="lg:w-64">
          <NeubrutalCard>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                // 只有管理员才能看到用户管理选项
                if (tab.id === 'users' && user?.role !== 'admin') {
                  return null;
                }
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </NeubrutalCard>
        </div>

        {/* 主内容区 */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <NeubrutalCard>
              <h2 className="text-lg font-semibold mb-4">个人资料</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">头像</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-800 flex items-center justify-center">
                      <UserCircle size={32} className="text-gray-600" />
                    </div>
                    <NeubrutalButton variant="secondary" size="sm">
                      更换头像
                    </NeubrutalButton>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <NeubrutalInput
                      label="姓名"
                      defaultValue="张三"
                    />
                  </div>
                  
                  <div>
                    <NeubrutalInput
                      label="用户名"
                      defaultValue="zhangsan"
                    />
                  </div>
                </div>
                
                <div>
                  <NeubrutalInput
                    label="邮箱"
                    type="email"
                    defaultValue="zhangsan@example.com"
                  />
                </div>
                
                <div>
                  <NeubrutalInput
                    label="职位"
                    defaultValue="数据分析师"
                  />
                </div>
                
                <div>
                  <NeubrutalInput
                    label="部门"
                    defaultValue="AI生态部"
                  />
                </div>
                
                <div className="pt-4">
                  <NeubrutalButton variant="primary">
                    <Save size={18} className="mr-2" />
                    保存更改
                  </NeubrutalButton>
                </div>
              </div>
            </NeubrutalCard>
          )}

          {activeTab === 'security' && (
            <NeubrutalCard>
              <h2 className="text-lg font-semibold mb-4">安全设置</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">密码设置</h3>
                  <div className="space-y-4">
                    <NeubrutalInput
                      label="当前密码"
                      type="password"
                      placeholder="输入当前密码"
                    />
                    
                    <NeubrutalInput
                      label="新密码"
                      type="password"
                      placeholder="输入新密码"
                    />
                    
                    <NeubrutalInput
                      label="确认新密码"
                      type="password"
                      placeholder="再次输入新密码"
                    />
                    
                    <NeubrutalButton variant="success">
                      <Key size={18} className="mr-2" />
                      更新密码
                    </NeubrutalButton>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-md font-medium mb-3">双因素认证</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">双因素认证</p>
                      <p className="text-sm text-gray-600">为您的账户添加额外的安全层</p>
                    </div>
                    <NeubrutalButton variant="secondary">
                      启用
                    </NeubrutalButton>
                  </div>
                </div>
              </div>
            </NeubrutalCard>
          )}

          {activeTab === 'notifications' && (
            <NeubrutalCard>
              <h2 className="text-lg font-semibold mb-4">通知设置</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">邮件通知</p>
                    <p className="text-sm text-gray-600">接收重要更新和通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border-2 border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">系统通知</p>
                    <p className="text-sm text-gray-600">接收系统更新和维护通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border-2 border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">数据更新通知</p>
                    <p className="text-sm text-gray-600">接收企业数据更新通知</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </NeubrutalCard>
          )}

          {activeTab === 'data' && (
            <NeubrutalCard>
              <h2 className="text-lg font-semibold mb-4">数据管理</h2>
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Database size={20} className="text-blue-600" />
                    <h3 className="font-medium">数据备份</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">定期备份您的企业数据，确保数据安全</p>
                  <NeubrutalButton variant="primary">
                    <Download size={18} className="mr-2" />
                    立即备份
                  </NeubrutalButton>
                </div>
                
                <div className="p-4 border-2 border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText size={20} className="text-green-600" />
                    <h3 className="font-medium">数据导出</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">导出您的企业数据为不同格式</p>
                  <div className="flex gap-2 flex-wrap">
                    <NeubrutalButton variant="success">
                      <Download size={18} className="mr-2" />
                      导出为Excel
                    </NeubrutalButton>
                    <NeubrutalButton variant="secondary">
                      <Download size={18} className="mr-2" />
                      导出为CSV
                    </NeubrutalButton>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 size={20} className="text-purple-600" />
                    <h3 className="font-medium">数据统计</h3>
                  </div>
                  <p className="text-sm text-gray-600">查看数据使用统计和分析报告</p>
                </div>
              </div>
            </NeubrutalCard>
          )}

          {activeTab === 'users' && user?.role === 'admin' && (
            <UserManagement currentUserRole={user.role} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;