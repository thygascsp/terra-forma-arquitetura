/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Script Principal - Modais, Filtros, Paleta com Textura no Fundo e FAQ
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. MENU MOBILE DRAWER
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (navMenu && navToggle && navBackdrop) {
      navMenu.classList.add('active');
      navToggle.classList.add('open');
      navBackdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (navMenu && navToggle && navBackdrop) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('open');
      navBackdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

  // 2. MODAL DE AGENDAMENTO DE CONSULTA TÉCNICA (BOA VISTA - RR)
  const scheduleModal = document.getElementById('modal-schedule');
  const openScheduleBtns = document.querySelectorAll('.btn-open-schedule');
  const closeScheduleBtn = document.getElementById('btn-close-schedule');
  const scheduleForm = document.getElementById('form-schedule');
  const scheduleSuccess = document.getElementById('schedule-success-message');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openScheduleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(scheduleModal);
    });
  });

  if (closeScheduleBtn) {
    closeScheduleBtn.addEventListener('click', () => closeModal(scheduleModal));
  }

  if (scheduleModal) {
    scheduleModal.addEventListener('click', (e) => {
      if (e.target === scheduleModal) closeModal(scheduleModal);
    });
  }

  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sched-name')?.value || '';
      const phone = document.getElementById('sched-phone')?.value || '';
      const type = document.getElementById('sched-type')?.value || '';
      const location = document.getElementById('sched-location')?.value || 'Boa Vista, RR';
      const date = document.getElementById('sched-date')?.value || '';
      const notes = document.getElementById('sched-notes')?.value || '';

      const whatsappMsg = `Olá, Atelier TERRA & FORMA (Boa Vista, RR)!%0A%0A` +
        `Gostaria de agendar uma Reunião Técnica de Arquitetura:%0A` +
        `• *Nome:* ${name}%0A` +
        `• *WhatsApp:* ${phone}%0A` +
        `• *Tipologia:* ${type}%0A` +
        `• *Localização:* ${location}%0A` +
        `• *Data Preferencial:* ${date}%0A` +
        `• *Detalhes:* ${notes}`;

      if (scheduleSuccess) {
        scheduleSuccess.style.display = 'block';
        scheduleForm.style.display = 'none';
      }

      setTimeout(() => {
        window.open(`https://wa.me/5595991234567?text=${whatsappMsg}`, '_blank');
      }, 1000);
    });
  }

  // 3. MODAL DE ESTUDO DE CASO
  const projectModal = document.getElementById('modal-project-detail');
  const closeProjectBtn = document.getElementById('btn-close-project');
  const projectCards = document.querySelectorAll('.project-card');

  const projectDetailsData = {
    'residencia-brises': {
      title: 'Residência Terra & Brises Amazônicos',
      category: 'Residencial Bioclimático • 480 m²',
      location: 'Boa Vista, RR (Bairro Paraviana)',
      cert: 'LEED Platinum / Referencial Amazônico',
      materials: 'Tijolo maciço ecológico de solo-cimento, brises em cumaru e vidro duplo insulado',
      energy: '85% de autonomia com geração solar fotovoltaica contínua no sol de Roraima',
      water: 'Cisterna pluvial com reaproveitamento das chuvas para jardim e piscina',
      description: 'Projetada especificamente para o clima quente e ensolarado de Boa Vista. A orientação solar inteligente e os brises de madeira bloqueiam a radiação poente, permitindo que a brisa refrescante do Rio Branco circule livremente pelos ambientes, reduzindo drasticamente o consumo de energia.'
    },
    'pavilhao-eco': {
      title: 'Pavilhão Bioclimático & Café da Orla',
      category: 'Comercial & Café • 320 m²',
      location: 'Boa Vista, RR (Orla Taumanan / Rio Branco)',
      cert: 'AQUA-HQE Ouro',
      materials: 'Estrutura de madeira laminada colada, paredes de taipa e tijolo aparente, espelho d água biológico',
      energy: 'Ventilação passiva induzida pelo espelho d água e iluminação zenital difusa',
      water: '100% de reaproveitamento hídrico com jardins de chuva drenantes',
      description: 'Um espaço de convivência integrado à natureza e às margens do Rio Branco. O espelho d água resfria o microclima em até 4°C por evaporação natural antes que o ar ingresse no pavilhão de tijolo e vidro.'
    },
    'retrofit-galpao': {
      title: 'Edifício Biofílico & Ateliê Criativo',
      category: 'Comercial & Retrofit • 850 m²',
      location: 'Boa Vista, RR (Centro Histórico)',
      cert: 'Certificação Zero Carbono',
      materials: 'Tijolos aparentes restaurados, madeira cumaru, jardineiras suspensas em cascata',
      energy: 'Redução de 68% no uso de ar-condicionado através de fachadas verdes e ventilação cruzada',
      water: 'Captação pluvial de alta capacidade',
      description: 'Antiga estrutura de alvenaria requalificada para abrigar um hub de inovação sustentável. As sacadas receberam jardins verticais exuberantes que barram o sol equatorial e proporcionam conforto térmico inigualável.'
    }
  };

  projectCards.forEach((card) => {
    const detailBtn = card.querySelector('.btn-view-project');
    if (detailBtn) {
      detailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = card.getAttribute('data-project-id');
        const data = projectDetailsData[projectId];

        if (data && projectModal) {
          document.getElementById('proj-modal-title').textContent = data.title;
          document.getElementById('proj-modal-cat').textContent = data.category;
          document.getElementById('proj-modal-location').textContent = data.location;
          document.getElementById('proj-modal-cert').textContent = data.cert;
          document.getElementById('proj-modal-materials').textContent = data.materials;
          document.getElementById('proj-modal-energy').textContent = data.energy;
          document.getElementById('proj-modal-water').textContent = data.water;
          document.getElementById('proj-modal-desc').textContent = data.description;
          openModal(projectModal);
        }
      });
    }
  });

  if (closeProjectBtn) closeProjectBtn.addEventListener('click', () => closeModal(projectModal));
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeModal(projectModal);
    });
  }

  // 4. FILTROS DE PROJETOS
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => { card.style.display = 'none'; }, 280);
        }
      });
    });
  });

  // 5. SELETOR INTERATIVO DE MATERIAIS COM TEXTURA NO FUNDO!
  const materialBtns = document.querySelectorAll('.mat-selector-btn');
  const matCard = document.getElementById('mat-detail-card');
  const matTextureShowcase = document.getElementById('mat-texture-showcase');
  const matShowcaseLabel = document.getElementById('mat-showcase-label');
  const matName = document.getElementById('mat-name');
  const matOrigin = document.getElementById('mat-origin');
  const matBenefit = document.getElementById('mat-benefit');
  const matCarbon = document.getElementById('mat-carbon');

  const materialsInfo = {
    'tijolo': {
      label: 'Tijolo Maciço Solo-Cimento Ecológico',
      name: 'Tijolo Maciço de Solo-Cimento Ecológico (Roraima)',
      origin: 'Produzido com terra da região norte, curado ao sol sem queima em fornos (emissão zero de CO₂)',
      benefit: 'Alta inércia térmica que impede a entrada do calor equatorial durante os horários de pico',
      carbon: '-78% de pegada de carbono em comparação com tijolo cerâmico tradicional',
      bgImage: 'assets/images/texture-tijolo.jpg'
    },
    'madeira': {
      label: 'Madeira Cumaru / Teca Manejo FSC',
      name: 'Madeira Cumaru e Teca de Manejo Florestal Sustentável',
      origin: 'Madeiras nobres amazônicas com certificação FSC e rastreabilidade total',
      benefit: 'Brises solares reguláveis que protegem a fachada sem barrar as brisas do Rio Branco',
      carbon: 'Sequestro líquido de carbono ativo na estrutura do imóvel',
      bgImage: 'assets/images/texture-madeira.jpg'
    },
    'concreto': {
      label: 'Concreto Biofílico Aparente',
      name: 'Concreto Biofílico com Agregados Naturais',
      origin: 'Misturas ecológicas com areias selecionadas e aditivos de baixo impacto',
      benefit: 'Resfriamento passivo com floreiras integradas à estrutura',
      carbon: 'Redução de até 45% nas emissões de clínquer do cimento convencional',
      bgImage: 'assets/images/texture-concreto.jpg'
    },
    'vidro': {
      label: 'Vidro Low-E Solar Cool Duplo',
      name: 'Vidros Baixo-Emissivos (Low-E) Solar Cool',
      origin: 'Nanotecnologia com bloqueio seletivo de raios infravermelhos',
      benefit: 'Permite desfrutar da luz natural amazônica barrando 82% do calor solar',
      carbon: 'Economia comprovada de mais de 40% na conta de energia',
      bgImage: 'assets/images/texture-vidro.jpg'
    }
  };

  function updateMaterial(matKey) {
    const info = materialsInfo[matKey];
    if (!info) return;

    if (matName) matName.textContent = info.name;
    if (matOrigin) matOrigin.textContent = info.origin;
    if (matBenefit) matBenefit.textContent = info.benefit;
    if (matCarbon) matCarbon.textContent = info.carbon;
    if (matShowcaseLabel) matShowcaseLabel.textContent = info.label;

    // Vitrine ampla dedicada: 100% VISÍVEL E LIMPA (SEM MÁSCARA ESCURA COBRINDO A FOTO)
    if (matTextureShowcase) {
      matTextureShowcase.style.backgroundImage = `url('${info.bgImage}')`;
      matTextureShowcase.style.backgroundSize = 'cover';
      matTextureShowcase.style.backgroundPosition = 'center';
    }
  }

  materialBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      materialBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const matKey = btn.getAttribute('data-mat');
      updateMaterial(matKey);
    });
  });

  // Inicializa o primeiro material (Tijolo)
  updateMaterial('tijolo');

  // 6. ACORDEÃO INTERATIVO DE FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        item.classList.toggle('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          } else {
            answer.style.maxHeight = null;
          }
        }
      });
    }
  });

  // 7. BOTÃO VOLTAR AO TOPO
  const backToTopBtn = document.getElementById('btn-back-to-top');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (backToTopBtn) {
      if (scrollY > 350) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
