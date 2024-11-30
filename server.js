const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Usuários
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

// Rota principal
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Rotas de autenticação
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// API Login
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

// Membros temporários
let members = [];

// API Membros
app.get('/api/members', (req, res) => {
    res.json(members);
});

app.post('/api/members', (req, res) => {
    const newMember = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    members.push(newMember);
    res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const index = members.findIndex(m => m.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Membro não encontrado' });
    }

    members[index] = {
        ...members[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    res.json(members[index]);
});

app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    members = members.filter(m => m.id !== id);
    res.status(204).send();
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Vercel serverless
module.exports = app;

// Development server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}