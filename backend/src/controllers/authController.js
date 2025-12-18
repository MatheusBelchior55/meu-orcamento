const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { saveBase64Image } = require("../services/uploadService");

// -------------------- REGISTER --------------------
module.exports = {
    register: (req, res) => {
        const { nome, email, senha, photo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: "Preencha todos os campos." });
        }

        const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (existing) {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        const senhaHash = bcrypt.hashSync(senha, 10);

        let photoUrl = null;

        // se enviou foto em base64, salva
        if (photo) {
            const saved = saveBase64Image(photo);
            if (saved) {
                photoUrl = saved;
            }
        }

        db.prepare(`
            INSERT INTO users (nome, email, senha, photo)
            VALUES (?, ?, ?, ?)
        `).run(nome, email, senhaHash, photoUrl);

        return res.json({ message: "Usuário registrado com sucesso!" });
    },

// -------------------- LOGIN --------------------
    login: (req, res) => {
        const { email, senha } = req.body;

        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado." });
        }

        const valid = bcrypt.compareSync(senha, user.senha);
        if (!valid) {
            return res.status(400).json({ error: "Senha incorreta." });
        }

        const token = jwt.sign(
            { id: user.id, nome: user.nome },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                photo: user.photo // ← devolve foto para o menu lateral do app
            }
        });
    }
};
