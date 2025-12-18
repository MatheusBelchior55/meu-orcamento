const db = require('../database/db');

module.exports = {
    listar: (req, res) => {
        const userId = req.user.id;

        const categorias = db.prepare(`
            SELECT * FROM categorias WHERE usuario_id = ?
        `).all(userId);

        return res.json(categorias);
    },

    criar: (req, res) => {
        const userId = req.user.id;
        const { nome, tipo } = req.body;

        if (!nome || !tipo) {
            return res.status(400).json({ error: "Preencha nome e tipo." });
        }

        db.prepare(`
            INSERT INTO categorias (nome, tipo, usuario_id)
            VALUES (?, ?, ?)
        `).run(nome, tipo, userId);

        return res.json({ message: "Categoria criada com sucesso!" });
    },

    atualizar: (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;
        const { nome, tipo } = req.body;

        db.prepare(`
            UPDATE categorias
            SET nome = ?, tipo = ?
            WHERE id = ? AND usuario_id = ?
        `).run(nome, tipo, id, userId);

        return res.json({ message: "Categoria atualizada com sucesso!" });
    },

    deletar: (req, res) => {
        const userId = req.user.id;
        const { id } = req.params;

        db.prepare(`
            DELETE FROM categorias
            WHERE id = ? AND usuario_id = ?
        `).run(id, userId);

        return res.json({ message: "Categoria excluída com sucesso!" });
    }
};
