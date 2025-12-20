import React from 'react';
import { DataCapsule } from '../../components/sync/DataCapsule';
import { SyncPortal } from '../../components/sync/SyncPortal';
import { Shield, Share2, Users } from 'lucide-react';

const SyncSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DataCapsule />
        <SyncPortal />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
        {/* 装饰性光晕 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl">
            <Shield className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">离线同步协作指南</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol & Operation Handbook</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white font-black text-sm uppercase">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">01</span>
              数据封印
            </div>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              点击“生成数据胶囊”将本地最新的企业数据进行加密打包。生成的 .eap 文件采用了 AES-256 加密，仅能由授权设备解密。
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white font-black text-sm uppercase">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">02</span>
              物理传输
            </div>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              将生成的同步文件通过安全的传输通道发送给需要同步的小组成员。推荐使用企业内网文件共享或加密存储介质。
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white font-black text-sm uppercase">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">03</span>
              对接融合
            </div>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              接收者将文件拖入“传送门”，系统将自动识别差异并进行智能合并。如遇版本冲突，请根据系统提示选择优先级版本。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncSection;
