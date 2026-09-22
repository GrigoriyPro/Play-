// Поиск в шапке
(function () {
    'use strict';

    const searchBtn = document.getElementById('search-toggle');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (!searchBtn || !searchForm || !searchInput) return;

    // Открытие / закрытие по кнопке
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (searchForm.classList.contains('is-open')) {
            searchForm.classList.remove('is-open');
        } else {
            searchForm.classList.add('is-open');
            setTimeout(function () {
                searchInput.focus();
            }, 100);
        }
    });

    // Клик по форме — не закрывать
    searchForm.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Клик вне — закрыть
    document.addEventListener('click', function () {
        searchForm.classList.remove('is-open');
    });

    // Escape — закрыть
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            searchForm.classList.remove('is-open');
        }
    });

    // Отправка формы
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var query = searchInput.value.trim();

        // Пустой поиск — открываем каталог без параметра
        if (!query) {
            window.location.href = 'catalog.html';
            return;
        }

        window.location.href = 'catalog.html?search=' + encodeURIComponent(query);
    });
})();