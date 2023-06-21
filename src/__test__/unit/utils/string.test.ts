import { upperCaseFirst } from "../../../utils/string";

describe("upperCaseFirst", () => {
  test("capitalizes the first letter of a string", () => {
    expect(upperCaseFirst("hello")).toBe("Hello");
    expect(upperCaseFirst("world")).toBe("World");
  });
});
