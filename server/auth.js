const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
    async authenticate(username, password) {
        try {
            const users = JSON.parse(await fs.readFile('./database/users.json', 'utf8'));
            const user = [...users.admins, ...users.clan_leaders]
                .find(u => u.username === username);

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Senha incorreta');
            }

            const token = jwt.sign(
                { 
                    username: user.username,
                    role: user.role,
                    clan: user.clan,
                    permissions: user.permissions 
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return { token, user: { ...user, password: undefined } };
        } catch (error) {
            throw new Error('Erro na autenticação: ' + error.message);
        }
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports = new AuthController(); 