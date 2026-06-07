const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

// Autenticar
router.post('/', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const resultado = await pool.query('SELECT id, email, senha, tipo FROM usuario WHERE email = $1', [email]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    const auth = await bcrypt.compare(senha, resultado.rows[0].senha);
    if (!auth) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: resultado.rows[0].id, tipo: resultado.rows[0].tipo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro de AUtenticação', erro: erro.message });
  }
});

module.exports = router;