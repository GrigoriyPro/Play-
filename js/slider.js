// Слайдер на главной
(function () {
    'use strict';

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroBg = hero.querySelector('.hero__bg');
    const heroContent = hero.querySelector('.hero__content');
    const heroEyebrow = hero.querySelector('.hero__eyebrow');
    const heroTitle = hero.querySelector('.hero__title');
    const heroSubtitle = hero.querySelector('.hero__subtitle');
    const dots = hero.querySelectorAll('.hero__dot');
    const prevBtn = hero.querySelector('.hero__arrow--prev');
    const nextBtn = hero.querySelector('.hero__arrow--next');

    const IMAGE_PATH = '../images/hero/';

    const slides = [
        {
            image: 'hero-1.jpg',
            eyebrow: 'НОВИНКИ',
            title: 'Свежие настолки<br>уже в продаже',
            subtitle: 'Стратегии, карточные, семейные —<br>выбирай под свою компанию'
        },
        {
            image: 'hero-2.jpg',
            eyebrow: 'СКИДКИ ДО 40%',
            title: 'Хиты продаж<br>по суперцене',
            subtitle: 'Каркассон, Манчкин, Колонизаторы —<br>только до конца месяца'
        },
        {
            image: 'hero-3.jpg',
            eyebrow: 'ДЛЯ ВЕЧЕРИНОК',
            title: 'Игры для<br>больших компаний',
            subtitle: 'Мафия, Codenames, Имаджинариум —<br>веселье гарантировано'
        }
    ];

    const AUTOPLAY_DELAY = 5000;
    const FADE_DURATION = 300;
    let current = 0;
    let timer = null;

    function render(index) {
        const slide = slides[index];

        heroContent.classList.add('hero__content--fading');

        setTimeout(() => {
            heroBg.style.backgroundImage = `url('${IMAGE_PATH}${slide.image}')`;
            heroEyebrow.innerHTML = slide.eyebrow;
            heroTitle.innerHTML = slide.title;
            heroSubtitle.innerHTML = slide.subtitle;

            dots.forEach((dot, i) => {
                const active = i === index;
                dot.classList.toggle('hero__dot--active', active);
                dot.setAttribute('aria-selected', String(active));
            });

            heroContent.classList.remove('hero__content--fading');
        }, FADE_DURATION);
    }

    function goTo(index) {
        const total = slides.length;
        current = (index + total) % total;
        render(current);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
        stop();
        timer = setInterval(next, AUTOPLAY_DELAY);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goTo(Number(dot.dataset.slideTo));
            start();
        });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    // Первый слайд
    heroBg.style.backgroundImage = `url('${IMAGE_PATH}${slides[0].image}')`;
    heroEyebrow.innerHTML = slides[0].eyebrow;
    heroTitle.innerHTML = slides[0].title;
    heroSubtitle.innerHTML = slides[0].subtitle;

    start();
})();