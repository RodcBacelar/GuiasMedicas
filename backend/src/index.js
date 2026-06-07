const express = require('express');
const dotenv = require('dotenv');
require('./database');

dotenv.config();

const app = express();
const usuariosRoutes = require('./routes/usuarios');

app.use(express.json());
app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});