const { defComponent, defStore, eventBus } = signa;

defStore('todo', (ctx) => {
  const { signal } = ctx;
  /** @type {Signal<Todo[]>} */
  const items = signal([
    {
      id: 1,
      name: 'test',
      completed: false,
    },
    {
      id: 2,
      name: 'test2',
      compoented: false,
    }
  ]);

  const toggle = (id) => {
    items.value = items.value.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  };

  const add = (todo) => {
    items.value = [...items.value, todo]
  };

  return {
    items,
    add,
    toggle,
  }
});

defComponent('task-input', (ctx) => {
  const { html, signal, store } = ctx;
  const todoStore = store('todo');
  const inputValue = signal('');

  const addItem = () => {
    todoStore.add({ id: Date.now().toString(), name: inputValue.value });
  }

  const onInputChange = (event) => {
    inputValue.value = event.target.value;
  }

  return () => html`
      <input
        .value=${inputValue}
        oninput="${onInputChange}" 
        type="text" 
        placeholder="Новая задача..."
        class="flex-grow border rounded-l-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400">
      <button
        onclick='${addItem}'
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
        Добавить
      </button>`
})

defComponent('todo-list', (ctx) => {
  const { html, store, htmlFor } = ctx;
  const todoStore = store('todo');

  const buildItem = item => {
    const html = htmlFor(buildItem, item.id);
    return html`
    <div>
      <span>id: ${item.id} status: ${item.completed}</span>
      <button onclick="${() => todoStore.toggle(item.id)}">click</button>
    </div>`;
  };

  return () => html`
    <div>
      ${todoStore.items.value.map(buildItem)}
    </div>`
})