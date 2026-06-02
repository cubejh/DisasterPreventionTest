import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../types';
import { TIMELINE_EVENTS } from '../data';
import { Clock, Plus, Trash2, CheckCircle2, Circle, AlertCircle, Sparkles, BookOpen, Construction, History } from 'lucide-react';

export default function MyTimeline() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'history' | 'construction' | 'learning'>('all');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  
  // Custom states to add new events
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'history' | 'construction' | 'learning'>('learning');

  useEffect(() => {
    // Load local storage if exists, otherwise load defaults
    const saved = localStorage.getItem('disaster_timeline_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(TIMELINE_EVENTS);
      }
    } else {
      setEvents(TIMELINE_EVENTS);
    }
  }, []);

  const saveEvents = (updated: TimelineEvent[]) => {
    setEvents(updated);
    localStorage.setItem('disaster_timeline_events', JSON.stringify(updated));
  };

  // Toggle learning step completion
  const handleToggleComplete = (id: string) => {
    const updated = events.map((ev) => {
      if (ev.id === id) {
        return { ...ev, completed: !ev.completed };
      }
      return ev;
    });
    saveEvents(updated);
  };

  // Add custom event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newYear.trim() || !newDesc.trim()) return;

    const newEv: TimelineEvent = {
      id: `custom_${Date.now()}`,
      year: newYear,
      title: newTitle,
      category: newCategory,
      description: newDesc,
      completed: false,
    };

    saveEvents([newEv, ...events]);
    setNewTitle('');
    setNewYear('');
    setNewDesc('');
  };

  // Delete custom event
  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((ev) => ev.id !== id);
    saveEvents(updated);
  };

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === 'all') return true;
    return ev.category === activeCategory;
  });

  // Calculate learning progress
  const learningEvents = events.filter((e) => e.category === 'learning');
  const completedLearning = learningEvents.filter((e) => e.completed).length;
  const learningPercent = learningEvents.length > 0 ? Math.round((completedLearning / learningEvents.length) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* EXPLANATORY HERO CORNER ON TIMELINE IMPLEMENTATION */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-sm text-white space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold font-sans">我的學習時間軸 (My Timeline) 是如何運作與擴充的？</h2>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          在防災與社區建設中，<span className="text-emerald-400 font-semibold">時間維度</span>是核心！
          為您展示了三種在防災 App 中整合「時間軸」的最佳模式，您可以參考這套架構自行擴充：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>1. 個人防災學習軌跡</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              追蹤用戶個人的教育進度（如逃生包準備、RCP學習）。提供互動勾選，勾記完成狀態並即時儲存於本機。
            </p>
          </div>
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Construction className="w-4 h-4 shrink-0" />
              <span>2. 社區疏濬建設歷程</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              記錄政府或地方近年的排水改善、抽水站擴建年表，向大眾傳達都市防災工程的投入與進展。
            </p>
          </div>
          <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <History className="w-4 h-4 shrink-0" />
              <span>3. 歷史天然事件大事記</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              回顧社區遭遇過的強烈颱風、淹水事件，配合當時的觀測水位，強化居民的居安思危意識。
            </p>
          </div>
        </div>
      </div>

      {/* TIMELINE VISUAL DATA AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: VISUALIZERS AND ADD FORM */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          
          {/* Learning Progress Widget */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm text-white space-y-4">
            <h3 className="font-bold text-sm font-sans text-stone-200">我的防災學習進度</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-400 font-mono">
                <span>技能點數：{completedLearning} / {learningEvents.length}</span>
                <span>{learningPercent}%</span>
              </div>
              <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${learningPercent}%` }} 
                />
              </div>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              {learningPercent === 100 
                ? '您已經具備紮實的社區防災先備知識！' 
                : ' 請在右側時間軸「防災學習步道」分類中點擊勾選，紀錄您的自主防災學習成效。'}
            </p>
          </div>

          {/* Add custom event to the Timeline */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-sm text-white">
            <h3 className="font-bold text-sm font-sans text-stone-200 mb-4 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>新增自訂學習/防災紀錄</span>
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">對應節點 / 年度：</label>
                <input
                  type="text"
                  placeholder="例如: 學習階段 6 或 2026年"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">事件標題名稱：</label>
                <input
                  type="text"
                  placeholder="例如: 清理住家前後排水設施"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">分類：</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="learning">防災學習步道 (互動式學習)</option>
                  <option value="construction">本區治水工程建設</option>
                  <option value="history">在地歷史災情足跡</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">詳細說明：</label>
                <textarea
                  rows={3}
                  placeholder="備妥防水擋板，清除門前出水口雜物枯枝，避免暴雨時水流受阻。"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100 resize-none focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 rounded transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>加入時間軸</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE SWIPEABLE CHRONOLOGY LIST */}
        <div className="col-span-1 lg:col-span-8 space-y-4">
          
          {/* Timeline filter bar */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">篩選時間軸：</span>
              <div className="flex gap-2.5 flex-wrap">
                {[
                  { value: 'all', label: '全部顯示', color: 'border-stone-700 bg-stone-950' },
                  { value: 'learning', label: '防災學習 📖', color: 'border-emerald-800/60 bg-emerald-950/20' },
                  { value: 'construction', label: '治水工程 🏗️', color: 'border-cyan-800/60 bg-cyan-950/20' },
                  { value: 'history', label: '歷史大事 🌊', color: 'border-rose-800/60 bg-rose-950/20' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveCategory(item.value as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                      activeCategory === item.value
                        ? 'bg-stone-100 text-stone-950 border-white'
                        : `${item.color} text-stone-300 hover:bg-stone-850`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chronological Vertical Thread Container */}
          <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-stone-850">
            {filteredEvents.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-8 text-center text-stone-400 text-xs">
                此分類目前沒有紀錄，請利用左方表單新增！
              </div>
            ) : (
              filteredEvents.map((event) => {
                const isCustom = event.id.startsWith('custom_');
                return (
                  <div key={event.id} className="relative group">
                    
                    {/* Visual Node Ball */}
                    <div className={`absolute -left-[20px] top-1.5 w-[11px] h-[11px] rounded-full border-2 bg-stone-950 transition-all z-10 ${
                      event.category === 'learning' ? 'border-emerald-500 scale-125' :
                      event.category === 'construction' ? 'border-cyan-500 scale-125' :
                      'border-rose-500 scale-125'
                    }`} />

                    {/* Card container */}
                    <div className={`bg-stone-900 border ${
                      event.category === 'learning' ? 'border-stone-800/70 hover:border-emerald-800/60' :
                      event.category === 'construction' ? 'border-stone-800/70 hover:border-cyan-800/60' :
                      'border-stone-800/70 hover:border-rose-800/60'
                    } rounded-xl p-5 transition duration-250 hover:shadow-md relative`}>
                      
                      {/* Meta header information */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono bg-stone-950 text-stone-300 px-2.5 py-0.5 rounded border border-stone-850">
                          {event.year} {event.date ? `・ ${event.date}` : ''}
                        </span>
                        
                        {/* Categorize tag badges */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            event.category === 'learning' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' :
                            event.category === 'construction' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40' :
                            'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                          }`}>
                            {event.category === 'learning' ? '自我防災學習' :
                             event.category === 'construction' ? '水安環境工程' : '地方豪雨歷史'}
                          </span>

                          {/* Delete capability for custom user nodes */}
                          {isCustom && (
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-stone-500 hover:text-rose-500 transition cursor-pointer p-0.5 rounded"
                              title="刪除自訂紀錄"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {/* If Interactive Study Progress is needed */}
                        {event.category === 'learning' && (
                          <button
                            onClick={() => handleToggleComplete(event.id)}
                            className="shrink-0 mt-1 cursor-pointer transition focus:scale-110"
                            title={event.completed ? "已完成！點擊設為未完成" : "未完成，點擊標籤為已完成"}
                          >
                            {event.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-600 hover:text-stone-400" />
                            )}
                          </button>
                        )}

                        <div className="space-y-1 flex-1">
                          <h4 className={`font-bold text-sm ${
                            event.category === 'learning' && event.completed
                              ? 'text-stone-400 line-through'
                              : 'text-stone-100 font-sans'
                          }`}>
                            {event.title}
                          </h4>
                          <p className="text-xs text-stone-300 leading-relaxed font-sans">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="text-[10px] text-stone-500 mt-2 flex items-center gap-1 font-mono">
                              📍 地標焦點: {event.location}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
