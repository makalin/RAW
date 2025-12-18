import { state, html, mount } from '../../../src/index.js';
import { createRouter } from '../../../src/router.js';

// Pages
const Home = () => html`
  <div class="page">
    <h1>Home</h1>
    <p>Welcome to RAW Router Demo</p>
  </div>
`;

const About = () => html`
  <div class="page">
    <h1>About</h1>
    <p>RAW is a zero-VDOM framework</p>
  </div>
`;

const User = () => {
  const router = createRouter({
    routes: [],
  });
  const params = router.getParams();
  
  return html`
    <div class="page">
      <h1>User Profile</h1>
      <p>User ID: ${params.id}</p>
    </div>
  `;
};

// Create router
const router = createRouter({
  routes: [
    { path: '/', component: Home, exact: true },
    { path: '/about', component: About },
    { path: '/user/:id', component: User },
  ],
});

// App
const App = () => html`
  <div class="app">
    <nav>
      <a href="/" onclick="${(e: Event) => { e.preventDefault(); router.navigate('/'); }}">Home</a>
      <a href="/about" onclick="${(e: Event) => { e.preventDefault(); router.navigate('/about'); }}">About</a>
      <a href="/user/123" onclick="${(e: Event) => { e.preventDefault(); router.navigate('/user/123'); }}">User 123</a>
    </nav>
    <main>
      ${router.View()}
    </main>
  </div>
`;

mount(App, document.getElementById('app')!);

