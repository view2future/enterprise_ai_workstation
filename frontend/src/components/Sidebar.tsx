import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Share2,
  Bell,
  Fingerprint,
  FileSearch
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: '战略大盘', path: '/' },
    { icon: Building2, label: '企业档案', path: '/enterprises' },
    { icon: FileSearch, label: '政策指挥室', path: '/policies' },
    { icon: Share2, label: '区域协同', path: '/sync' },
    { icon: ShieldCheck, label: '数据存真', path: '/veracity' },
    { icon: FileText, label: '智库报告', path: '/reports' },
    { icon: Fingerprint, label: '成员指纹', path: '/members' },
    { icon: Bell, label: '数字秘书', path: '/secretary' },
    { icon: Settings, label: '系统设置', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white fixed left-0 top-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Share2 size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">联图NEXUS</h1>
          {/* 子标题已按需移除 */}
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-3 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Nexus Admin</p>
            <p className="text-xs truncate">v5.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;