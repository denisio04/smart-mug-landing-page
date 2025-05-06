document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.mug-slider-container'); // Usaremos este para los botones
    if (!sliderContainer) return; // Salir si no hay contenedor del slider

    const slider = sliderContainer.querySelector('.mug-slider');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const nextButton = sliderContainer.querySelector('.slider-btn.next');
    const prevButton = sliderContainer.querySelector('.slider-btn.prev');
    const dotsContainer = sliderContainer.querySelector('.slider-dots');

    if (slides.length <= 1) { // Si no hay suficientes slides, ocultar controles
        if(nextButton) nextButton.style.display = 'none';
        if(prevButton) prevButton.style.display = 'none';
        if(dotsContainer) dotsContainer.style.display = 'none';
        return;
    }

    let currentSlideIndex = 0;
    let slideInterval;
    const AUTOPLAY_DELAY = 5000;

    // Crear dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    function goToSlide(slideIndex) {
        const previousSlideIndex = currentSlideIndex;
        currentSlideIndex = slideIndex;

        slides[previousSlideIndex].classList.remove('active');
        slides[previousSlideIndex].classList.add('prev-slide'); // Para animar la salida

        slides[currentSlideIndex].classList.remove('prev-slide'); // Asegurar que no tenga esta clase
        slides[currentSlideIndex].classList.add('active');

        // Resetear la clase prev-slide del que ya no es prev-slide visualmente
        // Esto es importante si el usuario navega rápido o salta slides con los dots
        slides.forEach((s, i) => {
            if (i !== previousSlideIndex && i !== currentSlideIndex) {
                s.classList.remove('prev-slide');
            }
        });
        
        // Forzar reflow para que la transición se aplique correctamente si se quita y añade 'active' rápidamente
        // void slides[currentSlideIndex].offsetWidth;


        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
    }

    nextButton.addEventListener('click', () => {
        let nextIndex = (currentSlideIndex + 1) % slides.length;
        goToSlide(nextIndex);
        resetAutoplay();
    });

    prevButton.addEventListener('click', () => {
        let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
        resetAutoplay();
    });

    function startAutoplay() {
        slideInterval = setInterval(() => {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
        clearInterval(slideInterval);
        startAutoplay();
    }

    // Inicialización
    goToSlide(0); // Mostrar el primer slide
    if (slides.length > 1) { // Solo iniciar autoplay si hay más de un slide
        startAutoplay();
    }
});