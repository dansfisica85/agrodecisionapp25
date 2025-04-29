/**
 * AgroDecision - Script de correções de layout não intrusivas (Versão Final)
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
  
  // Observador de mutação para garantir que as correções sejam aplicadas mesmo após mudanças dinâmicas no DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Aplicar correções aos novos elementos
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Elemento
            // Corrigir textos em cards
            if (node.classList && (node.classList.contains('card') || node.className.includes('card') || node.className.includes('section'))) {
              const textElements = node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class])');
              textElements.forEach(function(el) {
                if (!el.style.position || el.style.position === 'static') {
                  el.style.maxWidth = '100%';
                  el.style.overflow = 'hidden';
                  el.style.textOverflow = 'ellipsis';
                }
              });
            }
          }
        });
      }
    });
  });
  
  // Configurar observador para monitorar mudanças no conteúdo
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('Correções de layout não intrusivas inicializadas com sucesso!');
});
