// Autenticação para AgroDecision PWA
// Gerencia autenticação de usuários com Firebase

// Inicializa autenticação
function initAuth() {
  // Verifica se o Firebase Auth está disponível
  if (window.auth) {
    // Configura listener de estado de autenticação
    window.auth.onAuthStateChanged(user => {
      updateUserInfo(user);
      
      if (user) {
        // Usuário autenticado
        hideLoginModal();
      } else {
        // Usuário não autenticado
        // Não mostra modal automaticamente para não interromper a experiência inicial
      }
    });
  } else {
    console.error('Firebase Auth não está disponível');
  }
}

// Atualiza informações do usuário na interface
function updateUserInfo(user) {
  const userInfoElement = document.getElementById('userInfo');
  const loginButton = document.getElementById('loginButton');
  
  if (user) {
    // Usuário autenticado
    userInfoElement.innerHTML = `
      <img src="${user.photoURL || 'images/default_avatar.png'}" alt="Avatar" class="user-avatar">
      <span class="user-name">${user.displayName || user.email}</span>
    `;
    
    // Atualiza botão de login para logout
    loginButton.innerHTML = '<i>👤</i> Sair';
    loginButton.onclick = handleLogout;
  } else {
    // Usuário não autenticado
    userInfoElement.innerHTML = '';
    
    // Atualiza botão para login
    loginButton.innerHTML = '<i>👤</i> Login';
    loginButton.onclick = handleAuth;
  }
}

// Manipula autenticação (login/registro)
function handleAuth() {
  showLoginModal();
}

// Manipula logout
function handleLogout() {
  if (window.auth) {
    Swal.fire({
      title: 'Sair',
      text: 'Tem certeza que deseja sair?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#4CAF50'
    }).then((result) => {
      if (result.isConfirmed) {
        window.auth.signOut()
          .then(() => {
            Swal.fire({
              title: 'Sucesso',
              text: 'Você saiu com sucesso',
              icon: 'success',
              confirmButtonColor: '#4CAF50'
            });
          })
          .catch((error) => {
            console.error('Erro ao fazer logout:', error);
            Swal.fire({
              title: 'Erro',
              text: 'Ocorreu um erro ao tentar sair',
              icon: 'error',
              confirmButtonColor: '#4CAF50'
            });
          });
      }
    });
  }
}

// Mostra modal de login
function showLoginModal() {
  // Remove modal existente, se houver
  const existingModal = document.querySelector('.login-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Cria modal de login
  const modal = document.createElement('div');
  modal.className = 'login-modal animate__animated animate__fadeIn';
  modal.innerHTML = `
    <div class="login-card animate__animated animate__zoomIn">
      <h2>Entrar no AgroDecision</h2>
      <p>Faça login para salvar suas simulações e acessar recursos exclusivos.</p>
      
      <div class="login-buttons">
        <button id="googleLoginBtn" class="google-button">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18">
          Entrar com Google
        </button>
      </div>
      
      <button class="close-button" id="closeLoginModal">×</button>
    </div>
  `;
  
  // Adiciona ao corpo do documento
  document.body.appendChild(modal);
  
  // Adiciona eventos
  document.getElementById('googleLoginBtn').addEventListener('click', loginWithGoogle);
  document.getElementById('closeLoginModal').addEventListener('click', hideLoginModal);
}

// Esconde modal de login
function hideLoginModal() {
  const modal = document.querySelector('.login-modal');
  if (modal) {
    modal.classList.add('animate__fadeOut');
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 500);
  }
}

// Login com Google
function loginWithGoogle() {
  if (window.auth) {
    const provider = new GoogleAuthProvider();
    
    window.auth.signInWithPopup(provider)
      .then((result) => {
        // Login bem-sucedido
        hideLoginModal();
        
        Swal.fire({
          title: 'Bem-vindo!',
          text: `Olá, ${result.user.displayName || 'usuário'}!`,
          icon: 'success',
          confirmButtonColor: '#4CAF50'
        });
      })
      .catch((error) => {
        console.error('Erro no login com Google:', error);
        
        Swal.fire({
          title: 'Erro',
          text: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
          icon: 'error',
          confirmButtonColor: '#4CAF50'
        });
      });
  } else {
    console.error('Firebase Auth não está disponível');
    
    Swal.fire({
      title: 'Erro',
      text: 'Serviço de autenticação não disponível',
      icon: 'error',
      confirmButtonColor: '#4CAF50'
    });
  }
}

// Exporta funções
window.authManager = {
  initAuth,
  updateUserInfo,
  handleAuth,
  handleLogout,
  showLoginModal,
  hideLoginModal,
  loginWithGoogle
};
