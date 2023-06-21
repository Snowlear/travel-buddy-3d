import { roundNumber } from "../../../utils/number";

describe("roundNumber", () => {
  test("rounds a number to the specified number of decimal places", () => {
    expect(roundNumber(1.23456, 0)).toBe(1);
    expect(roundNumber(1.23456, 1)).toBe(1.2);
    expect(roundNumber(1.23456, 2)).toBe(1.23);
    expect(roundNumber(1.23456, 3)).toBe(1.235);
    expect(roundNumber(1.23456, 4)).toBe(1.2346);
  });
});
