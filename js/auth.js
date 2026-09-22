// Авторизация и регистрация
(function () {
    'use strict';

    const tabs = document.querySelectorAll('.auth__tab');
    const panels = document.querySelectorAll('.auth__panel');

    if (!tabs.length || !panels.length) return;

    function switchTab(name) {
        tabs.forEach((tab) => {
            const active = tab.dataset.tab === name;
            tab.classList.toggle('auth__tab--active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
            const active = panel.id === `panel-${name}`;
            panel.hidden = !active;
        });
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    document.querySelectorAll('[data-goto]').forEach((btn) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.goto));
    });

    // ===== РЕГУЛЯРКИ =====
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
    const NAME_REGEX  = /^[А-Яа-яЁёA-Za-z\s\-]{2,50}$/;

    // ===== ПРОВЕРКИ =====
    function checkEmail(input) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) { input.setCustomValidity(''); return false; }

        if (!EMAIL_REGEX.test(value)) {
            input.setCustomValidity('Введите корректный email, например: name@mail.ru');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }

    function checkName(input) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) { input.setCustomValidity(''); return false; }

        if (!NAME_REGEX.test(value)) {
            input.setCustomValidity('Введите данные в указанном формате. Только буквы, пробел и дефис. От 2 до 50 символов.');
            return false;
        }
        input.setCustomValidity('');
        return true;
    }

    function checkPasswords(form) {
        const pass = form.querySelector('input[name="password"]');
        const confirm = form.querySelector('input[name="password-confirm"]');
        if (!pass || !confirm) return true;

        if (!confirm.value) { confirm.setCustomValidity(''); return false; }

        if (pass.value !== confirm.value) {
            confirm.setCustomValidity('Пароли не совпадают');
            return false;
        }
        confirm.setCustomValidity('');
        return true;
    }

    // ===== ФОРМЫ =====
    const forms = document.querySelectorAll('.auth__panel form');

    forms.forEach((form) => {
        const emailInput      = form.querySelector('input[type="email"]');
        const confirmInput    = form.querySelector('input[name="password-confirm"]');
        const firstnameInput  = form.querySelector('input[name="firstname"]');
        const lastnameInput   = form.querySelector('input[name="lastname"]');
        const passwordInput   = form.querySelector('input[name="password"]');
        const agreeCheckbox   = form.querySelector('input[type="checkbox"][required]');
        const submitBtn       = form.querySelector('button[type="submit"]');
        const isRegisterForm  = !!confirmInput; // если есть подтверждение пароля — это регистрация

        // ===== ВАЛИДАЦИЯ ФОРМЫ (для активации кнопки) =====
        function validateForm() {
            if (!isRegisterForm) {
                // Для формы входа — просто проверяем заполнение и формат
                const okEmail = emailInput ? EMAIL_REGEX.test(emailInput.value.trim()) : true;
                const okPass  = passwordInput ? passwordInput.value.length >= 6 : true;
                if (submitBtn) submitBtn.disabled = !(okEmail && okPass);
                return;
            }

            // Регистрация
            const okEmail = emailInput ? EMAIL_REGEX.test(emailInput.value.trim()) : false;
            const okFirst = firstnameInput ? NAME_REGEX.test(firstnameInput.value.trim()) : false;
            const okLast  = lastnameInput ? NAME_REGEX.test(lastnameInput.value.trim()) : false;
            const okPass  = passwordInput ? passwordInput.value.length >= 6 : false;
            const okConf  = confirmInput && confirmInput.value === passwordInput.value && confirmInput.value.length >= 6;
            const agreed  = agreeCheckbox ? agreeCheckbox.checked : true;

            if (submitBtn) {
                submitBtn.disabled = !(okEmail && okFirst && okLast && okPass && okConf && agreed);
            }
        }

        // Следим за изменениями
        form.addEventListener('input', validateForm);
        form.addEventListener('change', validateForm);

        // Обработчики для мгновенной валидации при вводе
        if (emailInput)     emailInput.addEventListener('input', () => checkEmail(emailInput));
        if (firstnameInput) firstnameInput.addEventListener('input', () => checkName(firstnameInput));
        if (lastnameInput)  lastnameInput.addEventListener('input', () => checkName(lastnameInput));
        if (confirmInput)   confirmInput.addEventListener('input', () => checkPasswords(form));

        // ===== ОТПРАВКА =====
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            checkEmail(emailInput);
            checkName(firstnameInput);
            checkName(lastnameInput);
            checkPasswords(form);

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const data = Object.fromEntries(new FormData(form).entries());
            console.log('Форма отправлена:', data);
        });

        // Первая проверка
        validateForm();
    });

    // При переключении вкладок — пересчитать
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            setTimeout(() => {
                forms.forEach((form) => {
                    form.dispatchEvent(new Event('input'));
                });
            }, 50);
        });
    });
})();