class Auth {
    static checkAuth() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');

        if (!token || !user) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.redirectToLogin();
    }

    static redirectToLogin() {
        window.location.href = '/admin/login';
    }

    static redirectToDashboard() {
        window.location.href = '/admin/dashboard';
    }
} 