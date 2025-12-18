/**
 * Global state management (store pattern)
 */

import { Signal, state } from './index.js';

export type StoreActions<T> = Record<string, (state: T, ...args: any[]) => T>;
export type StoreGetters<T> = Record<string, (state: T) => any>;

export type Store<T, A extends StoreActions<T>, G extends StoreGetters<T>> = {
  state: Signal<T>;
  actions: {
    [K in keyof A]: (...args: Parameters<A[K]> extends [T, ...infer Rest] ? Rest : never[]) => void;
  };
  getters: {
    [K in keyof G]: Signal<ReturnType<G[K]>>;
  };
};

/**
 * Creates a store with state, actions, and getters
 */
export function createStore<T, A extends StoreActions<T>, G extends StoreGetters<T>>(
  initialState: T,
  actions: A,
  getters: G = {} as G
): Store<T, A, G> {
  const storeState = state(initialState);
  
  // Create actions
  const storeActions = {} as Store<T, A, G>['actions'];
  Object.entries(actions).forEach(([key, action]) => {
    (storeActions as any)[key] = (...args: any[]) => {
      storeState.val = action(storeState.val, ...args);
    };
  });
  
  // Create getters (computed signals)
  const storeGetters = {} as Store<T, A, G>['getters'];
  Object.entries(getters).forEach(([key, getter]) => {
    const getterSignal = state(getter(storeState.val));
    
    // Subscribe to state changes
    storeState._subscribers.add(() => {
      getterSignal.val = getter(storeState.val);
    });
    
    (storeGetters as any)[key] = getterSignal;
  });
  
  return {
    state: storeState,
    actions: storeActions,
    getters: storeGetters,
  };
}

/**
 * Combine multiple stores
 */
export function combineStores<T extends Record<string, Store<any, any, any>>>(
  stores: T
): T {
  return stores;
}

