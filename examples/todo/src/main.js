const { defComponent, defStore, eventBus } = signa;

defStore('todo', (ctx) => {
  const { signal } = ctx;
  const items = signal([]);
  const add = (todo) => {
    items.value = [...items.value, todo]
  };

  return {
    items,
    add,
  }
});

defComponent('task-input', (ctx) => {
  const { html, signal, store } = ctx;
  const todoStore = store('todo');
  const inputValue = signal('');

  const addItem = () => {
    todoStore.add(inputValue.value);
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
  const { html, computed, store } = ctx;
  const todoStore = store('todo');
  const itemsJson = computed(() => JSON.stringify(todoStore.items));

  return () => html`<div>${itemsJson.value}</div>`
})