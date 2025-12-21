import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { enterpriseApi } from '../../services/enterprise.service';
import { cityCoords, getRandomOffset } from '../../utils/geoUtils';
import { motion } from 'framer-motion';
import { 
  Zap, Map as MapIcon, Sliders, Clock, 
  Target, Info, ChevronRight, Maximize2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarMapPage: React.FC = () => {
  const [timeValue, setTimeRange] = useState(2025);
  const navigate = useNavigate();

  const { data: enterprisesData } = useQuery({
    queryKey: ['enterprises', 'all-map'],
    queryFn: () => enterpriseApi.getMapData().then(res => res.data),
  });

  const enterprises = enterprisesData?.items || [];

  // 为企业生成带有随机偏移的坐标
  const markers = useMemo(() => {
    return enterprises.map(ent => {
      const base = ent.base || '成都';
      const center = cityCoords[base] || cityCoords['成都'];
      return {
        ...ent,
        position: [center[0] + getRandomOffset(), center[1] + getRandomOffset()] as [number, number]
      };
    });
  }, [enterprises]);

  // 根据时间轴模拟可见性 (Time-Machine 逻辑)
  const visibleMarkers = useMemo(() => {
    if (timeValue >= 2025) return markers;
    // 模拟历史数据：时间越早，显示的企业越少
    const ratio = (timeValue - 2020) / (2025 - 2020);
    return markers.slice(0, Math.floor(markers.length * Math.max(0.1, ratio)));
  }, [markers, timeValue]);

  return (
    <div className="h-[calc(100vh-120px)] relative bg-gray-900 border-8 border-gray-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4">
        <div className="bg-gray-900/90 backdrop-blur-md border-4 border-blue-500 p-4 shadow-[8px_8px_0px_0px_rgba(59,130,246,0.3)]">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Target className="text-blue-400" /> 西南 AI 产业战术地图 // V2.0
          </h2>
          <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">西南地区地理空间情报实时监控</p>
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-md border-4 border-gray-800 p-4 flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-500 uppercase mb-1">活跃节点</span>
            <span className="text-lg font-black text-white italic">{visibleMarkers.length}</span>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-gray-500 uppercase mb-1">网格状态</span>
            <span className="text-[10px] font-black text-green-500 uppercase">已优化</span>
          </div>
        </div>
      </div>

      {/* Time Machine Slider */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-6">
        <div className="bg-gray-900/90 backdrop-blur-xl border-4 border-gray-800 p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-white uppercase italic flex items-center gap-2">
              <Clock className="text-indigo-400" size={14} /> 产业时空回溯系统
            </h3>
            <span className="text-xl font-black text-indigo-400 italic">年份: {timeValue}</span>
          </div>
          <input 
            type="range" 
            min="2020" 
            max="2030" 
            step="1"
            value={timeValue}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between mt-2 text-[8px] font-black text-gray-600 uppercase">
            <span>2020 (历史回溯)</span>
            <span>2025 (当前局势)</span>
            <span>2030 (演进预测)</span>
          </div>
          {timeValue > 2025 && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="mt-4 text-[10px] text-yellow-400 font-bold italic text-center animate-pulse"
            >
              [预测模式已开启] AI Agent 正在模拟未来高增长产业集群...
            </motion.p>
          )}
        </div>
      </div>

      {/* Map Implementation */}
      <MapContainer 
        center={[30.0, 105.5]} 
        zoom={6} 
        scrollWheelZoom={true} 
        className="h-full w-full grayscale contrast-125"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        
        {visibleMarkers.map((marker, idx) => {
          const isP0 = marker.priority === 'P0';
          return (
            <CircleMarker
              key={idx}
              center={marker.position}
              radius={isP0 ? 12 : 6}
              pathOptions={{
                fillColor: isP0 ? '#ef4444' : '#3b82f6',
                color: isP0 ? '#991b1b' : '#1d4ed8',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px] font-sans">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${isP0 ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                    <h4 className="font-black text-sm uppercase">{marker.enterpriseName}</h4>
                  </div>
                  <div className="space-y-1 text-[10px] font-bold text-gray-500 uppercase">
                    <p>总部所在: {marker.base}</p>
                    <p>所属行业: {(marker.industry as any)?.primary || '人工智能'}</p>
                    <p>决策能级: {marker.priority}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/enterprises/${marker.id}`)}
                    className="mt-3 w-full bg-gray-900 text-white p-2 font-black uppercase text-[10px] hover:bg-blue-600 transition-colors"
                  >
                    查看深度卷宗 <ChevronRight size={10} className="inline ml-1" />
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <style>{`
        .leaflet-container {
          background: #0f172a !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #fff !important;
          border: 4px solid #000 !important;
          border-radius: 0 !important;
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1) !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #000 !important;
        }
      `}</style>
    </div>
  );
};

export default WarMapPage;
