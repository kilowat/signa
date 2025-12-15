defStore('useNavdrawer', ({ signal }) => {
    const isOpen = signal(false);
    const toggle = () => isOpen.value = !isOpen.value;
    const open = () => isOpen.value = true;
    const close = () => isOpen.value = false;
    return {
        isOpen,
        toggle,
        open,
        close,
    };
});

defComponent('nav-drawer', ({ html, store, slot, $this }) => {
    const drawer = store('useNavdrawer');
    $this.drawer = drawer;

    return () => html`
        <div  class=${drawer.isOpen.value ? 'drawer is-open' : 'drawer'}>
           ${slot.default}
        </div>
        <div class=${drawer.isOpen.value ? 'drawer__overlay --opened' : 'drawer__overlay'} onclick=${drawer.close}></div>
    `;
});

defComponent('toggle-drawer', ({ html, store, effect, $this }) => {
    const drawer = store('useNavdrawer');

    effect(() => {
        $this.addEventListener('click', drawer.toggle);
        return () => $this.removeEventListener('click', drawer.toggle);
    });

    return () => html`
        <button class="${drawer.isOpen.value ? 'burger is-open' : 'burger'}" type="button">
        <span></span>
    </button>
    `;
});