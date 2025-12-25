
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Cpu, Terminal, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { enterpriseApi } from '../services/enterprise.service';
import { NeubrutalButton } from './ui/neubrutalism/NeubrutalComponents';
import { soundEngine } from '../utils/SoundUtility';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleParse = async () => {
    if (!content.trim()) return;
    setIsParsing(true);
    soundEngine.playPneumatic();
    try {
      const res = await enterpriseApi.quickParse(content);
      setParsedData(res.data);
      soundEngine.playSuccess();
    } catch (err) {
      console.error('Parsing failed', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;
    setIsSaving(true);
    try {
      // 转换字段名为后端要求的中文 DTO 字段
      const dto = {
        企业名称: parsedData.enterpriseName,
        飞桨_文心: parsedData.feijiangWenxin,
        优先级: parsedData.priority,
        任务方向: parsedData.taskDirection,
        联系人信息: parsedData.contactInfo,
        base: '成都'
      };
      await enterpriseApi.createEnterprise(dto);
      soundEngine.playSuccess();
      onSuccess?.();
      onClose();
      // 重置状态
      setContent('');
      setParsedData(null);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-white border-8 border-gray-900 shadow-[25px_25px_0px_0px_rgba(59,130,246,1)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center border-b-4 border-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 text-gray-900 border-2 border-white rotate-3">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">智研闪录矩阵</h3>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mt-1">Intelligence Quick-Input Console v5.0</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-red-600 transition-colors border-2 border-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              {/* 输入区 */}
              {!parsedData ? (
                <div className="space-y-4">
                  <label className="block text-sm font-black uppercase text-gray-500 italic flex items-center gap-2">
                    <Terminal size={14} /> 请输入或粘贴碎片化情报 (Chat Logs, Emails, etc.)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-48 p-4 bg-gray-50 border-4 border-gray-900 font-bold text-sm focus:bg-yellow-50 outline-none transition-colors placeholder:opacity-30"
                    placeholder="例如：成华智能科技有限公司正在测试文心一言4.0，反馈识别速度很快。联系人：李经理 13800138000。"
                  />
                  <NeubrutalButton 
                    variant="primary" 
                    className="w-full py-4 text-xl italic tracking-tighter flex items-center justify-center gap-3"
                    onClick={handleParse}
                    disabled={isParsing || !content.trim()}
                  >
                    {isParsing ? <Loader2 className="animate-spin" /> : <Cpu />}
                    {isParsing ? '智研解析中...' : '启动语义解析 ➔'}
                  </NeubrutalButton>
                </div>
              ) : (
                /* 预览解析结果 */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 text-green-600 font-black uppercase text-xs">
                    <CheckCircle size={14} /> 解析成功：检测到结构化字段
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 border-4 border-gray-900 relative">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                       <Zap size={100} />
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase">企业名称</p>
                        <p className="text-lg font-black uppercase tracking-tighter text-blue-600">{parsedData.enterpriseName || '---'}</p>
                      </div>
                      <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase">技术底座</p>
                        <span className="px-2 py-1 bg-gray-900 text-white text-[10px] font-black uppercase italic">{parsedData.feijiangWenxin || '未识别'}</span>
                      </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase">联系人信息</p>
                        <p className="font-bold text-sm">{parsedData.contactInfo || '---'}</p>
                      </div>
                      <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase">战力分级</p>
                        <span className={`px-2 py-1 border-2 border-gray-900 text-[10px] font-black ${parsedData.priority === 'P0' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                          {parsedData.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setParsedData(null)}
                      className="flex-1 py-4 border-4 border-gray-900 font-black uppercase text-sm hover:bg-gray-100 transition-all"
                    >
                      重新解析
                    </button>
                    <NeubrutalButton 
                      variant="success" 
                      className="flex-[2] py-4 text-xl italic tracking-tighter flex items-center justify-center gap-3"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="animate-spin" /> : <Send />}
                      {isSaving ? '正在入库...' : '确认并录入档案 ➔'}
                    </NeubrutalButton>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="bg-gray-100 p-4 border-t-4 border-gray-900 flex justify-between items-center px-8">
               <div className="flex items-center gap-2 opacity-40">
                  <Terminal size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">NLP Engine: Semantic_Extractor_v1</span>
               </div>
               <div className="text-[8px] font-bold text-gray-400 italic">
                  * 录入后系统将自动启动外部数据补全任务 (registeredCapital, etc.)
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
