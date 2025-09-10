const { defComponent, defStore, eventBus } = signa;

defStore('todo', ({ signal }) => {
  const items = signal([]);

  const add = ({ id, name } = todo) => {
    items.value = [...items.value, todo];
  };

  return { items, add };
});

defComponent('task-input', (ctx) => {
  const { html, signal, store } = ctx;

  const todoStore = store('todo');
  const inputValue = signal('');

  const addItem = () => {
    const newTodo = {
      id: Date.now(),
      title: inputValue.value,
      completed: false,
    };
    todoStore.add(newTodo);
    inputValue.value = '';
  };

  const onInputChange = (event) => {
    inputValue.value = event.target.value;
  };

  return () => html`
    <div style="display:flex; gap: 4px;">
      <input
        .value=${inputValue}
        oninput=${onInputChange}
        type="text"
        placeholder="Новая задача..."
        style="flex-grow:1; padding:4px;">
      <button onclick=${addItem}>Добавить</button>
    </div>
  `;
});

defComponent('todo-list', (ctx) => {
  const { html, store } = ctx;
  const todoStore = store('todo');

  return () => html`
    <ul>
      ${todoStore.items.value.map(
    (todo) => html`<li>${todo.title} ${todo.completed ? '✓' : ''}</li>`
  )}
    </ul>
  `;
});
