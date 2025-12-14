defComponent('popup-window', ({ signal, html, eventBus, effect, $this }) => {
    const isOpen = signal(false);
    const title = signal('');
    const body = signal('');
    const content = signal(null);
    const onClose = signal(null);

    const autClose = signal(0);
    const timeToClose = signal(0);

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let timer = null;

    let movedNode = null;
    let placeholder = null;

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

    const mountContent = () => {
        if (!content.value) return;

        if (typeof content.value === 'string' || typeof content.value === 'function') return;

        const container = getContentEl();
        if (!container) return;

        movedNode = content.value;

        if (!movedNode.parentNode) {
            container.appendChild(movedNode);
            return;
        }

        placeholder = document.createComment('popup-placeholder');
        movedNode.parentNode.insertBefore(placeholder, movedNode);
        container.appendChild(movedNode);
    };

    const restoreContent = () => {
        if (!movedNode) return;

        if (!placeholder) {
            movedNode.remove();
            movedNode = null;
            return;
        }

        placeholder.parentNode.insertBefore(movedNode, placeholder);
        placeholder.remove();

        movedNode = null;
        placeholder = null;
    };

    const open = (opts = {}) => {
        title.value = opts.title || '';
        body.value = opts.body || '';
        content.value = opts.content || null;
        onClose.value = opts.onClose || null;

        autClose.value = opts.autClose || 0;
        timeToClose.value = autClose.value;

        isOpen.value = true;
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            resetWindowPosition();
            mountContent();
        });
    };

    const close = () => {
        isOpen.value = false;
        document.body.style.overflow = '';

        resetWindowPosition();
        restoreContent();

        currentY = 0;
        isDragging = false;

        if (timer) {
            clearInterval(timer);
            timer = null;
        }

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

        if (currentY > slideCloseOffset) close();
        else el.style.transform = '';

        currentY = 0;
    };

    const bindTouchEvents = (el) => {
        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd);

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    };

    effect(() => eventBus.on('popup:open', open));
    effect(() => eventBus.on('popup:close', close));
    effect(() => {
        if (!isOpen.value) return;
        const el = getWindowEl();
        if (!el) return;
        return bindTouchEvents(el);
    });

    $this.open = open;
    $this.close = close;

    const renderTitle = () =>
        title.value ? html`<h2>${title.value}</h2>` : '';

    const renderBody = () =>
        body.value ? html`<div>${body.value}</div>` : '';

    const renderContent = () => {
        if (typeof content.value === 'function') {
            return content.value();
        }
        return typeof content.value === 'string'
            ? html([content.value])
            : html`${renderTitle()}${renderBody()}`;
    }


    return () => html`
        <div class=${isOpen.value ? 'popup popup--open' : 'popup'}
             style=${isOpen.value ? 'display:flex' : 'display:none'}>
            <div class="popup__overlay" onclick=${close}></div>
            <div class="popup__window">
                <div class="popup__close" onclick=${close}></div>
                <div class="popup__content">
                   ${renderContent()}
                </div>
            </div>
        </div>
    `;
});

defComponent('popup-trigger', ({ $this, effect, prop, eventBus }) => {
    const contentId = prop('contentId');
    const componentName = prop('component');

    const RESERVED_ATTRS = [
        'data-component',
        'data-content-id'
    ];

    const createFromContentId = () => {
        if (!contentId.value) return null;
        return document.getElementById(contentId.value);
    };

    const createComponent = () => {
        if (!componentName.value) return null;

        const el = document.createElement(componentName.value);

        $this.getAttributeNames()
            .filter(
                (name) =>
                    name.startsWith('data-') &&
                    !RESERVED_ATTRS.includes(name)
            )
            .forEach((name) => {
                el.setAttribute(name, $this.getAttribute(name));
            });

        return el;
    };

    effect(() => {
        const clickHandler = () => {
            let content = null;

            if (componentName.value) {
                content = createComponent();
            } else if (contentId.value) {
                content = createFromContentId();
            }

            if (!content) return;

            eventBus.emit('popup:open', { content });
        };

        $this.addEventListener('click', clickHandler);
        return () => $this.removeEventListener('click', clickHandler);
    });
});
