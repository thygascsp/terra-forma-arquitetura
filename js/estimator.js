/**
 * TERRA & FORMA Atelier de Arquitetura - Boa Vista, RR
 * Simulador & Estimador de Viabilidade Bioclimática para o Clima de Roraima
 */

(function() {
  'use strict';

  const typeSelect = document.getElementById('est-type');
  const areaRange = document.getElementById('est-area');
  const areaValueDisplay = document.getElementById('est-area-value');
  const checkboxes = document.querySelectorAll('.est-feature');
  
  const outEnergy = document.getElementById('out-energy-saving');
  const outWater = document.getElementById('out-water-saving');
  const outScore = document.getElementById('out-eco-score');
  const outTime = document.getElementById('out-project-time');
  const outCertification = document.getElementById('out-certification-level');
  
  const btnWhatsapp = document.getElementById('btn-est-whatsapp');
  const btnPrint = document.getElementById('btn-est-print');

  if (!areaRange || !areaValueDisplay) return;

  function calculateEstimates() {
    const area = parseInt(areaRange.value, 10);
    areaValueDisplay.textContent = `${area} m²`;

    let baseEnergy = 28;
    let baseWater = 25;
    let baseScore = 45;
    let baseMonths = 3;

    const type = typeSelect ? typeSelect.value : 'residencia';
    let typeName = 'Residência Bioclimática em Boa Vista';

    if (type === 'residencia') {
      typeName = 'Residência Bioclimática de Alto Padrão';
      baseMonths = Math.max(3, Math.round(area / 120));
    } else if (type === 'retrofit') {
      typeName = 'Retrofit & Reforma Sustentável';
      baseScore += 10;
      baseMonths = Math.max(2, Math.round(area / 150));
    } else if (type === 'comercial') {
      typeName = 'Complexo Corporativo / Comercial Verde';
      baseScore += 5;
      baseMonths = Math.max(4, Math.round(area / 180));
    } else if (type === 'hotel') {
      typeName = 'Hotel Boutique / Eco-Resort Amazônico';
      baseMonths = Math.max(5, Math.round(area / 200));
    }

    let selectedFeatures = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        selectedFeatures.push(cb.getAttribute('data-name') || cb.value);
        if (cb.value === 'solar') { baseEnergy += 38; baseScore += 15; }
        if (cb.value === 'water') { baseWater += 40; baseScore += 12; }
        if (cb.value === 'green-roof') { baseEnergy += 10; baseScore += 10; }
        if (cb.value === 'brises') { baseEnergy += 14; baseScore += 8; }
        if (cb.value === 'brick') { baseScore += 10; }
        if (cb.value === 'cert') { baseScore += 15; }
      }
    });

    const finalEnergy = Math.min(88, baseEnergy);
    const finalWater = Math.min(80, baseWater);
    const finalScore = Math.min(100, baseScore);

    let certLabel = 'Selo Verde Básico';
    if (finalScore >= 85) {
      certLabel = 'LEED Platinum / Referencial Amazônico Ouro';
    } else if (finalScore >= 70) {
      certLabel = 'LEED Gold / Selo Casa Azul Caixa';
    } else if (finalScore >= 55) {
      certLabel = 'LEED Silver / Conforto Bioclimático';
    }

    if (outEnergy) outEnergy.textContent = `${finalEnergy}%`;
    if (outWater) outWater.textContent = `${finalWater}%`;
    if (outScore) outScore.textContent = `${finalScore}/100`;
    if (outTime) outTime.textContent = `${baseMonths} a ${baseMonths + 2} meses`;
    if (outCertification) outCertification.textContent = certLabel;

    if (btnWhatsapp) {
      const phone = '5595991234567'; // Número de Boa Vista, Roraima
      const message = `Olá, Atelier TERRA & FORMA (Boa Vista, RR)!%0A%0A` +
        `Fiz uma estimativa no site para meu projeto em Roraima:%0A` +
        `• *Tipologia:* ${typeName}%0A` +
        `• *Área:* ${area} m²%0A` +
        `• *Redução de Energia Esperada:* ${finalEnergy}%%0A` +
        `• *Economia Hídrica:* ${finalWater}%%0A` +
        `• *Score Sustentável:* ${finalScore}/100 (${certLabel})%0A` +
        `• *Recursos:* ${selectedFeatures.join(', ')}%0A%0A` +
        `Gostaria de agendar uma reunião técnica em Boa Vista.`;

      btnWhatsapp.href = `https://wa.me/${phone}?text=${message}`;
    }
  }

  if (typeSelect) typeSelect.addEventListener('change', calculateEstimates);
  areaRange.addEventListener('input', calculateEstimates);
  checkboxes.forEach((cb) => cb.addEventListener('change', calculateEstimates));

  if (btnPrint) {
    btnPrint.addEventListener('click', () => { window.print(); });
  }

  calculateEstimates();

})();
