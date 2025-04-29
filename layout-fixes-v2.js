/**
 * AgroDecision - Script de correções de layout não intrusivas
 * Este script complementa as correções CSS sem interferir com a funcionalidade original
 */

// Inicialização - executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Corrigir sobreposição de texto nos cards sem modificar a estrutura
  document.querySelectorAll('.card, [class*="card"], [class*="section"]').forEach(function(card) {
    const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class])');
    textElements.forEach(function(el) {
      // Aplicar estilos apenas se o elemento não tiver posição definida
      if (!el.style.position || el.style.position === 'static') {
        el.style.maxWidth = '100%';
        el.style.overflow = 'hidden';
        el.style.textOverflow = 'ellipsis';
      }
    });
  });
  
  // Garantir que o mapa tenha altura adequada sem modificar outras propriedades
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const currentHeight = mapElement.style.height;
    if (!currentHeight || currentHeight === 'auto' || currentHeight === '0px') {
      mapElement.style.height = 'calc(100vh - 60px)';
    }
  }
  
  console.log('Correções de layout não intrusivas inicializadas com sucesso!');
});
