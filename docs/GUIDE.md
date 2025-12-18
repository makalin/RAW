# RAW Framework Guide

## Getting Started

### Installation

```bash
npm install raw
```

### Basic Example

```typescript
import { state, html, mount } from 'raw';

const count = state(0);
const increment = () => count.val++;

const App = () => html`
  <div>
    <h1>Count: ${count}</h1>
    <button onclick="${increment}">Increment</button>
  </div>
`;

mount(App, document.getElementById('app')!);
```

## Core Concepts

### Signals

Signals are reactive values that notify subscribers when they change.

```typescript
const name = state('John');
name.val = 'Jane'; // Automatically updates all subscribers
```

### Components

Components are functions that return DocumentFragments.

```typescript
const Button = (props: { text: string; onClick: () => void }) => html`
  <button onclick="${props.onClick}">${props.text}</button>
`;
```

### Computed Values

Computed signals derive their value from other signals.

```typescript
const a = state(5);
const b = state(10);
const sum = computed(() => a.val + b.val);
```

### Effects

Effects run side effects when signals change.

```typescript
effect(() => {
  document.title = `Count: ${count.val}`;
});
```

## Forms

RAW provides form handling utilities:

```typescript
import { field, form, validators } from 'raw/forms';

const loginForm = form({
  email: field('', [
    validators.required(),
    validators.email()
  ]),
  password: field('', [
    validators.required(),
    validators.minLength(6)
  ]),
});

// In component
const Login = () => html`
  <form>
    <input 
      type="email" 
      value="${loginForm.fields.email.value}"
      oninput="${(e) => loginForm.fields.email.value.val = e.target.value}"
    />
    ${loginForm.fields.email.error.val && html`
      <span class="error">${loginForm.fields.email.error}</span>
    `}
  </form>
`;
```

## Routing

```typescript
import { createRouter } from 'raw/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/user/:id', component: User },
  ],
});

// In your app
const App = () => html`
  <nav>
    <a href="/" onclick="${(e) => { e.preventDefault(); router.navigate('/'); }}">Home</a>
    <a href="/about" onclick="${(e) => { e.preventDefault(); router.navigate('/about'); }}">About</a>
  </nav>
  ${router.View()}
`;
```

## State Management

Use stores for global state:

```typescript
import { createStore } from 'raw/store';

const counterStore = createStore(
  { count: 0 },
  {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
  },
  {
    doubleCount: (state) => state.count * 2,
  }
);

// Use in components
const Counter = () => html`
  <div>
    <p>Count: ${counterStore.state.val.count}</p>
    <p>Double: ${counterStore.getters.doubleCount.val}</p>
    <button onclick="${counterStore.actions.increment}">+</button>
  </div>
`;
```

## Best Practices

1. **Keep components small** - Break down complex components
2. **Use computed for derived state** - Don't manually sync values
3. **Use effects sparingly** - Prefer computed signals when possible
4. **Validate forms** - Use the form utilities for better UX
5. **Use TypeScript** - Get better type safety and IDE support

## Performance Tips

1. **Minimize signal subscriptions** - Only subscribe when necessary
2. **Use batch for multiple updates** - Reduces re-renders
3. **Memoize expensive computations** - Use the memo utility
4. **Debounce/throttle user input** - Use utility functions

