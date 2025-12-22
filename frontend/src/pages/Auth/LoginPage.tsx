
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Zap, ChevronRight, Terminal, Globe, User, Radio, Cpu } from 'lucide-react';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { NexusLogo } from '../../components/ui/neubrutalism/NexusLogo';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const { login, loginDemo } = useAuth();

  const handleProdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.response?.data?.message || '身份校验失败');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError('');
    try {
      await loginDemo();
    } catch (err: any) {
      console.error('Demo Login Detailed Error:', err);
      const msg = err.response?.data?.message || err.message || '演示环境初始化失败';
      setError(`DEBUG: ${msg}`);
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-sans overflow-hidden p-4 relative">
      
      {/* 智研矩阵背景层 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 背景巨幕水印 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none">
          <h1 className="text-[45vw] font-black italic tracking-tighter leading-none text-white">NEXUS</h1>
        </div>

        {/* 坐标十字准星 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-px bg-blue-900/30" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-blue-900/30" />
          <div className="absolute left-1/4 top-0 w-px h-full bg-blue-900/30" />
          <div className="absolute left-3/4 top-0 w-px h-full bg-blue-900/30" />
        </div>

        {/* 动态漂浮标签 */}
        {[
          { text: 'COGNITION', top: '15%', left: '10%' },
          { text: 'SYNERGY', top: '20%', left: '80%' },
          { text: 'DECISION_FLOW', top: '70%', left: '15%' },
          { text: 'SW_AI_MATRIX', top: '85%', left: '75%' },
        ].map((tag, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.05, 0.15, 0.05], y: [0, -20, 0] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-[10px] font-black tracking-[1em] text-blue-400/40"
            style={{ top: tag.top, left: tag.left }}
          >
            {tag.text}
          </motion.div>
        ))}

        {/* 模拟实时日志 - 修复 JSX 转义 */}
        <div className="absolute bottom-10 left-10 opacity-20 font-mono text-[8px] text-blue-500 space-y-1">
          <div className="flex gap-2"><span className="text-blue-300">{'>>'}</span> INITIALIZING_GRAVITY_PROTCOL... [OK]</div>
          <div className="flex gap-2"><span className="text-blue-300">{'>>'}</span> SYNCING_SOUTHWEST_INDUSTRIAL_NODES... [OK]</div>
          <div className="flex gap-2 animate-pulse"><span className="text-blue-300">{'>>'}</span> LISTENING_FOR_INTEL_STREAM...</div>
        </div>

        {/* 缓慢扫描线 */}
        <motion.div 
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent z-10"
        />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-0 relative z-10 border-8 border-gray-900 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] bg-white">
        
        {/* 左翼：联图 / NEXUS 生产指挥入口 */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 bg-white p-12 flex flex-col justify-between relative overflow-hidden border-r-8 border-gray-900"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          
          <div>
            <div className="flex flex-col mb-12">
              <div className="flex items-center gap-5 mb-2">
                <NexusLogo size="lg" color="bg-blue-600" />
                <div className="flex flex-col">
                  <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-gray-900">联图 / NEXUS</h1>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mt-1">Intelligence Research Platform</span>
                </div>
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-24">西南AI产业生态智研决策平台</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-100 border-4 border-red-600 text-red-800 font-black text-xs flex items-center gap-3">
                <Terminal size={20} /> ACCESS_DENIED: {error}
              </div>
            )}

            <form onSubmit={handleProdLogin} className="space-y-8 max-w-md">
              <NeubrutalInput
                label="情报员代号 (Username)" type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="INPUT ID" required
                autoComplete="off"
                icon={<User size={20} className="text-gray-900" />}
              />
              <NeubrutalInput
                label="访问密钥 (Passkey)" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                autoComplete="new-password"
                icon={<Lock size={20} className="text-gray-900" />}
              />
              <NeubrutalButton type="submit" disabled={loading || isDemoLoading} className="w-full py-5 text-xl italic tracking-tighter">
                {loading ? '正在同步智研矩阵...' : '接入指挥总线 ➔'}
              </NeubrutalButton>
            </form>
          </div>
          
          <div className="mt-16 pt-8 border-t-4 border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mb-2">Security: L7_ADVISORY_ONLY</p>
              <div className="flex gap-1">
                {Array.from({length: 8}).map((_, i) => <div key={i} className={`w-4 h-1 ${i < 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>)}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Radio size={14} className="animate-pulse text-red-500" />
              <span className="text-[8px] font-black uppercase">Live_Encrypted_Feed</span>
            </div>
          </div>
        </motion.div>

        {/* 右翼：演示观测入口 */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 bg-blue-600 p-12 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
            <h2 className="text-[25vw] font-black leading-none rotate-90 text-white">联图</h2>
          </div>

          <div className="relative z-10 text-white">
            <div className="flex items-center gap-4 mb-12">
              <NexusLogo size="md" color="bg-yellow-400" />
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">全息演兵场</h1>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-white text-5xl font-black italic tracking-tighter leading-[0.9]">
                  1,245 节点<br />实时全景
                </h2>
                <div className="h-2 w-20 bg-yellow-400"></div>
                <p className="text-blue-100 text-lg font-bold leading-relaxed italic">
                  开启‘联图’战术模拟环境，透视西南 AI 生态的每一个微观律动。
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  { icon: <Cpu size={16}/>, text: '26 维真实企业画像演示' },
                  { icon: <Globe size={16}/>, text: '跨区域能级分布透视' },
                  { icon: <Terminal size={16}/>, text: 'L7 级高机密研报解密' },
                  { icon: <Radio size={16}/>, text: '无风险数据操作沙盒' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-black text-xs uppercase italic bg-black/20 p-2 border-l-4 border-yellow-400">
                    {item.icon} {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <button 
              onClick={handleDemoLogin}
              disabled={loading || isDemoLoading}
              className="group w-full bg-yellow-400 hover:bg-white text-gray-900 border-4 border-gray-900 p-6 font-black uppercase italic tracking-[0.2em] text-xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-4 active:translate-x-1 active:translate-y-1"
            >
              {isDemoLoading ? 'INITIALIZING...' : '启动演示模态'} 
              <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 底部系统信息 */}
      <div className="absolute bottom-8 left-10 flex gap-12 opacity-30 font-mono text-[10px] text-white tracking-widest">
        <div className="flex flex-col">
          <span className="font-black text-blue-400 mb-1 uppercase">Terminal</span>
          <p>LIANTU_NEXUS_V3.0</p>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-blue-400 mb-1 uppercase">Environment</span>
          <p>CONTEXT_ISOLATION: ON</p>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-blue-400 mb-1 uppercase">Protocol</span>
          <p>© 2025 SOUTHWEST_AI_INTEL</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
