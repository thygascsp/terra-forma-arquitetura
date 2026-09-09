/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Visualizador 3D de Arquitetura Bioclimática de Alto Padrão
 * Three.js - Todos os elementos com texturas táteis realistas (Madeira, Concreto, Tijolo, Grama)
 * Zero z-fighting, zero interseção na grama, Sol e Ventos que giram junto
 */

(function() {
  'use strict';

  const container = document.getElementById('threejs-canvas-container');
  if (!container) return;

  let width = container.clientWidth;
  let height = container.clientHeight || 480;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
  camera.position.set(16, 12, 18);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const architecturalModel = new THREE.Group();
  scene.add(architecturalModel);

  // Iluminação
  const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.85);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffeed0, 1.4);
  sunLight.position.set(22, 28, 16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -14;
  sunLight.shadow.camera.right = 14;
  sunLight.shadow.camera.top = 14;
  sunLight.shadow.camera.bottom = -14;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const interiorLight = new THREE.PointLight(0xffa733, 2.2, 16);
  interiorLight.position.set(0, 2.0, 0);
  architecturalModel.add(interiorLight);

  const hemiLight = new THREE.HemisphereLight(0xedf6f0, 0x302015, 0.6);
  scene.add(hemiLight);

  // --- GERADORES DE TEXTURAS PROCEDURAIS RICAS (ELIMINA ASPECTO PLÁSTICO) ---

  // 1. Textura de Concreto Aparente com Poros e Granulação
  function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#d4d1ca';
    ctx.fillRect(0, 0, 512, 512);

    // Ruído fino de areia e cimento
    for (let i = 0; i < 25000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.random() > 0.5 ? 230 : 180;
      ctx.fillStyle = `rgba(${gray},${gray},${gray},0.08)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Poros e marcas sutis de forma de madeira
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = 'rgba(120, 115, 108, 0.25)';
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Frisos de fôrma de concreto
    ctx.strokeStyle = 'rgba(130, 125, 118, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 170); ctx.lineTo(512, 170);
    ctx.moveTo(0, 340); ctx.lineTo(512, 340);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // 2. Textura de Madeira Cumaru com Veios Naturais
  function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9c542b';
    ctx.fillRect(0, 0, 512, 512);

    // Linhas de veios de madeira
    for (let y = 0; y < 512; y += 4) {
      const shade = Math.sin(y * 0.05) * 20;
      ctx.fillStyle = `rgba(${120 + shade}, ${60 + shade * 0.6}, ${30 + shade * 0.4}, 0.35)`;
      ctx.fillRect(0, y, 512, 3);
    }

    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = 'rgba(70, 30, 15, 0.4)';
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(170, y + 10, 340, y - 10, 512, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  }

  // 3. Textura de Tijolo Aparente
  function createBrickTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#261b16';
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16;
    const cols = 8;
    const rowH = 512 / rows;
    const colW = 512 / cols;
    const colors = ['#9e4832', '#a85139', '#8c3d28', '#b45a40', '#7a3220', '#a24630'];

    for (let r = 0; r < rows; r++) {
      const offsetX = (r % 2 === 0) ? 0 : colW / 2;
      for (let c = -1; c <= cols + 1; c++) {
        const x = c * colW + offsetX + 2;
        const y = r * rowH + 2;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, colW - 4, rowH - 4);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // 4. Textura de Grama / Teto Verde
  function createGreenRoofTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e5230';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = ['#2c7546', '#3b9459', '#174226', '#26633b'][Math.floor(Math.random() * 4)];
      ctx.fillRect(x, y, 2.5, 2.5);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }

  // MATERIAIS TEXTURIZADOS
  const matConcrete = new THREE.MeshStandardMaterial({
    map: createConcreteTexture(),
    roughness: 0.85,
    metalness: 0.05
  });

  const matWood = new THREE.MeshStandardMaterial({
    map: createWoodTexture(),
    roughness: 0.65,
    metalness: 0.08
  });

  const matBrick = new THREE.MeshStandardMaterial({
    map: createBrickTexture(),
    roughness: 0.85,
    metalness: 0.05
  });

  const matGreenRoof = new THREE.MeshStandardMaterial({
    map: createGreenRoofTexture(),
    roughness: 0.95,
    metalness: 0.0
  });

  const matGlass = new THREE.MeshPhysicalMaterial({
    color: 0x6bb8a5,
    transparent: true,
    opacity: 0.45,
    roughness: 0.08,
    transmission: 0.7,
    thickness: 0.5,
    reflectivity: 0.95
  });

  const matSolarPanel = new THREE.MeshStandardMaterial({
    color: 0x14314c,
    roughness: 0.2,
    metalness: 0.85
  });

  const matWater = new THREE.MeshStandardMaterial({
    color: 0x1d5854,
    transparent: true,
    opacity: 0.85,
    roughness: 0.1,
    metalness: 0.3
  });

  const matWireframe = new THREE.MeshBasicMaterial({
    color: 0xc8a261,
    wireframe: true
  });

  const matBioclimatic = new THREE.MeshStandardMaterial({
    color: 0x4a947a,
    transparent: true,
    opacity: 0.35,
    roughness: 0.3,
    depthWrite: false
  });

  const allMeshes = [];
  function registerMesh(mesh, originalMat) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { originalMaterial: originalMat };
    allMeshes.push(mesh);
    return mesh;
  }

  // --- MONTAGEM DA MAQUETE: CADA ELEMENTO COM ESPAÇO PRÓPRIO E SEM PONTOS BUGADOS ---

  // 1. Terreno / Piso da Maquete
  const ground = new THREE.Mesh(new THREE.BoxGeometry(15, 0.3, 15), matConcrete);
  ground.position.set(0, -0.15, 0);
  ground.receiveShadow = true;
  architecturalModel.add(registerMesh(ground, matConcrete));

  // 2. Deck de Madeira Frontal (y apoiado perfeitamente sobre a base)
  const deck = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 4), matWood);
  deck.position.set(1.5, 0.04, 4.2);
  architecturalModel.add(registerMesh(deck, matWood));

  // 3. Espelho D'Água / Piscina Biológica
  const pool = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.16, 4.2), matConcrete);
  pool.position.set(-4.5, 0.08, 4.2);
  architecturalModel.add(registerMesh(pool, matConcrete));

  const water = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 3.8), matWater);
  water.position.set(-4.5, 0.18, 4.2);
  architecturalModel.add(water);

  // 4. Paredes de Tijolo Aparente
  const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.4, 6.2), matBrick);
  wallLeft.position.set(-3.5, 1.7, -0.2);
  architecturalModel.add(registerMesh(wallLeft, matBrick));

  const wallBack = new THREE.Mesh(new THREE.BoxGeometry(6.6, 3.4, 0.4), matBrick);
  wallBack.position.set(0, 1.7, -3.1);
  architecturalModel.add(registerMesh(wallBack, matBrick));

  // 5. Grandes Panos de Vidro Low-E
  const glassFront = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.3, 0.08), matGlass);
  glassFront.position.set(0, 1.65, 2.9);
  architecturalModel.add(glassFront);

  const glassRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.3, 5.8), matGlass);
  glassRight.position.set(3.4, 1.65, -0.2);
  architecturalModel.add(glassRight);

  // Pilar de Concreto Frontal
  const pilar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.4, 0.4), matConcrete);
  pilar.position.set(3.4, 1.7, 2.9);
  architecturalModel.add(registerMesh(pilar, matConcrete));

  // 6. LAJE COM TETO VERDE (SEM INTERSEÇÕES OU PONTOS BUGADOS!)
  // A laje de concreto suporta tudo de Y=3.4 a 3.65
  const roof = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.25, 7.2), matConcrete);
  roof.position.set(0, 3.525, -0.1);
  architecturalModel.add(registerMesh(roof, matConcrete));

  // O teto verde é uma camada contínua e limpa estritamente sobre a laje (Y = 3.68)
  const greenRoof = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.08, 6.4), matGreenRoof);
  greenRoof.position.set(0, 3.69, -0.1);
  architecturalModel.add(registerMesh(greenRoof, matGreenRoof));

  // 7. Brises Verticais em Madeira Cumaru (Ficam estritamente na fachada de Y=0 a 3.4, sem encostar na grama!)
  const brisesGroup = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const brise = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.3, 0.3), matWood);
    brise.position.set(-1.6 + i * 0.7, 1.65, 3.15);
    brise.rotation.y = 0.42;
    brisesGroup.add(registerMesh(brise, matWood));
  }
  architecturalModel.add(brisesGroup);

  // 8. Pérgola Superior de Madeira (Apoiada na borda frontal da laje de concreto em Z=4.2, SEM TOCAR NA GRAMA!)
  for (let i = 0; i < 5; i++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 1.8), matWood);
    beam.position.set(0.8 + i * 0.65, 3.73, 4.0);
    architecturalModel.add(registerMesh(beam, matWood));
  }

  // 9. Painéis Solares Fotovoltaicos (Sobre suportes finos a Y=3.78)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 1.2), matSolarPanel);
      panel.position.set(-1.6 + i * 2.2, 3.77, -1.6 + j * 1.5);
      panel.rotation.x = -0.08;
      architecturalModel.add(panel);
    }
  }

  // --- MODO VENTOS & SOL (ANEXADOS À MAQUETE PARA GIRAREM JUNTOS!) ---

  // Setas de Ventilação Cruzada
  const windFlowGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const arrowDir = new THREE.Vector3(1, 0, -0.15).normalize();
    const arrowOrigin = new THREE.Vector3(-6.5, 1.2 + i * 0.9, -1 + i * 1.8);
    const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, 12, 0x00e5ff, 1.2, 0.5);
    arrow.line.material.linewidth = 3;
    windFlowGroup.add(arrow);
  }
  windFlowGroup.visible = false;
  architecturalModel.add(windFlowGroup);

  // Sol Heliotérmico 3D Radiante + Trajetória Solar
  const sunGizmoGroup = new THREE.Group();

  const sunSphereMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
  const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), sunSphereMat);
  sunSphere.position.set(-7, 8.5, 6);
  sunGizmoGroup.add(sunSphere);

  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0xff9900,
    transparent: true,
    opacity: 0.35,
    wireframe: true
  });
  const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), sunGlowMat);
  sunGlow.position.copy(sunSphere.position);
  sunGizmoGroup.add(sunGlow);

  const rayMat = new THREE.LineBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 5; i++) {
    const rayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-7, 8.5, 6),
      new THREE.Vector3(-2 + i * 1.2, 3.5, 2.5)
    ]);
    const rayLine = new THREE.Line(rayGeo, rayMat);
    sunGizmoGroup.add(rayLine);
  }

  const solarCurve = new THREE.EllipseCurve(0, 0, 11, 8.5, 0, Math.PI, false, 0);
  const points = solarCurve.getPoints(36);
  const arcGeo = new THREE.BufferGeometry().setFromPoints(
    points.map(p => new THREE.Vector3(p.x, p.y, 3))
  );
  const arcMat = new THREE.LineDashedMaterial({
    color: 0xffbb33,
    dashSize: 0.6,
    gapSize: 0.4,
    linewidth: 2
  });
  const solarArcLine = new THREE.Line(arcGeo, arcMat);
  solarArcLine.computeLineDistances();
  sunGizmoGroup.add(solarArcLine);

  sunGizmoGroup.visible = false;
  architecturalModel.add(sunGizmoGroup);

  // --- INTERATIVIDADE MOUSE & TOUCH ---
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let targetRotY = 0.45;
  let targetRotX = 0.2;
  let autoRotate = true;

  const onDown = (e) => {
    isDragging = true;
    autoRotate = false;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    prevMousePos = { x: cx, y: cy };
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = cx - prevMousePos.x;
    const dy = cy - prevMousePos.y;

    targetRotY += dx * 0.007;
    targetRotX += dy * 0.005;
    targetRotX = Math.max(-0.1, Math.min(0.55, targetRotX));

    prevMousePos = { x: cx, y: cy };
  };

  const onUp = () => {
    isDragging = false;
    setTimeout(() => { if (!isDragging) autoRotate = true; }, 4000);
  };

  container.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  container.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.02;
    camera.position.z = Math.max(10, Math.min(26, camera.position.z));
  }, { passive: false });

  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight || 480;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Botões de Modo
  const btnRealistic = document.getElementById('btn-3d-realistic');
  const btnBioclimatic = document.getElementById('btn-3d-bioclimatic');
  const btnWireframe = document.getElementById('btn-3d-wireframe');
  const ctrlBtns = [btnRealistic, btnBioclimatic, btnWireframe].filter(Boolean);

  function setMode(mode) {
    ctrlBtns.forEach(b => b.classList.remove('active'));
    if (mode === 'realistic') {
      if (btnRealistic) btnRealistic.classList.add('active');
      windFlowGroup.visible = false;
      sunGizmoGroup.visible = false;
      allMeshes.forEach(m => { m.material = m.userData.originalMaterial; });
    } else if (mode === 'bioclimatic') {
      if (btnBioclimatic) btnBioclimatic.classList.add('active');
      windFlowGroup.visible = true;
      sunGizmoGroup.visible = true;
      allMeshes.forEach(m => { m.material = matBioclimatic; });
    } else if (mode === 'wireframe') {
      if (btnWireframe) btnWireframe.classList.add('active');
      windFlowGroup.visible = false;
      sunGizmoGroup.visible = false;
      allMeshes.forEach(m => { m.material = matWireframe; });
    }
  }

  if (btnRealistic) btnRealistic.addEventListener('click', () => setMode('realistic'));
  if (btnBioclimatic) btnBioclimatic.addEventListener('click', () => setMode('bioclimatic'));
  if (btnWireframe) btnWireframe.addEventListener('click', () => setMode('wireframe'));

  const btnLight = document.getElementById('btn-3d-light');
  let isNight = false;
  if (btnLight) {
    btnLight.addEventListener('click', () => {
      isNight = !isNight;
      if (isNight) {
        sunLight.color.setHex(0xff7533);
        sunLight.intensity = 0.7;
        ambientLight.color.setHex(0x3a251c);
        interiorLight.intensity = 3.8;
        btnLight.innerHTML = '<span>🌙</span> Modo Noite';
      } else {
        sunLight.color.setHex(0xffedd0);
        sunLight.intensity = 1.4;
        ambientLight.color.setHex(0xfff5ea);
        interiorLight.intensity = 2.2;
        btnLight.innerHTML = '<span>☀️</span> Dia Solar';
      }
    });
  }

  const btnReset = document.getElementById('btn-3d-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      targetRotY = 0.45;
      targetRotX = 0.2;
      camera.position.set(16, 12, 18);
      autoRotate = true;
    });
  }

  // Otimização de performance: pausa Three.js quando fora do viewport
  let isCanvasVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (!isCanvasVisible) return; // Pausa se a maquete estiver fora da visão do usuário

    const elapsedTime = clock.getElapsedTime();

    if (autoRotate) targetRotY += 0.003;
    architecturalModel.rotation.y += (targetRotY - architecturalModel.rotation.y) * 0.08;
    architecturalModel.rotation.x += (targetRotX - architecturalModel.rotation.x) * 0.08;

    if (sunGlow) {
      sunGlow.rotation.y = elapsedTime * 0.5;
      sunGlow.rotation.z = elapsedTime * 0.3;
    }
    water.position.y = 0.18 + Math.sin(elapsedTime * 2.2) * 0.008;

    camera.lookAt(0, 1.8, 0);
    renderer.render(scene, camera);
  }
  animate();

})();
