import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lock, Zap, ChevronRight, Terminal, Globe, User, Radio, Cpu, ShieldAlert, Activity, Database } from 'lucide-react';
import { NeubrutalButton, NeubrutalInput } from '../../components/ui/neubrutalism/NeubrutalComponents';
import { NexusLogo } from '../../components/ui/neubrutalism/NexusLogo';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const { login, loginDemo } = useAuth();

  // 鼠标引力视差
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  const bgX = useTransform(mouseX, (v) => v * 0.01);
  const bgY = useTransform(mouseY, (v) => v * 0.01);

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
      setError('演示环境初始化失败');
      setIsDemoLoading(false);
    }
  };

  // 模拟传感器数据波动
  const [sensorVal, setSensorVal] = useState(85);
  useEffect(() => {
    const timer = setInterval(() => {
      setSensorVal(v => Math.max(80, Math.min(98, v + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center bg-[#020202] font-sans overflow-hidden p-4 relative"
    >
      
      {/* 联图/NEXUS 智研流动背景引擎 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        
        {/* 1. 无限滚动背景网格 */}
        <motion.div 
          animate={{ 
            backgroundPosition: ['0px 0px', '100px 100px'] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.05]"
          style={{ 
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* 2. 巨幕视差水印 + 流光效果 */}
        <motion.div 
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 flex items-center justify-center select-none"
        >
          <div className="relative">
            <h1 className="text-[55vw] font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-900/10 via-blue-500/20 to-blue-900/10 bg-[length:200%_auto] animate-flow-text">
              NEXUS
            </h1>
          </div>
        </motion.div>

        {/* 3. 横向流动的数据包碎片 (Data Streams) */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="absolute h-px w-64 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent flex items-center"
            style={{ top: `${20 * i}%` }}
          >
            <span className="ml-4 text-[8px] font-mono text-blue-400/60 tracking-widest whitespace-nowrap">
              SYNC_NODE_{1000 + i} {'>>'} P0_ACTIVE {'>>'} API_LOAD: {80 + i}%
            </span>
          </motion.div>
        ))}

        {/* 4. 核心：中心旋转脉动环 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-[900px] h-[900px] border border-blue-500/20 rounded-full flex items-center justify-center"
          >
            <div className="w-[850px] h-[850px] border-[2px] border-dashed border-blue-900/40 rounded-full animate-spin-slow" />
          </motion.div>
        </div>

        {/* 5. 右侧：动态高精度监测面板 */}
        <div className="absolute top-0 right-0 h-full w-72 border-l border-blue-900/30 bg-black/40 backdrop-blur-md p-10 hidden 2xl:flex flex-col justify-between">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Enc_Matrix_Stability</p>
                <span className="font-mono text-[10px] text-blue-400">{sensorVal.toFixed(2)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-900 border border-blue-900/50 p-0.5">
                <motion.div 
                  animate={{ width: `${sensorVal}%` }}
                  className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,1)]" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic flex items-center gap-2">
                <Radio size={12} className="animate-pulse" /> Live_Intel_Nodes
              </p>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="group flex justify-between items-center bg-blue-950/20 p-2 border-l-2 border-blue-800 hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-blue-300">HUB_CD_{i}0{i}</span>
                  </div>
                  <span className="text-[8px] font-bold text-blue-700 uppercase">Standby</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-2 border-blue-900/50 bg-blue-900/10">
            <p className="text-[9px] font-black text-blue-400 leading-tight uppercase italic">
              Warning: Unauthorized access to NEXUS kernel will trigger immediate IP protocol isolation.
            </p>
          </div>
        </div>

        {/* 6. 底部：终端流水日志 */}
        <div className="absolute bottom-12 left-12 opacity-90 font-mono text-[9px] space-y-2 bg-black/60 p-5 border-l-4 border-blue-600 backdrop-blur-xl shadow-[20px_0_50px_rgba(0,0,0,1)]">
          <div className="flex gap-2 text-blue-400 items-center">
            <span className="text-blue-200 font-black">{'>>'}</span> 
            LIANTU_NEXUS_OS: <span className="text-green-400 font-black px-1 bg-green-900/20">[KERNEL_READY]</span>
          </div>
          <div className="flex gap-2 text-blue-400">
            <span className="text-blue-200 font-black">{'>>'}</span> 
            SYNCING_SOUTHWEST_GRAVITY_FIELD... <span className="text-blue-300">DONE</span>
          </div>
          <div className="flex gap-2 text-blue-400">
            <span className="text-blue-200 font-black">{'>>'}</span> 
            UPLINK_SECURITY: <span className="text-yellow-400 font-black italic">LEVEL_7_ADMIRAL</span>
          </div>
          <motion.div 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }} 
            className="flex gap-2 text-white font-black bg-blue-600 px-3 py-1 mt-2"
          >
            <span className="text-white animate-pulse">{'>>'}</span> 
            AWAITING_COMMAND_AUTHORIZATION_...
          </motion.div>
        </div>

        {/* 全局扫描带 */}
        <motion.div 
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-blue-500/[0.06] to-transparent z-10 pointer-events-none"
        />
      </div>

      {/* 登录主容器 */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-0 relative z-10 border-8 border-gray-900 shadow-[50px_50px_0px_0px_rgba(0,0,0,1)] bg-white">
        
        {/* 左翼：联图 / NEXUS 生产指挥入口 */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-3 bg-white p-12 flex flex-col justify-between relative overflow-hidden border-r-8 border-gray-900"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
          
          <div>
            <div className="flex flex-col mb-12">
              <div className="flex items-center gap-6 mb-2">
                <NexusLogo size="lg" color="bg-blue-600" />
                <div className="flex flex-col">
                  <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-gray-900">联图 / NEXUS</h1>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mt-1 italic">Intelligence Research Platform</span>
                </div>
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-28">西南AI产业生态智研决策平台</p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-50 border-4 border-gray-900 text-gray-900 font-black text-xs flex items-center gap-4 animate-shake shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ShieldAlert size={24} className="text-red-600" />
                <div>
                  <p className="uppercase tracking-tighter text-[10px]">Security_Access_Fault</p>
                  <p className="text-sm italic">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleProdLogin} className="space-y-8 max-w-md">
              <NeubrutalInput
                label="情报员代号 (Username)" type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ID_IDENTIFIER" required
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
              <button 
                type="submit" 
                disabled={loading || isDemoLoading} 
                className="group w-full bg-yellow-400 hover:bg-white text-gray-900 border-4 border-gray-900 p-6 font-black uppercase italic tracking-[0.2em] text-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-4 active:translate-x-2 active:translate-y-2"
              >
                {loading ? 'MATRIX_BOOTING...' : '接入联图Nexus ➔'}
              </button>
            </form>
          </div>
          
          <div className="mt-16 pt-8 border-t-4 border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-3 text-gray-500 italic">Auth_Protocol: L7_ADVISORY</p>
              <div className="flex gap-1.5">
                {Array.from({length: 12}).map((_, i) => <div key={i} className={`w-3 h-1 ${i < 5 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>)}
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Radio size={16} className="animate-pulse text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Live_Sync_Active</span>
            </div>
          </div>
        </motion.div>

        {/* 右翼：演示观测入口 */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
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
                <h2 className="text-white text-5xl font-black italic tracking-tighter leading-[0.8]">
                  1,245<br />NODES
                </h2>
                <div className="h-3 w-24 bg-yellow-400"></div>
                <p className="text-blue-100 text-xl font-bold leading-relaxed italic tracking-tight">
                  开启‘联图’战术模拟环境，实时观测西南 AI 生态的每一个微观律动。
                </p>
              </div>

              <ul className="space-y-4">
                {[
                  { icon: <Cpu size={18}/>, text: '26 维真实企业画像演示' },
                  { icon: <Globe size={18}/>, text: '跨区域能级分布透视' },
                  { icon: <Terminal size={18}/>, text: 'L7 级研报自动化解密' },
                  { icon: <Activity size={18}/>, text: '核心 API 脉动仿真' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white font-black text-sm uppercase italic bg-black/20 p-3 border-l-8 border-yellow-400 shadow-xl">
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
              className="group w-full bg-yellow-400 hover:bg-white text-gray-900 border-4 border-gray-900 p-6 font-black uppercase italic tracking-[0.2em] text-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center justify-center gap-4 active:translate-x-2 active:translate-y-2"
            >
              {isDemoLoading ? 'BOOTING_SIM...' : '启动演示模态'} 
              <ChevronRight size={32} className="group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 底部系统信息 */}
      <div className="absolute bottom-8 left-10 right-10 flex justify-between opacity-60 font-mono text-[10px] text-white tracking-[0.4em]">
        <div className="flex gap-16">
          <div className="flex flex-col">
            <span className="font-black text-blue-400 mb-1">TERMINAL_ID</span>
            <p className="text-blue-100">LIANTU_NEXUS_OS_V3.0</p>
          </div>
          <div className="flex flex-col border-l border-white/20 pl-8">
            <span className="font-black text-blue-400 mb-1">NETWORK_UPLINK</span>
            <p className="text-blue-100 animate-pulse">ENCRYPTED_AND_LIVE</p>
          </div>
        </div>
        <div className="text-right flex flex-col">
          <span className="font-black text-blue-400 mb-1">LEGAL_PROTOCOL</span>
          <p>© 2025 SOUTHWEST_AI_INTEL // ALL_RIGHTS_RESERVED</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;