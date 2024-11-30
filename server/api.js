const express = require('express');
const router = express.Router();
const auth = require('./auth');
const fs = require('fs').promises;
const Member = require('./models/Member');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        req.user = auth.verifyToken(token);
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};

// Middleware de verificação de permissão
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (req.user.role === 'super_admin' || 
            req.user.permissions.includes(permission) ||
            req.user.permissions.includes('all')) {
            next();
        } else {
            res.status(403).json({ error: 'Permissão negada' });
        }
    };
};

// Middleware para verificar permissões específicas do clã
const checkClanPermission = async (req, res, next) => {
    try {
        const user = req.user;
        const { clanName } = req.body;

        // Super admin pode tudo
        if (user.role === 'super_admin') {
            return next();
        }

        // Líder do clã só pode modificar seu próprio clã
        if (user.role === 'clan_leader' && user.clan !== clanName) {
            return res.status(403).json({
                error: 'Você só pode modificar membros do seu próprio clã'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Rotas de autenticação
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await auth.authenticate(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Rotas protegidas
router.post('/clan/members', authenticateToken, checkClanPermission, async (req, res) => {
    try {
        const { clanName, member } = req.body;
        const clansData = JSON.parse(await fs.readFile('./database/clans.json', 'utf8'));
        
        const clan = clansData.clans.find(c => c.name === clanName);
        if (!clan) {
            return res.status(404).json({ error: 'Clã não encontrado' });
        }

        // Adiciona informações do responsável
        member.addedBy = req.user.username;
        member.addedAt = new Date().toISOString();
        
        clan.members.push(member);
        await fs.writeFile('./database/clans.json', JSON.stringify(clansData, null, 2));

        res.json({ 
            message: 'Membro adicionado com sucesso',
            member
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para listar membros do clã
router.get('/clan/:clanName/members', authenticateToken, async (req, res) => {
    try {
        const { clanName } = req.params;
        const clansData = JSON.parse(await fs.readFile('./database/clans.json', 'utf8'));
        
        const clan = clansData.clans.find(c => c.name === clanName);
        if (!clan) {
            return res.status(404).json({ error: 'Clã não encontrado' });
        }

        // Se for líder do clã, só pode ver seu próprio clã
        if (req.user.role === 'clan_leader' && req.user.clan !== clanName) {
            return res.status(403).json({
                error: 'Você só pode visualizar membros do seu próprio clã'
            });
        }

        res.json(clan.members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas de membros
router.get('/members', authenticateToken, async (req, res) => {
    try {
        const members = await Member.findAll();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/members', authenticateToken, async (req, res) => {
    try {
        const member = await Member.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/members/:id', authenticateToken, async (req, res) => {
    try {
        const member = await Member.update(req.params.id, req.body);
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/members/:id', authenticateToken, async (req, res) => {
    try {
        await Member.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para validar token
router.get('/validate-token', authenticateToken, (req, res) => {
    try {
        // Se chegou aqui, o token é válido
        res.json({ 
            valid: true, 
            user: {
                username: req.user.username,
                role: req.user.role,
                clan: req.user.clan
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
});

// Rota de logout
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Aqui você pode adicionar lógica para invalidar o token
        // Por exemplo, adicionando-o a uma lista negra

        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar logout' });
    }
});

module.exports = router; 