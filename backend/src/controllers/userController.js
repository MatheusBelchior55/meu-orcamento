const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { saveBase64Image } = require("../services/uploadService");

module.exports = {

    // -------------------------
    // 1. Atualizar dados (nome e email)
    // -------------------------
    updateInfo: (req, res) => {
        const userId = req.user.id;
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ error: "Nome e email são obrigatórios." });
        }

        // Verifica se email já existe em outro usuário
        const exists = db.prepare(`
            SELECT id FROM users WHERE email = ? AND id != ?
        `).get(email, userId);

        if (exists) {
            return res.status(400).json({ error: "Email já está sendo usado por outro usuário." });
        }

        db.prepare(`
            UPDATE users
            SET nome = ?, email = ?
            WHERE id = ?
        `).run(nome, email, userId);

        return res.json({ message: "Informações atualizadas com sucesso!" });
    },


    // -------------------------
    // 2. Atualizar foto de perfil
    // -------------------------
    updatePhoto: (req, res) => {
        const userId = req.user.id;
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ error: "Nenhuma imagem enviada." });
        }

        const savedPath = saveBase64Image(photo);
        if (!savedPath) {
            return res.status(500).json({ error: "Falha ao salvar foto." });
        }

        db.prepare(`
            UPDATE users
            SET photo = ?
            WHERE id = ?
        `).run(savedPath, userId);

        return res.json({
            message: "Foto atualizada com sucesso!",
            photo: savedPath
        });
    },


    // -------------------------
    // 3. Atualizar senha
    // -------------------------
    updatePassword: (req, res) => {
        const userId = req.user.id;
        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ error: "Preencha todos os campos." });
        }

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

        const valid = bcrypt.compareSync(senhaAtual, user.senha);
        if (!valid) {
            return res.status(400).json({ error: "Senha atual incorreta." });
        }

        const novaHash = bcrypt.hashSync(novaSenha, 10);

        db.prepare(`
            UPDATE users
            SET senha = ?
            WHERE id = ?
        `).run(novaHash, userId);

        return res.json({ message: "Senha alterada com sucesso!" });
    },


    // -------------------------
    // 4. Obter dados do usuário logado
    // -------------------------
    getUser: (req, res) => {
        const userId = req.user.id;

        const user = db.prepare(`
            SELECT id, nome, email, photo
            FROM users
            WHERE id = ?
        `).get(userId);

        return res.json(user);
    }
};
