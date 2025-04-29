// Histórico para AgroDecision PWA
// Gerencia o histórico de simulações

// Carrega o histórico de simulações
async function loadHistory() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="history-container animate__animated animate__fadeIn">
      <div class="history-card">
        <h2>Histórico de Simulações</h2>
        
        <div class="history-grid" id="historyGrid">
          <!-- Itens do histórico serão carregados aqui -->
          <div class="loading-spinner">
            <div class="loader"></div>
            <p>Carregando histórico...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    // Obtém simulações do banco de dados
    const simulations = await window.dbManager.getSimulations();
    const historyGrid = document.getElementById('historyGrid');
    
    if (simulations.length === 0) {
      historyGrid.innerHTML = `
        <div class="empty-history">
          <div class="empty-icon">📝</div>
          <p>Nenhuma simulação encontrada</p>
        </div>
      `;
      return;
    }

    historyGrid.innerHTML = simulations.map(sim => `
      <div class="history-item animate__animated animate__fadeIn">
        <div class="history-content">
          <div class="history-header">
            <div class="crop-icon">${getCropEmoji(sim.crop)}</div>
            <div class="history-date">
              ${new Date(sim.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>
          
          <div class="simulation-details">
            <div class="detail-row">
              <span class="detail-label">Cultura:</span>
              <span class="detail-value">${getCropName(sim.crop)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Área:</span>
              <span class="detail-value">${sim.area} hectares</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Irrigação:</span>
              <span class="detail-value">${getIrrigationName(sim.irrigation)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Solo:</span>
              <span class="detail-value">${getSoilName(sim.soil)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data Plantio:</span>
              <span class="detail-value">${formatDate(sim.plantingDate)}</span>
            </div>
          </div>

          <div class="results-summary">
            <div class="result-item">
              <div class="result-icon">📊</div>
              <div class="result-info">
                <span class="result-label">Produtividade</span>
                <span class="result-value">${sim.results.yield} ton</span>
              </div>
            </div>
            <div class="result-item">
              <div class="result-icon">💧</div>
              <div class="result-info">
                <span class="result-label">Água</span>
                <span class="result-value">${sim.results.water} mm</span>
              </div>
            </div>
            <div class="result-item">
              <div class="result-icon">📅</div>
              <div class="result-info">
                <span class="result-label">Colheita</span>
                <span class="result-value">${sim.results.harvestDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    const historyGrid = document.getElementById('historyGrid');
    historyGrid.innerHTML = `
      <div class="error-message">
        <div class="error-icon">❌</div>
        <p>Erro ao carregar histórico</p>
      </div>
    `;
  }
}

// Função auxiliar para obter emoji da cultura
function getCropEmoji(crop) {
  const cropEmojis = {
    soybean: '🌱',
    corn: '🌽',
    wheat: '🌾',
    cotton: '🌿',
    coffee: '☕',
    rice: '🍚',
    sugarcane: '🎋',
    beans: '🫘',
    cassava: '🥔',
    potato: '🥔',
    tomato: '🍅',
    onion: '🧅',
    carrot: '🥕',
    lettuce: '🥬',
    cabbage: '🥬',
    peanut: '🥜',
    sunflower: '🌻',
    grape: '🍇',
    orange: '🍊',
    lemon: '🍋',
    apple: '🍎',
    mango: '🥭',
    banana: '🍌',
    papaya: '🍈',
    pineapple: '🍍',
    strawberry: '🍓',
    blackberry: '🫐',
    avocado: '🥑',
    coconut: '🥥',
    watermelon: '🍉',
    melon: '🍈',
    pumpkin: '🎃',
    cucumber: '🥒',
    pepper: '🫑',
    eggplant: '🍆',
    garlic: '🧄',
    sweetPotato: '🍠',
    default: '🌱'
  };

  return cropEmojis[crop] || cropEmojis.default;
}

// Função auxiliar para obter nome da cultura em português
function getCropName(crop) {
  const cropNames = {
    soybean: 'Soja',
    corn: 'Milho',
    wheat: 'Trigo',
    cotton: 'Algodão',
    coffee: 'Café',
    rice: 'Arroz',
    sugarcane: 'Cana de Açúcar',
    beans: 'Feijão',
    cassava: 'Mandioca',
    potato: 'Batata',
    tomato: 'Tomate',
    onion: 'Cebola',
    carrot: 'Cenoura',
    lettuce: 'Alface',
    cabbage: 'Repolho',
    peanut: 'Amendoim',
    sunflower: 'Girassol',
    grape: 'Uva',
    orange: 'Laranja',
    lemon: 'Limão',
    apple: 'Maçã',
    mango: 'Manga',
    banana: 'Banana',
    papaya: 'Mamão',
    pineapple: 'Abacaxi',
    strawberry: 'Morango',
    blackberry: 'Amora',
    avocado: 'Abacate',
    coconut: 'Coco',
    watermelon: 'Melancia',
    melon: 'Melão',
    pumpkin: 'Abóbora',
    cucumber: 'Pepino',
    pepper: 'Pimentão',
    eggplant: 'Berinjela',
    garlic: 'Alho',
    sweetPotato: 'Batata Doce'
  };

  return cropNames[crop] || crop;
}

// Função auxiliar para obter nome do sistema de irrigação em português
function getIrrigationName(irrigation) {
  const irrigationNames = {
    pivot: 'Pivô Central',
    drip: 'Gotejamento',
    sprinkler: 'Aspersão',
    none: 'Sem Irrigação'
  };

  return irrigationNames[irrigation] || irrigation;
}

// Função auxiliar para obter nome do tipo de solo em português
function getSoilName(soil) {
  const soilNames = {
    clay: 'Argiloso',
    sandy: 'Arenoso',
    loam: 'Franco'
  };

  return soilNames[soil] || soil;
}

// Função auxiliar para formatar data
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Exporta funções
window.historyManager = {
  loadHistory,
  getCropEmoji,
  getCropName,
  getIrrigationName,
  getSoilName,
  formatDate
};
