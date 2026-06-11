import { AreaInfo, MarkerInfo, TimelineEvent } from './types';

export const AREAS: AreaInfo[] = [
  {
    id: 'zongtou',
    name: '總頭里',
    center: { lat: 23.055803, lng: 120.202096 },
    zoom: 16,
    description: '總頭里位於安南區，多屬於傳統聚落與灌溉渠道交織地區。防災重點在於社區自主防災組織運作、低窪地區淹水警戒，以及利用活動中心進行緊急避難安置。',
    features: [
      '自主常備防災社區編組',
      '總頭里活動中心緊急避難處所',
      '曾文溪排水支線水情觀測點'
    ],
    tips: [
      '若發布豪大雨警戒，請隨時注意防災資訊。',
      '請提前安置防水閘門或前往避難所。'
    ]
  },
  {
    id: 'budai',
    name: '布袋里',
    center: { lat: 23.06332, lng: 120.20707 },
    zoom: 16,
    description: '布袋里緊鄰總頭里，區內包含布袋里活動中心，為本區重要收容中心。水患防禦重點在於外圍排水渠道疏通以及道路積淹水監控。',
    features: [
      '布袋里活動中心收容能量達220人',
      '緊鄰主要聯外道路，利於搜救與物資調度',
    ],
    tips: [
      '避難路線建議避開未加蓋大排水溝之便道。',
      '活動中心備有緊急發電機件，停電時仍可提供基礎照明與手機充電。'
    ]
  },
];

export const MARKERS: MarkerInfo[] = [
  {
    id: 'm1',
    name: '總頭里社區中心',
    position: { lat: 23.055803, lng: 120.202096 },
    type: 'shelter',
    description: '簡單的避難收容處所，配有社區防災對講機、乾糧與急救箱。',
    phone: '06-2567123',
    capacity: '容納約 50 人'
  },
  {
    id: 'm2',
    name: '總頭寮興安宮',
    position: { lat: 23.054980, lng: 120.201999 },
    type: 'shelter',
    description: '可簡單避難的當地小廟，里長服務處與總頭社區活動中心也在附近。',
    phone: '06-2460103',
    capacity: '容納約 50 人'
  },
  {
    id: 'm3',
    name: '安順教堂',
    position: { lat: 23.052889, lng: 120.202204 },
    type: 'shelter',
    description: '淹水不嚴重時，可以是簡單的短期避難收容處所，配有簡易資源。',
    phone: '06-2560635',
    capacity: '容納約 100 人'
  },
  
  {
    id: 'm4',
    name: '布袋里活動中心',
    position: { lat: 23.06332, lng: 120.20707 },
    type: 'shelter',
    description: '配備發電機與緊急物資（睡袋、水、照明），高齡者優先收容點。',
    phone: '06-2569876',
    capacity: '容納約 220 人'
  },
  {
    id: 'm5',
    name: '長溪路二段598巷(撤離主要路線)',
    position: { lat: 23.056655, lng: 120.203552 },
    type: 'general',
    description: '社區防災巡邏路線，巡守隊在平時與豪雨期間確認安全。'
  },

  {
    id: 'm6',
    name: '海佃國小避難所',
    position: { lat: 23.037148, lng: 120.198357 },
    type: 'shelter',
    description: '安南區大型指定避難所，操場可作為直升機臨時起降或物資空投點。',
    phone: '06-2503001',
    capacity: '容納約 300 人'
  },
  {
    id: 'm7',
    name: '六塊寮自動排水閘門與排水機組',
    position: { lat: 23.053387, lng: 120.209591 },
    type: 'pumping',
    description: '須確保閘門正常，並配備輔助抽水機組協助。'
  },
  {
    id: 'm8',
    name: '長溪路二段(易積水路段)',
    position: { lat: 23.049309, lng: 120.203071 },
    type: 'danger',
    description: '在極端強降雨時路段很可能淹水，撤離或移動時須避免。'
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'l1',
    year: '學習階段 1',
    title: '防災意識與家庭防災計畫',
    category: 'learning',
    description: '認識住家周遭的潛在淹水風險，繪製家庭避難路線圖，並約定緊急聯絡電話與集合地點。',
    completed: true
  },
  {
    id: 'l2',
    year: '學習階段 2',
    title: '緊急避難包準備與維護',
    category: 'learning',
    description: '備妥緊急避難包：包含3天乾糧、水、急救藥品、證件影本、保暖衣物與手電筒。每半年檢查一次效期。',
    completed: true
  },
  {
    id: 'l3',
    year: '學習階段 3',
    title: '社區避難演練與實際踏查',
    category: 'learning',
    description: '實際走訪總頭里或布袋里活動中心，確認避難路線上無大型障礙物，熟悉避難處所位置。',
    completed: false
  },
  {
    id: 'l4',
    year: '學習階段 4',
    title: '自主防災技能（急救與沙包堆疊）',
    category: 'learning',
    description: '學習基礎CPR與止血急救，並學習「人字形」、「磚牆形」沙包正確堆疊技術，防止家戶漫淹。',
    completed: false
  },
  {
    id: 'l5',
    year: '學習階段 5',
    title: '防災志工或防災士培訓',
    category: 'learning',
    description: '參加內政部消防署或在地的防災士培训課，成為社區自主防災圈的一員，守護鄰里。',
    completed: false
  },

  {
    id: 'h1',
    year: '2009年',
    date: '8月8日',
    title: '莫拉克風災衝擊安南區',
    category: 'history',
    description: '極端降雨造成曾文溪及排水系統溢堤，安南區（包含總頭、海佃等地）面臨嚴重積淹水。此事件啟動了後續大規模的治水與社區防災轉型。',
    location: '台南市安南區'
  },
  {
    id: 'h2',
    year: '2016年',
    date: '2月6日',
    title: '美濃地震與土壤液化檢討',
    category: 'history',
    description: '強震造成安南區部分道路與民宅傾斜及土壤液化。地方開始注重地質調查與防震工法補強。',
    location: '台南安南區及永康區'
  },
  {
    id: 'h3',
    year: '2018年',
    date: '8月23日',
    title: '0823熱帶低壓豪雨襲擊',
    category: 'history',
    description: '滯留降雨強度超出排水設計，社區抽水機全力運轉。催生安南區「韌性社區」自主防災組織的建置。',
    location: '台南市安南區'
  },

  {
    id: 'c1',
    year: '2012年',
    title: '總頭社區排水疏濬與加固',
    category: 'construction',
    description: '曾文溪支線排水進行護岸加高工程與清淤，減少強降雨溢堤機率。'
  },
  {
    id: 'c2',
    year: '2020年',
    title: '海佃抽水站全面升級運转',
    category: 'construction',
    description: '抽水站機組進行擴建升級，單秒抽水量大幅上升，能更迅速導引本區雨水排出。'
  },
  {
    id: 'c3',
    year: '2023年',
    title: '韌性防災社區2.0智慧佈置',
    category: 'construction',
    description: '推動防汛感測APP，實現防水閘門即時安全監測。'
  }
];
