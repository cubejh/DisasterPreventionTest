import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AreaInfo, MarkerInfo } from '../types';
import { AREAS, MARKERS } from '../data';
import { MapPin, Navigation, Info, Shield, Droplet, Phone, Users, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

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

  // SVG Custom Marker Generator
  const getMarkerHtml = (type: 'shelter' | 'danger' | 'general' | 'pumping', name: string) => {
    let colorBg = 'bg-blue-500';
    let pulseBg = 'bg-blue-400';
    let iconSvg = '';

    if (type === 'shelter') {
      colorBg = 'bg-emerald-600';
      pulseBg = 'bg-emerald-400';
      // Shield or Home
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3 6-6m-2.25-9.75h-.008v.008H16.5V3.75h-.008v.008H16.5M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      `;
    } else if (type === 'danger') {
      colorBg = 'bg-rose-600';
      pulseBg = 'bg-rose-400';
      // Triangle alert
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      `;
    } else if (type === 'pumping') {
      colorBg = 'bg-cyan-600';
      pulseBg = 'bg-cyan-400';
      // Water droplet or fan
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M12 3v18m0-18l-3 3m3-3l3 3M12 21l-3-3m3 3l3-3" />
        </svg>
      `;
    } else {
      colorBg = 'bg-amber-600';
      pulseBg = 'bg-amber-400';
      // General location pin
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25A7.5 7.5 0 0119.5 10.5z" />
        </svg>
      `;
    }

    return `
      <div class="relative flex items-center justify-center w-8 h-8">
        <div class="absolute w-7 h-7 rounded-full ${pulseBg} opacity-60 animate-ping"></div>
        <div class="relative w-8 h-8 rounded-full ${colorBg} flex items-center justify-center border-2 border-white shadow-md text-white transition-all transform hover:scale-110">
          ${iconSvg}
        </div>
      </div>
    `;
  };

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: [selectedArea.center.lat, selectedArea.center.lng],
        zoom: selectedArea.zoom,
        zoomControl: false, // Customized position later
      });

      // Add OSM layered tile
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add zoom control at bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when selected area from props changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedArea.center.lat, selectedArea.center.lng],
        selectedArea.zoom,
        {
          animate: true,
          duration: 1.5,
        }
      );
    }
  }, [selectedArea]);

  // Update/place markers based on active filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers completely
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    // Filter markers
    const filteredMarkers = MARKERS.filter((mk) => {
      if (filterType === 'all') return true;
      return mk.type === filterType;
    });

    // Render new markers
    filteredMarkers.forEach((markerData) => {
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: getMarkerHtml(markerData.type, markerData.name),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -12],
      });

      const popupContent = `
        <div class="p-2 font-sans text-stone-800">
          <h4 class="font-bold text-sm text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1">
            ${markerData.name}
          </h4>
          <p class="text-xs text-stone-600 mt-1 leading-relaxed">${markerData.description}</p>
          ${
            markerData.phone
              ? `<div class="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">📞 聯絡: ${markerData.phone}</div>`
              : ''
          }
          ${
            markerData.capacity
              ? `<div class="text-[11px] text-blue-700 font-medium flex items-center gap-1">👥 容納: ${markerData.capacity}</div>`
              : ''
          }
        </div>
      `;

      const marker = L.marker([markerData.position.lat, markerData.position.lng], {
        icon: customIcon,
      })
        .addTo(map)
        .bindPopup(popupContent);

      markersRef.current[markerData.id] = marker;
    });
  }, [filterType]);

  const handleMarkerItemClick = (marker: MarkerInfo) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([marker.position.lat, marker.position.lng], 17, {
        animate: true,
        duration: 1,
      });

      // Wait a moment and trigger leaflet popup
      setTimeout(() => {
        const leafMarker = markersRef.current[marker.id];
        if (leafMarker) {
          leafMarker.openPopup();
        }
      }, 1000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* MAP CONTROLS & INFO PANEL */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-5 justify-between">
        
        {/* District Selector & Descriptive Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm text-white flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-widest">
              <Compass className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>區域導航中心</span>
            </div>
            <h2 className="text-xl font-bold font-sans mt-1 text-emerald-400 flex items-center gap-2">
              {selectedArea.name}
            </h2>
          </div>

          {/* Quick Buttons row */}
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => onAreaSelect(area)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans border transition-all duration-200 cursor-pointer ${
                  selectedArea.id === area.id
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>

          <p className="text-stone-300 text-sm leading-relaxed border-t border-stone-800 pt-3">
            {selectedArea.description}
          </p>

          {/* Highlight features */}
          <div className="space-y-2 mt-1">
            <h4 className="text-xs font-semibold text-emerald-500">區域防災關鍵：</h4>
            <div className="space-y-1.5">
              {selectedArea.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tip / Alerts Card Card */}
        {showTips && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 text-emerald-200 text-xs shadow-inner relative">
            <button
              onClick={() => setShowTips(false)}
              className="absolute top-2 right-2 text-emerald-500 hover:text-emerald-300 cursor-pointer"
            >
              ×
            </button>
            <div className="flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="space-y-1">
                <span className="font-bold">防災與學習提醒：</span>
                <ul className="list-disc pl-3 space-y-1 text-emerald-300/95 leading-normal">
                  {selectedArea.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAP GRID (8 Cols on large screens) */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-3">
        {/* Filter Map Pins Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">篩選地標類型：</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { value: 'all', label: '全部顯示', color: 'bg-stone-800 hover:bg-stone-700' },
                { value: 'shelter', label: '避難收容處所 🟢', color: 'hover:bg-emerald-900/30' },
                { value: 'danger', label: '歷史淹水/警戒點 🔴', color: 'hover:bg-rose-900/30' },
                { value: 'pumping', label: '抽水站/防汛工程 🔵', color: 'hover:bg-cyan-900/30' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border cursor-pointer transition-all ${
                    filterType === filter.value
                      ? 'bg-stone-100 text-stone-950 border-white font-semibold'
                      : `bg-stone-950 border-stone-800 text-stone-300 ${filter.color}`
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-stone-500 font-mono hidden sm:inline-flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span></span>
          </div>
        </div>

        {/* Outer Map Frame with Leaflet Container */}
        <div className="relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg flex-1 min-h-[460px] lg:min-h-[500px]">
          
          {/* Map Target ID */}
          <div id="map" ref={mapRef} className="w-full h-full absolute inset-0 z-10" />

          {/* Floated Markers List for Quick Focus */}
          <div className="absolute top-4 left-4 z-20 max-w-[260px] bg-stone-950/90 hover:bg-stone-950 border border-stone-800 rounded-lg p-3 shadow-xl backdrop-blur-md max-h-[80%] overflow-y-auto style-scrollbar">
            <h3 className="font-semibold text-xs text-stone-300 mb-2 border-b border-stone-800 pb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>點擊地標即可快速定位查看</span>
            </h3>
            <div className="space-y-1">
              {MARKERS.filter((m) => filterType === 'all' || m.type === filterType).map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => handleMarkerItemClick(marker)}
                  onMouseEnter={() => setHoveredMarker(marker)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  className="w-full text-left p-1.5 rounded hover:bg-stone-800 transition text-[11px] text-stone-300 flex items-start gap-1.5 cursor-pointer border border-transparent hover:border-stone-700"
                >
                  <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                    marker.type === 'shelter' ? 'bg-emerald-500' :
                    marker.type === 'danger' ? 'bg-rose-500' :
                    marker.type === 'pumping' ? 'bg-cyan-500' : 'bg-amber-500'
                  }`} />
                  <div className="truncate">
                    <div className="font-semibold text-stone-200 truncate">{marker.name}</div>
                    <div className="text-[9px] text-stone-500 truncate">{marker.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
