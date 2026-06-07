const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');
const { autenticar, autorizar } = require('../middleware/autenticacao');
const validar = require('../middleware/validacao');
const { criarMedicoSchema, atualizarMedicoSchema } = require('../schemas/medicoSchema');

// Buscar Médicos
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuario JOIN medico ON usuario.id = medico.id_usuario WHERE usuario.ativo = true');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar medicos', erro: erro.message });
  }
});

// Buscar Médicos por ID
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuario JOIN medico ON usuario.id = medico.id_usuario WHERE usuario.id = $1', [id]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar medico', erro: erro.message });
  }
});

// Criar Médicos
router.post('/', validar(criarMedicoSchema), async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, nascimento, sexo, residencia, especialidade, cargo} = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    const usuario = await pool.query('INSERT INTO usuario (nome, telefone, email, senha, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING id', [nome, telefone, email, senhaHash, tipo]);
    const id_usuario = usuario.rows[0].id;
    await pool.query('INSERT INTO medico (id_usuario, nascimento, sexo, residencia, especialidade, cargo) VALUES ($1, $2, $3, $4, $5, $6)', [id_usuario, nascimento, sexo, residencia, especialidade, cargo]);
    const resultado = await pool.query('COMMIT');
    
    res.status(201).json({ mensagem: 'Médico criado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao criar médico', erro: erro.message });
  }
});

// Atualizar Médicos
router.put('/:id', autenticar, validar(atualizarMedicoSchema), async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, nascimento, sexo, residencia, especialidade, cargo} = req.body;
    const { id } = req.params;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    await pool.query('UPDATE usuario SET nome = $1, telefone = $2, email = $3, senha = $4, tipo = $5 WHERE id = $6', [nome, telefone, email, senhaHash, tipo, id]);
    await pool.query('UPDATE medico SET nascimento = $1, sexo = $2, residencia = $3, especialidade = $4, cargo = $5 WHERE id_usuario = $6', [nascimento, sexo, residencia, especialidade, cargo, id]);
    const resultado = await pool.query('COMMIT');

    res.json({ mensagem: 'Médico atualizado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao atualizar Médico', erro: erro.message });
  }
});

module.exports = router;