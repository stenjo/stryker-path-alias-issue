/**
 * Calculator that uses PATH ALIASES to import from shared (fails with Stryker)
 * This simulates a frontend importing from a shared workspace
 */

import { add, subtract, multiply, divide } from "@shared"; // Path alias import!
// Note: This imports from ../../../shared/src/math via the @shared alias

export class Calculator {
    public add(a: number, b: number): number {
        return add(a, b);
    }

    public subtract(a: number, b: number): number {
        return subtract(a, b);
    }

    public multiply(a: number, b: number): number {
        return multiply(a, b);
    }

    public divide(a: number, b: number): number {
        return divide(a, b);
    }

    public calculate(operation: string, a: number, b: number): number {
        switch (operation) {
            case "+":
                return this.add(a, b);
            case "-":
                return this.subtract(a, b);
            case "*":
                return this.multiply(a, b);
            case "/":
                return this.divide(a, b);
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }
}
