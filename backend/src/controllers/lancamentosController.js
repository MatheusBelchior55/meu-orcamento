const db = require('../database/db');

module.exports = {
    listar: (req, res) => {
        const userId = req.user.id;

        const results = db.prepare(`
            SELECT l.*, c.nome AS categoria_nome, c.tipo AS categoria_tipo
            FROM lancamentos l
            JOIN categorias c ON c.id = l.categoria_id
            WHERE l.usuario_id = ?
            ORDER BY date(l.data) DESC
        `).all(userId);

        return res.json(results);
    },

    criar: (req, res) => {
        const userId = req.user.id;
        const { tipo, valor, categoria_id, data, descricao } = req.body;

        if (!tipo || !valor || !categoria_id || !data) {
            return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
        }

        db.prepare(`
            INSERT INTO lancamentos (tipo, valor, categoria_id, data, descricao, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(tipo, valor, categoria_id, data, descricao || null, userId);

        return res.json({ message: "Lançamento criado com sucesso!" });
    },

    atualizar: (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;
        const { tipo, valor, categoria_id, data, descricao } = req.body;

        db.prepare(`
            UPDATE lancamentos
            SET tipo = ?, valor = ?, categoria_id = ?, data = ?, descricao = ?
            WHERE id = ? AND usuario_id = ?
        `).run(tipo, valor, categoria_id, data, descricao, id, userId);

        return res.json({ message: "Lançamento atualizado com sucesso!" });
    },

    deletar: (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;

        db.prepare(`
            DELETE FROM lancamentos
            WHERE id = ? AND usuario_id = ?
        `).run(id, userId);

        return res.json({ message: "Lançamento excluído com sucesso!" });
    }
};
