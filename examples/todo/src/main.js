const { defComponent, defStore, eventBus } = signa;

defComponent('task-input', (ctx) => {
    const { html } = ctx;

    const add = () => {
        console.log('test');
    }

    return () => html`
      <input id="taskInput" type="text" placeholder="Новая задача..."
        class="input-base">
      <button onclick='${add}' class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
        Добавить
      </button>`
})