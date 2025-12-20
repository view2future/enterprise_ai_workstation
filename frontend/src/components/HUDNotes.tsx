
import React, { useState, useEffect } from 'react';
import { StickyNote, X, GripHorizontal } from 'lucide-react';
import { NeubrutalCard } from './ui/neubrutalism/NeubrutalComponents';

const HUDNotes: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(() => localStorage.getItem('hud-note') || '');
  const [position, setPosition] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'n' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-[90] hud-note"
      style={{ left: position.x, top: position.y }}
    >
      <NeubrutalCard className="w-64 !p-0 !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-yellow-50">
        <div className="flex items-center justify-between p-2 bg-yellow-200 border-b-4 border-gray-800 cursor-move group">
          <GripHorizontal size={14} className="text-gray-600" />
          <span className="text-[10px] font-black uppercase">Tactical Note</span>
          <button onClick={() => setIsOpen(false)}><X size={14} /></button>
        </div>
        <textarea
          autoFocus
          className="w-full h-40 p-4 bg-transparent outline-none font-bold text-sm text-gray-800 placeholder-yellow-600/40"
          placeholder="按下 N 键隐藏 / 记录您的洞察..."
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            localStorage.setItem('hud-note', e.target.value);
          }}
        />
        <div className="p-2 border-t-2 border-dashed border-yellow-300 text-[8px] font-bold text-yellow-700 uppercase flex justify-between">
          <span>Auto-saving to core</span>
          <span>HUD v1.0</span>
        </div>
      </NeubrutalCard>
    </div>
  );
};

export default HUDNotes;
