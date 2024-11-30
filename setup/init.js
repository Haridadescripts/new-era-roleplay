// Criar arquivo de membros inicial
await fs.writeFile(
    path.join(config.database.path, 'members.json'),
    JSON.stringify({ members: [] }, null, 2)
); 