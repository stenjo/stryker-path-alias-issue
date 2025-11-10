import { describe, it, expect, beforeEach } from "vitest";
import { Calculator } from "./calculator";

describe("Calculator (using path aliases)", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("add", () => {
    it("should add two numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });
  });

  describe("subtract", () => {
    it("should subtract two numbers", () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(calculator.multiply(4, 3)).toBe(12);
    });
  });

  describe("divide", () => {
    it("should divide two numbers", () => {
      expect(calculator.divide(12, 3)).toBe(4);
    });

    it("should throw error on division by zero", () => {
      expect(() => calculator.divide(10, 0)).toThrow("Division by zero");
    });
  });

  describe("calculate", () => {
    it("should perform addition", () => {
      expect(calculator.calculate("+", 2, 3)).toBe(5);
    });

    it("should perform subtraction", () => {
      expect(calculator.calculate("-", 5, 3)).toBe(2);
    });

    it("should perform multiplication", () => {
      expect(calculator.calculate("*", 4, 3)).toBe(12);
    });

    it("should perform division", () => {
      expect(calculator.calculate("/", 12, 3)).toBe(4);
    });

    it("should throw error for unknown operation", () => {
      expect(() => calculator.calculate("%", 10, 3)).toThrow("Unknown operation: %");
    });
  });
});
