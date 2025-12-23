import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, X, Terminal, MapPin } from 'lucide-react';

interface CommandNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  fileName: string;
}

export const CommandNotification: React.FC<CommandNotificationProps> = ({ isOpen, onClose, title, message, fileName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(59,130,246,1)] overflow-hidden relative"
          >
            {/* 扫描线特效 */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-cyber-grid"></div>
            
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-blue-400" />
                <span className="font-black uppercase text-xs tracking-[0.2em]">System_Notification // V2.0</span>
              </div>
              <button onClick={onClose} className="hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 text-gray-900">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 border-4 border-gray-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">{title}</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Intelligence Protocol Executed</p>
                </div>
              </div>

              <div className="bg-gray-50 border-4 border-dashed border-gray-200 p-4 space-y-4">
                <p className="text-sm font-bold leading-relaxed italic text-gray-600">
                  {message}
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase">目标归档目录 (Target Directory)</p>
                    <p className="text-xs font-black text-gray-900 uppercase italic underline decoration-blue-500">/dist_reports</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 text-white p-3 border-4 border-gray-900">
                <Download size={14} className="text-blue-400" />
                <span className="font-mono text-[9px] truncate">{fileName}</span>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-4 border-gray-900 p-3 font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                确认指令
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
