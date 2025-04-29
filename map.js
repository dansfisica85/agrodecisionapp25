// Mapa para AgroDecision PWA
let map, marker;

// Inicialização do mapa
function initMap() {
  // Inicializa o mapa com centro no Brasil
  map = L.map('map').setView([-15.7801, -47.9292], 5);
  
  // Adiciona camada de mapa base
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Verifica se há uma localização salva
  window.dbManager.getLastLocation()
    .then(location => {
      if (location) {
        // Se houver localização salva, centraliza o mapa e adiciona marcador
        map.setView([location.lat, location.lng], 7);
        marker = L.marker([location.lat, location.lng]).addTo(map);
        
        // Carrega dados climáticos para a localização
        getNASAData(location.lat, location.lng)
          .then(data => {
            window.climateData = data;
            showWeatherPopup(location);
          });
      } else {
        // Se não houver localização salva, mostra popup de introdução
        const initialPopup = L.popup()
          .setLatLng([-15.7801, -47.9292])
          .setContent('<div class="intro-popup">Selecione um local no mapa para começar</div>')
          .openOn(map);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar última localização:', error);
      
      // Em caso de erro, mostra popup de introdução
      const initialPopup = L.popup()
        .setLatLng([-15.7801, -47.9292])
        .setContent('<div class="intro-popup">Selecione um local no mapa para começar</div>')
        .openOn(map);
    });
  
  // Adiciona evento de clique no mapa
  map.on('click', async function(e) {
    if (marker) {
      marker.remove();
    }
    
    // Adiciona marcador na posição clicada
    marker = L.marker(e.latlng).addTo(map);
    
    // Salva a localização no banco de dados
    const locationId = await window.dbManager.saveLocation(e.latlng);
    
    // Mostra orientação do menu
    showMenuGuidance();
    
    // Carrega dados climáticos para a localização
    const nasaData = await getNASAData(e.latlng.lat, e.latlng.lng);
    window.climateData = nasaData;
    
    if (nasaData) {
      // Salva dados climáticos no banco de dados
      await window.dbManager.saveClimateData(locationId, nasaData);
      
      // Mostra popup com previsão do tempo
      showWeatherPopup(e.latlng);
    }
  });
  
  // Torna o mapa disponível globalmente
  window.map = map;
}

// Função para mostrar orientação do menu
function showMenuGuidance() {
  // Remove orientação existente, se houver
  const existingGuidance = document.querySelector('.menu-guidance');
  if (existingGuidance) {
    existingGuidance.remove();
  }
  
  // Cria elemento de orientação
  const guidance = document.createElement('div');
  guidance.className = 'menu-guidance animate__animated animate__fadeInUp';
  guidance.innerHTML = `
    <div class="guidance-icon">👈</div>
    <div class="guidance-text">Abra o menu para acessar as funcionalidades</div>
    <button class="close-guidance" onclick="this.parentElement.remove()">×</button>
  `;
  
  // Adiciona ao corpo do documento
  document.body.appendChild(guidance);
  
  // Remove automaticamente após 5 segundos
  setTimeout(() => {
    if (guidance.parentElement) {
      guidance.classList.add('animate__fadeOutDown');
      setTimeout(() => {
        if (guidance.parentElement) {
          guidance.remove();
        }
      }, 500);
    }
  }, 5000);
}

// Função para obter dados climáticos da NASA
async function getNASAData(lat, lng) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 30);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const params = new URLSearchParams({
    parameters: 'T2M,PRECTOT,RH2M,WS10M,ALLSKY_SFC_SW_DWN',
    community: 'AG',
    longitude: lng.toFixed(4),
    latitude: lat.toFixed(4),
    start: formatDate(startDate),
    end: formatDate(endDate),
    format: 'JSON'
  });

  try {
    const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?${params}`);
    if (!response.ok) {
      throw new Error('Erro na requisição da API da NASA');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados da NASA:', error);
    Swal.fire({
      title: 'Erro',
      text: 'Não foi possível carregar os dados climáticos. Por favor, tente novamente.',
      icon: 'error'
    });
    return null;
  }
}

// Função para mostrar popup com previsão do tempo
function showWeatherPopup(latlng) {
  if (!window.climateData) return;
  
  try {
    // Extrai dados climáticos recentes
    const data = window.climateData;
    const parameters = data.properties.parameter;
    
    // Obtém data mais recente
    const dates = Object.keys(parameters.T2M);
    const latestDate = dates[dates.length - 1];
    
    // Obtém valores para a data mais recente
    const temperature = parameters.T2M[latestDate];
    const precipitation = parameters.PRECTOT[latestDate];
    const humidity = parameters.RH2M[latestDate];
    const windSpeed = parameters.WS10M[latestDate];
    const solarRadiation = parameters.ALLSKY_SFC_SW_DWN[latestDate];
    
    // Formata data
    const formattedDate = new Date(latestDate.substring(0, 4), 
                                  parseInt(latestDate.substring(4, 6)) - 1, 
                                  latestDate.substring(6, 8))
                                  .toLocaleDateString('pt-BR');
    
    // Cria conteúdo do popup
    const popupContent = `
      <div class="weather-popup">
        <h3>Dados Climáticos</h3>
        <p><strong>Data:</strong> ${formattedDate}</p>
        <p><strong>Temperatura:</strong> ${temperature.toFixed(1)}°C</p>
        <p><strong>Precipitação:</strong> ${precipitation.toFixed(1)} mm</p>
        <p><strong>Umidade:</strong> ${humidity.toFixed(1)}%</p>
        <p><strong>Velocidade do Vento:</strong> ${windSpeed.toFixed(1)} m/s</p>
        <p><strong>Radiação Solar:</strong> ${solarRadiation.toFixed(1)} kW-hr/m²/dia</p>
      </div>
    `;
    
    // Mostra popup
    L.popup()
      .setLatLng(latlng)
      .setContent(popupContent)
      .openOn(map);
      
  } catch (error) {
    console.error('Erro ao processar dados climáticos:', error);
  }
}

// Exporta funções
window.mapManager = {
  initMap,
  showMenuGuidance,
  getNASAData,
  showWeatherPopup
};
