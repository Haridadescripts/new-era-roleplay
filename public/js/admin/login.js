class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.errorMessage = document.getElementById('errorMessage');
        this.loginButton = this.form.querySelector('.login-btn');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showError('Por favor, preencha todos os campos');
            return;
        }

        this.setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            // Salvar dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Feedback visual
            this.loginButton.querySelector('.btn-text').textContent = 'Sucesso!';
            
            // Redirecionar para o dashboard
            window.location.href = '/admin/dashboard';

        } catch (error) {
            this.showError(error.message || 'Usuário ou senha incorretos');
            this.setLoading(false);
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.animation = 'none';
        this.errorMessage.offsetHeight; // Trigger reflow
        this.errorMessage.style.animation = 'shake 0.5s ease-in-out';
    }

    setLoading(isLoading) {
        this.loginButton.classList.toggle('loading', isLoading);
        this.loginButton.disabled = isLoading;
    }
}

// Inicializar o gerenciador de login
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Adicionar animação de shake para mensagens de erro
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style); 