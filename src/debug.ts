/**
 * Developer tools and debugging utilities
 */

import { Signal } from './index.js';

let debugMode = false;

/**
 * Enable debug mode
 */
export function enableDebug(): void {
  debugMode = true;
  console.log('%cRAW Debug Mode Enabled', 'color: #667eea; font-weight: bold; font-size: 14px;');
}

/**
 * Disable debug mode
 */
export function disableDebug(): void {
  debugMode = false;
}

/**
 * Debug log (only in debug mode)
 */
export function debug(...args: any[]): void {
  if (debugMode) {
    console.log('%c[RAW]', 'color: #667eea; font-weight: bold;', ...args);
  }
}

/**
 * Track signal changes
 */
export function trackSignal<T>(signal: Signal<T>, name?: string): Signal<T> {
  const signalName = name || 'Signal';
  
  debug(`Tracking ${signalName}:`, signal.val);
  
  signal._subscribers.add(() => {
    debug(`${signalName} changed:`, signal.val);
  });
  
  return signal;
}

/**
 * Performance measurement
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  debug(`Performance [${name}]:`, `${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * Component render counter
 */
const renderCounts = new Map<string, number>();

export function trackRender(componentName: string): void {
  const count = (renderCounts.get(componentName) || 0) + 1;
  renderCounts.set(componentName, count);
  debug(`Render [${componentName}]:`, count);
}

/**
 * Get render statistics
 */
export function getRenderStats(): Record<string, number> {
  return Object.fromEntries(renderCounts);
}

/**
 * Reset render statistics
 */
export function resetRenderStats(): void {
  renderCounts.clear();
}

/**
 * Signal dependency graph
 */
export function getSignalDependencies(signal: Signal<any>): number {
  return signal._subscribers.size;
}

/**
 * Memory usage info
 */
export function getMemoryInfo(): {
  used: number;
  total: number;
  percentage: number;
} {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  return { used: 0, total: 0, percentage: 0 };
}

