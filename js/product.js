// Страница карточки товара
(function () {
    'use strict';

    const titleEl  = document.querySelector('[data-product-title]');
    const brandEl  = document.querySelector('[data-product-brand]');
    const priceEl  = document.querySelector('[data-product-price]');
    const oldPriceEl = document.querySelector('[data-product-old-price]');
    const discountEl = document.querySelector('[data-product-discount]');
    const imageEl  = document.querySelector('[data-product-image]');
    const breadcrumbEl = document.querySelector('[data-product-breadcrumb]');
    const descEl = document.querySelector('[data-product-description]');
    const badgeNewEl = document.querySelector('[data-product-badge-new]');
    const badgeSaleEl = document.querySelector('[data-product-badge-sale]');

    const playersEl = document.querySelector('[data-spec-players]');
    const ageEl     = document.querySelector('[data-spec-age]');
    const timeEl    = document.querySelector('[data-spec-time]');
    const specBrandEl = document.querySelector('[data-spec-brand]');

    const favoriteBtn = document.querySelector('[data-favorite-btn]');

    if (!titleEl) return;

    const PRODUCTS = [
        { id: 1, name: 'Каркассон',      genre: 'strategy', genreName: 'Стратегии',      players: '2-5',  age: '6+',  time: '30-45 мин',   price: 2490, oldPrice: null, brand: 'Hobby World',      isNew: true,  description: 'Каркассон — классическая настольная игра на составление карты средневековых земель. Игроки выкладывают тайлы с дорогами, городами и монастырями, размещая своих подданных для получения очков.' },
        { id: 2, name: 'Манчкин',        genre: 'card',     genreName: 'Карточные',      players: '3-6',  age: '12+', time: '60-90 мин',   price: 1690, oldPrice: 1990, brand: 'Hobby World',      isNew: false, description: 'Манчкин — пародийная карточная игра про подземелья, монстров и сокровища. Убивай монстров, качай уровень, предавай друзей — всё ради победы!' },
        { id: 3, name: 'Диксит',         genre: 'family',   genreName: 'Семейные',       players: '3-8',  age: '6+',  time: '30 мин',      price: 2290, oldPrice: null, brand: 'GaGa Games',       isNew: false, description: 'Диксит — игра на ассоциации с красивыми иллюстрациями. Один игрок загадывает ассоциацию к своей карте, остальные ищут похожие. Угадал — получил очки.' },
        { id: 4, name: 'Колонизаторы',   genre: 'strategy', genreName: 'Стратегии',      players: '3-4',  age: '12+', time: '90-120 мин',  price: 3490, oldPrice: null, brand: 'Hobby World',      isNew: false, description: 'Колонизаторы — экономическая стратегия про освоение острова. Стройте дороги, города, торгуйте ресурсами и первым наберите 10 очков победы.' },
        { id: 5, name: 'Codenames',      genre: 'party',    genreName: 'Для вечеринок',  players: '4-8',  age: '12+', time: '15-30 мин',   price: 1790, oldPrice: null, brand: 'GaGa Games',       isNew: true,  description: 'Codenames — командная игра на ассоциации. Капитан даёт подсказки из одного слова, команда угадывает своих агентов по кодовым именам.' },
        { id: 6, name: 'Имаджинариум',   genre: 'party',    genreName: 'Для вечеринок',  players: '4-7',  age: '12+', time: '30-60 мин',   price: 2790, oldPrice: null, brand: 'Cosmodrome Games', isNew: false, description: 'Имаджинариум — игра на ассоциации с сюрреалистичными картинками. Загадывайте ассоциации, угадывайте чужие и двигайте своего слона вперёд.' },
        { id: 7, name: 'Билет на поезд', genre: 'family',   genreName: 'Семейные',       players: '2-5',  age: '6+',  time: '60 мин',      price: 3190, oldPrice: null, brand: 'Hobby World',      isNew: false, description: 'Билет на поезд — семейная стратегия про железные дороги. Собирайте вагоны, соединяйте города и выполняйте маршруты.' },
        { id: 8, name: 'UNO',            genre: 'card',     genreName: 'Карточные',      players: '2-10', age: '6+',  time: '15-30 мин',   price: 590,  oldPrice: 690,  brand: 'Mattel',           isNew: false, description: 'UNO — всемирно известная карточная игра. Избавляйся от карт первым, не забудь крикнуть «UNO!» когда останется одна.' },
        { id: 9, name: 'Мафия',          genre: 'party',    genreName: 'Для вечеринок',  players: '5-12', age: '18+', time: '30-60 мин',   price: 990,  oldPrice: null, brand: 'GaGa Games',       isNew: false, description: 'Мафия — психологическая игра на социальную дедукцию. Городские ищут мафию, мафия убивает горожан. Кто победит?' }
    ];

    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id')) || 1;
    const game = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

    document.title = `${game.name} — Play!`;

    if (titleEl) titleEl.textContent = game.name;
    if (brandEl) brandEl.textContent = game.brand;
    if (priceEl) priceEl.textContent = `${game.price.toLocaleString('ru-RU')} ₽`;

    if (game.oldPrice) {
        const discount = Math.round((1 - game.price / game.oldPrice) * 100);

        if (oldPriceEl) {
            oldPriceEl.textContent = `${game.oldPrice.toLocaleString('ru-RU')} ₽`;
            oldPriceEl.hidden = false;
        }
        if (discountEl) {
            discountEl.textContent = `-${discount}%`;
            discountEl.hidden = false;
        }
        if (badgeSaleEl) {
            badgeSaleEl.textContent = `-${discount}%`;
            badgeSaleEl.hidden = false;
        }
    }

    if (game.isNew && badgeNewEl) {
        badgeNewEl.hidden = false;
    }

    if (imageEl) {
        imageEl.src = '../images/products/monopoly.jpg';
        imageEl.alt = game.name;
    }

    if (breadcrumbEl) {
        breadcrumbEl.innerHTML = `
            <a href="index.html">Главная</a>
            <span>›</span>
            <a href="catalog.html">Каталог</a>
            <span>›</span>
            <a href="catalog.html?genre=${game.genre}">${game.genreName}</a>
            <span>›</span>
            <b>${game.name}</b>
        `;
    }

    if (playersEl) playersEl.textContent = game.players;
    if (ageEl)     ageEl.textContent = game.age;
    if (timeEl)    timeEl.textContent = game.time;
    if (specBrandEl) specBrandEl.textContent = game.brand;

    if (descEl) descEl.textContent = game.description;

    // ===== ИЗБРАННОЕ =====
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

    function isFavorite(gameId) {
        return getFavorites().includes(gameId);
    }

    function toggleFavorite(gameId) {
        let list = getFavorites();

        if (list.includes(gameId)) {
            list = list.filter(id => id !== gameId);
        } else {
            list.push(gameId);
        }

        saveFavorites(list);
        return list.includes(gameId);
    }

    if (favoriteBtn) {
        if (isFavorite(game.id)) {
            favoriteBtn.classList.add('is-active');
        }

        favoriteBtn.addEventListener('click', () => {
            const active = toggleFavorite(game.id);
            favoriteBtn.classList.toggle('is-active', active);

            console.log(active ? `${game.name} добавлен в избранное` : `${game.name} удалён из избранного`);
        });
    }
})();