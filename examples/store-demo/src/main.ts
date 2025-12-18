import { html, mount } from '../../../src/index.js';
import { createStore } from '../../../src/store.js';

// Create store
const counterStore = createStore(
  { count: 0, name: 'RAW' },
  {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    setName: (state, name: string) => ({ ...state, name }),
  },
  {
    doubleCount: (state) => state.count * 2,
    greeting: (state) => `Hello, ${state.name}!`,
  }
);

// Components
const Counter = () => html`
  <div class="card">
    <h2>Counter Store Demo</h2>
    <div class="display">
      <p>Count: <strong>${counterStore.state.val.count}</strong></p>
      <p>Double: <strong>${counterStore.getters.doubleCount.val}</strong></p>
      <p>${counterStore.getters.greeting.val}</p>
    </div>
    <div class="controls">
      <button onclick="${counterStore.actions.decrement}">-</button>
      <button onclick="${counterStore.actions.increment}">+</button>
    </div>
  </div>
`;

const NameInput = () => html`
  <div class="card">
    <h2>Update Name</h2>
    <input 
      type="text" 
      value="${counterStore.state.val.name}"
      oninput="${(e: Event) => {
        const input = e.target as HTMLInputElement;
        counterStore.actions.setName(input.value);
      }}"
      placeholder="Enter name"
    />
  </div>
`;

const App = () => html`
  <div class="app">
    <h1>RAW Store Demo</h1>
    ${Counter()}
    ${NameInput()}
  </div>
`;

mount(App, document.getElementById('app')!);

