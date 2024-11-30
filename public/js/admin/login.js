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
        this.setLoading(true);

        try {
            const formData = new FormData(this.form);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/admin';
            } else {
                throw new Error(data.error || 'Erro ao fazer login');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
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