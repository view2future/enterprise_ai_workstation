
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, Zap, FileText, Building2, MapPin } from 'lucide-react';
import { NeubrutalCard } from './ui/neubrutalism/NeubrutalComponents';

const CommandCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { icon: <Zap size={18} />, label: '跳转到技术雷达', action: () => navigate('/dashboard/tech') },
    { icon: <Building2 size={18} />, label: '管理 P0 企业', action: () => navigate('/enterprises?priority=P0') },
    { icon: <FileText size={18} />, label: '生成最新报告', action: () => navigate('/reports') },
    { icon: <MapPin size={18} />, label: '查看西安分大盘', action: () => navigate('/enterprises?base=西安') },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-150">
        <NeubrutalCard className="p-0 overflow-hidden !shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center p-6 border-b-4 border-gray-800 bg-white">
            <Command className="text-gray-400 mr-4" size={24} />
            <input
              autoFocus
              className="flex-1 text-2xl font-black outline-none placeholder-gray-300 uppercase tracking-tighter"
              placeholder="输入指令或搜索企业..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="text-xs font-black bg-gray-100 px-2 py-1 border-2 border-gray-800 rounded">ESC</span>
          </div>
          
          <div className="bg-gray-50 p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">推荐指令</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => { cmd.action(); setIsOpen(false); }}
                  className="flex items-center gap-3 p-4 bg-white border-2 border-gray-800 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1 font-bold rounded-xl"
                >
                  {cmd.icon}
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-gray-800 text-gray-400 text-[10px] font-bold flex justify-between uppercase">
            <span>使用键盘上下键选择</span>
            <span>产业指挥系统 v1.0 / Terminal Mode</span>
          </div>
        </NeubrutalCard>
      </div>
    </div>
  );
};

export default CommandCenter;
