<div align="center">

![RAW Logo](./assets/logo.png)

# RAW 🥩

### **The Naked Performance Engine.**

</div>

**Zero Virtual DOM. Zero Hydration. 100% Browser Power.**

---

## 🛑 The Problem

Modern web development is obese.

- **React** re-renders entire trees to change one number.
- **Next.js** sends the data twice (HTML + JSON blob) to "hydrate" static text.
- **Vue** traps you in proprietary file formats.

We forgot that the browser is already fast. We built layers of "crap" on top of it.

## ⚡ The RAW Solution

**RAW** strips away the layers. It is a compiler that turns your state logic into surgical, direct DOM updates.

- **No Virtual DOM:** We don't diff. We point and shoot.
- **Atomic Signals:** Updates are O(1). Changing a value only touches the specific text node bound to it.
- **No Hydration:** The app is interactive the millisecond HTML loads.

---

## 🚀 Comparison

| Feature              | RAW                    | React                | Next.js                     |
| -------------------- | ---------------------- | -------------------- | --------------------------- |
| **Update Strategy**  | **Surgical (Signals)** | Tree Diffing (VDOM)  | Tree Diffing + Hydration    |
| **Hello World Size** | **~1kb**               | ~130kb               | ~200kb+                     |
| **Mental Model**     | **Mutable State**      | Immutability / Hooks | Server vs Client Components |
| **Language**         | **Standard JS/TS**     | JSX / Hooks          | JSX / Proprietary Routing   |

---

## 🛠 Installation

```bash
# Install RAW
npm install raw

# Or create a new project
npx raw-cli new my-project
```

## 📚 Documentation

- [API Reference](./docs/API.md) - Complete API documentation
- [Guide](./docs/GUIDE.md) - Getting started and best practices
- [Examples](./examples/) - Example projects

## 🧪 Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## 🏗️ Building

```bash
npm run build
```

## 📦 What's Included

### Core Framework

- `state()` - Reactive signals
- `computed()` - Derived values
- `effect()` - Side effects
- `html` - Component templates
- `mount()` - Mount components

### Utilities

- Form handling with validation
- Router for SPA navigation
- Global state store
- Lifecycle hooks
- Debugging tools
- Performance utilities (debounce, throttle, memo)

### Developer Tools

- TypeScript support
- ESLint configuration
- Prettier formatting
- Vitest testing
- CI/CD pipeline
- Comprehensive documentation

## 💻 The Code

RAW uses standard Tagged Template Literals. No build step required for JSX. No magic imports.

```typescript
import { state, html, mount, computed, effect } from 'raw';

// 1. ATOMIC STATE
const count = state(0);
const name = state('RAW');

// 2. COMPUTED VALUES
const doubleCount = computed(() => count.val * 2);

// 3. EFFECTS
effect(() => {
  document.title = `Count: ${count.val}`;
});

// 4. LOGIC
const increment = () => count.val++;

// 5. COMPONENT
const App = () => html`
  <div class="container">
    <h1>${name} Speed</h1>

    <div class="display">Count: ${count} | Double: ${doubleCount}</div>

    <div class="controls">
      <button onclick="${increment}">Accelerate</button>
    </div>
  </div>
`;

// 6. MOUNT
mount(App, document.body);
```

## 🎯 Features

### Core

- ✅ **Signals** - Reactive state management
- ✅ **Computed** - Derived reactive values
- ✅ **Effects** - Side effects that auto-run
- ✅ **Components** - Tagged template literals
- ✅ **Zero VDOM** - Direct DOM manipulation

### Advanced

- ✅ **Forms** - Form handling with validation
- ✅ **Router** - SPA routing
- ✅ **Store** - Global state management
- ✅ **Lifecycle Hooks** - Component lifecycle
- ✅ **Developer Tools** - Debugging utilities

### Developer Experience

- ✅ **TypeScript** - Full type safety
- ✅ **Testing** - Vitest setup
- ✅ **CI/CD** - GitHub Actions
- ✅ **Documentation** - Comprehensive guides

---

## 🧠 Architecture

### 1. The Signal Engine

In React, `setState` triggers a function re-run. In RAW, `state` is just a proxy.
When you type `count.val++`, the framework knows exactly which DOM node subscribed to `count` and updates its `.nodeValue` directly.

### 2. The Compiler

RAW parses your HTML template once. It separates the **Static** parts (cached forever) from the **Dynamic** parts (signals).

- **Static:** `<div class="container">...</div>` created via `cloneNode`.
- **Dynamic:** `${count}` creates a subscription.

### 3. Native Speed

We use standard browser APIs (`document.createElement`, `EventDelegation`). If the browser gets faster, RAW gets faster.

---

## 🤝 Contributing

Burning the old forest to plant something new.

1. Fork it.
2. Create a branch (`feature/laser-updates`).
3. Submit a PR.

**Author:** [Mehmet T. AKALIN](https://github.com/makalin)
**License:** MIT
