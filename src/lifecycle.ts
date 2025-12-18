/**
 * Lifecycle hooks for components
 */

export type LifecycleHook = () => void | (() => void);

let currentComponent: {
  onMount?: LifecycleHook[];
  onUnmount?: LifecycleHook[];
  onUpdate?: LifecycleHook[];
} | null = null;

/**
 * Registers a callback to run when component mounts
 */
export function onMount(fn: LifecycleHook): void {
  if (!currentComponent) {
    currentComponent = { onMount: [], onUnmount: [], onUpdate: [] };
  }
  if (!currentComponent.onMount) {
    currentComponent.onMount = [];
  }
  currentComponent.onMount.push(fn);
}

/**
 * Registers a callback to run when component unmounts
 */
export function onUnmount(fn: LifecycleHook): void {
  if (!currentComponent) {
    currentComponent = { onMount: [], onUnmount: [], onUpdate: [] };
  }
  if (!currentComponent.onUnmount) {
    currentComponent.onUnmount = [];
  }
  currentComponent.onUnmount.push(fn);
}

/**
 * Registers a callback to run when component updates
 */
export function onUpdate(fn: LifecycleHook): void {
  if (!currentComponent) {
    currentComponent = { onMount: [], onUnmount: [], onUpdate: [] };
  }
  if (!currentComponent.onUpdate) {
    currentComponent.onUpdate = [];
  }
  currentComponent.onUpdate.push(fn);
}

/**
 * Gets current component lifecycle hooks
 */
export function getCurrentComponent() {
  return currentComponent;
}

/**
 * Sets current component lifecycle hooks
 */
export function setCurrentComponent(component: typeof currentComponent) {
  currentComponent = component;
}

/**
 * Resets current component
 */
export function resetCurrentComponent() {
  currentComponent = null;
}

