const db = require('./db');

function createTables() {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            photo TEXT DEFAULT NULL
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tipo TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES users(id)
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS lancamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,                    -- AGORA OPCIONAL
            valor REAL NOT NULL,
            data TEXT NOT NULL,
            tipo TEXT NOT NULL,
            categoria_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id),
            FOREIGN KEY (usuario_id) REFERENCES users(id)
        )
    `).run();

    console.log("Tabelas criadas com sucesso!");
}

createTables();
