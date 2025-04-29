// Home para AgroDecision PWA
// Gerencia a tela inicial e recursos de boas-vindas

// Carrega a tela inicial melhorada
function loadHomeScreen() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="home-container animate__animated animate__fadeIn">
      <div class="logo-container">
        <img src="images/logo_AD.png" class="animated-logo" alt="AgroDecision Logo">
      </div>
      <div class="welcome-text animate__animated animate__fadeInUp">
        <h1>Bem-vindo ao AgroDecision</h1>
        <p>Sua ferramenta inteligente para decisões agrícolas baseadas em dados climáticos</p>
      </div>
      
      <div class="feature-grid">
        <div class="feature-card" onclick="showScreen('monthly')">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Consulta Mensal</h3>
          <p class="feature-desc">Analise dados climáticos mensais para planejar suas atividades agrícolas.</p>
        </div>
        
        <div class="feature-card" onclick="showScreen('regional')">
          <div class="feature-icon">🌍</div>
          <h3 class="feature-title">Consulta Regional</h3>
          <p class="feature-desc">Acesse notícias e previsões climáticas específicas para sua região.</p>
        </div>
        
        <div class="feature-card" onclick="showScreen('simulation')">
          <div class="feature-icon">🌾</div>
          <h3 class="feature-title">Simulação de Colheita</h3>
          <p class="feature-desc">Simule resultados de colheita com base em dados climáticos históricos.</p>
        </div>
        
        <div class="feature-card" onclick="showScreen('indicators')">
          <div class="feature-icon">📈</div>
          <h3 class="feature-title">Indicadores</h3>
          <p class="feature-desc">Monitore índices importantes como seca, vegetação e risco de geada.</p>
        </div>
      </div>
      
      <div class="offline-notice" id="offlineNotice" style="display: none;">
        <div class="notice-icon">📱</div>
        <div class="notice-text">
          <h3>Disponível Offline</h3>
          <p>Este aplicativo funciona mesmo sem conexão à internet. Instale-o para acesso rápido.</p>
          <button class="modern-button" onclick="window.installManager.showInstallPrompt()">Instalar Agora</button>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona efeitos 3D ao logo
  const logo = document.querySelector('.animated-logo');
  
  if (logo) {
    logo.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = logo.getBoundingClientRect();
      const x = (e.pageX - left) / width * 30 - 15;
      const y = (e.pageY - top) / height * 30 - 15;
      
      logo.style.transform = `
        rotateY(${x}deg) 
        rotateX(${y}deg)
        scale(1.1)
      `;
    });
    
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    });
  }
  
  // Verifica se o aplicativo está instalado
  if (!window.installManager.isPWAInstalled() && window.offlineManager.isOnline()) {
    document.getElementById('offlineNotice').style.display = 'flex';
  }
}

// Mostra animação de boas-vindas
function showHomeAnimation() {
  return new Promise((resolve) => {
    const content = document.getElementById('content');
    const mapElement = document.getElementById('map');
    
    // Esconde o mapa durante a animação
    mapElement.style.display = 'none';
    content.style.display = 'block';
    
    content.innerHTML = `
      <div class="home-animation-container">
        <img src="images/logo_AD.png" class="logo-animation" alt="AgroDecision Logo">
        <div class="animation-text">Bem-vindo ao AgroDecision</div>
      </div>
    `;

    const logo = document.querySelector('.logo-animation');
    
    // Adiciona sequência de animação
    setTimeout(() => {
      logo.classList.add('animate__zoomOut');
      // Após a animação de zoom out, carrega a tela inicial
      setTimeout(() => {
        loadHomeScreen();
        setTimeout(() => {
          resolve();
        }, 500);
      }, 500);
    }, 2000);
  });
}

// Verifica se há atualizações disponíveis
function checkForUpdates() {
  if ('serviceWorker' in navigator && window.offlineManager.isOnline()) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update().then(() => {
        console.log('Verificação de atualizações concluída');
      }).catch(error => {
        console.error('Erro ao verificar atualizações:', error);
      });
    });
  }
}

// Mostra notificação de nova versão disponível
function showUpdateNotification() {
  Swal.fire({
    title: 'Nova Versão Disponível',
    text: 'Uma nova versão do AgroDecision está disponível. Deseja atualizar agora?',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#4CAF50',
    cancelButtonColor: '#999',
    confirmButtonText: 'Atualizar',
    cancelButtonText: 'Mais tarde'
  }).then((result) => {
    if (result.isConfirmed) {
      // Recarrega a página para aplicar a atualização
      window.location.reload();
    }
  });
}

// Exporta funções
window.homeManager = {
  loadHomeScreen,
  showHomeAnimation,
  checkForUpdates,
  showUpdateNotification
};
