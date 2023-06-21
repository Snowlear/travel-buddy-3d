import { deg2rad, haversineDistance } from "../../../api/utils";

describe("haversineDistance", () => {
  test("calculates the distance between two cities", () => {
    const city1 = { name: "a", latitude: 51.5074, longitude: 0.1278 };
    const city2 = { name: "b", latitude: 48.8566, longitude: 2.3522 };
    expect(haversineDistance(city1, city2)).toBeCloseTo(334.6, 0.5);
  });
});

describe("deg2rad", () => {
  test("converts degrees to radians", () => {
    expect(deg2rad(0)).toBe(0);
    expect(deg2rad(180)).toBe(Math.PI);
    expect(deg2rad(360)).toBe(2 * Math.PI);
  });
});
