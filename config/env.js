require('dotenv').config();
const path = require('path');

const config = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    security: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRATION || '24h',
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    },
    database: {
        path: path.resolve(process.env.DATABASE_PATH || './database'),
        backupPath: path.resolve(process.env.BACKUP_PATH || './database/backups'),
    },
    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif'],
        path: path.resolve(process.env.UPLOAD_PATH || './public/uploads'),
    },
    logs: {
        level: process.env.LOG_LEVEL || 'debug',
        path: path.resolve(process.env.LOG_PATH || './logs'),
    },
    urls: {
        base: process.env.BASE_URL || 'http://localhost:3000',
        api: process.env.API_URL || 'http://localhost:3000/api',
    },
    rateLimit: {
        window: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
    cache: {
        ttl: parseInt(process.env.CACHE_TTL) || 3600,
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
};

// Validação das configurações críticas
function validateConfig() {
    if (!config.security.jwtSecret) {
        throw new Error('JWT_SECRET é obrigatório');
    }

    if (!config.email.host || !config.email.user || !config.email.pass) {
        console.warn('Configurações de email incompletas');
    }

    // Criar diretórios necessários
    const directories = [
        config.database.path,
        config.database.backupPath,
        config.upload.path,
        config.logs.path,
    ];

    const fs = require('fs');
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

validateConfig();

module.exports = config; 