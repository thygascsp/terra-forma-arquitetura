/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Parallax da Árvore à Esquerda (Talos Fora da Tela), Tilt 3D e Slider Antes & Depois
 */

(function() {
  'use strict';

  // 1. COPA TROPICAL À ESQUERDA (MOVIMENTO ULTRA LEVE APENAS COM SCROLL)
  const branches = [
    { el: document.querySelector('.branch-top'), rot: 18, speed: 0.05 },
    { el: document.querySelector('.branch-upper-mid'), rot: -6, speed: 0.12 },
    { el: document.querySelector('.branch-mid'), rot: 8, speed: 0.08 },
    { el: document.querySelector('.branch-lower-mid'), rot: -14, speed: 0.14 },
    { el: document.querySelector('.branch-bottom'), rot: -24, speed: 0.06 }
  ].filter(b => b.el !== null);

  const singleLeftTree = document.querySelector('.left-tree-foliage');

  let isTicking = false;
  function onScrollParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Movimento sutil e suave apenas com a rolagem
    for (let i = 0; i < branches.length; i++) {
      const b = branches[i];
      const y = scrollY * b.speed;
      b.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${b.rot}deg)`;
    }

    if (singleLeftTree) {
      singleLeftTree.style.transform = `translate3d(0, ${(scrollY * 0.08).toFixed(1)}px, 0)`;
    }

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScrollParallax);
      isTicking = true;
    }
  }, { passive: true });

  // Executa uma vez na inicialização
  onScrollParallax();

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
