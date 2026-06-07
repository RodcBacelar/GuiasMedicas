const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../database');

const { autenticar, autorizar } = require('../middleware/autenticacao');

// Buscar Guias
router.get('/', autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT guia.*, 
      medico_usuario.nome AS nome_medico, 
      paciente_usuario.nome AS nome_paciente, 
      unidade_usuario.nome AS nome_unidade,
      json_agg(json_build_object('id', exame.id, 'nome', exame.nome)) AS exames 
      FROM guia JOIN usuario AS medico_usuario ON guia.id_medico = medico_usuario.id 
      JOIN usuario AS paciente_usuario ON guia.id_paciente = paciente_usuario.id 
      JOIN usuario AS unidade_usuario ON guia.id_unidade = unidade_usuario.id 
      JOIN guia_exame ON guia.id = guia_exame.id_guia 
      JOIN exame ON guia_exame.id_exame = exame.id 
      GROUP BY guia.id, medico_usuario.nome, paciente_usuario.nome, unidade_usuario.nome`);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar guias', erro: erro.message });
  }
});

// Buscar Guias por id do paciente
router.get('/paciente/:id', autenticar, autorizar('paciente', 'medico'), async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`
      SELECT guia.*, 
      medico_usuario.nome AS nome_medico, 
      paciente_usuario.nome AS nome_paciente, 
      unidade_usuario.nome AS nome_unidade,
      json_agg(json_build_object('id', exame.id, 'nome', exame.nome)) AS exames 
      FROM guia JOIN usuario AS medico_usuario ON guia.id_medico = medico_usuario.id 
      JOIN usuario AS paciente_usuario ON guia.id_paciente = paciente_usuario.id 
      JOIN usuario AS unidade_usuario ON guia.id_unidade = unidade_usuario.id 
      JOIN guia_exame ON guia.id = guia_exame.id_guia 
      JOIN exame ON guia_exame.id_exame = exame.id 
      WHERE id_paciente = $1 
      GROUP BY guia.id, medico_usuario.nome, paciente_usuario.nome, unidade_usuario.nome`, [id]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar guias', erro: erro.message });
  }
});

// Criar Guia
router.post('/', autenticar, autorizar('medico'), async (req, res) => {
  try {
    const { id_medico, id_paciente, id_unidade, prioridade, exames, numero_consultas, tempo_doenca, quadro_clinico, hipotese_diagnostico, cid_10, medicacao, tratamento_evolucao, motivo_encaminhamento } = req.body;

    await pool.query('BEGIN');

    const guia = await pool.query('INSERT INTO guia (id_medico, id_paciente, id_unidade, prioridade, numero_consultas, tempo_doenca, quadro_clinico, hipotese_diagnostico, cid_10, medicacao, tratamento_evolucao, motivo_encaminhamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id', [id_medico, id_paciente, id_unidade, prioridade, numero_consultas, tempo_doenca, quadro_clinico, hipotese_diagnostico, cid_10, medicacao, tratamento_evolucao, motivo_encaminhamento]);
    const id_guia = guia.rows[0].id;

    for (const id_exame of exames) {
      await pool.query('INSERT INTO guia_exame (id_guia, id_exame) VALUES ($1, $2)', [id_guia, id_exame]);
    }

    const resultado = await pool.query('COMMIT');
    
    res.status(201).json({ mensagem: 'Guia criada com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao criar guia', erro: erro.message });
  }
});

// Status Guia
router.put('/:id/status', autenticar, autorizar('unidade'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const resultado = await pool.query(`UPDATE guia SET status = $1 WHERE id = $2`, [status, id]);
    
    res.json({ mensagem: 'Status da Guia atualizada com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao atualizar status da guia', erro: erro.message });
  }
});

// Atualizar Guia
router.put('/:id', autenticar, autorizar('medico'), async (req, res) => {
  try {
    const { id } = req.params;
    const { prioridade, exames, numero_consultas, tempo_doenca, quadro_clinico, hipotese_diagnostico, cid_10, medicacao, tratamento_evolucao, motivo_encaminhamento } = req.body;
    await pool.query('BEGIN');
    await pool.query(`
      UPDATE guia SET 
        prioridade = $1,
        numero_consultas = $2,
        tempo_doenca = $3,
        quadro_clinico = $4,
        hipotese_diagnostico = $5,
        cid_10 = $6,
        medicacao = $7,
        tratamento_evolucao = $8,
        motivo_encaminhamento = $9
      WHERE id = $10
    `, [prioridade, numero_consultas, tempo_doenca, quadro_clinico, hipotese_diagnostico, cid_10, medicacao, tratamento_evolucao, motivo_encaminhamento, id]);
    await pool.query('DELETE FROM guia_exame WHERE id_guia = $1', [id]);
    for (const id_exame of exames) {
      await pool.query('INSERT INTO guia_exame (id_guia, id_exame) VALUES ($1, $2)', [id, id_exame]);
    }
    await pool.query('COMMIT');
    res.json({ mensagem: 'Guia atualizada com sucesso!' });
  } catch (erro) {
    await pool.query('ROLLBACK');
    res.status(500).json({ mensagem: 'Erro ao atualizar guia', erro: erro.message });
  }
});



module.exports = router;