// Каталог в шапке
(function () {
    'use strict';

    const toggle = document.getElementById('catalog-toggle');
    const panel = document.getElementById('catalog-panel');
    if (!toggle || !panel) return;

    function setOpen(open) {
        toggle.setAttribute('aria-expanded', String(open));
        if (open) {
            panel.classList.add('is-open');
        } else {
            panel.classList.remove('is-open');
        }
    }

    // Клик по кнопке «Каталог»
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        setOpen(!isOpen);
    });

    // Клик вне панели
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            setOpen(false);
        }
    });

    // Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
})();