export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CityDistanceData {
  totalDistance?: number;
  distanceBetween?: number[];
}
