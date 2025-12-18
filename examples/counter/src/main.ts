import { state, html, mount } from '../../src/index.js';

// 1. ATOMIC STATE
const count = state(0);

// 2. LOGIC
const increment = () => count.val++;
const decrement = () => count.val--;
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
      <button onclick="${decrement}">Decelerate</button>
      <button onclick="${reset}" class="danger">Stop</button>
    </div>
  </div>
`;

// 4. MOUNT
mount(App, document.getElementById('app')!);

