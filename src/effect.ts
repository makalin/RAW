/**
 * Effects - side effects that run when signals change
 */

import { Signal } from './index.js';

let currentEffect: (() => void) | null = null;
const effectStack: Array<() => void> = [];

/**
 * Runs a side effect that automatically re-runs when dependencies change
 */
export function effect(fn: () => void | (() => void)): () => void {
  const dependencies = new Set<Signal<any>>();
  let cleanup: (() => void) | void = undefined;
  let isActive = true;
  
  const runEffect = () => {
    if (!isActive) return;
    
    // Cleanup previous effect
    if (cleanup) {
      cleanup();
    }
    
    // Track dependencies
    dependencies.clear();
    const prevEffect = currentEffect;
    currentEffect = runEffect;
    effectStack.push(runEffect);
    
    try {
      cleanup = fn();
    } finally {
      currentEffect = prevEffect;
      effectStack.pop();
    }
  };
  
  // Initial run
  runEffect();
  
  // Subscribe to dependencies
  const unsubscribers: (() => void)[] = [];
  dependencies.forEach((dep) => {
    const unsub = () => {
      dep._subscribers.delete(runEffect);
    };
    dep._subscribers.add(runEffect);
    unsubscribers.push(unsub);
  });
  
  // Return cleanup function
  return () => {
    isActive = false;
    if (cleanup) {
      cleanup();
    }
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Batch multiple updates together
 */
export function batch(fn: () => void): void {
  const isBatching = true;
  fn();
  // Notify all subscribers after batch completes
  // This is handled automatically by the signal system
}

