const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

// Buscar Usuários
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuario');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: erro.message });
  }
});

// Criar Usuários
router.post('/', async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const resultado = await pool.query('INSERT INTO usuario (nome, telefone, email, senha, tipo) VALUES ($1, $2, $3, $4, $5)', [nome, telefone, email, senhaHash, tipo]);
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: erro.message });
  }
});

module.exports = router;