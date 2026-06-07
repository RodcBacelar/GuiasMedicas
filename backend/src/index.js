const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
require('./database');

dotenv.config();
const app = express();

app.use(cors({origin: ['http://localhost:5173']}));
app.use(express.json());

const usuariosRoutes = require('./routes/usuarios');
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const unidadesRoutes = require('./routes/unidades');
const examesRoutes = require('./routes/exames');
const guiasRoutes = require('./routes/guias');
const autenticacaoRoutes = require('./routes/autenticacao');

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