const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

// Buscar exames
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM exame');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar exames', erro: erro.message });
  }
});

// Buscar exames por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM exame WHERE id = $1', [id]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar exame', erro: erro.message });
  }
});

// Criar exames
router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const resultado = await pool.query('INSERT INTO exame (nome, descricao) VALUES ($1, $2)', [nome, descricao]);
    res.status(201).json({ mensagem: 'exame criado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao criar exame', erro: erro.message });
  }
});

// Atualizar exames
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const { id } = req.params;

    const resultado = await pool.query('UPDATE exame SET nome = $1, descricao = $2 WHERE id = $3', [nome, descricao, id]);

    res.json({ mensagem: 'exame atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar exame', erro: erro.message });
  }
});

// Remover exames
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query('DELETE FROM exame WHERE id = $1', [id]);

    res.json({ mensagem: 'exame removido com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao remover exame', erro: erro.message });
  }
});

module.exports = router;