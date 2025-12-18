# RAW API Reference

## Core API

### `state<T>(initialValue: T): Signal<T>`

Creates a reactive signal (state).

```typescript
const count = state(0);
count.val = 10; // Updates and notifies subscribers
```

### `html(strings: TemplateStringsArray, ...values: any[]): () => DocumentFragment`

Creates a reactive DOM component using tagged template literals.

```typescript
const App = () => html`
  <div>Count: ${count}</div>
`;
```

### `mount(component: () => DocumentFragment, target: HTMLElement): () => void`

Mounts a component to a DOM element. Returns cleanup function.

```typescript
const cleanup = mount(App, document.getElementById('app')!);
```

## Computed Signals

### `computed<T>(fn: () => T): Signal<T>`

Creates a computed signal that derives its value from other signals.

```typescript
const sum = computed(() => a.val + b.val);
```

## Effects

### `effect(fn: () => void | (() => void)): () => void`

Runs a side effect that automatically re-runs when dependencies change.

```typescript
effect(() => {
  console.log('Count changed:', count.val);
});
```

## Forms

### `field<T>(initialValue: T, rules?: ValidationRule<T>[]): FormField<T>`

Creates a form field with validation.

```typescript
const email = field('', [
  validators.required(),
  validators.email()
]);
```

### `form<T>(fields: T): Form`

Creates a form with multiple fields.

```typescript
const loginForm = form({
  email: field('', [validators.required()]),
  password: field('', [validators.required()]),
});
```

## Router

### `createRouter(config: RouterConfig): Router`

Creates a router instance.

```typescript
const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
});
```

## Store

### `createStore<T, A, G>(initialState: T, actions: A, getters?: G): Store`

Creates a global store with state, actions, and getters.

```typescript
const store = createStore(
  { count: 0 },
  {
    increment: (state) => ({ ...state, count: state.count + 1 }),
  },
  {
    doubleCount: (state) => state.count * 2,
  }
);
```

## Utilities

### `cond(condition: boolean | Signal<boolean>, trueValue: any, falseValue?: any): any`

Conditional rendering helper.

### `loop<T>(array: T[] | Signal<T[]>, renderFn: (item: T, index: number) => () => DocumentFragment): () => DocumentFragment`

Loop helper for rendering arrays.

### `cls(...classes: (string | boolean | Signal<boolean>)[]): string`

Class name helper.

### `debounce<T>(fn: T, delay: number): T`

Debounce function.

### `throttle<T>(fn: T, delay: number): T`

Throttle function.

