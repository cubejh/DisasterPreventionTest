import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldAlert, Heart, Sprout } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="space-y-8 text-white max-w-4xl mx-auto">
      {/* Editorial Frame with generous spacing & clean layout */}
      <div className="text-center space-y-3 py-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-stone-100 font-sans">關於我們 & 計畫背景</h2>
        <p className="text-sm text-stone-400 font-sans leading-relaxed">
          台南市安南區低窪、水文發達。本平台旨在建立「總頭里」社區共建的防汛意識、自主避難導覽與互動式防災學習體系。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Vision */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Heart className="w-5 h-5" />
            <h3 className="font-bold font-sans text-stone-100">核心使命 / Core Vision</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans space-y-2">
            氣候變遷帶來的極端降雨，使得社區「自主防災」成為都市減災的最重要拼圖。我們深信，每位里民熟悉住家附近的避難站點、淹水好發道路，並具備充分的避難包備忘與防汛擋板知識，能大幅減少水患造成的損失。
          </p>
          <ul className="text-xs text-stone-400 space-y-1.5 pl-3 list-disc">
            <li>宣導實體避難站點位置與即時聯絡管道。</li>
            <li>推動自主學習軌跡，降低救災資源缺口。</li>
            <li>提升安南區防汛治水工程的社會能見度。</li>
          </ul>
        </div>

        {/* Resilient Community Structure */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold font-sans text-stone-100">社區韌性體系</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            安南區近年在基層自主防災社群運營下，各里建立了常規編制與演練機制：
          </p>
          <div className="space-y-3 mt-1.5">
            <div className="border-l-2 border-emerald-500 pl-3">
              <h4 className="text-xs font-semibold text-emerald-400">總頭里防災編組</h4>
              <p className="text-[11px] text-stone-400">設有警戒組、疏散組及物資組。豪雨時重點巡查渠道倒灌水位。</p>
            </div>
          </div>
        </div>

      </div>

      {/* Sustainable Footprint */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-emerald-950/40 p-4 rounded-lg border border-emerald-800/40 shrink-0">
          <Sprout className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-stone-100">防減災永續與社區守護</h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            本平台為示範專案，嘗試將遙遠的公部門計劃，結合民間與在地組織，將資訊更隨手可得與方便理解。
          </p>
        </div>
      </div>
    </div>
  );
}

interface ContactMessage {
  id: string;
  name: string;
  type: string;
  content: string;
  time: string;
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('drainage'); // default
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<ContactMessage[]>([]);

  // Feed with mock alerts at start
  React.useEffect(() => {
    setReports([
      {
        id: '1',
        name: '路人甲',
        type: 'other',
        content: '我覺得里長很帥。',
        time: '2026-06-02 12:40'
      }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newReport: ContactMessage = {
      id: String(Date.now()),
      name,
      type,
      content,
      time: new Date().toLocaleString()
    };

    setReports([newReport, ...reports]);
    setName('');
    setContent('');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="space-y-8 text-white max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-2 py-2">
        <h2 className="text-2xl font-bold tracking-tight text-stone-100 font-sans">聯絡我們</h2>
        <p className="text-sm text-stone-400 font-sans">
          網頁功能修改建議、各種防災隱患觀察，歡迎在此說明。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form (7 columns) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-sm text-stone-200 border-b border-stone-800 pb-3 flex items-center gap-1.5">
            <Send className="w-4 h-4 text-emerald-500" />
            <span>通報與建議</span>
          </h3>

          {submitted && (
            <div className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 p-4 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>感謝您的通報！資料已儲存（本專案非即時聯繫公部門，緊急災情請直接撥打119 / 1999 ）。</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">您的姓名 / 稱呼：</label>
                <input
                  type="text"
                  placeholder="例如: 林先生"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">通報或建議類別：</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="drainage">側溝淤積 / 水流阻塞通報</option>
                  <option value="damage">防災看板 / 避難所硬體損壞</option>
                  <option value="web_feedback">網頁功能或座標數據調整建議</option>
                  <option value="other">其他防災事物諮詢</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">詳細說明（如：地點、情形等）：</label>
              <textarea
                rows={5}
                placeholder="請輸入詳情（例如：總頭里活動中心前的水溝落葉堆積嚴重、希望將布袋里避難所的收容能量修改為...人）..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100 resize-none focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition cursor-pointer flex items-center justify-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>送出通報資訊</span>
            </button>
          </form>
        </div>

        {/* Right Info and List of submitted items (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Contact methods */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-stone-200">重要聯絡管道</h3>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">緊急災情救援</div>
                  <div className="text-stone-400">消防與火警救護：撥打 <span className="font-mono text-emerald-400 font-semibold text-sm">119</span></div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-800 pt-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">台南安南區公所</div>
                  <div className="text-stone-400">總機：(06) 256-7126</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">地址：臺南市安南區安中路二段308號</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-stone-800 pt-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">系統開發與志工信箱</div>
                  <div className="text-stone-400">cuberjhcubing@gmail.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Notice Board (Real-time update mock view) */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-xs text-stone-400 uppercase tracking-wider font-mono">
              📢 近期社區通報事項 (測試用)
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 bg-stone-950 border border-stone-850 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-stone-300">{rep.name}</span>
                    <span className="text-stone-500 font-mono">{rep.time}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    {rep.type === 'drainage' ? '🔧 側溝淤積阻礙' :
                     rep.type === 'damage' ? '⚠️ 防災硬體損壞' :
                     rep.type === 'web_feedback' ? '💻 網頁數據建議' : '💬 其他防災諮詢'}
                  </div>
                  <p className="text-[11px] text-stone-300 leading-normal font-sans">
                    {rep.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
