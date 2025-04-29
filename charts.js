// Gráficos para AgroDecision PWA
// Gerencia a criação e exibição de gráficos

// Configurações padrão para gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      titleColor: '#333',
      bodyColor: '#333',
      borderColor: '#4CAF50',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.2)'
      }
    },
    x: {
      grid: {
        color: 'rgba(200, 200, 200, 0.2)'
      }
    }
  }
};

// Inicializa gráficos para relatório mensal
function initMonthlyCharts() {
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  
  // Verifica se há dados climáticos disponíveis
  if (window.climateData) {
    try {
      const data = window.climateData;
      const parameters = data.properties.parameter;
      
      // Obtém dados de precipitação das últimas 4 semanas
      const dates = Object.keys(parameters.PRECTOT).sort();
      const recentDates = dates.slice(-28); // últimos 28 dias
      
      // Agrupa por semana
      const weeklyData = [0, 0, 0, 0]; // 4 semanas
      recentDates.forEach((date, index) => {
        const weekIndex = Math.floor(index / 7);
        if (weekIndex < 4) {
          weeklyData[weekIndex] += parameters.PRECTOT[date];
        }
      });
      
      // Cria o gráfico
      const monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
          datasets: [{
            label: 'Precipitação (mm)',
            data: weeklyData.map(val => val.toFixed(1)),
            backgroundColor: '#4CAF50'
          }]
        },
        options: chartOptions
      });
      
    } catch (error) {
      console.error('Erro ao processar dados para gráfico mensal:', error);
      createFallbackChart(ctx, 'bar');
    }
  } else {
    // Cria gráfico com dados de exemplo
    createFallbackChart(ctx, 'bar');
  }
}

// Inicializa gráficos para indicadores
function initIndicatorCharts() {
  const ctx = document.getElementById('indicatorsChart').getContext('2d');
  
  // Verifica se há dados climáticos disponíveis
  if (window.climateData) {
    try {
      const data = window.climateData;
      const parameters = data.properties.parameter;
      
      // Calcula médias dos parâmetros
      const dates = Object.keys(parameters.T2M);
      let tempSum = 0, rainSum = 0, humiditySum = 0, windSum = 0, radiationSum = 0;
      
      dates.forEach(date => {
        tempSum += parameters.T2M[date];
        rainSum += parameters.PRECTOT[date];
        humiditySum += parameters.RH2M[date];
        windSum += parameters.WS10M[date];
        radiationSum += parameters.ALLSKY_SFC_SW_DWN[date];
      });
      
      const count = dates.length;
      
      // Normaliza valores para escala 0-1
      const droughtIndex = 1 - (rainSum / count) / 10; // Índice de seca inverso à precipitação
      const vegetationIndex = (radiationSum / count) / 25; // Índice de vegetação proporcional à radiação
      const frostRisk = 1 - (tempSum / count) / 30; // Risco de geada inverso à temperatura
      const rainIndex = (rainSum / count) / 10; // Índice de chuva
      const tempIndex = (tempSum / count) / 30; // Índice de temperatura
      
      // Cria o gráfico
      const indicatorsChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Seca', 'Vegetação', 'Geada', 'Chuva', 'Temperatura'],
          datasets: [{
            label: 'Índices Atuais',
            data: [
              droughtIndex.toFixed(2), 
              vegetationIndex.toFixed(2), 
              frostRisk.toFixed(2), 
              rainIndex.toFixed(2), 
              tempIndex.toFixed(2)
            ],
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4CAF50'
          }]
        },
        options: chartOptions
      });
      
    } catch (error) {
      console.error('Erro ao processar dados para gráfico de indicadores:', error);
      createFallbackChart(ctx, 'radar');
    }
  } else {
    // Cria gráfico com dados de exemplo
    createFallbackChart(ctx, 'radar');
  }
}

// Cria gráfico com dados de exemplo quando não há dados reais
function createFallbackChart(ctx, type) {
  if (type === 'bar') {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: 'Precipitação (mm)',
          data: [30, 45, 25, 20],
          backgroundColor: '#4CAF50'
        }]
      },
      options: chartOptions
    });
  } else if (type === 'radar') {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Seca', 'Vegetação', 'Geada', 'Chuva', 'Temperatura'],
        datasets: [{
          label: 'Índices Atuais',
          data: [0.75, 0.82, 0.2, 0.6, 0.9],
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50'
        }]
      },
      options: chartOptions
    });
  }
}

// Carrega relatório mensal
function loadMonthlyReport() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="report-container monthly-report animate__animated animate__fadeIn">
      <div class="report-header">
        <h2 class="animate__animated animate__slideInDown">Consulta Mensal</h2>
      </div>

      <div class="monthly-stats">
        <div class="stat-card animate__animated animate__fadeInLeft">
          <div class="card-3d-wrapper">
            <div class="stat-icon">📊</div>
            <h3>Média de Temperatura</h3>
            <div class="stat-value" id="avgTemp">--°C</div>
          </div>
        </div>

        <div class="stat-card animate__animated animate__fadeInRight">
          <div class="card-3d-wrapper">
            <div class="stat-icon">🌧️</div>
            <h3>Total Precipitação</h3>
            <div class="stat-value" id="totalRain">--mm</div>
          </div>
        </div>
      </div>

      <div class="chart-container animate__animated animate__fadeInUp">
        <canvas id="monthlyChart"></canvas>
      </div>
    </div>
  `;

  // Atualiza estatísticas com dados reais se disponíveis
  updateMonthlyStats();
  
  // Inicializa gráficos
  initMonthlyCharts();
  
  // Inicializa efeitos 3D
  init3DCards();
}

// Atualiza estatísticas mensais com dados reais
function updateMonthlyStats() {
  if (window.climateData) {
    try {
      const data = window.climateData;
      const parameters = data.properties.parameter;
      
      // Calcula médias dos últimos 30 dias
      const dates = Object.keys(parameters.T2M).sort();
      const recentDates = dates.slice(-30); // últimos 30 dias
      
      let tempSum = 0;
      let rainSum = 0;
      
      recentDates.forEach(date => {
        tempSum += parameters.T2M[date];
        rainSum += parameters.PRECTOT[date];
      });
      
      const avgTemp = tempSum / recentDates.length;
      
      // Atualiza elementos na página
      document.getElementById('avgTemp').textContent = `${avgTemp.toFixed(1)}°C`;
      document.getElementById('totalRain').textContent = `${rainSum.toFixed(1)}mm`;
      
    } catch (error) {
      console.error('Erro ao atualizar estatísticas mensais:', error);
    }
  }
}

// Carrega indicadores
function loadIndicators() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="report-container indicators-report animate__animated animate__fadeIn">
      <div class="report-header">
        <h2 class="animate__animated animate__slideInDown">Indicadores</h2>
      </div>

      <div class="indicators-grid">
        <div class="indicator-card drought animate__animated animate__fadeInLeft">
          <div class="card-3d-wrapper">
            <div class="indicator-icon">🏜️</div>
            <h3>Índice de Seca</h3>
            <div class="indicator-gauge">
              <div class="gauge-fill" id="droughtGauge" style="width: 75%"></div>
            </div>
            <div class="indicator-value" id="droughtValue">0.75</div>
          </div>
        </div>

        <div class="indicator-card vegetation animate__animated animate__fadeInUp">
          <div class="card-3d-wrapper">
            <div class="indicator-icon">🌱</div>
            <h3>Índice de Vegetação</h3>
            <div class="indicator-gauge">
              <div class="gauge-fill" id="vegetationGauge" style="width: 82%"></div>
            </div>
            <div class="indicator-value" id="vegetationValue">0.82</div>
          </div>
        </div>

        <div class="indicator-card frost animate__animated animate__fadeInRight">
          <div class="card-3d-wrapper">
            <div class="indicator-icon">❄️</div>
            <h3>Risco de Geada</h3>
            <div class="indicator-gauge">
              <div class="gauge-fill" id="frostGauge" style="width: 20%"></div>
            </div>
            <div class="indicator-value" id="frostValue">Baixo</div>
          </div>
        </div>
      </div>

      <div class="chart-container animate__animated animate__fadeInUp">
        <canvas id="indicatorsChart"></canvas>
      </div>
    </div>
  `;

  // Atualiza indicadores com dados reais se disponíveis
  updateIndicators();
  
  // Inicializa gráficos
  initIndicatorCharts();
  
  // Inicializa efeitos 3D
  init3DCards();
}

// Atualiza indicadores com dados reais
function updateIndicators() {
  if (window.climateData) {
    try {
      const data = window.climateData;
      const parameters = data.properties.parameter;
      
      // Calcula médias
      const dates = Object.keys(parameters.T2M);
      let tempSum = 0, rainSum = 0, radiationSum = 0;
      
      dates.forEach(date => {
        tempSum += parameters.T2M[date];
        rainSum += parameters.PRECTOT[date];
        radiationSum += parameters.ALLSKY_SFC_SW_DWN[date];
      });
      
      const count = dates.length;
      const avgTemp = tempSum / count;
      const avgRain = rainSum / count;
      
      // Calcula índices
      const droughtIndex = Math.max(0, Math.min(1, 1 - (avgRain / 10)));
      const vegetationIndex = Math.max(0, Math.min(1, (radiationSum / count) / 25));
      const frostRisk = Math.max(0, Math.min(1, 1 - (avgTemp / 30)));
      
      // Atualiza elementos na página
      document.getElementById('droughtGauge').style.width = `${droughtIndex * 100}%`;
      document.getElementById('droughtValue').textContent = droughtIndex.toFixed(2);
      
      document.getElementById('vegetationGauge').style.width = `${vegetationIndex * 100}%`;
      document.getElementById('vegetationValue').textContent = vegetationIndex.toFixed(2);
      
      document.getElementById('frostGauge').style.width = `${frostRisk * 100}%`;
      
      // Define texto do risco de geada
      let frostText = 'Baixo';
      if (frostRisk > 0.7) {
        frostText = 'Alto';
      } else if (frostRisk > 0.4) {
        frostText = 'Médio';
      }
      document.getElementById('frostValue').textContent = frostText;
      
    } catch (error) {
      console.error('Erro ao atualizar indicadores:', error);
    }
  }
}

// Inicializa efeitos 3D para cartões
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d-wrapper');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// Exporta funções
window.chartManager = {
  loadMonthlyReport,
  loadIndicators,
  initMonthlyCharts,
  initIndicatorCharts,
  init3DCards
};
