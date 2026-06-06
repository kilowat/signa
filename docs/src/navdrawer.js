sig('useNavdrawer', ({ signal }) => {
    const isOpen = signal(false);
    return {
        isOpen,
        toggle: () => isOpen.value = !isOpen.value,
        open: () => isOpen.value = true,
        close: () => isOpen.value = false,
    };
});

sig('nav-drawer', ({ html, slot, $this }) => {
    const drawer = sig('useNavdrawer');
    $this.drawer = drawer;

    return () => html`
        <div class=${drawer.isOpen.value ? 'drawer is-open' : 'drawer'}>
            ${slot.default}
        </div>
        <div class=${drawer.isOpen.value ? 'drawer__overlay --opened' : 'drawer__overlay'}
             onclick=${drawer.close}></div>
    `;
});

sig('toggle-drawer', ({ html, effect, $this }) => {
    const drawer = sig('useNavdrawer');

    effect(() => {
        $this.addEventListener('click', drawer.toggle);
        return () => $this.removeEventListener('click', drawer.toggle);
    });

    return () => html`
        <button class=${drawer.isOpen.value ? 'burger is-open' : 'burger'} type="button">
            <span></span>
        </button>
    `;
});