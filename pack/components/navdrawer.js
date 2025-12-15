defStore('navDrawer', ({ signal }) => {
    const isOpen = signal(false);
    const toggle = () => isOpen.value = !isOpen.value;
    return {
        isOpen,
        toggle,
    };
});

defComponent('nav-drawer', ({ html, store, slot }) => {
    const drawerStore = store('navDrawer');

    return () => html`
        <div  class=${drawerStore.isOpen.value ? 'drawer is-open' : 'drawer'}>
           ${slot.default}
        </div>
    `;
});

defComponent('toggle-drawer', ({ html, store, effect, $this }) => {
    const drawerStore = store('navDrawer');

    effect(() => {
        $this.addEventListener('click', drawerStore.toggle);
        return () => $this.removeEventListener('click', drawerStore.toggle);
    });

    return () => html`
        <button class="${drawerStore.isOpen.value ? 'burger is-open' : 'burger'}" type="button">
        <span></span>
    </button>
    `;
});