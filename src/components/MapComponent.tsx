import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaInfo, MarkerInfo } from '../types';
import { AREAS, MARKERS } from '../data';
import { MapPin, Navigation, Info, Shield, Droplet, Phone, Users, CheckCircle2, ChevronRight, Compass, List } from 'lucide-react';

interface MapComponentProps {
  selectedArea: AreaInfo;
  onAreaSelect: (area: AreaInfo) => void;
}

export default function MapComponent({ selectedArea, onAreaSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  const [filterType, setFilterType] = useState<string>('all');
  const [showTips, setShowTips] = useState<boolean>(true);
  const [hoveredMarker, setHoveredMarker] = useState<MarkerInfo | null>(null);

  // SVG Custom Marker Generator (保持不變)
  const getMarkerHtml = (type: 'shelter' | 'danger' | 'general' | 'pumping', name: string) => {
    let colorBg = 'bg-blue-500';
    let pulseBg = 'bg-blue-400';
    let iconSvg = '';
    if (type === 'shelter') {
      colorBg = 'bg-emerald-600'; pulseBg = 'bg-emerald-400';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3 6-6m-2.25-9.75h-.008v.008H16.5V3.75h-.008v.008H16.5M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`;
    } else if (type === 'danger') {
      colorBg = 'bg-rose-600'; pulseBg = 'bg-rose-400';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`;
    } else if (type === 'pumping') {
      colorBg = 'bg-cyan-600'; pulseBg = 'bg-cyan-400';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M12 3v18m0-18l-3 3m3-3l3 3M12 21l-3-3m3 3l3-3" /></svg>`;
    } else {
      colorBg = 'bg-amber-600'; pulseBg = 'bg-amber-400';
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25A7.5 7.5 0 0119.5 10.5z" /></svg>`;
    }
    return `<div class="relative flex items-center justify-center w-8 h-8"><div class="absolute w-7 h-7 rounded-full ${pulseBg} opacity-60 animate-ping"></div><div class="relative w-8 h-8 rounded-full ${colorBg} flex items-center justify-center border-2 border-white shadow-md text-white transition-all transform hover:scale-110">${iconSvg}</div></div>`;
  };

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [selectedArea.center.lat, selectedArea.center.lng],
        zoom: selectedArea.zoom,
        zoomControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedArea.center.lat, selectedArea.center.lng],
        selectedArea.zoom,
        { animate: true, duration: 1.5 }
      );
    }
  }, [selectedArea]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((marker) => map.removeLayer(marker));
    markersRef.current = {};
    const filteredMarkers = MARKERS.filter((mk) => filterType === 'all' || mk.type === filterType);
    filteredMarkers.forEach((markerData) => {
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: getMarkerHtml(markerData.type, markerData.name),
        iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -12],
      });
      const popupContent = `<div class="p-2 font-sans text-stone-800"><h4 class="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1">${markerData.name}</h4><p class="text-xs text-stone-600 mt-1">${markerData.description}</p></div>`;
      const marker = L.marker([markerData.position.lat, markerData.position.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
      markersRef.current[markerData.id] = marker;
    });
  }, [filterType]);

  const handleMarkerItemClick = (marker: MarkerInfo) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([marker.position.lat, marker.position.lng], 17, { animate: true, duration: 1 });
      setTimeout(() => {
        const leafMarker = markersRef.current[marker.id];
        if (leafMarker) leafMarker.openPopup();
      }, 1000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[650px] items-stretch">
      
      {/* 左側資訊與地標列表面板 (整合在一起) */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
        
        {/* 1. 區域選擇器 */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm text-white shrink-0">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-4 h-4 text-emerald-500" />
            <span>區域導航中心</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => onAreaSelect(area)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedArea.id === area.id
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-bold text-emerald-400">{selectedArea.name}</h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed line-clamp-2">
            {selectedArea.description}
          </p>
        </div>

        {/* 2. 重點地標清單 (從地圖移至此處) */}
        <div className="flex-1 min-h-0 bg-stone-900 border border-stone-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
              <List className="w-4 h-4 text-rose-500" />
              <span>區域關鍵設施清單</span>
            </div>
            <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">
              {MARKERS.filter((m) => filterType === 'all' || m.type === filterType).length} 處
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {MARKERS.filter((m) => filterType === 'all' || m.type === filterType).map((marker) => (
              <button
                key={marker.id}
                onClick={() => handleMarkerItemClick(marker)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-stone-800 transition text-sm text-stone-300 flex items-start gap-3 cursor-pointer border border-transparent hover:border-stone-700 group"
              >
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm ${
                  marker.type === 'shelter' ? 'bg-emerald-500' :
                  marker.type === 'danger' ? 'bg-rose-500' :
                  marker.type === 'pumping' ? 'bg-cyan-500' : 'bg-amber-500'
                }`} />
                <div className="min-w-0">
                  <div className="font-bold text-stone-100 group-hover:text-emerald-400 transition-colors truncate">
                    {marker.name}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    {marker.description}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-600 ml-auto self-center shrink-0 group-hover:text-stone-400" />
              </button>
            ))}
            {/* 若沒地標顯示 */}
            {MARKERS.filter((m) => filterType === 'all' || m.type === filterType).length === 0 && (
              <div className="p-10 text-center text-stone-500 text-xs italic">
                此分類目前無地標顯示
              </div>
            )}
          </div>
        </div>

        {/* 3. 提示卡片 */}
        {showTips && (
          <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-4 text-emerald-200 text-xs relative shrink-0">
            <button onClick={() => setShowTips(false)} className="absolute top-2 right-2 text-emerald-700 hover:text-emerald-300">×</button>
            <div className="flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-emerald-500" />
              <div className="space-y-1">
                <span className="font-bold">防災提醒：</span>
                <ul className="list-disc pl-3 space-y-0.5 text-emerald-400/90 leading-tight">
                  {selectedArea.tips.slice(0, 2).map((tip, idx) => <li key={idx}>{tip}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右側地圖主體 */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-3">
        {/* 地標篩選欄 */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-wrap items-center gap-3 text-white shrink-0">
          <span className="text-xs text-stone-400 font-medium ml-1">地圖篩選：</span>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { value: 'all', label: '全部', color: 'bg-stone-800' },
              { value: 'shelter', label: '避難所 🟢', color: 'hover:bg-emerald-900/30' },
              { value: 'danger', label: '警戒點 🔴', color: 'hover:bg-rose-900/30' },
              { value: 'pumping', label: '抽水站 🔵', color: 'hover:bg-cyan-900/30' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                  filterType === filter.value
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : `bg-stone-950 border-stone-800 text-stone-400 ${filter.color}`
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 地圖容器 - 現在這裡完全沒有浮動列表擋住了 */}
        <div className="relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg flex-1">
          <div id="map" ref={mapRef} className="w-full h-full absolute inset-0 z-10" />
        </div>
      </div>
    </div>
  );
}