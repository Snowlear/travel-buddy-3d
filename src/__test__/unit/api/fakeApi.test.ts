import {
  calculateDistances,
  getCities,
  isValidCities,
  isValidCity,
  searchCities,
} from "../../../api/fakeApi";
import { City } from "../../../types/City";

describe("searchCities", () => {
  test("returns cities that match the given keyword", async () => {
    const cities = await searchCities("a");
    expect(cities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Paris" }),
        expect.objectContaining({ name: "Marseille" }),
        expect.objectContaining({ name: "Nantes" }),
      ])
    );
  });

  test('throws an error if the keyword is "fail"', async () => {
    await expect(searchCities("fail")).rejects.toThrow(
      "Server encountered a problem."
    );
  });
});

describe("isValidCity", () => {
  test("returns true if the given city name is valid", async () => {
    expect(await isValidCity("Paris")).toBe(true);
    expect(await isValidCity("Marseille")).toBe(true);
    expect(await isValidCity("Nantes")).toBe(true);
  });

  test("returns false if the given city name is not valid", async () => {
    expect(await isValidCity("Invalid City")).toBe(false);
  });

  test('throws an error if the city name is "fail"', async () => {
    await expect(isValidCity("fail")).rejects.toThrow(
      "Server encountered a problem."
    );
  });
});

describe("isValidCities", () => {
  test("returns an array of booleans indicating if the given city names are valid", async () => {
    const result = await isValidCities(["Paris", "Marseille", "Invalid City"]);
    expect(result).toEqual([true, true, false]);
  });
});

describe("calculateDistances", () => {
  test("calculates the distances between the given cities", async () => {
    const cities: City[] = [
      { name: "Paris", latitude: 48.856614, longitude: 2.352222 },
      { name: "Marseille", latitude: 43.296482, longitude: 5.36978 },
    ];
    const distances = await calculateDistances(cities);
    expect(distances[0]).toBeCloseTo(660.48, 1);
  });

  test("throws an error if one of the cities is Dijon", async () => {
    const cities: City[] = [
      { name: "Paris", latitude: 48.856614, longitude: 2.352222 },
      { name: "Dijon", latitude: 47.322047, longitude: 5.04148 },
    ];
    await expect(calculateDistances(cities)).rejects.toThrow(
      "Server encountered a problem."
    );
  });
});

describe("getCities", () => {
  test("returns the cities with the given names", async () => {
    const cities = await getCities(["Paris", "Marseille"]);
    expect(cities).toEqual([
      { name: "Paris", latitude: 48.856614, longitude: 2.352222 },
      { name: "Marseille", latitude: 43.296482, longitude: 5.36978 },
    ]);
  });

  test("throws an error if one or more cities are not found", async () => {
    await expect(getCities(["Paris", "Invalid City"])).rejects.toThrow(
      "One or more cities not found"
    );
  });
});
