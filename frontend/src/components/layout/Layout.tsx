import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CommandCenter from '../CommandCenter';
import { 
  LayoutDashboard, 
  Building2, 
  FileOutput, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Bot
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
    <div className="flex h-screen bg-gray-100 font-sans">
      <CommandCenter />
      
      {/* 侧边栏 */}
      <div className="w-64 bg-gray-800 text-white flex flex-col border-r-4 border-gray-900 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-4 border-gray-900 flex items-center gap-3">
          <div className="bg-blue-600 p-2 border-2 border-white rounded-lg animate-bot">
            <Bot size={24} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter leading-none">
            Ecosystem<br/><span className="text-blue-400">Station</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 border-2 transition-all active-gravity ${
                      isActive(item.path)
                        ? 'bg-blue-600 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-black uppercase text-xs tracking-widest">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t-4 border-gray-900 bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-gray-400">系统活性：极高</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-700 border-2 border-gray-600 flex items-center justify-center font-black text-xs">
                {user?.username?.[0].toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white truncate w-24">{user?.username}</p>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 border-2 border-red-800 bg-red-600 hover:bg-red-700 text-white active-gravity transition-all"
              title="退出系统"
            >
              <LogOut size={14} />
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