// Simulação para AgroDecision PWA
let simulationData = {};

// Inicializa a simulação
function loadSimulation() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="simulation-container animate__animated animate__fadeIn">
      <div class="simulation-card">
        <h2>Simulação de Colheita</h2>
        
        <!-- Barra de progresso -->
        <div class="progress-container">
          <div class="progress-bar" id="simulationProgress">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">0%</span>
        </div>

        <!-- Formulário -->
        <form id="simulationForm">
          <div class="form-grid">
            <div class="input-group">
              <label for="crop">Cultura</label>
              <select class="modern-input" id="crop" required>
                <option value="">Selecione a cultura</option>
                <option value="soybean">Soja</option>
                <option value="corn">Milho</option>
                <option value="wheat">Trigo</option>
                <option value="cotton">Algodão</option>
                <option value="coffee">Café</option>
                <option value="rice">Arroz</option>
                <option value="sugarcane">Cana de Açúcar</option>
                <option value="beans">Feijão</option>
                <option value="cassava">Mandioca</option>
                <option value="potato">Batata</option>
                <option value="tomato">Tomate</option>
                <option value="onion">Cebola</option>
                <option value="carrot">Cenoura</option>
                <option value="lettuce">Alface</option>
                <option value="cabbage">Repolho</option>
                <option value="peanut">Amendoim</option>
                <option value="sunflower">Girassol</option>
                <option value="grape">Uva</option>
                <option value="orange">Laranja</option>
                <option value="lemon">Limão</option>
                <option value="apple">Maçã</option>
                <option value="mango">Manga</option>
                <option value="banana">Banana</option>
                <option value="papaya">Mamão</option>
                <option value="pineapple">Abacaxi</option>
                <option value="strawberry">Morango</option>
                <option value="blackberry">Amora</option>
                <option value="avocado">Abacate</option>
                <option value="coconut">Coco</option>
                <option value="watermelon">Melancia</option>
                <option value="melon">Melão</option>
                <option value="pumpkin">Abóbora</option>
                <option value="cucumber">Pepino</option>
                <option value="pepper">Pimentão</option>
                <option value="eggplant">Berinjela</option>
                <option value="garlic">Alho</option>
                <option value="sweetPotato">Batata Doce</option>
                <option value="barley">Cevada</option>
                <option value="oats">Aveia</option>
                <option value="rye">Centeio</option>
                <option value="sorghum">Sorgo</option>
                <option value="quinoa">Quinoa</option>
                <option value="chia">Chia</option>
                <option value="flax">Linhaça</option>
                <option value="hemp">Cânhamo</option>
                <option value="sesame">Gergelim</option>
                <option value="safflower">Cártamo</option>
                <option value="chickpea">Grão de Bico</option>
                <option value="lentil">Lentilha</option>
                <option value="alfalfa">Alfafa</option>
                <option value="clover">Trevo</option>
              </select>
            </div>

            <div class="input-group">
              <label for="area">Área (hectares)</label>
              <input type="number" class="modern-input" id="area" required min="0">
            </div>

            <div class="input-group">
              <label for="irrigation">Sistema de Irrigação</label>
              <select class="modern-input" id="irrigation" required>
                <option value="">Selecione o sistema</option>
                <option value="pivot">Pivô Central</option>
                <option value="drip">Gotejamento</option>
                <option value="sprinkler">Aspersão</option>
                <option value="none">Sem Irrigação</option>
              </select>
            </div>

            <div class="input-group">
              <label for="soil">Tipo de Solo</label>
              <select class="modern-input" id="soil" required>
                <option value="">Selecione o tipo de solo</option>
                <option value="clay">Argiloso</option>
                <option value="sandy">Arenoso</option>
                <option value="loam">Franco</option>
              </select>
            </div>

            <div class="input-group">
              <label for="plantingDate">Data do Plantio</label>
              <input type="date" class="modern-input" id="plantingDate" required>
            </div>
          </div>

          <button type="submit" class="modern-button">
            <span class="button-text">Simular</span>
            <div class="button-icon">🌱</div>
          </button>
        </form>
      </div>

      <!-- Resultados (inicialmente ocultos) -->
      <div id="simulationResult" class="simulation-card" style="display: none;">
        <h2>Resultados da Simulação</h2>
        
        <div class="results-grid">
          <div class="result-card">
            <div class="result-icon">📊</div>
            <h3>Produtividade Estimada</h3>
            <div id="yieldValue" class="result-value"></div>
          </div>

          <div class="result-card">
            <div class="result-icon">💧</div>
            <h3>Necessidade Hídrica</h3>
            <div id="waterValue" class="result-value"></div>
          </div>

          <div class="result-card">
            <div class="result-icon">🌱</div>
            <h3>Ciclo da Cultura</h3>
            <div id="cycleValue" class="result-value"></div>
          </div>

          <div class="result-card">
            <div class="result-icon">📅</div>
            <h3>Data Estimada de Colheita</h3>
            <div id="harvestDateValue" class="result-value"></div>
          </div>
        </div>

        <h3>Probabilidade de Sucesso na Colheita</h3>
        <div id="probabilityButtons" class="probability-buttons-vertical"></div>
      </div>
    </div>
  `;

  // Adiciona eventos aos elementos
  document.getElementById('simulationForm').addEventListener('submit', handleSimulation);
  
  // Adiciona eventos para atualizar a barra de progresso
  document.querySelectorAll('#simulationForm select, #simulationForm input').forEach(element => {
    element.addEventListener('change', updateProgress);
  });
  
  // Inicializa a data de plantio com a data atual
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  document.getElementById('plantingDate').value = formattedDate;
  
  // Atualiza a barra de progresso
  updateProgress();
}

// Atualiza a barra de progresso com base nos campos preenchidos
function updateProgress() {
  const form = document.getElementById('simulationForm');
  const inputs = form.querySelectorAll('select, input');
  let filledCount = 0;
  
  inputs.forEach(input => {
    if (input.value) {
      filledCount++;
    }
  });
  
  const progressPercent = Math.round((filledCount / inputs.length) * 100);
  const progressFill = document.querySelector('#simulationProgress .progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `${progressPercent}%`;
}

// Manipula o envio do formulário de simulação
function handleSimulation(event) {
  if (event) {
    event.preventDefault();
  }
  
  // Coleta dados do formulário
  const crop = document.getElementById('crop').value;
  const area = parseFloat(document.getElementById('area').value);
  const irrigation = document.getElementById('irrigation').value;
  const soil = document.getElementById('soil').value;
  const plantingDate = document.getElementById('plantingDate').value;
  
  // Valida os dados
  if (!crop || isNaN(area) || !irrigation || !soil || !plantingDate) {
    Swal.fire({
      title: 'Erro',
      text: 'Por favor, preencha todos os campos corretamente.',
      icon: 'error'
    });
    return;
  }
  
  // Mostra indicador de carregamento
  Swal.fire({
    title: 'Processando',
    text: 'Calculando simulação...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  
  // Simula um atraso para processamento
  setTimeout(() => {
    // Realiza a simulação
    const results = simulateCrop(crop, area, irrigation, soil, plantingDate);
    
    // Salva os dados da simulação
    simulationData = {
      crop,
      area,
      irrigation,
      soil,
      plantingDate,
      results
    };
    
    // Salva a simulação no banco de dados
    window.dbManager.saveSimulation(simulationData)
      .then(() => {
        console.log('Simulação salva com sucesso');
      })
      .catch(error => {
        console.error('Erro ao salvar simulação:', error);
      });
    
    // Mostra os resultados
    showSimulationResults(results);
    
    // Fecha o indicador de carregamento
    Swal.close();
  }, 1500);
}

// Simula o cultivo com base nos parâmetros
function simulateCrop(crop, area, irrigation, soil, plantingDate) {
  // Valores ideais para cada cultura
  const cropData = {
    soybean: { 
      baseYield: 3.2, 
      waterNeed: 450, 
      cycleDays: 120,
      temp: 25,
      rain: 500,
      humidity: 60
    },
    corn: { 
      baseYield: 8.0, 
      waterNeed: 550, 
      cycleDays: 150,
      temp: 27,
      rain: 650,
      humidity: 55
    },
    wheat: { 
      baseYield: 2.8, 
      waterNeed: 400, 
      cycleDays: 110,
      temp: 18,
      rain: 450,
      humidity: 50
    },
    cotton: { 
      baseYield: 1.5, 
      waterNeed: 700, 
      cycleDays: 180,
      temp: 28,
      rain: 500,
      humidity: 45
    },
    coffee: { 
      baseYield: 1.8, 
      waterNeed: 1200, 
      cycleDays: 300,
      temp: 23,
      rain: 1500,
      humidity: 70
    },
    rice: { 
      baseYield: 6.0, 
      waterNeed: 900, 
      cycleDays: 120,
      temp: 26,
      rain: 1200,
      humidity: 80
    }
  };
  
  // Usa dados da cultura selecionada ou valores padrão
  const cropInfo = cropData[crop] || { 
    baseYield: 2.5, 
    waterNeed: 500, 
    cycleDays: 120,
    temp: 25,
    rain: 600,
    humidity: 60
  };
  
  // Fatores de ajuste com base no solo
  const soilFactors = {
    clay: { yieldFactor: 1.1, waterFactor: 0.9 },
    sandy: { yieldFactor: 0.8, waterFactor: 1.3 },
    loam: { yieldFactor: 1.2, waterFactor: 1.0 }
  };
  
  // Fatores de ajuste com base na irrigação
  const irrigationFactors = {
    pivot: { yieldFactor: 1.2, waterFactor: 1.1 },
    drip: { yieldFactor: 1.3, waterFactor: 0.8 },
    sprinkler: { yieldFactor: 1.1, waterFactor: 1.0 },
    none: { yieldFactor: 0.7, waterFactor: 1.5 }
  };
  
  // Aplica fatores de ajuste
  const soilFactor = soilFactors[soil] || { yieldFactor: 1.0, waterFactor: 1.0 };
  const irrigationFactor = irrigationFactors[irrigation] || { yieldFactor: 1.0, waterFactor: 1.0 };
  
  // Calcula produtividade
  const yieldPerHectare = cropInfo.baseYield * soilFactor.yieldFactor * irrigationFactor.yieldFactor;
  const totalYield = yieldPerHectare * area;
  
  // Calcula necessidade hídrica
  const waterNeed = cropInfo.waterNeed * soilFactor.waterFactor * irrigationFactor.waterFactor;
  
  // Calcula data estimada de colheita
  const plantDate = new Date(plantingDate);
  const harvestDate = new Date(plantDate);
  harvestDate.setDate(plantDate.getDate() + cropInfo.cycleDays);
  
  // Formata data de colheita
  const formattedHarvestDate = harvestDate.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  // Gera probabilidades de sucesso para diferentes datas
  const probabilities = [];
  for (let i = -10; i <= 10; i += 5) {
    const date = new Date(harvestDate);
    date.setDate(harvestDate.getDate() + i);
    
    const formattedDate = date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    // Calcula probabilidade com base na distância da data ideal
    let probability = 0.7;
    if (i === 0) {
      probability = 0.85;
    } else if (Math.abs(i) <= 5) {
      probability = 0.75;
    } else {
      probability = 0.6;
    }
    
    // Ajusta com base no clima se disponível
    if (window.climateData) {
      const month = date.getMonth();
      probability = calculateProbabilityWithClimate(crop, month, cropInfo, probability);
    }
    
    // Adiciona variação aleatória
    const randomFactor = 0.95 + (Math.random() * 0.1);
    probability *= randomFactor;
    
    // Limita entre 0 e 1
    probability = Math.max(0, Math.min(1, probability));
    
    probabilities.push({
      date: formattedDate,
      probability
    });
  }
  
  // Retorna resultados
  return {
    yield: totalYield.toFixed(2),
    water: waterNeed.toFixed(0),
    cycle: cropInfo.cycleDays,
    harvestDate: formattedHarvestDate,
    probabilities
  };
}

// Calcula probabilidade com base em dados climáticos
function calculateProbabilityWithClimate(crop, month, ideal, baseProbability) {
  // Se não houver dados climáticos, retorna probabilidade base
  if (!window.climateData) {
    return baseProbability;
  }
  
  try {
    // Extrai dados climáticos
    const data = window.climateData;
    const parameters = data.properties.parameter;
    
    // Calcula médias mensais
    const dates = Object.keys(parameters.T2M);
    let avgTemp = null;
    let avgRain = null;
    let avgHumidity = null;
    
    let tempSum = 0;
    let rainSum = 0;
    let humiditySum = 0;
    let count = 0;
    
    dates.forEach(date => {
      const dateMonth = parseInt(date.substring(4, 6)) - 1;
      if (dateMonth === month) {
        tempSum += parameters.T2M[date];
        rainSum += parameters.PRECTOT[date];
        humiditySum += parameters.RH2M[date];
        count++;
      }
    });
    
    if (count > 0) {
      avgTemp = tempSum / count;
      avgRain = rainSum / count;
      avgHumidity = humiditySum / count;
    }
    
    // Calcula probabilidade com base nas condições climáticas
    let probability = 1.0;

    if (avgTemp !== null) {
      const tempDiff = Math.abs(avgTemp - ideal.temp) / ideal.temp;
      probability *= (1 - tempDiff);
    }

    if (avgRain !== null) {
      const rainDiff = Math.abs(avgRain - ideal.rain) / ideal.rain;
      probability *= (1 - rainDiff);
    }

    if (avgHumidity !== null) {
      const humidityDiff = Math.abs(avgHumidity - ideal.humidity) / ideal.humidity;
      probability *= (1 - humidityDiff);
    }

    const monthRisk = getMonthRisk(crop, month);
    probability *= monthRisk;

    probability = Math.max(0, Math.min(1, probability));

    const randomFactor = 0.95 + (Math.random() * 0.1);
    probability *= randomFactor;

    return probability;
  } catch (error) {
    console.error('Erro ao calcular probabilidade com clima:', error);
    return baseProbability;
  }
}

// Obtém fator de risco mensal para cada cultura
function getMonthRisk(crop, month) {
  const monthRisks = {
    soybean: [0.8, 0.9, 1.0, 0.9, 0.7, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9],
    corn: [0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9],
    wheat: [0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.8, 0.9, 0.9, 0.8],
  };

  return monthRisks[crop]?.[month] || 0.8;
}

// Mostra os resultados da simulação
function showSimulationResults(results) {
  const resultDiv = document.getElementById('simulationResult');
  resultDiv.style.display = 'block';

  document.getElementById('yieldValue').textContent = `${results.yield} ton`;
  document.getElementById('waterValue').textContent = `${results.water} mm`;
  document.getElementById('cycleValue').textContent = `${results.cycle} dias`;
  document.getElementById('harvestDateValue').textContent = results.harvestDate;

  const probabilityContainer = document.getElementById('probabilityButtons');
  probabilityContainer.innerHTML = '';
  probabilityContainer.className = 'probability-buttons-vertical';

  results.probabilities.forEach(prob => {
    const button = document.createElement('button');
    button.className = 'probability-button animate__animated animate__pulse animate__infinite';
    
    const successClass = prob.probability > 0.7 ? 'high-success' :
                        prob.probability > 0.4 ? 'medium-success' : 'low-success';
    
    button.classList.add(successClass);
    button.innerHTML = `
      <span class="date">${prob.date}</span>
      <span class="probability-percent">${(prob.probability * 100).toFixed(1)}%</span>
      <div class="probability-indicator">
        <div class="indicator-fill" style="width: ${prob.probability * 100}%"></div>
      </div>
    `;
    
    button.addEventListener('click', () => {
      Swal.fire({
        title: 'Probabilidade de Sucesso na Colheita',
        html: `
          <div class="probability-details">
            <p>Data: ${prob.date}</p>
            <p>Probabilidade de Sucesso: ${(prob.probability * 100).toFixed(1)}%</p>
            <div class="probability-meter" style="width: 100%; height: 20px; background: #ddd; border-radius: 10px;">
              <div style="width: ${prob.probability * 100}%; height: 100%; background: var(--primary-gradient); border-radius: 10px;"></div>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonColor: '#4CAF50'
      });
    });

    probabilityContainer.appendChild(button);
  });
  
  // Rola para os resultados
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Exporta funções
window.simulationManager = {
  loadSimulation,
  updateProgress,
  handleSimulation,
  showSimulationResults
};
