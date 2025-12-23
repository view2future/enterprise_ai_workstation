
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  show, 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  const icons = {
    success: <CheckCircle className="text-green-600" size={18} />,
    info: <Info className="text-blue-600" size={18} />,
    error: <AlertCircle className="text-red-600" size={18} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-600',
    info: 'bg-blue-50 border-blue-600',
    error: 'bg-red-50 border-red-600',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={`fixed bottom-10 left-1/2 z-[9999] flex items-center gap-3 px-6 py-3 border-4 border-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${colors[type]}`}
        >
          {icons[type]}
          <span className="font-black uppercase text-xs tracking-wider text-gray-900">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
