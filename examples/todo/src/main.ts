import { state, html, mount } from '../../src/index.js';

// State
const todos = state<Array<{ id: number; text: string; done: boolean }>>([]);
const inputValue = state('');

let nextId = 1;

// Logic
const addTodo = () => {
  if (inputValue.val.trim()) {
    todos.val = [...todos.val, { id: nextId++, text: inputValue.val, done: false }];
    inputValue.val = '';
  }
};

const toggleTodo = (id: number) => {
  todos.val = todos.val.map(todo =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
};

const deleteTodo = (id: number) => {
  todos.val = todos.val.filter(todo => todo.id !== id);
};

const TodoItem = (todo: { id: number; text: string; done: boolean }) => {
  const toggleHandler = () => toggleTodo(todo.id);
  const deleteHandler = () => deleteTodo(todo.id);
  
  return html`
    <li class="todo-item ${todo.done ? 'done' : ''}">
      <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="${toggleHandler}" />
      <span>${todo.text}</span>
      <button onclick="${deleteHandler}" class="delete">×</button>
    </li>
  `;
};

// Create a computed signal for todos list rendering
const todosList = () => todos.val.map((todo: any) => TodoItem(todo));

const App = () => html`
  <div class="container">
    <h1>RAW Todo</h1>
    
    <div class="input-section">
      <input 
        type="text" 
        placeholder="What needs to be done?"
        value="${inputValue}"
        oninput="${(e: Event) => { inputValue.val = (e.target as HTMLInputElement).value; }}"
        onkeypress="${(e: KeyboardEvent) => { if (e.key === 'Enter') addTodo(); }}"
      />
      <button onclick="${addTodo}">Add</button>
    </div>
    
    <ul class="todo-list">
      ${todosList()}
    </ul>
    
    <div class="footer">
      <span>Total: ${todos.val.length} | Done: ${todos.val.filter((t: any) => t.done).length}</span>
    </div>
  </div>
`;

mount(App, document.getElementById('app')!);

