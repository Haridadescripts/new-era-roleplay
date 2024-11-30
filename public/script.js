document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let startX;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Desativa seleção de texto durante o arrasto
    carousel.addEventListener('selectstart', e => e.preventDefault());

    // Funções de toque e mouse
    function startDrag(e) {
        isDragging = true;
        startX = getPositionX(e);
        carousel.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        const walk = diff;
        
        currentTranslate = prevTranslate + walk;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function endDrag(e) {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        // Determina se o usuário arrastou o suficiente para mudar de slide
        if (Math.abs(movedBy) > 100) {
            if (movedBy < 0) {
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
        }
        
        updateCarousel();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    // Adiciona eventos de toque
    carousel.addEventListener('touchstart', startDrag);
    carousel.addEventListener('touchmove', drag);
    carousel.addEventListener('touchend', endDrag);

    // Adiciona eventos de mouse
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('mousemove', drag);
    carousel.addEventListener('mouseup', endDrag);
    carousel.addEventListener('mouseleave', endDrag);

    // Atualiza o carrossel com animação suave
    function updateCarousel() {
        carousel.style.transition = 'transform 0.5s ease-out';
        currentTranslate = -(currentIndex * carousel.clientWidth);
        prevTranslate = currentTranslate;
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Atualiza quando a janela é redimensionada
    window.addEventListener('resize', () => {
        carousel.style.transition = 'none';
        updateCarousel();
    });
    
    // Botões de navegação
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
    
    // Auto-play com pausa ao interagir
    let autoplayInterval;

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Pausa o autoplay quando o usuário interage
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay);
    prevBtn.addEventListener('mouseenter', stopAutoplay);
    nextBtn.addEventListener('mouseenter', stopAutoplay);

    // Reinicia o autoplay quando o usuário para de interagir
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchend', startAutoplay);
    prevBtn.addEventListener('mouseleave', startAutoplay);
    nextBtn.addEventListener('mouseleave', startAutoplay);

    // Inicia o carrossel
    updateCarousel();
    startAutoplay();

    // Menu mobile
    const menuBtn = document.querySelector('.menu-mobile-btn');
    const navMenu = document.querySelector('.navmenu');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Muda o ícone do botão
        menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-item a, .btn1').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        }
    });
}); 