// Фильтры и сортировка в каталоге
(function () {
    'use strict';

    const grid = document.querySelector('[data-products]');
    if (!grid) return;

    const countEl = document.querySelector('[data-count]');
    const sortSelect = document.querySelector('[data-sort]');
    const filtersBox = document.querySelector('[data-filters]');
    const resetBtn = document.querySelector('[data-filters-reset]');
    const priceFrom = document.querySelector('[data-price-from]');
    const priceTo = document.querySelector('[data-price-to]');
    const priceApply = document.querySelector('[data-price-apply]');
    const titleEl = document.querySelector('.catalog-page__title');

    // ====== ДАННЫЕ ИГР ======
    const PRODUCTS = [
        { id: 1, name: 'Каркассон',      genre: 'strategy', players: '2-5',  age: '6+',  price: 2490, oldPrice: null, brand: 'Hobby World',       isNew: true  },
        { id: 2, name: 'Манчкин',        genre: 'card',     players: '3-6',  age: '12+', price: 1690, oldPrice: 1990, brand: 'Hobby World',       isNew: false },
        { id: 3, name: 'Диксит',         genre: 'family',   players: '3-8',  age: '6+',  price: 2290, oldPrice: null, brand: 'GaGa Games',        isNew: false },
        { id: 4, name: 'Колонизаторы',   genre: 'strategy', players: '3-4',  age: '12+', price: 3490, oldPrice: null, brand: 'Hobby World',       isNew: false },
        { id: 5, name: 'Codenames',      genre: 'party',    players: '4-8',  age: '12+', price: 1790, oldPrice: null, brand: 'GaGa Games',        isNew: true  },
        { id: 6, name: 'Имаджинариум',   genre: 'party',    players: '4-7',  age: '12+', price: 2790, oldPrice: null, brand: 'Cosmodrome Games',  isNew: false },
        { id: 7, name: 'Билет на поезд', genre: 'family',   players: '2-5',  age: '6+',  price: 3190, oldPrice: null, brand: 'Hobby World',       isNew: false },
        { id: 8, name: 'UNO',            genre: 'card',     players: '2-10', age: '6+',  price: 590,  oldPrice: 690,  brand: 'Mattel',            isNew: false },
        { id: 9, name: 'Мафия',          genre: 'party',    players: '5-12', age: '18+', price: 990,  oldPrice: null, brand: 'GaGa Games',        isNew: false }
    ];

    // ====== СОСТОЯНИЕ ======
    const state = {
        genres: [],
        players: [],
        ages: [],
        brands: [],
        priceFrom: null,
        priceTo: null,
        sort: 'popular'
    };

    // ====== ЧТЕНИЕ ПАРАМЕТРОВ ИЗ URL ======
    const params = new URLSearchParams(location.search);
    const genreParam = params.get('genre');
    const searchParam = params.get('search') ? params.get('search').toLowerCase().trim() : null;

    const GENRE_TITLES = {
        strategy: 'Стратегии',
        card:     'Карточные',
        family:   'Семейные',
        puzzle:   'Головоломки',
        party:    'Для вечеринок'
    };

    if (genreParam && GENRE_TITLES[genreParam]) {
        state.genres = [genreParam];

        const genreCheckbox = document.querySelector(`input[data-filter="genres"][value="${genreParam}"]`);
        if (genreCheckbox) genreCheckbox.checked = true;

        if (titleEl) titleEl.textContent = GENRE_TITLES[genreParam];
    }

    // ====== ФИЛЬТРАЦИЯ ======
    function applyFilters() {
        let items = PRODUCTS.slice();

        if (searchParam) {
            items = items.filter(p =>
                p.name.toLowerCase().includes(searchParam) ||
                p.brand.toLowerCase().includes(searchParam)
            );
        }

        if (state.genres.length) {
            items = items.filter(p => state.genres.includes(p.genre));
        }

        if (state.players.length) {
            items = items.filter(p => {
                const [min, max] = p.players.split('-').map(Number);
                return state.players.some(range => {
                    if (range === '1-2')  return max <= 2;
                    if (range === '3-4')  return min >= 3 && max <= 4;
                    if (range === '5+')   return max >= 5;
                    return false;
                });
            });
        }

        if (state.ages.length) {
            items = items.filter(p => state.ages.includes(p.age));
        }

        if (state.brands.length) {
            items = items.filter(p => state.brands.includes(p.brand));
        }

        if (state.priceFrom !== null) items = items.filter(p => p.price >= state.priceFrom);
        if (state.priceTo !== null)   items = items.filter(p => p.price <= state.priceTo);

        switch (state.sort) {
            case 'price-asc':  items.sort((a, b) => a.price - b.price); break;
            case 'price-desc': items.sort((a, b) => b.price - a.price); break;
            case 'name':       items.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'new':        items.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
            default:           break;
        }

        return items;
    }

    // ====== РЕНДЕР КАРТОЧКИ ======
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
                </div>
            </article>
        `;
    }

    function render() {
        const items = applyFilters();

        if (searchParam && titleEl) {
            titleEl.textContent = `Поиск: «${searchParam}»`;
        }

        if (!items.length) {
            grid.innerHTML = '<p class="catalog-page__empty">Ничего не найдено. Попробуйте изменить фильтры.</p>';
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

    // ====== ОБРАБОТЧИКИ ======

    if (filtersBox) {
        filtersBox.addEventListener('change', (e) => {
            const cb = e.target;
            if (!cb.matches('input[type="checkbox"][data-filter]')) return;

            const key = cb.dataset.filter;
            const value = cb.value;

            if (cb.checked) {
                if (!state[key].includes(value)) state[key].push(value);
            } else {
                state[key] = state[key].filter(v => v !== value);
            }

            render();
        });
    }

    if (priceApply) {
        priceApply.addEventListener('click', () => {
            const from = priceFrom?.value.trim();
            const to = priceTo?.value.trim();
            state.priceFrom = from ? Number(from) : null;
            state.priceTo = to ? Number(to) : null;
            render();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            state.sort = sortSelect.value;
            render();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (params.has('search') || params.has('genre')) {
                window.location.href = 'catalog.html';
                return;
            }

            state.genres = [];
            state.players = [];
            state.ages = [];
            state.brands = [];
            state.priceFrom = null;
            state.priceTo = null;
            state.sort = 'popular';

            if (filtersBox) {
                filtersBox.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            if (priceFrom) priceFrom.value = '';
            if (priceTo) priceTo.value = '';
            if (sortSelect) sortSelect.value = 'popular';
            if (titleEl) titleEl.textContent = 'Все игры';

            render();
        });
    }

    render();
})();