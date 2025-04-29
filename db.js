// Banco de dados para AgroDecision PWA
const DB_NAME = 'agrodecision-db';
const DB_VERSION = 1;
let db;

// Inicialização do banco de dados
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Erro ao abrir banco de dados:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Banco de dados inicializado com sucesso');
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Armazenamento de localizações
      if (!db.objectStoreNames.contains('locations')) {
        const locationsStore = db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
        locationsStore.createIndex('lat', 'lat', { unique: false });
        locationsStore.createIndex('lng', 'lng', { unique: false });
        locationsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Armazenamento de simulações
      if (!db.objectStoreNames.contains('simulations')) {
        const simulationsStore = db.createObjectStore('simulations', { keyPath: 'id', autoIncrement: true });
        simulationsStore.createIndex('crop', 'crop', { unique: false });
        simulationsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Armazenamento de dados climáticos
      if (!db.objectStoreNames.contains('climateData')) {
        const climateStore = db.createObjectStore('climateData', { keyPath: 'id', autoIncrement: true });
        climateStore.createIndex('locationId', 'locationId', { unique: false });
        climateStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
}

// Salvar localização selecionada
async function saveLocation(latlng) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');
    
    const location = {
      lat: latlng.lat,
      lng: latlng.lng,
      timestamp: new Date().getTime()
    };
    
    const request = store.add(location);
    
    request.onsuccess = (event) => {
      console.log('Localização salva com sucesso');
      resolve(event.target.result); // Retorna o ID da localização
    };
    
    request.onerror = (event) => {
      console.error('Erro ao salvar localização:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Salvar dados climáticos
async function saveClimateData(locationId, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['climateData'], 'readwrite');
    const store = transaction.objectStore('climateData');
    
    const climateData = {
      locationId: locationId,
      data: data,
      date: new Date().getTime()
    };
    
    const request = store.add(climateData);
    
    request.onsuccess = (event) => {
      console.log('Dados climáticos salvos com sucesso');
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error('Erro ao salvar dados climáticos:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Salvar simulação
async function saveSimulation(simulationData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['simulations'], 'readwrite');
    const store = transaction.objectStore('simulations');
    
    const simulation = {
      ...simulationData,
      timestamp: new Date().getTime()
    };
    
    const request = store.add(simulation);
    
    request.onsuccess = (event) => {
      console.log('Simulação salva com sucesso');
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error('Erro ao salvar simulação:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Obter simulações
async function getSimulations() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['simulations'], 'readonly');
    const store = transaction.objectStore('simulations');
    const index = store.index('timestamp');
    
    const request = index.openCursor(null, 'prev'); // Ordem decrescente por timestamp
    const simulations = [];
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        simulations.push(cursor.value);
        cursor.continue();
      } else {
        resolve(simulations);
      }
    };
    
    request.onerror = (event) => {
      console.error('Erro ao obter simulações:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Obter última localização
async function getLastLocation() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readonly');
    const store = transaction.objectStore('locations');
    const index = store.index('timestamp');
    
    const request = index.openCursor(null, 'prev'); // Ordem decrescente por timestamp
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        resolve(cursor.value);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = (event) => {
      console.error('Erro ao obter última localização:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Exportar funções
window.dbManager = {
  initDB,
  saveLocation,
  saveClimateData,
  saveSimulation,
  getSimulations,
  getLastLocation
};
