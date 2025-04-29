// Instalação do PWA para AgroDecision
// Gerencia a instalação do aplicativo como PWA

// Variável para armazenar o evento de instalação
let deferredPrompt;

// Inicializa o gerenciador de instalação
function initInstallManager() {
  // Escuta o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o comportamento padrão do navegador
    e.preventDefault();
    
    // Armazena o evento para uso posterior
    deferredPrompt = e;
    
    // Mostra o prompt de instalação personalizado
    showInstallPrompt();
  });
  
  // Escuta o evento appinstalled
  window.addEventListener('appinstalled', () => {
    // Limpa o prompt armazenado
    deferredPrompt = null;
    
    // Registra a instalação
    console.log('PWA instalado com sucesso');
    
    // Mostra mensagem de sucesso
    Swal.fire({
      title: 'Instalado!',
      text: 'O AgroDecision foi instalado com sucesso no seu dispositivo.',
      icon: 'success',
      confirmButtonColor: '#4CAF50'
    });
  });
}

// Mostra prompt personalizado de instalação
function showInstallPrompt() {
  // Verifica se já existe um prompt
  const existingPrompt = document.querySelector('.install-prompt');
  if (existingPrompt) {
    return;
  }
  
  // Verifica se o evento de instalação está disponível
  if (!deferredPrompt) {
    return;
  }
  
  // Cria o elemento do prompt
  const promptElement = document.createElement('div');
  promptElement.className = 'install-prompt animate__animated animate__fadeInUp';
  promptElement.innerHTML = `
    <div class="install-icon">📱</div>
    <div class="install-text">
      <h4>Instalar AgroDecision</h4>
      <p>Instale o aplicativo para acesso rápido e uso offline.</p>
      <div class="install-buttons">
        <button class="install-button install-accept">Instalar</button>
        <button class="install-button install-later">Mais tarde</button>
      </div>
    </div>
  `;
  
  // Adiciona ao corpo do documento
  document.body.appendChild(promptElement);
  
  // Adiciona eventos aos botões
  const installButton = promptElement.querySelector('.install-accept');
  const laterButton = promptElement.querySelector('.install-later');
  
  installButton.addEventListener('click', () => {
    // Esconde o prompt
    hideInstallPrompt();
    
    // Mostra o prompt nativo de instalação
    deferredPrompt.prompt();
    
    // Espera pela resposta do usuário
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      } else {
        console.log('Usuário recusou a instalação');
      }
      
      // Limpa o prompt armazenado
      deferredPrompt = null;
    });
  });
  
  laterButton.addEventListener('click', hideInstallPrompt);
  
  // Esconde o prompt após 10 segundos se o usuário não interagir
  setTimeout(() => {
    hideInstallPrompt();
  }, 10000);
}

// Esconde o prompt de instalação
function hideInstallPrompt() {
  const promptElement = document.querySelector('.install-prompt');
  if (promptElement) {
    promptElement.classList.remove('animate__fadeInUp');
    promptElement.classList.add('animate__fadeOutDown');
    
    // Remove o elemento após a animação
    setTimeout(() => {
      if (promptElement.parentElement) {
        promptElement.remove();
      }
    }, 500);
  }
}

// Verifica se o aplicativo está sendo executado como PWA instalado
function isPWAInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Exporta funções
window.installManager = {
  initInstallManager,
  showInstallPrompt,
  hideInstallPrompt,
  isPWAInstalled
};
