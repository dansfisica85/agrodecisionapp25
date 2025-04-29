// Regional para AgroDecision PWA
// Gerencia consultas e relatórios regionais

// Carrega relatório regional
function loadRegionalReport() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="report-container regional-report animate__animated animate__fadeIn">
      <div class="report-header">
        <h2 class="animate__animated animate__slideInDown">Consulta Regional</h2>
      </div>

      <div class="regional-filters">
        <div class="filter-group">
          <label for="regionFilter">Região:</label>
          <select id="regionFilter" class="modern-input" onchange="window.regionalManager.filterNews()">
            <option value="all">Todas as regiões</option>
            <option value="norte">Norte</option>
            <option value="nordeste">Nordeste</option>
            <option value="centro-oeste">Centro-Oeste</option>
            <option value="sudeste">Sudeste</option>
            <option value="sul">Sul</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="cropFilter">Cultura:</label>
          <select id="cropFilter" class="modern-input" onchange="window.regionalManager.filterNews()">
            <option value="all">Todas as culturas</option>
            <option value="soja">Soja</option>
            <option value="milho">Milho</option>
            <option value="cafe">Café</option>
            <option value="cana">Cana de Açúcar</option>
            <option value="algodao">Algodão</option>
          </select>
        </div>
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
      
      <div class="regional-weather">
        <h3>Previsão Climática Regional</h3>
        <div id="regionalWeather" class="weather-grid">
          <!-- Previsão climática será carregada aqui -->
        </div>
      </div>
    </div>
  `;

  // Busca notícias regionais
  fetchRegionalNews();
  
  // Busca previsão climática regional
  fetchRegionalWeather();
}

// Busca notícias agrícolas regionais
async function fetchRegionalNews() {
  // Em produção, esta chave deve ser protegida em um backend
  const apiKey = 'pub_64289afecd42e6eadf3f50a6c75695c09da03'; 
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=agricultura&country=br&language=pt`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar notícias');
    }
    const data = await response.json();
    
    // Armazena os dados para filtragem posterior
    window.newsData = data.results || [];
    
    // Exibe as notícias
    displayNews(window.newsData);
    
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    const newsGrid = document.getElementById('regionalNews');
    newsGrid.innerHTML = `
      <div class="error-message">
        <div class="error-icon">❌</div>
        <p>Erro ao carregar notícias. Tente novamente mais tarde.</p>
      </div>
    `;
  }
}

// Exibe notícias na interface
function displayNews(newsItems) {
  const newsGrid = document.getElementById('regionalNews');
  
  if (!newsItems || newsItems.length === 0) {
    newsGrid.innerHTML = `
      <div class="empty-news">
        <div class="empty-icon">📰</div>
        <p>Nenhuma notícia encontrada</p>
      </div>
    `;
    return;
  }

  newsGrid.innerHTML = newsItems.map((article, index) => `
    <div class="news-item animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s">
      <div class="news-content">
        <h4>${article.title}</h4>
        <p>${article.description || 'Sem descrição disponível'}</p>
        <div class="news-meta">
          <span class="news-source">${article.source_id || 'Fonte desconhecida'}</span>
          <span class="news-date">${formatNewsDate(article.pubDate)}</span>
        </div>
        <a href="${article.link}" target="_blank" class="news-link">Leia mais</a>
      </div>
    </div>
  `).join('');
}

// Filtra notícias com base nos critérios selecionados
function filterNews() {
  if (!window.newsData) return;
  
  const regionFilter = document.getElementById('regionFilter').value;
  const cropFilter = document.getElementById('cropFilter').value;
  
  let filteredNews = window.newsData;
  
  // Filtra por região
  if (regionFilter !== 'all') {
    filteredNews = filteredNews.filter(article => 
      article.title.toLowerCase().includes(regionFilter) || 
      (article.description && article.description.toLowerCase().includes(regionFilter))
    );
  }
  
  // Filtra por cultura
  if (cropFilter !== 'all') {
    filteredNews = filteredNews.filter(article => 
      article.title.toLowerCase().includes(cropFilter) || 
      (article.description && article.description.toLowerCase().includes(cropFilter))
    );
  }
  
  // Exibe notícias filtradas
  displayNews(filteredNews);
}

// Busca previsão climática regional
async function fetchRegionalWeather() {
  const weatherContainer = document.getElementById('regionalWeather');
  
  try {
    // Obtém localização atual do mapa
    let location = await window.dbManager.getLastLocation();
    
    if (!location) {
      // Localização padrão (Brasil central)
      location = { lat: -15.7801, lng: -47.9292 };
    }
    
    // Busca previsão do tempo para a localização
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&units=metric&appid=9de243494c0b295cca9337e1e96b00e2`;
    
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar previsão do tempo');
    }
    
    const data = await response.json();
    
    // Processa e exibe a previsão
    displayWeatherForecast(data);
    
  } catch (error) {
    console.error('Erro ao buscar previsão do tempo:', error);
    weatherContainer.innerHTML = `
      <div class="error-message">
        <div class="error-icon">🌦️</div>
        <p>Não foi possível carregar a previsão do tempo.</p>
      </div>
    `;
  }
}

// Exibe previsão do tempo na interface
function displayWeatherForecast(data) {
  const weatherContainer = document.getElementById('regionalWeather');
  
  if (!data || !data.list || data.list.length === 0) {
    weatherContainer.innerHTML = `
      <div class="empty-weather">
        <div class="empty-icon">🌦️</div>
        <p>Dados de previsão não disponíveis</p>
      </div>
    `;
    return;
  }
  
  // Agrupa previsões por dia
  const dailyForecasts = {};
  
  data.list.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = {
        date: date,
        temps: [],
        icons: [],
        descriptions: [],
        precipitation: 0
      };
    }
    
    dailyForecasts[dateKey].temps.push(forecast.main.temp);
    dailyForecasts[dateKey].icons.push(forecast.weather[0].icon);
    dailyForecasts[dateKey].descriptions.push(forecast.weather[0].description);
    
    // Soma precipitação (se disponível)
    if (forecast.rain && forecast.rain['3h']) {
      dailyForecasts[dateKey].precipitation += forecast.rain['3h'];
    }
  });
  
  // Converte para array e limita a 5 dias
  const forecastArray = Object.values(dailyForecasts).slice(0, 5);
  
  // Cria HTML para cada dia
  weatherContainer.innerHTML = `
    <div class="forecast-container">
      ${forecastArray.map((day, index) => {
        // Calcula médias e valores mais frequentes
        const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
        const mostFrequentIcon = getMostFrequent(day.icons);
        const mostFrequentDesc = getMostFrequent(day.descriptions);
        
        return `
          <div class="forecast-day animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s">
            <div class="forecast-date">${formatWeatherDate(day.date)}</div>
            <div class="forecast-icon">
              <img src="https://openweathermap.org/img/wn/${mostFrequentIcon}@2x.png" alt="${mostFrequentDesc}">
            </div>
            <div class="forecast-temp">${Math.round(avgTemp)}°C</div>
            <div class="forecast-desc">${capitalizeFirst(mostFrequentDesc)}</div>
            <div class="forecast-rain">${day.precipitation.toFixed(1)} mm</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Funções auxiliares

// Formata data de notícia
function formatNewsDate(dateString) {
  if (!dateString) return 'Data desconhecida';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

// Formata data de previsão do tempo
function formatWeatherDate(date) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayName = days[date.getDay()];
  
  return `${dayName}, ${date.getDate()}/${date.getMonth() + 1}`;
}

// Encontra o valor mais frequente em um array
function getMostFrequent(arr) {
  const counts = {};
  let maxItem = arr[0];
  let maxCount = 1;
  
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxItem = item;
      maxCount = counts[item];
    }
  });
  
  return maxItem;
}

// Capitaliza primeira letra
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Exporta funções
window.regionalManager = {
  loadRegionalReport,
  fetchRegionalNews,
  displayNews,
  filterNews,
  fetchRegionalWeather,
  displayWeatherForecast
};
