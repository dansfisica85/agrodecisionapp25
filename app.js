// Aplicativo principal AgroDecision PWA
// Gerencia a inicialização e coordenação de todos os módulos

// Variáveis globais
let map, marker;
let climateData = null;

// Inicialização do aplicativo
window.onload = async function() {
  try {
    // Inicializa o banco de dados
    await window.dbManager.initDB();
    
    // Inicializa o mapa
    window.mapManager.initMap();
    
    // Inicializa autenticação
    window.authManager.initAuth();
    
    // Inicializa gerenciador de instalação
    window.installManager.initInstallManager();
    
    // Inicializa gerenciador offline
    window.offlineManager.initOfflineManager();
    
    // Inicializa animações
    initAnimations();
    
    // Verifica se é a primeira execução
    checkFirstRun();
    
    console.log('Aplicativo inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar o aplicativo:', error);
    Swal.fire({
      title: 'Erro',
      text: 'Ocorreu um erro ao inicializar o aplicativo. Por favor, recarregue a página.',
      icon: 'error',
      confirmButtonColor: '#4CAF50'
    });
  }
};

// Inicializa animações e efeitos visuais
function initAnimations() {
  // Implementação futura para animações com Three.js
  console.log('Animações inicializadas');
}

// Verifica se é a primeira execução do aplicativo
function checkFirstRun() {
  const firstRun = localStorage.getItem('firstRun') === null;
  
  if (firstRun) {
    // Marca que não é mais a primeira execução
    localStorage.setItem('firstRun', 'false');
    
    // Mostra tutorial de boas-vindas
    showWelcomeTutorial();
  }
}

// Mostra tutorial de boas-vindas para novos usuários
function showWelcomeTutorial() {
  Swal.fire({
    title: 'Bem-vindo ao AgroDecision!',
    text: 'Vamos mostrar como usar o aplicativo para tomar melhores decisões agrícolas.',
    icon: 'info',
    confirmButtonColor: '#4CAF50',
    confirmButtonText: 'Começar Tutorial'
  }).then((result) => {
    if (result.isConfirmed) {
      showTutorialStep(1);
    }
  });
}

// Mostra os passos do tutorial
function showTutorialStep(step) {
  switch(step) {
    case 1:
      Swal.fire({
        title: 'Passo 1: Selecione um local',
        text: 'Clique no mapa para selecionar a localização da sua propriedade.',
        icon: 'info',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Próximo'
      }).then((result) => {
        if (result.isConfirmed) {
          showTutorialStep(2);
        }
      });
      break;
    case 2:
      Swal.fire({
        title: 'Passo 2: Explore o menu',
        text: 'Use o menu para acessar consultas climáticas, simulações de colheita e mais.',
        icon: 'info',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Próximo'
      }).then((result) => {
        if (result.isConfirmed) {
          showTutorialStep(3);
        }
      });
      break;
    case 3:
      Swal.fire({
        title: 'Passo 3: Simule sua colheita',
        text: 'Use a ferramenta de simulação para prever resultados com base em dados climáticos.',
        icon: 'info',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Próximo'
      }).then((result) => {
        if (result.isConfirmed) {
          showTutorialStep(4);
        }
      });
      break;
    case 4:
      Swal.fire({
        title: 'Pronto para começar!',
        text: 'Agora você pode usar o AgroDecision para tomar melhores decisões agrícolas.',
        icon: 'success',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Começar'
      });
      break;
  }
}

// Alterna o menu de usuário
function toggleUserDropdown() {
  const userInfo = document.getElementById('userInfo');
  
  // Verifica se já existe o conteúdo do dropdown
  let dropdownContent = document.querySelector('.user-dropdown-content');
  
  if (!dropdownContent) {
    // Cria o conteúdo do dropdown
    dropdownContent = document.createElement('div');
    dropdownContent.className = 'user-dropdown-content';
    userInfo.appendChild(dropdownContent);
  }
  
  // Alterna a classe active
  userInfo.classList.toggle('active');
  
  // Se estiver ativo, preenche com opções
  if (userInfo.classList.contains('active')) {
    // Verifica se o usuário está logado
    const isLoggedIn = window.auth && window.auth.currentUser;
    
    if (isLoggedIn) {
      // Opções para usuário logado
      dropdownContent.innerHTML = `
        <div class="dropdown-item" onclick="window.authManager.handleLogout()">
          <span class="dropdown-icon">🚪</span>
          <span>Sair</span>
        </div>
        <div class="dropdown-item" onclick="showUserProfile()">
          <span class="dropdown-icon">👤</span>
          <span>Meu Perfil</span>
        </div>
        <div class="dropdown-item" onclick="showSettings()">
          <span class="dropdown-icon">⚙️</span>
          <span>Configurações</span>
        </div>
      `;
    } else {
      // Opções para usuário não logado
      dropdownContent.innerHTML = `
        <div class="dropdown-item" onclick="window.authManager.handleAuth()">
          <span class="dropdown-icon">🔑</span>
          <span>Entrar</span>
        </div>
        <div class="dropdown-item" onclick="showSettings()">
          <span class="dropdown-icon">⚙️</span>
          <span>Configurações</span>
        </div>
      `;
    }
  }
  
  // Adiciona evento para fechar o dropdown ao clicar fora
  if (userInfo.classList.contains('active')) {
    setTimeout(() => {
      document.addEventListener('click', closeDropdownOnClickOutside);
    }, 10);
  } else {
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

// Fecha o dropdown ao clicar fora
function closeDropdownOnClickOutside(event) {
  const userInfo = document.getElementById('userInfo');
  
  if (!userInfo.contains(event.target)) {
    userInfo.classList.remove('active');
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

// Mostra perfil do usuário
function showUserProfile() {
  if (window.auth && window.auth.currentUser) {
    const user = window.auth.currentUser;
    
    Swal.fire({
      title: 'Meu Perfil',
      html: `
        <div class="user-profile">
          <img src="${user.photoURL || 'images/default_avatar.png'}" alt="Avatar" class="user-avatar-large">
          <h3>${user.displayName || 'Usuário'}</h3>
          <p>${user.email}</p>
        </div>
      `,
      confirmButtonColor: '#4CAF50'
    });
  }
}

// Mostra configurações
function showSettings() {
  Swal.fire({
    title: 'Configurações',
    html: `
      <div class="settings-container">
        <div class="setting-item">
          <label for="darkMode">Modo Escuro</label>
          <input type="checkbox" id="darkMode" ${isDarkModeEnabled() ? 'checked' : ''}>
        </div>
        <div class="setting-item">
          <label for="notifications">Notificações</label>
          <input type="checkbox" id="notifications" ${areNotificationsEnabled() ? 'checked' : ''}>
        </div>
        <div class="setting-item">
          <label for="dataSync">Sincronização de Dados</label>
          <input type="checkbox" id="dataSync" ${isDataSyncEnabled() ? 'checked' : ''}>
        </div>
      </div>
    `,
    confirmButtonText: 'Salvar',
    confirmButtonColor: '#4CAF50',
    preConfirm: () => {
      // Salva as configurações
      const darkMode = document.getElementById('darkMode').checked;
      const notifications = document.getElementById('notifications').checked;
      const dataSync = document.getElementById('dataSync').checked;
      
      saveSettings({
        darkMode,
        notifications,
        dataSync
      });
      
      // Aplica as configurações
      applySettings();
    }
  });
}

// Verifica se o modo escuro está ativado
function isDarkModeEnabled() {
  const settings = getSettings();
  return settings.darkMode || false;
}

// Verifica se as notificações estão ativadas
function areNotificationsEnabled() {
  const settings = getSettings();
  return settings.notifications || false;
}

// Verifica se a sincronização de dados está ativada
function isDataSyncEnabled() {
  const settings = getSettings();
  return settings.dataSync || true; // Ativado por padrão
}

// Obtém as configurações salvas
function getSettings() {
  const settingsStr = localStorage.getItem('settings');
  return settingsStr ? JSON.parse(settingsStr) : {};
}

// Salva as configurações
function saveSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

// Aplica as configurações
function applySettings() {
  const settings = getSettings();
  
  // Aplica modo escuro
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Aplica outras configurações conforme necessário
}
  console.log('Animações inicializadas');
}

// Alterna o menu lateral
function toggleMenu() {
  const navDrawer = document.getElementById('navDrawer');
  navDrawer.classList.toggle('open');
}

// Mostra tela específica
function showScreen(screenName) {
  const content = document.getElementById('content');
  const mapElement = document.getElementById('map');

  if (screenName === 'home') {
    // Mostra animação de boas-vindas e depois o mapa
    showHomeAnimation().then(() => {
      mapElement.style.display = 'block';
      content.style.display = 'none';
      
      // Atualiza o tamanho do mapa (necessário após alternar visibilidade)
      if (window.map) {
        window.map.invalidateSize();
      }
    });
  } else {
    // Mostra conteúdo específico e esconde o mapa
    content.style.display = 'block';
    mapElement.style.display = 'none';

    switch(screenName) {
      case 'monthly':
        window.chartManager.loadMonthlyReport();
        break;
      case 'regional':
        loadRegionalReport();
        break;
      case 'indicators':
        window.chartManager.loadIndicators();
        break;
      case 'simulation':
        window.simulationManager.loadSimulation();
        break;
      case 'history':
        window.historyManager.loadHistory();
        break;
    }
  }

  // Fecha o menu após selecionar uma opção
  document.getElementById('navDrawer').classList.remove('open');
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
      // Após a animação de zoom out, resolve a promessa
      setTimeout(() => {
        resolve();
      }, 500);
    }, 2000);
  });
}

// Carrega relatório regional
function loadRegionalReport() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="report-container regional-report animate__animated animate__fadeIn">
      <div class="report-header">
        <h2 class="animate__animated animate__slideInDown">Consulta Regional</h2>
      </div>

      <div class="regional-news">
        <h3>Notícias Agrícolas da Região</h3>
        <div id="regionalNews" class="news-grid">
          <div class="loading-spinner">
            <div class="loader"></div>
            <p>Carregando notícias...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Busca notícias regionais
  fetchRegionalNews();
}

// Busca notícias agrícolas regionais
async function fetchRegionalNews() {
  // Chave de API deve ser armazenada em ambiente seguro em produção
  const apiKey = 'pub_64289afecd42e6eadf3f50a6c75695c09da03'; 
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=agricultura&country=br`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar notícias');
    }
    const data = await response.json();
    const newsGrid = document.getElementById('regionalNews');
    
    if (!data.results || data.results.length === 0) {
      newsGrid.innerHTML = `
        <div class="empty-news">
          <div class="empty-icon">📰</div>
          <p>Nenhuma notícia encontrada</p>
        </div>
      `;
      return;
    }

    newsGrid.innerHTML = data.results.map(article => `
      <div class="news-item animate__animated animate__fadeIn">
        <div class="news-content">
          <h4>${article.title}</h4>
          <p>${article.description || 'Sem descrição disponível'}</p>
          <a href="${article.link}" target="_blank">Leia mais</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    const newsGrid = document.getElementById('regionalNews');
    newsGrid.innerHTML = `
      <div class="error-message">
        <div class="error-icon">❌</div>
        <p>Erro ao carregar notícias</p>
      </div>
    `;
  }
}

// Exporta funções para o escopo global
window.toggleMenu = toggleMenu;
window.showScreen = showScreen;
window.showHomeAnimation = showHomeAnimation;
