const Database = require('better-sqlite3');
const path = require('path');

// caminho do banco
const dbPath = path.resolve(__dirname, 'meuorcamento.db');

// abre/cria o arquivo do banco
const db = new Database(dbPath);

console.log("Banco SQLite conectado com sucesso! (better-sqlite3)");

module.exports = db;