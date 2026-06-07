const express = require('express');
const dotenv = require('dotenv');
require('./database');

dotenv.config();

const app = express();

// CORS – permite chamadas do frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const usuariosRoutes = require('./routes/usuarios');
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const unidadesRoutes = require('./routes/unidades');
const examesRoutes = require('./routes/exames');
const guiasRoutes = require('./routes/guias');
const autenticacaoRoutes = require('./routes/autenticacao');

app.use(express.json());
app.use('/usuarios', usuariosRoutes);
app.use('/medicos', medicosRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/unidades', unidadesRoutes);
app.use('/exames', examesRoutes);
app.use('/guias', guiasRoutes);
app.use('/autenticacao', autenticacaoRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});