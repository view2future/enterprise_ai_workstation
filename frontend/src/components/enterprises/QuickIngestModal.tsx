import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Fingerprint, Zap, Check, AlertCircle, Loader2 } from 'lucide-react';
import { NeubrutalButton, NeubrutalCard } from '../ui/neubrutalism/NeubrutalComponents';
import apiClient from '../../services/api';

const QuickIngestModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    (window as any).showQuickIngest = () => setIsOpen(true);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    try {
      const response = await apiClient.post('/enterprises/action/parse-unstructured', { text });
      setParsedData(response.data);
    } catch (error) {
      console.error('Parse failed', error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    try {
      await apiClient.post('/enterprises', parsedData);
      setIsOpen(false);
      setText('');
      setParsedData(null);
      // 触发页面刷新
      window.location.reload();
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl"
          >
            <NeubrutalCard className="bg-white border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] !p-0 overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 p-6 border-b-8 border-gray-900 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                  <Terminal size={32} />
                  <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">快速情报入库协议</h2>
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Local NLP Extraction Engine V4.0</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={32} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Input */}
                <div className="p-8 border-r-8 border-gray-900 space-y-6 bg-gray-50">
                  <div className="space-y-2">
                    <label className="font-black uppercase text-xs tracking-widest text-gray-500 flex items-center gap-2">
                      <Zap size={14} className="text-yellow-500" /> 粘贴原始回访文本
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="将电话回访内容、微信推文片段等粘贴至此处..."
                      className="w-full h-80 p-4 border-4 border-gray-900 font-bold focus:outline-none focus:ring-0 focus:border-blue-600 bg-white shadow-inner"
                    />
                  </div>
                  <NeubrutalButton 
                    variant="primary" 
                    className="w-full text-xl py-4" 
                    onClick={handleParse}
                    disabled={isParsing || !text.trim()}
                  >
                    {isParsing ? <Loader2 className="animate-spin mx-auto" /> : '执行语义提取_'}
                  </NeubrutalButton>
                </div>

                {/* Right: Results */}
                <div className="p-8 space-y-6 relative overflow-y-auto max-h-[550px]">
                  <label className="font-black uppercase text-xs tracking-widest text-gray-500 flex items-center gap-2">
                    <Fingerprint size={14} className="text-blue-600" /> 拟入库字段预览
                  </label>

                  {parsedData ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <div className="p-4 border-4 border-gray-900 bg-blue-50">
                        <p className="text-[10px] font-black text-blue-600 uppercase">企业主体</p>
                        <p className="text-2xl font-black italic">{parsedData.enterpriseName}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border-4 border-gray-900 bg-yellow-50">
                          <p className="text-[10px] font-black text-yellow-600 uppercase">行业领域</p>
                          <p className="font-bold uppercase italic">{parsedData.industry}</p>
                        </div>
                        <div className="p-3 border-4 border-gray-900 bg-purple-50">
                          <p className="text-[10px] font-black text-purple-600 uppercase">线索城市</p>
                          <p className="font-bold uppercase italic">{parsedData.base}</p>
                        </div>
                      </div>

                      <div className="p-4 border-4 border-gray-900 bg-green-50">
                        <p className="text-[10px] font-black text-green-600 uppercase">预测转化阶段</p>
                        <p className="text-xl font-black italic">{parsedData.clueStage}</p>
                      </div>

                      <div className="p-4 border-4 border-gray-900 bg-gray-900 text-white">
                        <p className="text-[10px] font-black text-gray-400 uppercase">技术堆栈识别</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {parsedData.techStack?.map((t: string) => (
                            <span key={t} className="px-2 py-1 bg-blue-600 text-[10px] font-black rounded-sm border border-white/20">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t-4 border-dashed border-gray-200">
                        <NeubrutalButton 
                          variant="success" 
                          className="w-full py-4 text-xl" 
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="animate-spin mx-auto" /> : '确认并执行入库'}
                        </NeubrutalButton>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-80 flex flex-col items-center justify-center border-4 border-dashed border-gray-200 text-gray-300">
                      <AlertCircle size={48} className="mb-4" />
                      <p className="font-black uppercase tracking-widest text-sm">等待指令输入</p>
                    </div>
                  )}
                </div>
              </div>
            </NeubrutalCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickIngestModal;
