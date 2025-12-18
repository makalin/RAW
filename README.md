# RAW 🥩

### **The Naked Performance Engine.**

**Zero Virtual DOM. Zero Hydration. 100% Browser Power.**

---

## 🛑 The Problem

Modern web development is obese.

* **React** re-renders entire trees to change one number.
* **Next.js** sends the data twice (HTML + JSON blob) to "hydrate" static text.
* **Vue** traps you in proprietary file formats.

We forgot that the browser is already fast. We built layers of "crap" on top of it.

## ⚡ The RAW Solution

**RAW** strips away the layers. It is a compiler that turns your state logic into surgical, direct DOM updates.

* **No Virtual DOM:** We don't diff. We point and shoot.
* **Atomic Signals:** Updates are O(1). Changing a value only touches the specific text node bound to it.
* **No Hydration:** The app is interactive the millisecond HTML loads.

---

## 🚀 Comparison

| Feature | RAW | React | Next.js |
| --- | --- | --- | --- |
| **Update Strategy** | **Surgical (Signals)** | Tree Diffing (VDOM) | Tree Diffing + Hydration |
| **Hello World Size** | **~1kb** | ~130kb | ~200kb+ |
| **Mental Model** | **Mutable State** | Immutability / Hooks | Server vs Client Components |
| **Language** | **Standard JS/TS** | JSX / Hooks | JSX / Proprietary Routing |

---

## 🛠 Installation

Stop installing 200MB of `node_modules`.

```bash
npx raw-cli new my-project

```

## 💻 The Code

RAW uses standard Tagged Template Literals. No build step required for JSX. No magic imports.

```typescript
import { state, html, mount } from 'raw';

// 1. ATOMIC STATE
// Defined anywhere. Global or local.
// No strict "Hooks rules".
const count = state(0);

// 2. LOGIC
const increment = () => count.val++;
const reset = () => count.val = 0;

// 3. COMPONENT
const App = () => html`
  <div class="container">
    <h1>Raw Speed</h1>
    
    <div class="display">
      Current count: ${count}
    </div>

    <div class="controls">
      <button onclick="${increment}">Accelerate</button>
      <button onclick="${reset}" class="danger">Stop</button>
    </div>
  </div>
`;

// 4. MOUNT
mount(App, document.body);

```

---

## 🧠 Architecture

### 1. The Signal Engine

In React, `setState` triggers a function re-run. In RAW, `state` is just a proxy.
When you type `count.val++`, the framework knows exactly which DOM node subscribed to `count` and updates its `.nodeValue` directly.

### 2. The Compiler

RAW parses your HTML template once. It separates the **Static** parts (cached forever) from the **Dynamic** parts (signals).

* **Static:** `<div class="container">...</div>` created via `cloneNode`.
* **Dynamic:** `${count}` creates a subscription.

### 3. Native Speed

We use standard browser APIs (`document.createElement`, `EventDelegation`). If the browser gets faster, RAW gets faster.

---

## 🤝 Contributing

We are burning the old forest to plant something new.

1. Fork it.
2. Create a branch (`feature/laser-updates`).
3. Submit a PR.

**Author:** [Mehmet T. AKALIN](https://github.com/makalin)
**License:** MIT
