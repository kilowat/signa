//Programming open
// document.getElementById('modal-root', { title: 'myTitle' });

defComponent('modal-window', ({ signal, html, effect, $this }) => {
    const isOpen = signal(false);
    const title = signal('');
    const body = signal('');
    const content = signal(null);
    const onClose = signal(null);
    const popupId = $this.getAttribute('id') || null;

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

    $this.open = ({ title: t = '', body: b = '', content: c = null, onClose: onCb = null } = {}) => {
        title.value = t;
        body.value = b;
        content.value = c;
        onClose.value = onCb;
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


defComponent('modal-trigger', ({ $this, effect }) => {
    const popupId = $this.getAttribute('data-modal-id');
    const content = $this.getAttribute('data-content');

    if (!popupId) {
        throw new Error("data-modal-id required")
    }

    effect(() => {
        const clickHandler = () => {
            const popup = document.getElementById(popupId);
            if (popup && typeof popup.open === 'function') {
                popup.open({ content });
            }
        };
        $this.addEventListener('click', clickHandler);

        return () => $this.removeEventListener('click', clickHandler);
    });
});