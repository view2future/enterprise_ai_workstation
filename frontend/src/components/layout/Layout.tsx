import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  FileOutput, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: '仪表板', icon: LayoutDashboard },
    { path: '/enterprises', label: '企业管理', icon: Building2 },
    { path: '/import-export', label: '导入导出', icon: FileOutput },
    { path: '/reports', label: '报告', icon: BarChart3 },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">企业数据管理平台</h1>
        </div>
        
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              title="退出登录"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg border-2 border-gray-800 neubrutal-button">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {location.pathname === '/dashboard' && '仪表板'}
              {location.pathname === '/enterprises' && '企业管理'}
              {location.pathname === '/enterprises/:id' && '企业详情'}
              {location.pathname === '/import-export' && '导入导出'}
              {location.pathname === '/reports' && '报告'}
              {location.pathname === '/settings' && '系统设置'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              欢迎, {user?.username}
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;