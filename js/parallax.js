/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Parallax da Árvore à Esquerda (Talos Fora da Tela), Tilt 3D e Slider Antes & Depois
 */

(function() {
  'use strict';

  // 1. COPA TROPICAL À ESQUERDA (5 GALHOS COM FÍSICA E PARALLAX INDEPENDENTES)
  const branches = [
    {
      el: document.querySelector('.branch-top'),
      baseRot: 18,
      baseScale: 1.0,
      scrollSpeed: 0.06,
      mouseAmpX: 11,
      mouseAmpY: 5,
      mouseRotAmp: 2.2,
      windAmp: 2.2,
      windFreq1: 0.0016,
      windFreq2: 0.0029,
      phase: 0.0,
      tension: 0.04,
      damping: 0.88,
      currX: 0, currY: 0, currRot: 18,
      vx: 0, vy: 0, vRot: 0
    },
    {
      el: document.querySelector('.branch-upper-mid'),
      baseRot: -6,
      baseScale: 1.02,
      scrollSpeed: 0.16,
      mouseAmpX: 18,
      mouseAmpY: 9,
      mouseRotAmp: 3.6,
      windAmp: 3.4,
      windFreq1: 0.0024,
      windFreq2: 0.0041,
      phase: 1.7,
      tension: 0.065,
      damping: 0.84,
      currX: 0, currY: 0, currRot: -6,
      vx: 0, vy: 0, vRot: 0
    },
    {
      el: document.querySelector('.branch-mid'),
      baseRot: 8,
      baseScale: 1.06,
      scrollSpeed: 0.11,
      mouseAmpX: 14,
      mouseAmpY: 7,
      mouseRotAmp: 2.8,
      windAmp: 2.6,
      windFreq1: 0.0019,
      windFreq2: 0.0034,
      phase: 3.3,
      tension: 0.05,
      damping: 0.86,
      currX: 0, currY: 0, currRot: 8,
      vx: 0, vy: 0, vRot: 0
    },
    {
      el: document.querySelector('.branch-lower-mid'),
      baseRot: -14,
      baseScale: 0.98,
      scrollSpeed: 0.19,
      mouseAmpX: 16,
      mouseAmpY: 8,
      mouseRotAmp: 3.2,
      windAmp: 3.1,
      windFreq1: 0.0027,
      windFreq2: 0.0046,
      phase: 4.8,
      tension: 0.055,
      damping: 0.85,
      currX: 0, currY: 0, currRot: -14,
      vx: 0, vy: 0, vRot: 0
    },
    {
      el: document.querySelector('.branch-bottom'),
      baseRot: -24,
      baseScale: 0.95,
      scrollSpeed: 0.08,
      mouseAmpX: 10,
      mouseAmpY: 5,
      mouseRotAmp: 2.0,
      windAmp: 1.8,
      windFreq1: 0.0014,
      windFreq2: 0.0026,
      phase: 6.1,
      tension: 0.038,
      damping: 0.90,
      currX: 0, currY: 0, currRot: -24,
      vx: 0, vy: 0, vRot: 0
    }
  ].filter(b => b.el !== null);

  const singleLeftTree = document.querySelector('.left-tree-foliage');
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
    const time = performance.now();
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Atualização física individual para cada galho da copa
    branches.forEach((b) => {
      // 1. Vento orgânico perpétuo (duas harmônicas defasadas)
      const windWave = Math.sin(time * b.windFreq1 + b.phase) * b.windAmp +
                       Math.cos(time * b.windFreq2 + b.phase * 0.8) * (b.windAmp * 0.45);

      // 2. Coordenadas alvo baseadas em scroll e interação do mouse
      const targetX = currentX * b.mouseAmpX;
      const targetY = (scrollY * b.scrollSpeed) + (currentY * b.mouseAmpY);
      const targetRot = b.baseRot + windWave + (currentX * b.mouseRotAmp);

      // 3. Sistema de molas (Hooke + Damping) com inércia independente
      b.vx = (b.vx + (targetX - b.currX) * b.tension) * b.damping;
      b.currX += b.vx;

      b.vy = (b.vy + (targetY - b.currY) * b.tension) * b.damping;
      b.currY += b.vy;

      b.vRot = (b.vRot + (targetRot - b.currRot) * b.tension) * b.damping;
      b.currRot += b.vRot;

      // 4. Aplicação no estilo do elemento com aceleração por GPU
      b.el.style.transform = `translate3d(${b.currX.toFixed(2)}px, ${b.currY.toFixed(2)}px, 0) rotate(${b.currRot.toFixed(2)}deg) scale(${b.baseScale})`;
    });

    // Compatibilidade caso exista árvore legada individual
    if (singleLeftTree) {
      const scrollOffset = scrollY * 0.12;
      const swayX = currentX * 10;
      const swayY = currentY * 6;
      singleLeftTree.style.transform = `translate3d(${swayX}px, ${scrollOffset + swayY}px, 0) rotate(${currentX * 1.2}deg)`;
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
