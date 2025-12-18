const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());


// Servir arquivos de upload (fotos do usuário)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rota de teste
app.get('/', (req, res) => {
    res.send({ message: 'API funcionando!' });
});

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const categoriasRoutes = require('./routes/categoriasRoutes');
app.use('/categorias', categoriasRoutes);

const lancamentosRoutes = require('./routes/lancamentosRoutes');
app.use('/lancamentos', lancamentosRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/dashboard', dashboardRoutes);

const selicRoutes = require('./routes/selicRoutes');
app.use('/selic', selicRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);


module.exports = app;
