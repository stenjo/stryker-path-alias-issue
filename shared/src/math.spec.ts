import { describe, it, expect } from "vitest";
import { add, subtract, multiply, divide } from "./math"; // Relative import

describe("Math functions (relative imports)", () => {
    describe("add", () => {
        it("should add two positive numbers", () => {
            expect(add(2, 3)).toBe(5);
        });

        it("should add negative numbers", () => {
            expect(add(-2, -3)).toBe(-5);
        });
    });

    describe("subtract", () => {
        it("should subtract two numbers", () => {
            expect(subtract(5, 3)).toBe(2);
        });
    });

    describe("multiply", () => {
        it("should multiply two numbers", () => {
            expect(multiply(4, 3)).toBe(12);
        });
    });

    describe("divide", () => {
        it("should divide two numbers", () => {
            expect(divide(12, 3)).toBe(4);
        });

        it("should throw error on division by zero", () => {
            expect(() => divide(10, 0)).toThrow("Division by zero");
        });
    });
});
