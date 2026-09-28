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
    const NAME_REGEX  = /^[А-ЯЁA-Z][а-яёa-z\-]+$/;

    // ===== АВТОКАПИТАЛИЗАЦИЯ =====
    function capitalize(value) {
        if (!value) return value;
        return value
            .split(/(\s|-)/)
            .map(part => {
                if (part === ' ' || part === '-') return part;
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            })
            .join('');
    }

    // ===== ПРОВЕРКИ =====
    function checkEmail(input) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) { input.setCustomValidity(''); markValid(input, false); return false; }

        if (!EMAIL_REGEX.test(value)) {
            input.setCustomValidity('Введите корректный email, например: name@mail.ru');
            markValid(input, false);
            return false;
        }
        input.setCustomValidity('');
        markValid(input, true);
        return true;
    }

    function checkName(input) {
        if (!input) return true;
        const value = input.value.trim();
        if (!value) { input.setCustomValidity(''); markValid(input, false); return false; }

        if (value.length < 2) {
            input.setCustomValidity('Минимум 2 символа');
            markValid(input, false);
            return false;
        }

        if (value.length > 50) {
            input.setCustomValidity('Максимум 50 символов');
            markValid(input, false);
            return false;
        }

        if (!NAME_REGEX.test(value)) {
            input.setCustomValidity('Первая буква должна быть заглавной. Только буквы, дефис.');
            markValid(input, false);
            return false;
        }
        input.setCustomValidity('');
        markValid(input, true);
        return true;
    }

    function checkPasswords(form) {
        const pass = form.querySelector('input[name="password"]');
        const confirm = form.querySelector('input[name="password-confirm"]');
        if (!pass || !confirm) return true;

        if (!confirm.value) { confirm.setCustomValidity(''); markValid(confirm, false); return false; }

        if (pass.value !== confirm.value) {
            confirm.setCustomValidity('Пароли не совпадают');
            markValid(confirm, false);
            return false;
        }
        confirm.setCustomValidity('');
        markValid(confirm, true);
        return true;
    }

    // ===== ПОДСВЕТКА ПОЛЕЙ =====
    function markValid(input, valid) {
        if (!input) return;
        if (valid) {
            input.classList.remove('form__input--error');
            input.classList.add('form__input--ok');
        } else if (input.value.length > 0) {
            input.classList.add('form__input--error');
            input.classList.remove('form__input--ok');
        } else {
            input.classList.remove('form__input--error', 'form__input--ok');
        }
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
        const isRegisterForm  = !!confirmInput;

        // ===== ВАЛИДАЦИЯ ДЛЯ КНОПКИ =====
        function validateForm() {
            if (!isRegisterForm) {
                const okEmail = emailInput ? EMAIL_REGEX.test(emailInput.value.trim()) : true;
                const okPass  = passwordInput ? passwordInput.value.length >= 6 : true;
                if (submitBtn) submitBtn.disabled = !(okEmail && okPass);
                return;
            }

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

        form.addEventListener('input', validateForm);
        form.addEventListener('change', validateForm);

        // ===== АВТОКАПИТАЛИЗАЦИЯ =====
        if (firstnameInput) {
            firstnameInput.addEventListener('input', (e) => {
                const pos = e.target.selectionStart;
                const before = e.target.value;
                const after = capitalize(before);

                if (before !== after) {
                    e.target.value = after;
                    e.target.setSelectionRange(pos, pos);
                }

                checkName(firstnameInput);
            });
        }

        if (lastnameInput) {
            lastnameInput.addEventListener('input', (e) => {
                const pos = e.target.selectionStart;
                const before = e.target.value;
                const after = capitalize(before);

                if (before !== after) {
                    e.target.value = after;
                    e.target.setSelectionRange(pos, pos);
                }

                checkName(lastnameInput);
            });
        }

        if (emailInput)     emailInput.addEventListener('input', () => checkEmail(emailInput));
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

        validateForm();
    });

    // При переключении вкладок — пересчитать
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            setTimeout(() => {
                forms.forEach((form) => form.dispatchEvent(new Event('input')));
            }, 50);
        });
    });
})();