/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Parallax da Árvore à Esquerda (Talos Fora da Tela), Tilt 3D e Slider Antes & Depois
 */

(function() {
  'use strict';

  // 1. ÁRVORE TROPICAL À ESQUERDA (DESCE SUAVEMENTE COM PARALLAX LENTO)
  const leftTree = document.querySelector('.left-tree-foliage');
  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    mouseY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        mouseX = Math.max(-1, Math.min(1, e.gamma / 30));
        mouseY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    }, { passive: true });
  }

  function renderParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Árvore à esquerda: desce de forma mais lenta e balança levemente com o vento/mouse
    if (leftTree) {
      const scrollOffset = scrollY * 0.12;
      const swayX = currentX * 10;
      const swayY = currentY * 6;
      leftTree.style.transform = `translate3d(${swayX}px, ${scrollOffset + swayY}px, 0) rotate(${currentX * 1.2}deg)`;
    }

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.1;
      const mouseFactor = parseFloat(el.getAttribute('data-mouse-factor')) || 20;
      const rect = el.parentElement.getBoundingClientRect();
      const elementOffset = rect.top * speed * -0.45;
      const moveX = currentX * mouseFactor;
      const moveY = elementOffset + currentY * (mouseFactor * 0.5);
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    requestAnimationFrame(renderParallax);
  }
  renderParallax();

  // 2. CARDS COM TILT 3D
  const tiltCards = document.querySelectorAll('.tilt-3d-card');
  tiltCards.forEach((card) => {
    const glare = card.querySelector('.tilt-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(200, 162, 97, 0.35), transparent 70%)`;
        glare.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) glare.style.opacity = '0';
    });
  });

  // 3. SLIDER ANTES E DEPOIS
  const baContainer = document.querySelector('.ba-slider-container');
  const baHandle = document.querySelector('.ba-handle');
  const baAfterImage = document.querySelector('.ba-image-after');

  if (baContainer && baHandle && baAfterImage) {
    let isDraggingSlider = false;

    const setSliderPosition = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      offsetX = Math.max(0, Math.min(rect.width, offsetX));

      const percentage = (offsetX / rect.width) * 100;
      baHandle.style.left = `${percentage}%`;
      baAfterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
    };

    setSliderPosition(baContainer.getBoundingClientRect().left + baContainer.offsetWidth * 0.5);

    const onStart = (e) => {
      isDraggingSlider = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    const onMove = (e) => {
      if (!isDraggingSlider) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    const onEnd = () => { isDraggingSlider = false; };

    baHandle.addEventListener('mousedown', onStart);
    baContainer.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    baHandle.addEventListener('touchstart', onStart, { passive: true });
    baContainer.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

})();
