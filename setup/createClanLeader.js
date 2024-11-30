const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config/env');

async function createUchihaLeader() {
    try {
        // Ler arquivo de usuários existente
        const usersPath = path.join(config.database.path, 'users.json');
        const users = JSON.parse(await fs.readFile(usersPath, 'utf8'));

        // Criar hash da senha
        const hashedPassword = await bcrypt.hash('12345678', config.security.bcryptSaltRounds);

        // Criar novo líder do clã
        const uchihaLeader = {
            username: 'Mabbis',
            password: hashedPassword,
            role: 'clan_leader',
            clan: 'Uchiha',
            permissions: ['edit_clan', 'add_members', 'remove_members', 'edit_members'],
            createdAt: new Date().toISOString()
        };

        // Verificar se já existe
        const existingLeaderIndex = users.clan_leaders.findIndex(
            leader => leader.username === 'Mabbis' || leader.clan === 'Uchiha'
        );

        if (existingLeaderIndex >= 0) {
            users.clan_leaders[existingLeaderIndex] = uchihaLeader;
            console.log('Líder do clã Uchiha atualizado!');
        } else {
            users.clan_leaders.push(uchihaLeader);
            console.log('Líder do clã Uchiha criado!');
        }

        // Salvar alterações
        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

        console.log('\nCredenciais do líder Uchiha:');
        console.log('Username:', uchihaLeader.username);
        console.log('Password: 12345678');
        console.log('Clan:', uchihaLeader.clan);
        console.log('Permissions:', uchihaLeader.permissions.join(', '));

    } catch (error) {
        console.error('Erro ao criar líder do clã Uchiha:', error);
    }
}

createUchihaLeader(); 