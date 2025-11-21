import { describe, expect, it } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("should correctly sum valid numbers separated by commas", () => {
    expect(calculateTotal("10, 20, 30")).toBe(60);
    expect(calculateTotal("1.5,2.5,3")).toBe(7);
  });

  it("should handle newline-separated values", () => {
    expect(calculateTotal("100\n200\n300")).toBe(600);
    expect(calculateTotal("1.23\n4.56\n7.89")).toBe(13.68);
  });

  it("should handle mixed comma and newline separators", () => {
    expect(calculateTotal("10,20\n30, 40\n50")).toBe(150);
    expect(calculateTotal("1, 2\n3\n4,5")).toBe(15);
  });

  it("should trim whitespace around numbers", () => {
    expect(calculateTotal("  10  ,  20  ,  30  ")).toBe(60);
    expect(calculateTotal("\n   5   \n   10   \n")).toBe(15);
  });

  it("should ignore empty strings and extra delimiters", () => {
    expect(calculateTotal("10,,20,,,30")).toBe(60);
    expect(calculateTotal("\n\n10\n\n20\n\n")).toBe(30);
    expect(calculateTotal(",,,")).toBe(0);
    expect(calculateTotal("")).toBe(0);
  });

  it("should filter out invalid numbers (NaN)", () => {
    expect(calculateTotal("10, abc, 20, hello, 30")).toBe(60);
    expect(calculateTotal("1.5, two, 3.7, four.point.five")).toBe(5.2);
  });

  it("should handle decimal numbers correctly", () => {
    expect(calculateTotal("0.1, 0.2, 0.3")).toBeCloseTo(0.6); // Avoid floating-point issues
    expect(calculateTotal("999.99, 0.01")).toBe(1000);
  });

  it("should return 0 for empty input or only invalid data", () => {
    expect(calculateTotal("")).toBe(0);
    expect(calculateTotal("   ")).toBe(0);
    expect(calculateTotal("abc, def, ghi")).toBe(0);
    expect(calculateTotal(",,, \n\n")).toBe(0);
  });

  it("should handle very large numbers (within safe float range)", () => {
    expect(calculateTotal("1000000000, 2000000000")).toBe(3000000000);
  });

  it("should handle negative numbers", () => {
    expect(calculateTotal("-10, 20, -30, 40")).toBe(20);
    expect(calculateTotal("-5.5\n-4.5")).toBe(-10);
  });

  it("should handle scientific notation (if parseFloat supports it)", () => {
    expect(calculateTotal("1e3, 2e3")).toBe(3000); // 1000 + 2000
    expect(calculateTotal("1.5e2, 2.5e2")).toBe(400);
  });

  it("should be case-insensitive to whitespace and formatting", () => {
    const messyInput = `
      100.50  ,
      200.75
      
      , 300
      ,abc
      , 400.25
    `;
    expect(calculateTotal(messyInput)).toBe(1001.5);
  });
});
