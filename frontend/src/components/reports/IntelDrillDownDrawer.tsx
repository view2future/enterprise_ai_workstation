
import React from 'react';
import { X, ExternalLink, Building2, MapPin, Zap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeubrutalButton } from '../ui/neubrutalism/NeubrutalComponents';

export interface DrillDownData {
  title: string;
  type: 'enterprise' | 'list';
  filter?: any;
  items?: any[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
}

const IntelDrillDownDrawer: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <>
      {/* 遮罩 */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* 抽屉 */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l-8 border-gray-900 z-[101] shadow-[-20px_0px_0px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-400 mb-1 tracking-[0.2em]">Drill-down Intelligence</p>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{data.title}</h3>
            </div>
            <button onClick={onClose} className="p-2 border-2 border-white hover:bg-red-600 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-blue-600 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase text-gray-400">原始实体记录提取中...</span>
            </div>

            <div className="space-y-4">
              {data.items?.map((item, i) => (
                <div 
                  key={i} 
                  className="p-4 border-4 border-gray-900 bg-gray-50 hover:bg-yellow-50 hover:-translate-y-1 transition-all cursor-pointer group"
                  onClick={() => navigate(`/enterprises/${item.id || 1}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-sm uppercase group-hover:text-blue-600">{item.name || '示例企业名称'}</h4>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                      <MapPin size={10} /> {item.base || '成都'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                      <Award size={10} /> {item.level || '普通伙伴'}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                      <Zap size={10} /> {item.calls || '120k'} API
                    </div>
                  </div>
                </div>
              ))}

              {(!data.items || data.items.length === 0) && (
                <div className="text-center py-20 opacity-20 italic font-black">
                  NO ENTITY RECORDS FOUND
                </div>
              )}
            </div>
          </div>

          {/* 底部 */}
          <div className="p-6 border-t-4 border-gray-100 bg-gray-50">
            <NeubrutalButton 
              variant="primary" 
              className="w-full"
              onClick={() => navigate('/enterprises')}
            >
              在资源库中查看全量数据
            </NeubrutalButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntelDrillDownDrawer;
