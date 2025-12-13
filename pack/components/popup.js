
//Programming open document.querySelector('popup-window', ).open({ title: 'title' });
defComponent('popup-window', ({ signal, html, eventBus, effect, $this }) => {
    const isOpen = signal(false);
    const title = signal('');
    const body = signal('');
    const content = signal(null);
    const onClose = signal(null);

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    const slideCloseOffset = 80;

    const getWindowEl = () =>
        $this.querySelector('.popup__window');

    const getContentEl = () =>
        $this.querySelector('.popup__content');

    const resetWindowPosition = () => {
        const el = getWindowEl();
        if (!el) return;

        el.style.transform = '';
        el.style.transition = '';
    };

    const open = (opts = {}) => {
        const {
            title: t = '',
            body: b = '',
            content: c = null,
            onClose: closeCb = null
        } = opts;

        title.value = t;
        body.value = b;
        content.value = c;
        onClose.value = closeCb;

        isOpen.value = true;
        document.body.style.overflow = 'hidden';

        const contentEl = getContentEl();
        if (contentEl) contentEl.scrollTop = 0;

    };

    const close = () => {
        isOpen.value = false;
        document.body.style.overflow = '';

        resetWindowPosition();
        currentY = 0;
        isDragging = false;

        if (onClose.value) {
            onClose.value();
            onClose.value = null;
        }
    };

    const onTouchStart = (e) => {
        const contentEl = getContentEl();

        if (contentEl && contentEl.scrollTop > 0) return;

        startY = e.touches[0].clientY;
        isDragging = true;
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;

        const delta = e.touches[0].clientY - startY;
        if (delta < 0) return;

        currentY = delta;

        const el = getWindowEl();
        if (!el) return;

        el.style.transition = 'none';
        el.style.transform = `translateY(${delta}px)`;
    };

    const onTouchEnd = () => {
        const el = getWindowEl();
        isDragging = false;

        if (!el) return;

        el.style.transition = '';

        if (currentY > slideCloseOffset) {
            currentY = 0;
            close();
        } else {
            el.style.transform = '';
            currentY = 0;
        }
    };

    const renderTitle = () =>
        title.value ? html`<h2>${title.value}</h2>` : '';

    const renderBody = () =>
        body.value ? html`<div>${body.value}</div>` : '';

    const renderContent = () =>
        content.value
            ? html([content.value])
            : html`${renderTitle()}${renderBody()}`;

    effect(() => eventBus.on('popup:open', open));
    effect(() => eventBus.on('popup:close', close));

    $this.open = open;
    $this.close = close;

    return () => html`
        <div class=${isOpen.value ? 'popup popup--open' : 'popup'}
             style=${isOpen.value ? 'display:flex' : 'display:none'}>
            
            <div class="popup__overlay" onclick=${close}></div>

            <div class="popup__window"
                 ontouchstart=${onTouchStart}
                 ontouchmove=${onTouchMove}
                 ontouchend=${onTouchEnd}>
                
                <div class="popup__close" onclick=${close}></div>

                <div class="popup__content">
                    ${renderContent()}
                    <slot></slot>
                </div>
            </div>
        </div>
    `;
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
