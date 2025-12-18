/**
 * Utility functions for RAW
 */

import { Signal, html } from './index.js';

/**
 * Conditional rendering helper
 */
export function cond<T>(
  condition: boolean | Signal<boolean>,
  trueValue: T,
  falseValue?: T
): T | '' {
  if (typeof condition === 'object' && '_subscribers' in condition) {
    return condition.val ? trueValue : (falseValue ?? '');
  }
  return condition ? trueValue : (falseValue ?? '');
}

/**
 * Loop helper for rendering arrays
 */
export function loop<T>(
  array: T[] | Signal<T[]>,
  renderFn: (item: T, index: number) => () => DocumentFragment
): () => DocumentFragment {
  return () => {
    const fragment = document.createDocumentFragment();
    const items = typeof array === 'object' && '_subscribers' in array ? array.val : array;
    
    items.forEach((item, index) => {
      const itemFragment = renderFn(item, index)();
      fragment.appendChild(itemFragment);
    });
    
    return fragment;
  };
}

/**
 * Class name helper
 */
export function cls(...classes: (string | boolean | Signal<boolean> | undefined | null)[]): string {
  return classes
    .filter((c) => {
      if (typeof c === 'boolean' || c === undefined || c === null) return false;
      if (typeof c === 'object' && '_subscribers' in c) {
        return c.val;
      }
      return Boolean(c);
    })
    .map((c) => {
      if (typeof c === 'object' && '_subscribers' in c) {
        return c.val ? String(c.val) : '';
      }
      return String(c);
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Style object helper
 */
export function style(styles: Record<string, string | number | Signal<string | number>>): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      const val = typeof value === 'object' && '_subscribers' in value ? value.val : value;
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${val}`;
    })
    .join('; ');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Memoization helper
 */
export function memo<T>(fn: () => T, deps: Signal<any>[]): Signal<T> {
  const memoized = { val: fn(), _subscribers: new Set<() => void>() } as Signal<T>;
  
  const update = () => {
    const newValue = fn();
    if (memoized.val !== newValue) {
      memoized.val = newValue;
      memoized._subscribers.forEach((sub) => sub());
    }
  };
  
  deps.forEach((dep) => {
    dep._subscribers.add(update);
  });
  
  return memoized;
}

