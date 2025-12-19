import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, MenuIcon, XIcon, Building, FileUp, LayoutDashboard, CheckSquare, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '仪表板', icon: <LayoutDashboard size={24} /> },
    { path: '/enterprises', label: '企业管理', icon: <Building size={24} /> },
    { path: '/import-export', label: '导入导出', icon: <FileUp size={24} /> },
    { path: '/tasks', label: '任务管理', icon: <CheckSquare size={24} /> },
    { path: '/settings', label: '系统设置', icon: <Settings size={24} /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="neubrutalism-button bg-gray-800 text-white p-3"
        >
          {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static neubrutalism`}
      >
        <div className="flex items-center justify-center h-16 border-b-4 border-white">
          <h1 className="text-xl font-bold text-xl">企业数据平台</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-colors border-2 border-white text-lg ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="flex-shrink-0 icon-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 px-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between gap-3 text-gray-300 hover:text-white px-4 py-4 rounded-lg border-2 border-white text-lg"
            >
              <span>切换主题</span>
              <div className="flex-shrink-0">
                {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
              </div>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <header className="sticky top-0 z-30 bg-white border-b-4 border-gray-900 neubrutalism">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="搜索企业..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neubrutalism-input w-full pl-12 pr-4 py-3 bg-white text-gray-900 text-lg"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-lg text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative neubrutalism-button bg-gray-200 text-black p-3">
            <svg
              className="icon-lg text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-black neubrutalism flex-shrink-0">
              A
            </div>
            <span className="font-bold text-lg">分析师</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;