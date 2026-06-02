export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerInfo {
  id: string;
  name: string;
  position: LatLng;
  type: 'shelter' | 'danger' | 'general' | 'pumping';
  description: string;
  phone?: string;
  capacity?: string;
}

export interface AreaInfo {
  id: string;
  name: string;
  center: LatLng;
  zoom: number;
  description: string;
  features: string[];
  tips: string[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  date?: string;
  title: string;
  category: 'history' | 'construction' | 'learning';
  description: string;
  location?: string;
  completed?: boolean;
}
