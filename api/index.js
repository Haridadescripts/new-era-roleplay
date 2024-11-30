const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Usuários do sistema
const users = {
    'Mabbis': {
        password: '12345678',
        clan: 'Uchiha',
        role: 'clan_leader',
        name: 'Mabbis'
    },
    'Art Night': {
        password: 'artnewera1',
        clan: 'Uzumaki',
        role: 'clan_leader',
        name: 'Art Night'
    }
};

// API Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    
    if (user && user.password === password) {
        const { password, ...userData } = user;
        res.json({
            token: `token_${Date.now()}`,
            user: userData,
            redirectUrl: '/admin/dashboard'
        });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// ... resto das rotas da API ...

module.exports = app;