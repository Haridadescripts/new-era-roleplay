const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos
app.use(express.static('public'));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Array para armazenar membros (temporário, substitua por banco de dados depois)
let members = [];

// Adicione este objeto de usuários no início do arquivo, após as importações
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

// Rotas da API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    
    if (user && user.password === password) {
        // Remove a senha antes de enviar os dados do usuário
        const { password, ...userData } = user;
        
        res.json({
            token: `token_${Date.now()}`,
            user: userData
        });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// CRUD de membros
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

// Rotas para as páginas
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Rota para 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n=== New Era Roleplay Server ===`);
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
});