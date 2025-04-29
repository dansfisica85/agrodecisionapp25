// Recursos offline para AgroDecision PWA
// Gerencia funcionalidades offline e sincronização de dados

// Verifica se o aplicativo está online
function isOnline() {
  return navigator.onLine;
}

// Inicializa o gerenciador de recursos offline
function initOfflineManager() {
  // Adiciona listeners para eventos de conectividade
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
  
  // Verifica status inicial
  handleOnlineStatus();
  
  // Configura sincronização periódica
  setInterval(syncDataIfOnline, 60000); // Tenta sincronizar a cada minuto
}

// Manipula mudanças no status de conectividade
function handleOnlineStatus() {
  const status = isOnline();
  
  // Atualiza indicador de status na interface
  updateStatusIndicator(status);
  
  if (status) {
    // Se voltou a ficar online, tenta sincronizar dados
    syncData();
  }
}

// Atualiza indicador de status na interface
function updateStatusIndicator(isOnline) {
  // Remove indicador existente, se houver
  const existingIndicator = document.getElementById('connectionStatus');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Cria novo indicador
  const indicator = document.createElement('div');
  indicator.id = 'connectionStatus';
  
  if (isOnline) {
    indicator.className = 'status-indicator online';
    indicator.innerHTML = `
      <div class="status-icon">🟢</div>
      <div class="status-text">Online</div>
    `;
    
    // Esconde após 3 segundos
    setTimeout(() => {
      if (indicator.parentElement) {
        indicator.classList.add('animate__fadeOut');
        setTimeout(() => {
          if (indicator.parentElement) {
            indicator.remove();
          }
        }, 500);
      }
    }, 3000);
  } else {
    indicator.className = 'status-indicator offline';
    indicator.innerHTML = `
      <div class="status-icon">🔴</div>
      <div class="status-text">Offline</div>
    `;
  }
  
  // Adiciona ao corpo do documento
  document.body.appendChild(indicator);
}

// Sincroniza dados se estiver online
function syncDataIfOnline() {
  if (isOnline()) {
    syncData();
  }
}

// Sincroniza dados com o servidor
async function syncData() {
  try {
    // Verifica se há dados pendentes para sincronização
    const pendingData = await getPendingData();
    
    if (pendingData.length === 0) {
      // Não há dados para sincronizar
      return;
    }
    
    // Tenta enviar dados pendentes para o servidor
    for (const item of pendingData) {
      await syncItem(item);
    }
    
    // Atualiza status dos itens sincronizados
    await updateSyncStatus(pendingData);
    
    console.log('Sincronização concluída com sucesso');
  } catch (error) {
    console.error('Erro durante sincronização:', error);
  }
}

// Obtém dados pendentes para sincronização
async function getPendingData() {
  // Implementação depende da estrutura do banco de dados
  // Aqui usamos um exemplo simples
  return [];
}

// Sincroniza um item com o servidor
async function syncItem(item) {
  // Implementação depende da API do servidor
  // Aqui usamos um exemplo simples
  return true;
}

// Atualiza status de sincronização dos itens
async function updateSyncStatus(items) {
  // Implementação depende da estrutura do banco de dados
  // Aqui usamos um exemplo simples
  return true;
}

// Salva dados localmente para uso offline
async function saveOfflineData(type, data) {
  try {
    // Implementação depende da estrutura do banco de dados
    // Aqui usamos um exemplo simples com localStorage
    const key = `offline_${type}_${Date.now()}`;
    const item = {
      id: key,
      type,
      data,
      timestamp: Date.now(),
      synced: false
    };
    
    // Salva no localStorage
    localStorage.setItem(key, JSON.stringify(item));
    
    return key;
  } catch (error) {
    console.error('Erro ao salvar dados offline:', error);
    return null;
  }
}

// Carrega dados salvos localmente
function getOfflineData(type) {
  try {
    const items = [];
    
    // Busca todos os itens do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Verifica se é um item offline do tipo especificado
      if (key.startsWith(`offline_${type}_`)) {
        const item = JSON.parse(localStorage.getItem(key));
        items.push(item);
      }
    }
    
    // Ordena por timestamp (mais recente primeiro)
    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Erro ao carregar dados offline:', error);
    return [];
  }
}

// Verifica se há dados disponíveis offline
function hasOfflineData(type) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`offline_${type}_`)) {
      return true;
    }
  }
  return false;
}

// Limpa dados offline antigos
function cleanupOfflineData(olderThanDays = 30) {
  try {
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Verifica se é um item offline
      if (key.startsWith('offline_')) {
        const item = JSON.parse(localStorage.getItem(key));
        
        // Remove se for mais antigo que o limite
        if (item.timestamp < cutoffTime) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao limpar dados offline:', error);
  }
}

// Exporta funções
window.offlineManager = {
  initOfflineManager,
  isOnline,
  syncData,
  saveOfflineData,
  getOfflineData,
  hasOfflineData,
  cleanupOfflineData
};
