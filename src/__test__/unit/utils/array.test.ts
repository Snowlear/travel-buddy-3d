import { isObjectOfArraysOfStrings, sumArray } from "../../../utils/array";

describe("isObjectOfArraysOfStrings", () => {
  test("returns true for an object with arrays of strings", () => {
    const obj = { a: ["hello", "world"], b: ["foo", "bar"] };
    expect(isObjectOfArraysOfStrings(obj)).toBe(true);
  });

  test("returns false for an object with non-array values", () => {
    const obj = { a: "hello", b: ["foo", "bar"] };
    expect(isObjectOfArraysOfStrings(obj)).toBe(false);
  });

  test("returns false for an object with arrays of non-string values", () => {
    const obj = { a: [1, 2], b: ["foo", "bar"] };
    expect(isObjectOfArraysOfStrings(obj)).toBe(false);
  });
});

describe("sumArray", () => {
  test("returns the sum of an array of numbers", () => {
    const numbers = [1, 2, 3];
    expect(sumArray(numbers)).toBe(6);
  });

  test("returns 0 for an empty array", () => {
    const numbers: number[] = [];
    expect(sumArray(numbers)).toBe(0);
  });
});
