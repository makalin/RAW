/**
 * Simple test utilities
 */

export function describe(name: string, fn: () => void): void {
  console.group(`%c${name}`, 'color: #667eea; font-weight: bold;');
  try {
    fn();
  } catch (error) {
    console.error('Test suite failed:', error);
  }
  console.groupEnd();
}

export function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`%c✓ ${name}`, 'color: green;');
  } catch (error) {
    console.error(`%c✗ ${name}`, 'color: red;', error);
    throw error;
  }
}

export function expect<T>(actual: T) {
  return {
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual(expected: T): void {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy(): void {
      if (!actual) {
        throw new Error(`Expected truthy value, but got ${actual}`);
      }
    },
    toBeFalsy(): void {
      if (actual) {
        throw new Error(`Expected falsy value, but got ${actual}`);
      }
    },
  };
}

export function beforeEach(fn: () => void): void {
  fn();
}

