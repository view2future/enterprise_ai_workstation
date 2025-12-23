import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FileOutput, 
  BarChart3, 
  Zap, 
  Terminal,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // 监听快捷键 Cmd+K 或 Ctrl+K，以及 Esc
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    command();
    setOpen(false);
    setQuery('');
  };

  // 强化语义路由 (Semantic Router 2.0)
  const handleCommand = (value: string) => {
    const v = value.toLowerCase();
    
    // 1. 组合查询解析 (基于真实字段)
    let params = new URLSearchParams();
    
    if (v.includes('成都')) params.append('base', '成都');
    if (v.includes('重庆')) params.append('base', '重庆');
    if (v.includes('西安')) params.append('base', '西安');
    
    if (v.includes('p0')) params.append('priority', 'P0');
    if (v.includes('p1')) params.append('priority', 'P1');
    
    if (v.includes('制造')) params.append('industry', '智能制造');
    if (v.includes('金融')) params.append('industry', '金融科技');
    if (v.includes('生物')) params.append('industry', '生物医药');

    // 2. 特殊指令跳转
    if (v.includes('同步') || v.includes('sync')) {
      runCommand(() => navigate('/import-export?tab=sync'));
      return;
    }

    if (v.includes('报告') || v.includes('分析')) {
      runCommand(() => navigate('/reports'));
      return;
    }

    if (v.includes('清洗') || v.includes('refine')) {
      alert('[CONCEPTUAL REFINER ACTIVE] 正在解析数据不一致性... \n检测到 12 处注册资本单位异常。是否自动修正？');
      return;
    }

    // 3. 执行导航
    if (params.toString()) {
      runCommand(() => navigate(`/enterprises?${params.toString()}`));
    } else {
      // 默认模糊搜索企业名
      runCommand(() => navigate(`/enterprises?search=${value}`));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 bg-gray-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-gray-900 border-4 border-gray-800 shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden"
          >
            <Command label="全局指令中心" className="command-palette" onKeyDown={(e) => {
              if (e.key === 'Enter' && query) {
                handleCommand(query);
              }
            }}>
              <div className="flex items-center border-b-4 border-gray-800 p-4 gap-3 bg-gray-900">
                <Terminal className="text-blue-500 w-6 h-6" />
                <Command.Input 
                  value={query}
                  onValueChange={setQuery}
                  placeholder="输入指令或语义搜索 (例如: '成都 P0 企业')..." 
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-lg placeholder:text-gray-600"
                />
                <div className="px-2 py-1 bg-gray-800 text-gray-500 text-[10px] font-black border border-gray-700">ESC 退出</div>
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="p-8 text-center text-gray-500 font-mono italic">
                  未找到匹配的情报指令...
                </Command.Empty>

                <Command.Group heading="战术快速导航" className="text-[10px] font-black uppercase text-blue-500 px-4 py-2 tracking-widest">
                  <Item onSelect={() => runCommand(() => navigate('/dashboard'))} icon={<Zap size={18}/>} label="进入核心仪表板" shortcut="D" />
                  <Item onSelect={() => runCommand(() => navigate('/enterprises'))} icon={<Building2 size={18}/>} label="打开企业全量库" shortcut="E" />
                  <Item onSelect={() => runCommand(() => navigate('/reports'))} icon={<BarChart3 size={18}/>} label="生成情报简报" shortcut="R" />
                  <Item onSelect={() => runCommand(() => navigate('/import-export'))} icon={<FileOutput size={18}/>} label="数据同步中心" shortcut="S" />
                </Command.Group>

                <Command.Group heading="智能系统操作" className="text-[10px] font-black uppercase text-gray-500 px-4 py-2 tracking-widest mt-4">
                  <Item onSelect={() => {}} icon={<Cpu size={18}/>} label="触发全量数据富化 (AI Agent)" />
                  <Item onSelect={() => {}} icon={<ShieldAlert size={18}/>} label="启动 VERACITY HUD 真值校准" />
                  <Item onSelect={() => {}} icon={<ShieldAlert size={18}/>} label="强制同步机密数据包 (.eap)" />
                </Command.Group>

                <Command.Group heading="最近搜索企业" className="text-[10px] font-black uppercase text-gray-500 px-4 py-2 tracking-widest mt-4">
                  <Item onSelect={() => {}} icon={<Building2 size={18}/>} label="成都考拉悠然科技有限公司" />
                  <Item onSelect={() => {}} icon={<Building2 size={18}/>} label="四川华鲲振宇智能科技有限责任公司" />
                </Command.Group>
              </Command.List>

              <div className="bg-gray-950 p-3 border-t-4 border-gray-800 flex justify-between items-center px-6">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1">
                      <span className="text-[8px] bg-gray-800 px-1 py-0.5 text-gray-400">↑↓</span>
                      <span className="text-[8px] text-gray-500 uppercase font-black">导航</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="text-[8px] bg-gray-800 px-1 py-0.5 text-gray-400">回车</span>
                      <span className="text-[8px] text-gray-500 uppercase font-black">执行</span>
                   </div>
                </div>
                <span className="text-[8px] font-mono text-blue-900 tracking-tighter">V2.0_核心指令就绪 | 语义解析已开启</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Item = ({ icon, label, shortcut, onSelect }: any) => (
  <Command.Item
    onSelect={onSelect}
    className="flex items-center justify-between p-3 rounded-none cursor-pointer hover:bg-blue-600/20 group transition-colors aria-selected:bg-blue-600 aria-selected:text-white"
  >
    <div className="flex items-center gap-3">
      <div className="text-gray-500 group-aria-selected:text-white">{icon}</div>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </div>
    {shortcut && <span className="text-[10px] font-mono opacity-50">{shortcut}</span>}
  </Command.Item>
);