const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');
const { autenticar, autorizar } = require('../middleware/autenticacao');

// Buscar Unidades
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuario JOIN unidade ON usuario.id = unidade.id_usuario WHERE usuario.ativo = true');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar Unidades', erro: erro.message });
  }
});

// Buscar Unidades por ID
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuario JOIN unidade ON usuario.id = unidade.id_usuario WHERE usuario.id = $1', [id]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar unidade', erro: erro.message });
  }
});

// Criar Unidades
router.post('/', async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, rua, numero, bairro, cidade, estado, cep } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    const usuario = await pool.query('INSERT INTO usuario (nome, telefone, email, senha, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING id', [nome, telefone, email, senhaHash, tipo]);
    const id_usuario = usuario.rows[0].id;
    await pool.query('INSERT INTO unidade (id_usuario, rua, numero, bairro, cidade, estado, cep) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id_usuario, rua, numero, bairro, cidade, estado, cep]);
    const resultado = await pool.query('COMMIT');
    
    res.status(201).json({ mensagem: 'unidade criado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao criar unidade', erro: erro.message });
  }
});

// Atualizar Unidades
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, rua, numero, bairro, cidade, estado, cep} = req.body;
    const { id } = req.params;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    await pool.query('UPDATE usuario SET nome = $1, telefone = $2, email = $3, senha = $4, tipo = $5 WHERE id = $6', [nome, telefone, email, senhaHash, tipo, id]);
    await pool.query('UPDATE unidade SET rua = $1, numero = $2, bairro = $3, cidade = $4, estado = $5, cep = $6 WHERE id_usuario = $7', [rua, numero, bairro, cidade, estado, cep, id]);
    const resultado = await pool.query('COMMIT');

    res.json({ mensagem: 'unidade atualizado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao atualizar unidade', erro: erro.message });
  }
});

module.exports = router;