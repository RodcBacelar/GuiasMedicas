const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');
const { autenticar, autorizar } = require('../middleware/autenticacao');
const validar = require('../middleware/validacao');
const { criarPacienteSchema, atualizarPacienteSchema } = require('../schemas/pacienteSchema');

// Buscar Pacientes
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuario JOIN paciente ON usuario.id = paciente.id_usuario WHERE usuario.ativo = true');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar pacientes', erro: erro.message });
  }
});

// Buscar Pacientes por ID
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM usuario JOIN paciente ON usuario.id = paciente.id_usuario WHERE usuario.id = $1', [id]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar paciente', erro: erro.message });
  }
});

// Criar Pacientes
router.post('/', validar(criarPacienteSchema), async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, nascimento, sexo } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    const usuario = await pool.query('INSERT INTO usuario (nome, telefone, email, senha, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING id', [nome, telefone, email, senhaHash, tipo]);
    const id_usuario = usuario.rows[0].id;
    await pool.query('INSERT INTO paciente (id_usuario, nascimento, sexo) VALUES ($1, $2, $3)', [id_usuario, nascimento, sexo]);
    const resultado = await pool.query('COMMIT');
    
    res.status(201).json({ mensagem: 'Paciente criado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao criar paciente', erro: erro.message });
  }
});

// Atualizar Pacientes
router.put('/:id', autenticar, validar(atualizarPacienteSchema), async (req, res) => {
  try {
    const { nome, telefone, email, senha, tipo, nascimento, sexo} = req.body;
    const { id } = req.params;
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query('BEGIN');
    await pool.query('UPDATE usuario SET nome = $1, telefone = $2, email = $3, senha = $4, tipo = $5 WHERE id = $6', [nome, telefone, email, senhaHash, tipo, id]);
    await pool.query('UPDATE paciente SET nascimento = $1, sexo = $2 WHERE id_usuario = $3', [nascimento, sexo, id]);
    const resultado = await pool.query('COMMIT');

    res.json({ mensagem: 'Paciente atualizado com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao atualizar Paciente', erro: erro.message });
  }
});

module.exports = router;