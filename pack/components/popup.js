//Programming open document.querySelector('popup-window', ).open({ title: 'title' });
function openModal(options) {
    document.querySelector('popup-window',)?.open(options);
}

defComponent('popup-window', ({ signal, html, effect, $this }) => {
    const isOpen = signal(false);
    const title = signal('');
    const body = signal('');
    const content = signal(null);
    const onClose = signal(null);

    const renderTitle = () => {
        if (!title.value) return '';
        return html`<h2>${html([title.value])}</h2>`;
    };

    const renderBody = () => {
        if (!body.value) return '';
        return html`<div>${html([body.value])}</div>`;
    };

    const renderContent = () => {
        if (content.value) {
            return html([content.value]);
        }

        return html`
            ${renderTitle()}
            ${renderBody()}
        `;
    };

    $this.open = (opts = {}) => {
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
    };

    $this.close = () => {
        isOpen.value = false;
        document.body.style.overflow = '';
        if (onClose.value) {
            onClose.value();
            onClose.value = null;
        }
    };

    effect(() => {
        if (!isOpen.value) return;

        const clickHandler = (e) => {
            if (e.target.closest('[data-popup-close]') || e.target.closest('[data-popup-overlay]')) {
                $this.close();
            }
        };

        $this.addEventListener('click', clickHandler);

        return () => $this.removeEventListener('click', clickHandler);
    });


    return () => html`
        <div class=${isOpen.value ? 'popup popup--open' : 'popup'}
             style=${isOpen.value ? 'display:flex' : 'display:none'}>
            <div class="popup__overlay" data-popup-overlay></div>
            <div class="popup__window" data-popup-window>
                <button class="popup__close" data-popup-close>&times;</button>
                <div class="popup__content">
                    ${renderContent()}
                    <slot></slot>
                </div>
            </div>
        </div>
    `;
});


defComponent('popup-trigger', ({ $this, effect, prop }) => {
    const contentData = prop('content');
    const contentId = prop('contentId');
    const popupId = prop('popupId');

    effect(() => {
        const popupWindowEl = popupId.value ? document.getElementById(popupId.value) : document.querySelector('popup-window');
        const contentEl = document.getElementById(contentId.value);

        if (!popupWindowEl) {
            throw new Error("popup-window not found in document")
        }

        const content = contentEl ? contentEl.innerHTML : contentData.value;

        if (contentEl) contentEl.remove();

        const clickHandler = () => {
            popupWindowEl.open({ content });
        };

        $this.addEventListener('click', clickHandler);

        return () => $this.removeEventListener('click', clickHandler);
    });
});
