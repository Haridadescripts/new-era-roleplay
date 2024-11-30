class Dashboard {
    constructor() {
        if (!Auth.checkAuth()) {
            return;
        }
        
        this.user = JSON.parse(localStorage.getItem('user'));
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        document.body.setAttribute('data-clan', this.user.clan);
    }

    loadUserData() {
        // Atualizar mensagem de boas-vindas
        const welcomeMessage = document.getElementById('welcomeMessage');
        const userRole = document.getElementById('userRole');
        
        if (welcomeMessage) {
            welcomeMessage.textContent = `Seja bem-vindo, ${this.user.name}`;
        }
        
        if (userRole) {
            userRole.textContent = `Líder do Clã ${this.user.clan}`;
        }

        // Atualizar título da página
        document.title = `${this.user.clan} - Painel Administrativo`;
    }

    setupEventListeners() {
        // Botão de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
            });
        }

        // ... outros event listeners ...
    }
}

// Inicializar o dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
}); 