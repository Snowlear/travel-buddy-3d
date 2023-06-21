import {
  formatDate,
  getMonthDays,
  getMonthNumber,
  handleDateFormat,
  isDMY,
  isYMD,
  toDMYOrder,
  toYMDOrder,
} from "../../../utils/date";

describe("toDMYOrder", () => {
  test("converts a date string from YMD to DMY order", () => {
    const ymd = "2022-12-31";
    expect(toDMYOrder(ymd)).toBe("31-12-2022");
  });
});

describe("toYMDOrder", () => {
  test("converts a date string from DMY to YMD order", () => {
    const dmy = "31-12-2022";
    expect(toYMDOrder(dmy)).toBe("2022-12-31");
  });
});

describe("isDMY", () => {
  test("returns true for a valid DMY date string", () => {
    const dmy = "31-12-2022";
    expect(isDMY(dmy)).toBe(true);
  });

  test("returns false for an invalid DMY date string", () => {
    const invalid = "2022-12-31";
    expect(isDMY(invalid)).toBe(false);
  });
});

describe("isYMD", () => {
  test("returns true for a valid YMD date string", () => {
    const ymd = "2022-12-31";
    expect(isYMD(ymd)).toBe(true);
  });

  test("returns false for an invalid YMD date string", () => {
    const invalid = "31-12-2022";
    expect(isYMD(invalid)).toBe(false);
  });
});

describe("formatDate", () => {
  test('formats a DMY date string as "MMM DD, YYYY"', () => {
    const dmy = "31-12-2022";
    expect(formatDate(dmy)).toBe("Dec 31, 2022");
  });
});

describe("getMonthNumber", () => {
  test("returns the month number for a given month name", () => {
    expect(getMonthNumber("Jan")).toBe(1);
    expect(getMonthNumber("Feb")).toBe(2);
    expect(getMonthNumber("Dec")).toBe(12);
  });
});

describe("getMonthDays", () => {
  test("returns the days of the previous, current, and next months for a given month and year", () => {
    const monthDays = getMonthDays(1, 2022);
    expect(monthDays.prevMonthDays).toEqual([27, 28, 29, 30, 31]);
    expect(monthDays.currentMonthDays).toHaveLength(31);
    expect(monthDays.nextMonthDays).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("handleDateFormat", () => {
  test("formats a day, month name, and year as a DMY date string", () => {
    const day = 1;
    const month = "Jan";
    const year = "2022";
    expect(handleDateFormat(day, month, year)).toBe("01-01-2022");
  });
});
