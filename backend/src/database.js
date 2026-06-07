const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Banco de dados conectado!'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));

module.exports = pool;