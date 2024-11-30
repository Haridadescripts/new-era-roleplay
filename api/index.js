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

// Membros temporários
let members = [];

// Rotas da API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    
    if (user && user.password === password) {
        const { password, ...userData } = user;
        res.json({
            token: `token_${Date.now()}`,
            user: userData
        });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

app.get('/api/members', (req, res) => {
    res.json(members);
});

app.post('/api/members', (req, res) => {
    const newMember = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
}); 