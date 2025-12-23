import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CommandCenter from '../CommandCenter';
import HUDNotes from '../HUDNotes';
import { soundEngine } from '../../utils/SoundUtility';
import { 
  LayoutDashboard, 
  Building2, 
  FileOutput, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Bot,
  Clock,
  Database,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Map
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { enterpriseApi } from '../../services/enterprise.service';
import { CommandPalette } from '../CommandPalette';
import { OperationalLiveFeed } from './OperationalLiveFeed';
import { CinematicOverlay } from '../CinematicOverlay';
import { NexusLogo } from '../ui/neubrutalism/NexusLogo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isGlitching, setIsGlitching] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [totalEnterprises, setTotalEnterprises] = React.useState<number | null>(null);
  
  // 侧边栏折叠状态，从 localStorage 读取初始值
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  // 持久化折叠状态
  React.useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  // 实时时钟
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取企业总数
  React.useEffect(() => {
    enterpriseApi.getEnterpriseStats().then(res => {
      setTotalEnterprises(res.data.total);
    }).catch(err => console.error('Failed to fetch stats', err));
  }, [location.pathname]); // 路由切换时尝试刷新（数据可能变了）

  // 监听路由变化触发 Glitch 转场 (Scheme 7)
  React.useEffect(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navItems = [
    { path: '/dashboard', label: '仪表板', icon: LayoutDashboard },
    { path: '/dashboard/war-map', label: '战术地图', icon: Map },
    { path: '/enterprises', label: '企业管理', icon: Building2 },
    { path: '/import-export', label: '导入导出', icon: FileOutput },
    { path: '/reports', label: '报告', icon: BarChart3 },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <CommandCenter />
      <HUDNotes />
      <CommandPalette />
      <CinematicOverlay />
      
      {/* 侧边栏 */}
      <motion.div 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-800 text-white flex flex-col border-r-4 border-gray-900 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] relative z-40"
      >
        {/* 折叠开关按钮 */}
        <button
          onClick={() => { soundEngine.playTick(); setIsCollapsed(!isCollapsed); }}
          className="absolute -right-5 top-24 w-6 h-12 bg-gray-900 border-2 border-gray-700 text-blue-400 flex items-center justify-center hover:text-white transition-colors z-50 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]"
          title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} /> }
        </button>

        <div className={`p-6 border-b-4 border-gray-900 flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <NexusLogo size="sm" color="bg-blue-600" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xl font-black uppercase tracking-tighter leading-tight whitespace-nowrap"
              >
                联图<br/><span className="text-blue-400 font-mono tracking-widest text-sm">NEXUS v3.0</span>
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => soundEngine.playTick()}
                    title={isCollapsed ? item.label : ""}
                    className={`flex items-center gap-3 px-4 py-3 border-2 transition-all active-gravity group ${
                      isActive(item.path)
                        ? 'bg-blue-600 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && (
                      <span className="font-black uppercase text-xs tracking-widest whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <OperationalLiveFeed isCollapsed={isCollapsed} />

        <div className={`p-4 border-t-4 border-gray-900 bg-gray-900 overflow-hidden ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                <span className="text-[10px] font-black uppercase text-gray-400">系统活性：极高</span>
              </div>
            </div>
          )}
          
          <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
            <div className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-gray-700 border-2 border-gray-600 flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                {user?.username?.[0].toUpperCase()}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-[10px] font-black uppercase text-white truncate w-24">{user?.username}</p>
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{user?.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => { soundEngine.playTick(); logout(); }}
              className="p-2 border-2 border-red-800 bg-red-600 hover:bg-red-700 text-white active-gravity transition-all shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              title="退出系统"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </motion.div>
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* V2 背景装饰流光 */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse pointer-events-none"></div>

        {/* 顶部导航栏 */}
        <header className="bg-white border-b-4 border-gray-800 p-4 flex items-center justify-between shadow-sm relative z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 border-4 border-gray-800 neubrutal-button">
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase tracking-widest text-gray-800 leading-tight">
                {location.pathname.split('/').pop() || 'DASHBOARD'}
              </h2>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">西南AI产业生态智研决策平台</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* V2.0 BADGE */}
            <div className="hidden xl:flex mr-6 px-3 py-1 bg-gray-900 border-2 border-blue-500 rounded-full items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse cursor-help group relative" title="按 Cmd+K 开启指令中心">
               <Zap size={12} className="text-blue-400 fill-blue-400" />
               <span className="text-[10px] font-black text-white italic tracking-tighter uppercase">Command Center Active</span>
               <div className="absolute top-full mt-2 right-0 hidden group-hover:block bg-gray-900 border-2 border-gray-800 p-2 text-[8px] text-gray-400 whitespace-nowrap z-50">
                  PRESS <span className="text-white">⌘ + K</span> TO OPEN
               </div>
            </div>

            {/* 滚动密码锁主题切换器 (Combination Lock Style) */}
            <div 
              className="hidden lg:block relative h-[36px] w-[100px] bg-white border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer group active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all mr-4"
              onClick={() => {
                soundEngine.playPneumatic();
                const themes: any[] = ['cyber', 'stealth', 'hazard'];
                const currentIndex = themes.indexOf(theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                setTheme(nextTheme);
              }}
              title="点击旋转密钥切换主题"
            >
              <motion.div
                animate={{ 
                  y: theme === 'cyber' ? 0 : theme === 'stealth' ? -32 : -64 
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center"
              >
                {[
                  { id: 'cyber', label: 'CYBER' },
                  { id: 'stealth', label: 'STEALTH' },
                  { id: 'hazard', label: 'HAZARD' }
                ].map((t) => (
                  <div 
                    key={t.id} 
                    className="h-[32px] flex items-center justify-center w-full font-black text-[10px] tracking-[0.2em] text-gray-900"
                  >
                    {t.label}
                  </div>
                ))}
              </motion.div>
              {/* 装饰性侧边刻度 */}
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none opacity-30">
                {[1,2,3,4].map(i => <div key={i} className="w-1 h-[2px] bg-gray-900"></div>)}
              </div>
              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none opacity-30">
                {[1,2,3,4].map(i => <div key={i} className="w-1 h-[2px] bg-gray-900"></div>)}
              </div>
            </div>

            {/* 动态系统状态 HUD */}
            <div className="hidden md:flex items-center gap-2 font-mono">
              <div className="bg-white text-gray-900 border-2 border-gray-900 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center min-w-[90px]">
                <span className="text-[7px] font-bold text-gray-500 uppercase leading-none mb-1">Mission Time</span>
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-xs font-black leading-none">
                    {currentTime.toLocaleTimeString([], { hour12: false })}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800 text-white border-2 border-gray-900 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center min-w-[110px]">
                <span className="text-[7px] font-bold text-blue-400 uppercase leading-none mb-1">Ecosystem Scale</span>
                <div className="flex items-center gap-2">
                  <Database size={10} className="text-blue-400" />
                  <span className="text-xs font-black italic leading-none">{totalEnterprises ?? '---'} ENT</span>
                </div>
              </div>

              <div className={`border-2 border-gray-900 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 ${user?.envScope === 'DEMO' ? 'bg-yellow-400 text-gray-900' : 'bg-red-600 text-white'}`}>
                <Zap size={10} className={user?.envScope === 'DEMO' ? 'fill-gray-900' : 'fill-white'} />
                <span className="text-[9px] font-black uppercase">{user?.envScope === 'DEMO' ? 'Tactical Demo' : 'Strategic Prod'}</span>
              </div>

              <div className="bg-green-500 text-gray-900 border-2 border-gray-900 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <RefreshCw size={10} className="animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-[9px] font-black uppercase">Sync OK</span>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 - 带 Glitch 转场 */}
        <main className={`flex-1 overflow-y-auto p-6 bg-gray-50 transition-all ${isGlitching ? 'glitch-active' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;