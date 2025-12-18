# RAW Examples

## Basic Counter

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

## Computed Values

```typescript
import { state, computed, html, mount } from 'raw';

const a = state(5);
const b = state(10);
const sum = computed(() => a.val + b.val);

const App = () => html`
  <div>
    <p>A: ${a}</p>
    <p>B: ${b}</p>
    <p>Sum: ${sum}</p>
  </div>
`;

mount(App, document.getElementById('app')!);
```

## Forms with Validation

```typescript
import { html, mount } from 'raw';
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

const Login = () => html`
  <form>
    <div>
      <input 
        type="email" 
        value="${loginForm.fields.email.value}"
        oninput="${(e) => {
          loginForm.fields.email.value.val = (e.target as HTMLInputElement).value;
          loginForm.fields.email.touched.val = true;
        }}"
      />
      ${loginForm.fields.email.error.val && html`
        <span class="error">${loginForm.fields.email.error}</span>
      `}
    </div>
    <button type="submit" onclick="${(e) => {
      e.preventDefault();
      if (loginForm.validate()) {
        console.log('Form valid:', loginForm.values());
      }
    }}">Submit</button>
  </form>
`;

mount(Login, document.getElementById('app')!);
```

## Router

```typescript
import { html, mount } from 'raw';
import { createRouter } from 'raw/router';

const Home = () => html`<div><h1>Home</h1></div>`;
const About = () => html`<div><h1>About</h1></div>`;

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
});

const App = () => html`
  <nav>
    <a href="/" onclick="${(e) => { e.preventDefault(); router.navigate('/'); }}">Home</a>
    <a href="/about" onclick="${(e) => { e.preventDefault(); router.navigate('/about'); }}">About</a>
  </nav>
  <main>
    ${router.View()}
  </main>
`;

mount(App, document.getElementById('app')!);
```

## Store Pattern

```typescript
import { html, mount } from 'raw';
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

const Counter = () => html`
  <div>
    <p>Count: ${counterStore.state.val.count}</p>
    <p>Double: ${counterStore.getters.doubleCount.val}</p>
    <button onclick="${counterStore.actions.increment}">+</button>
    <button onclick="${counterStore.actions.decrement}">-</button>
  </div>
`;

mount(Counter, document.getElementById('app')!);
```

## Effects

```typescript
import { state, effect, html, mount } from 'raw';

const count = state(0);

// Update document title when count changes
effect(() => {
  document.title = `Count: ${count.val}`;
});

const App = () => html`
  <div>
    <h1>Count: ${count}</h1>
    <button onclick="${() => count.val++}">Increment</button>
  </div>
`;

mount(App, document.getElementById('app')!);
```

## Conditional Rendering

```typescript
import { state, html, mount, cond } from 'raw';
import { cond } from 'raw/utils';

const showDetails = state(false);

const App = () => html`
  <div>
    <button onclick="${() => showDetails.val = !showDetails.val}">
      Toggle Details
    </button>
    ${cond(showDetails, html`<div>Details here</div>`)}
  </div>
`;

mount(App, document.getElementById('app')!);
```

## Lists

```typescript
import { state, html, mount, loop } from 'raw';
import { loop } from 'raw/utils';

const items = state(['Apple', 'Banana', 'Cherry']);

const App = () => html`
  <ul>
    ${loop(items, (item, index) => html`<li>${item}</li>`)}
  </ul>
`;

mount(App, document.getElementById('app')!);
```

