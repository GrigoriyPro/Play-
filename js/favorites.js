// Страница «Избранное»
(function () {
    'use strict';

    const grid = document.querySelector('[data-favorites-grid]');
    const countEl = document.querySelector('[data-favorites-count]');
    if (!grid) return;

    // ===== ДАННЫЕ ИГР =====
    const PRODUCTS = [
        { id: 1, name: 'Каркассон',      price: 2490, oldPrice: null, brand: 'Hobby World',       isNew: true  },
        { id: 2, name: 'Манчкин',        price: 1690, oldPrice: 1990, brand: 'Hobby World',       isNew: false },
        { id: 3, name: 'Диксит',         price: 2290, oldPrice: null, brand: 'GaGa Games',        isNew: false },
        { id: 4, name: 'Колонизаторы',   price: 3490, oldPrice: null, brand: 'Hobby World',       isNew: false },
        { id: 5, name: 'Codenames',      price: 1790, oldPrice: null, brand: 'GaGa Games',        isNew: true  },
        { id: 6, name: 'Имаджинариум',   price: 2790, oldPrice: null, brand: 'Cosmodrome Games',  isNew: false },
        { id: 7, name: 'Билет на поезд', price: 3190, oldPrice: null, brand: 'Hobby World',       isNew: false },
        { id: 8, name: 'UNO',            price: 590,  oldPrice: 690,  brand: 'Mattel',            isNew: false },
        { id: 9, name: 'Мафия',          price: 990,  oldPrice: null, brand: 'GaGa Games',        isNew: false }
    ];

    const FAVORITES_KEY = 'play_favorites';

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(list) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    }

    function renderCard(game) {
        const discount = game.oldPrice
            ? Math.round((1 - game.price / game.oldPrice) * 100)
            : 0;

        return `
            <article class="product-card">
                <a href="product.html?id=${game.id}" class="product-card__image-wrap">
                    <img class="product-card__image" src="../images/products/monopoly.jpg" alt="${game.name}">
                    ${game.isNew ? '<span class="product-card__badge product-card__badge--new">Новинка</span>' : ''}
                    ${discount ? `<span class="product-card__badge product-card__badge--sale">-${discount}%</span>` : ''}
                </a>
                <div class="product-card__body">
                    <p class="product-card__brand">${game.brand}</p>
                    <h3 class="product-card__title">
                        <a href="product.html?id=${game.id}">${game.name}</a>
                    </h3>
                    <div class="product-card__prices">
                        <p class="product-card__price">${game.price.toLocaleString('ru-RU')} ₽</p>
                        ${game.oldPrice ? `<p class="product-card__old-price">${game.oldPrice.toLocaleString('ru-RU')} ₽</p>` : ''}
                    </div>
                    <button type="button" class="btn btn--primary product-card__button">В корзину</button>
                    <button type="button" class="btn btn--ghost product-card__remove" data-remove-favorite="${game.id}">
                        Убрать из избранного
                    </button>
                </div>
            </article>
        `;
    }

    function render() {
        const favorites = getFavorites();
        const items = PRODUCTS.filter(p => favorites.includes(p.id));

        if (!items.length) {
            grid.innerHTML = `
                <div class="catalog-page__empty" style="grid-column: 1 / -1;">
                    <p style="margin-bottom: 16px;">У вас пока нет избранных игр</p>
                    <a href="catalog.html" class="btn btn--primary">Перейти в каталог</a>
                </div>
            `;
            if (countEl) countEl.textContent = '0 товаров';
            return;
        }

        grid.innerHTML = items.map(renderCard).join('');

        if (countEl) {
            const n = items.length;
            const mod10 = n % 10;
            const mod100 = n % 100;
            let word = 'товаров';
            if (mod10 === 1 && mod100 !== 11) word = 'товар';
            else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) word = 'товара';
            countEl.textContent = `${n} ${word}`;
        }
    }

    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-remove-favorite]');
        if (!btn) return;

        const id = Number(btn.dataset.removeFavorite);
        const list = getFavorites().filter(favId => favId !== id);
        saveFavorites(list);
        render();
    });

    render();
})();