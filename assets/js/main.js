document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const sliderTrack = document.querySelector('.slider__track');
    const sliderButtons = document.querySelectorAll('.slider__button');
    const slides = document.querySelectorAll('.testimonial');
    const form = document.getElementById('appointmentForm');

    let currentSlide = 0;

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    const updateActiveLink = () => {
        const sections = document.querySelectorAll('main section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
            const link = document.querySelector(`.nav__list a[href="#${section.id}"]`);
            if (!link) return;
            if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    const goToSlide = (index) => {
        if (!sliderTrack) return;
        currentSlide = (index + slides.length) % slides.length;
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    sliderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const direction = button.dataset.direction === 'next' ? 1 : -1;
            goToSlide(currentSlide + direction);
        });
    });

    let sliderInterval = null;

    const startSlider = () => {
        if (!sliderTrack) return;
        sliderInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    };

    const stopSlider = () => {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    };

    if (sliderTrack) {
        sliderTrack.addEventListener('mouseenter', stopSlider);
        sliderTrack.addEventListener('mouseleave', startSlider);
        startSlider();
    }

    const showError = (input, message) => {
        const errorElement = document.getElementById(`${input.id}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (input) => {
        const errorElement = document.getElementById(`${input.id}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.removeAttribute('aria-invalid');
    };

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let isValid = true;

            const nameInput = form.elements['name'];
            const phoneInput = form.elements['phone'];
            const serviceSelect = form.elements['service'];
            const successMessage = document.getElementById('formSuccess');

            if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Введите ваше имя (минимум 2 символа).');
                isValid = false;
            } else {
                clearError(nameInput);
            }

            if (!phoneInput.value.trim() || !phoneInput.checkValidity()) {
                showError(phoneInput, 'Укажите корректный номер телефона.');
                isValid = false;
            } else {
                clearError(phoneInput);
            }

            if (!serviceSelect.value) {
                showError(serviceSelect, 'Выберите направление приёма.');
                isValid = false;
            } else {
                clearError(serviceSelect);
            }

            if (isValid) {
                form.reset();
                if (successMessage) {
                    successMessage.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
                }
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.textContent = '';
                    }
                }, 7000);
            } else if (successMessage) {
                successMessage.textContent = '';
            }
        });

        ['input', 'change'].forEach((eventName) => {
            form.addEventListener(eventName, (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
                    return;
                }
                if (target.id && target.value.trim()) {
                    clearError(target);
                }
            });
        });
    }
});
