/**
 * Computed signals - derived reactive values
 */

import { Signal, state } from './index.js';

let currentComputed: { signal: Signal<any>; deps: Set<Signal<any>> } | null = null;

/**
 * Creates a computed signal that derives its value from other signals
 */
export function computed<T>(fn: () => T): Signal<T> {
  const computedSignal = state(fn()) as Signal<T>;
  const dependencies = new Set<Signal<any>>();
  
  const updateComputed = () => {
    // Track dependencies
    const prevComputed = currentComputed;
    const computedContext = { signal: computedSignal, deps: dependencies };
    currentComputed = computedContext;
    (globalThis as any).__RAW_CURRENT_COMPUTED__ = computedContext;
    dependencies.clear();
    
    try {
      const newValue = fn();
      if (computedSignal.val !== newValue) {
        computedSignal.val = newValue;
      }
    } finally {
      currentComputed = prevComputed;
      if (prevComputed) {
        (globalThis as any).__RAW_CURRENT_COMPUTED__ = prevComputed;
      } else {
        delete (globalThis as any).__RAW_CURRENT_COMPUTED__;
      }
    }
  };
  
  // Initial computation to track dependencies
  updateComputed();
  
  // Subscribe to all dependencies
  dependencies.forEach((dep) => {
    dep._subscribers.add(updateComputed);
  });
  
  return computedSignal;
}

/**
 * Get current computed context (for internal use)
 */
export function getCurrentComputed() {
  return currentComputed;
}

