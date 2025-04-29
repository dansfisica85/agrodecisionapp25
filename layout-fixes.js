/**
 * AgroDecision - Script de correções de layout
 * Este script complementa as correções CSS para garantir o funcionamento correto do layout
 */

// Função para alternar o menu lateral
window.toggleMenu = function() {
  const navDrawer = document.getElementById('navDrawer');
  const body = document.body;
  
  if (navDrawer.classList.contains('open')) {
    navDrawer.classList.remove('open');
    body.classList.remove('nav-open');
    body.classList.add('nav-closed');
  } else {
    navDrawer.classList.add('open');
    body.classList.add('nav-open');
    body.classList.remove('nav-closed');
  }
};

// Função para alternar o dropdown do usuário
window.toggleUserDropdown = function() {
  const userInfo = document.getElementById('userInfo');
  if (userInfo.classList.contains('active')) {
    userInfo.classList.remove('active');
  } else {
    userInfo.classList.add('active');
  }
};

// Inicialização - executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar classe inicial ao body
  document.body.classList.add('nav-closed');
  
  // Corrigir posicionamento de elementos com posição absoluta
  document.querySelectorAll('[style*="position: absolute"]').forEach(function(el) {
    // Garantir que elementos absolutos não ultrapassem seus contêineres
    const parent = el.parentElement;
    if (parent && parent !== document.body) {
      if (!parent.style.position || parent.style.position === 'static') {
        parent.style.position = 'relative';
      }
    }
  });
  
  // Corrigir sobreposição de texto nos cards
  document.querySelectorAll('.card, [class*="card"], [class*="section"]').forEach(function(card) {
    const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class])');
    textElements.forEach(function(el) {
      el.style.position = 'static';
      el.style.clear = 'both';
      el.style.display = 'block';
      el.style.margin = '10px 0';
      el.style.maxWidth = '100%';
    });
  });
  
  // Corrigir elementos do mapa Leaflet
  const mapElement = document.getElementById('map');
  if (mapElement) {
    // Garantir que o mapa tenha altura adequada
    mapElement.style.height = 'calc(100vh - 60px)';
    mapElement.style.marginTop = '60px';
    mapElement.style.width = '100%';
    mapElement.style.position = 'relative';
    mapElement.style.zIndex = '1';
  }
  
  console.log('Correções de layout inicializadas com sucesso!');
});
