
//Programming open document.querySelector('popup-window', ).open({ title: 'title' });
defComponent('popup-window', ({ signal, html, eventBus, effect, $this }) => {
    const isOpen = signal(false);
    const title = signal('');
    const body = signal('');
    const content = signal(null);
    const onClose = signal(null);

    const open = (opts = {}) => {
        const { title: t = '', body: b = '', content: c = null, onClose: closeCb = null } = opts;
        title.value = t;
        body.value = b;
        content.value = c;
        onClose.value = closeCb;
        isOpen.value = true;
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        isOpen.value = false;
        document.body.style.overflow = '';
        if (onClose.value) {
            onClose.value();
            onClose.value = null;
        }
    };

    const renderTitle = () => title.value ? html`<h2>${title.value}</h2>` : '';
    const renderBody = () => body.value ? html`<div>${body.value}</div>` : '';
    const renderContent = () => content.value ? html([content.value]) : html`${renderTitle()}${renderBody()}`;

    effect(() => {
        return eventBus.on('popup:open', (options) => open(options));
    });

    effect(() => {
        return eventBus.on('popup:close', close);
    });

    $this.open = open;
    $this.close = close;

    return () => html`
        <div class=${isOpen.value ? 'popup popup--open' : 'popup'}
                style=${isOpen.value ? 'display:flex' : 'display:none'}>
            <div class="popup__overlay" onclick=${close}></div>
            <div class="popup__window">
                <button class="popup__close" onclick=${close}>&times;</button>
                <div class="popup__content">
                    ${renderContent()}
                    <slot></slot>
                </div>
            </div>
        </div>
    `
});



defComponent('popup-trigger', ({ $this, effect, prop, eventBus }) => {
    const contentData = prop('content');
    const contentId = prop('contentId');

    effect(() => {
        const contentEl = document.getElementById(contentId.value);
        const content = contentEl ? contentEl.innerHTML : contentData.value;

        if (contentEl) contentEl.remove();

        const clickHandler = () => {
            eventBus.emit('popup:open', { content });
        };

        $this.addEventListener('click', clickHandler);

        return () => $this.removeEventListener('click', clickHandler);
    });
});
