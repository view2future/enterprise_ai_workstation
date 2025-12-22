import React, { useState, useMemo, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../services/dashboard.service';
import { cityCoords, getRandomOffset } from '../../utils/geoUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Sliders, Clock, Target, Info, ChevronRight, Maximize2, 
  Plus, Activity, ShieldAlert, Cpu, Terminal, Share2, Globe, Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 模拟年度数据趋势，用于曲线绘制
const yearlyCounts = [
  { year: 2020, count: 42 },
  { year: 2021, count: 86 },
  { year: 2022, count: 156 },
  { year: 2023, count: 280 },
  { year: 2024, count: 410 },
  { year: 2025, count: 526 },
  { year: 2026, count: 680 },
  { year: 2027, count: 850 },
  { year: 2028, count: 1100 },
  { year: 2029, count: 1450 },
  { year: 2030, count: 1800 },
];

const WarMapPage: React.FC = () => {
  const mapRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const overlayGroupRef = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [timeValue, setTimeRange] = useState(2025);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [logs, setLogs] = useState<string[]>(["[SYSTEM_INIT] Neural Core online", "[WAR_MAP] Ready for temporal simulation..."]);
  const [isBloomed, setIsBloomed] = useState(false);
  const navigate = useNavigate();

  const { data: enterprises } = useQuery({
    queryKey: ['dashboard', 'map-data'],
    queryFn: () => dashboardApi.getMapData().then(res => res.data),
  });

  // 1. 初始化地图引擎
  useEffect(() => {
    let mapInstance: any = null;
    
    // 确保 DOM 容器存在后再加载
    if (!containerRef.current) return;

    AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.InfoWindow', 'AMap.CircleMarker', 'AMap.OverlayGroup', 'AMap.Circle'],
    }).then((AMap) => {
      // 再次检查容器
      if (!containerRef.current) return;

      mapInstance = new AMap.Map(containerRef.current, {
        viewMode: '3D',
        zoom: 6,
        center: [105.0, 30.5],
        mapStyle: 'amap://styles/darkblue',
        pitch: 0,
        showLabel: true,
      });

      mapRef.current = mapInstance;
      
      mapInstance.on('complete', () => {
        setIsMapLoaded(true);
        overlayGroupRef.current = new AMap.OverlayGroup();
        mapInstance.add(overlayGroupRef.current);
        
        infoWindowRef.current = new AMap.InfoWindow({ 
          offset: new AMap.Pixel(0, -15),
          autoMove: true,
          closeWhenClickMap: true
        });

        // 初始战术序列
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.setZoomAndCenter(14, [104.0648, 30.6586], false, 3000);
            mapRef.current.setPitch(55, false, 3000);
            setTimeout(() => setIsBloomed(true), 3000);
          }
        }, 1000);
      });

    }).catch(e => console.error('AMap Engine Error:', e));

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
        mapRef.current = null;
      }
    };
  }, []);

  const markersData = useMemo(() => {
    if (!Array.isArray(enterprises)) return [];
    return enterprises.map(ent => {
      const base = ent.base || '成都';
      const center = cityCoords[base] || cityCoords['成都'];
      return {
        ...ent,
        coords: [center[1] + getRandomOffset(), center[0] + getRandomOffset()] as [number, number]
      };
    });
  }, [enterprises]);

  const visibleMarkersData = useMemo(() => {
    if (timeValue >= 2025) return markersData;
    const ratio = (timeValue - 2020) / (2025 - 2020);
    return markersData.slice(0, Math.floor(markersData.length * Math.max(0.05, ratio)));
  }, [markersData, timeValue]);

  // 2. 渲染点位与触发涟漪特效
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isBloomed || !overlayGroupRef.current) return;

    const AMap = (window as any).AMap;
    const group = overlayGroupRef.current;
    
    // 安全清理
    try {
      group.clearOverlays();
    } catch (e) {
      console.warn('Overlay cleanup failed', e);
    }

    const markers: any[] = [];

    visibleMarkersData.forEach((ent) => {
      const isP0 = ent.priority === 'P0';
      const circle = new AMap.CircleMarker({
        center: ent.coords,
        radius: isP0 ? 12 : 6,
        fillColor: isP0 ? '#ef4444' : '#3b82f6',
        strokeColor: '#fff',
        strokeWeight: 2,
        fillOpacity: 0.9,
        zIndex: isP0 ? 100 : 10,
        cursor: 'pointer'
      });

      circle.on('click', () => {
        const content = `
          <div class="cyber-popup-v2">
            <div class="popup-header">
              <span class="status-dot ${isP0 ? 'red' : 'blue'}"></span>
              <h4>${ent.enterpriseName}</h4>
            </div>
            <div class="popup-body">
              <p><span>总部区域:</span> <strong>${ent.base}</strong></p>
              <p><span>业务核心:</span> <strong>${(ent.industry as any)?.primary || '人工智能'}</strong></p>
              <p><span>能级评估:</span> <strong class="${isP0 ? 'text-red' : 'text-blue'}">${ent.priority}</strong></p>
            </div>
            <button class="dossier-btn" id="dossier-btn-${ent.id}">
              调取深度卷宗 ➔
            </button>
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapRef.current, ent.coords);

        setTimeout(() => {
          const btn = document.getElementById(`dossier-btn-${ent.id}`);
          if (btn) btn.onclick = () => {
            infoWindowRef.current.close();
            navigate(`/enterprises/${ent.id}`);
          };
        }, 100);
      });

      markers.push(circle);
    });

    group.addOverlays(markers);

    if ([2020, 2025, 2030].includes(timeValue)) {
      if (pulseCircleRef.current) pulseCircleRef.current.setMap(null);
      pulseCircleRef.current = new AMap.Circle({
        center: [104.0648, 30.6586],
        radius: 1000,
        fillColor: timeValue > 2025 ? '#8b5cf6' : '#3b82f6',
        fillOpacity: 0.2,
        strokeColor: timeValue > 2025 ? '#8b5cf6' : '#3b82f6',
        strokeWeight: 2,
      });
      pulseCircleRef.current.setMap(mapRef.current);
      
      let r = 1000;
      const pulseInt = setInterval(() => {
        r += 5000;
        if (r > 100000) {
          clearInterval(pulseInt);
          if (pulseCircleRef.current) pulseCircleRef.current.setMap(null);
        } else {
          pulseCircleRef.current?.setRadius(r);
        }
      }, 50);
    }

    if (timeValue > 2025) {
      mapRef.current.setPitch(65, false, 800);
    } else {
      mapRef.current.setPitch(50, false, 800);
    }

  }, [visibleMarkersData, isMapLoaded, isBloomed, timeValue, navigate]);

  return (
    <div 
      className={`h-[calc(100vh-120px)] relative border-[12px] border-gray-900 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden transition-all duration-1000 ${timeValue > 2025 ? 'bg-indigo-950' : 'bg-gray-950'}`}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className={`absolute inset-0 z-10 pointer-events-none bg-cyber-grid transition-opacity ${timeValue > 2025 ? 'opacity-[0.15]' : 'opacity-[0.08]'}`}></div>
      
      <AnimatePresence>
        {timeValue > 2025 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[11] pointer-events-none font-mono text-[8px] text-indigo-400 overflow-hidden leading-none p-2"
          >
            {Array(50).fill(0).map((_, i) => <div key={i}>10101101010101010101010101010101010101010101010101010101010101010101010101010101010101010101</div>)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-[100] space-y-2 text-right">
        <div className="bg-gray-900/80 backdrop-blur-md border-2 border-gray-800 p-2 shadow-lg">
          <p className="text-[8px] font-black text-gray-500 uppercase">Live_Nodes</p>
          <p className="text-xl font-black text-blue-400 italic">{visibleMarkersData.length}</p>
        </div>
        <div className="text-[8px] font-mono text-blue-500/50">
          <p>X: {mousePos.x} Y: {mousePos.y}</p>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-[100] space-y-6">
        <motion.div 
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="bg-gray-950/80 backdrop-blur-xl border-l-8 border-blue-600 p-6 shadow-2xl"
        >
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Target className={`animate-pulse ${timeValue > 2025 ? 'text-indigo-400' : 'text-blue-400'}`} /> {timeValue > 2025 ? '未来演进推演' : '战术指挥大脑'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full animate-ping ${isMapLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest italic">
              {isMapLoaded ? 'NEURAL_SYNC_ACTIVE' : 'INITIALIZING_CORE...'}
            </p>
          </div>
        </motion.div>
        
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-4 w-64 h-40 font-mono text-[9px] overflow-hidden space-y-2">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
            <span className="text-gray-500 font-black uppercase">Live Logs</span>
            <Terminal size={10} className="text-gray-500" />
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 - (i * 0.15) }} key={log + i} className={i === 0 ? "text-indigo-400 font-bold" : "text-gray-600"}>
                {log}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} id="amap-container" className="h-full w-full"></div>

      <div className="absolute bottom-10 left-8 z-[100] flex flex-col gap-3">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="w-12 h-12 bg-white border-4 border-gray-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(59,130,246,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          title="放大探测倍率"
        >
          <Plus size={24} className="text-gray-900" />
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="w-12 h-12 bg-white border-4 border-gray-900 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(59,130,246,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          title="缩小探测倍率"
        >
          <Maximize2 size={24} className="text-gray-900" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-950/60 backdrop-blur-xl border-2 border-gray-800 p-4 shadow-2xl rounded-2xl relative"
        >
          <div className="absolute top-0 left-4 right-4 h-8 -translate-y-full opacity-30 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path 
                d={`M 0,100 ${yearlyCounts.map((y, i) => `L ${(i/10)*1000},${100 - (y.count/1800)*100}`).join(' ')}`}
                fill="none" stroke={timeValue > 2025 ? "#8b5cf6" : "#3b82f6"} strokeWidth="4"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 bg-indigo-600/20 border border-indigo-500/50 rounded-lg">
                <Clock className="text-indigo-400" size={16} />
              </div>
              <div className="hidden sm:block">
                <h3 className="text-[9px] font-black text-white uppercase tracking-tighter">产业时空模拟</h3>
                <p className="text-[7px] text-gray-500 font-bold uppercase">TEMPORAL SIM</p>
              </div>
            </div>

            <div className="flex-1 relative flex items-center">
              <div className="absolute inset-x-0 -bottom-1 flex justify-between px-1 opacity-20">
                {Array(11).fill(0).map((_, i) => (
                  <div key={i} className={`w-0.5 ${i % 5 === 0 ? 'h-2 bg-white' : 'h-1 bg-gray-400'}`}></div>
                ))}
              </div>
              <input 
                type="range" min="2020" max="2030" step="1" value={timeValue}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500 z-10"
              />
            </div>

            <div className="flex items-center gap-6 min-w-[180px] justify-end border-l border-gray-800 pl-6">
              <div className="text-right">
                <span className="block text-[7px] font-black text-gray-500 uppercase tracking-tighter">Nodes Count</span>
                <motion.span key={`cnt-${timeValue}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-mono font-black text-white italic">
                  {yearlyCounts.find(y => y.year === timeValue)?.count || 0}
                </motion.span>
              </div>
              <div className="text-right">
                <span className="block text-[7px] font-black text-gray-500 uppercase tracking-tighter">Epoch</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={timeValue} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }}
                    className={`text-3xl font-black italic font-mono leading-none ${timeValue > 2025 ? 'text-amber-400 glow-text-amber' : 'text-cyan-400 glow-text-cyan'}`}
                  >
                    {timeValue}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        #amap-container { background: #020617 !important; }
        .amap-logo, .amap-copyright { display: none !important; }
        .amap-info-content { padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; }
        .cyber-popup-v2 {
          background: #ffffff !important; border: 4px solid #1e293b !important;
          box-shadow: 12px 12px 0px 0px rgba(0,0,0,1) !important;
          min-width: 260px; padding: 20px; font-family: 'Inter', sans-serif;
          color: #0f172a !important;
        }
        .popup-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 3px solid #f1f5f9; padding-bottom: 10px; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .status-dot.red { background: #ef4444; box-shadow: 0 0 10px #ef4444; }
        .status-dot.blue { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
        .popup-header h4 { margin: 0; font-weight: 900; text-transform: uppercase; color: #0f172a; font-size: 15px; }
        .popup-body p { margin: 8px 0; font-size: 11px; color: #64748b; text-transform: uppercase; display: flex; justify-content: space-between; }
        .popup-body strong { color: #0f172a; }
        .dossier-btn {
          margin-top: 20px; width: 100%; background: #0f172a; color: white; border: none; padding: 12px;
          font-weight: 900; text-transform: uppercase; font-size: 11px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s;
          box-shadow: 6px 6px 0px 0px rgba(59,130,246,0.5);
        }
        .dossier-btn:hover { background: #3b82f6; transform: translate(-2px, -2px); box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
        input[type=range]::-webkit-slider-thumb {
          border: 2px solid #ffffff; height: 20px; width: 4px;
          border-radius: 4px; background: #3b82f6; cursor: pointer;
          -webkit-appearance: none; margin-top: -8px;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
        }
        .glow-text-amber { text-shadow: 0 0 15px rgba(251, 191, 36, 0.6); }
        .glow-text-cyan { text-shadow: 0 0 15px rgba(34, 211, 238, 0.6); }
      `}</style>
    </div>
  );
};

export default WarMapPage;