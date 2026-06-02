import React, { useState } from 'react';
import { AREAS } from './data';
import { AreaInfo } from './types';
import MapComponent from './components/MapComponent';
import MyTimeline from './components/MyTimeline';
import { AboutPage, ContactPage } from './components/Pages';
import { Shield, Sparkles, Map, BookOpen, FileText, Send, Menu, X, CheckSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'timeline' | 'about' | 'contact'>('map');
  const [selectedArea, setSelectedArea] = useState<AreaInfo>(AREAS[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick jump helper from external page actions
  const handleAreaSelectFromOut = (area: AreaInfo) => {
    setSelectedArea(area);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-black flex flex-col justify-between">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-855 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand block */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="p-2.5 bg-emerald-650 rounded-xl text-white shadow-lg shadow-emerald-950/40">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-display font-medium text-lg sm:text-xl tracking-tight text-stone-100 flex items-center gap-1.5">
                <span>總頭里防災資訊</span>
                <span className="text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-750">
                  網站測試
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-stone-400 font-display font-medium uppercase tracking-wider hidden sm:block">
                Disaster Risk Reduction & Practice
              </p>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: 'map', label: '首頁 / 避難地圖', icon: Map },
              { id: 'timeline', label: '學習防汛時程軸 (My Timeline)', icon: BookOpen },
              { id: 'about', label: '關於我們', icon: FileText },
              { id: 'contact', label: '聯絡與災情通報', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-sans flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-800/40 font-semibold shadow-inner'
                      : 'border border-transparent text-stone-300 hover:text-white hover:bg-stone-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Responsive Mobile burger toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-800 space-y-1.5 px-2 animate-fade-in bg-stone-900 shadow-xl rounded-b-xl">
            {[
              { id: 'map', label: '首頁 / 避難地圖', icon: Map },
              { id: 'timeline', label: '學習時程軸 (My Timeline)', icon: BookOpen },
              { id: 'about', label: '關於我們', icon: FileText },
              { id: 'contact', label: '聯絡與災情通報', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* CORE WRAPPER SECTION CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        
        {/* Dynamic Header Badge / News banner */}
        {activeTab === 'map' && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-stone-900 border border-emerald-900/40 text-emerald-200">
            <div className="flex items-center gap-2.5">
              <span className="p-1 px-2.5 rounded bg-emerald-600 font-mono text-[10px] uppercase font-bold text-white tracking-wider shrink-0 animate-pulse">
                水情通報
              </span>
              <p className="text-xs sm:text-sm font-sans text-stone-200">
                目前台南市安南區氣候良好，排水設施與各抽水站皆處於安全水位。
              </p>
            </div>
            
          </div>
        )}

        {/* Tab Router Switch */}
        <div className="transition-all duration-300">
          {activeTab === 'map' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3.5xl font-display font-medium tracking-tight text-white flex items-center gap-2.5">
                  <span>都市社區防災安全導覽</span>
                  <span className="text-xs sm:text-sm text-stone-400 font-mono hidden sm:inline-block">安南水管理專案</span>
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 max-w-2xl font-sans">
                  本網頁展示安南區中<span className="text-emerald-400 font-medium">總頭里</span>之防減災重點區域。點擊下方區域按鈕瀏覽地圖，即可快速得到關鍵地理資訊！
                </p>
              </div>

              {/* Robust Interactive Map container */}
              <MapComponent selectedArea={selectedArea} onAreaSelect={setSelectedArea} />
            </div>
          )}

          {activeTab === 'timeline' && <MyTimeline />}

          {activeTab === 'about' && <AboutPage />}

          {activeTab === 'contact' && <ContactPage />}
        </div>

      </main>

      {/* FOOTER CONTAINER */}
      <footer className="bg-stone-950 border-t border-stone-900 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-display font-medium text-sm text-stone-300 flex items-center justify-center md:justify-start gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>安南社區都市防災學習平台</span>
            </div>
            <p className="text-[11px] text-stone-400 max-w-md leading-relaxed font-sans">
              結合地理資訊系統（GIS）與自主防災時程規劃（Timeline），為村里打造更安全、更具資訊透明度的數位韌性環境。
            </p>
          </div>
          <div className="space-y-1 md:text-right text-xs">
            <div className="text-stone-400 font-mono">
              網頁測試版
            </div>
            <div className="text-[10px] text-stone-500">
              提示：內容與數據僅供示範與學習概念使用，實際資訊與最新法定避難設施請依政府資訊為準。
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
