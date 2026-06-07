const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

// Buscar Usuários
router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuario WHERE ativo = true');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: erro.message });
  }
});

// Buscar Usuários por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
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

// Atualizar Usuários
router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo } = req.body;
    const { id } = req.params;
    const senhaHash = await bcrypt.hash(senha, 10);
    const resultado = await pool.query('UPDATE usuario SET nome = $1, telefone = $2, email = $3, senha = $4, tipo = $5 WHERE id = $6', [nome, telefone, email, senhaHash, tipo, id]);
    res.json({ mensagem: 'Usuário atualizado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário', erro: erro.message });
  }
});

// Reativar usuários (Estamos só trocando o campo ativo para true)
router.put('/:id/ativar', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('UPDATE usuario SET ativo = true WHERE id = $1', [id]);
    res.json({ mensagem: 'Usuário ativado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao ativar usuário', erro: erro.message });
  }
});

// Deletar usuários (Estamos só trocando o campo ativo para false)
router.put('/:id/desativar', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('UPDATE usuario SET ativo = false WHERE id = $1', [id]);
    res.json({ mensagem: 'Usuário desativado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao desativar usuário', erro: erro.message });
  }
});

module.exports = router;