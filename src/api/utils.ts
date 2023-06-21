import { City } from "../types/City";

export function haversineDistance(city1: City, city2: City) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(city2.latitude - city1.latitude);
  const dLon = deg2rad(city2.longitude - city1.longitude);
  const lat1 = deg2rad(city1.latitude);
  const lat2 = deg2rad(city2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
