const Joi = require('joi');

const criarGuiaSchema = Joi.object({
  id_medico: Joi.number().required(),
  id_paciente: Joi.number().required(),
  id_unidade: Joi.number().required(),
  prioridade: Joi.number().required(),
  exames: Joi.array().items(Joi.number()).min(1).required(),
  numero_consultas: Joi.number().required(),
  tempo_doenca: Joi.string().max(200).required(),
  quadro_clinico: Joi.string().max(200).required(),
  hipotese_diagnostico: Joi.string().max(200).required(),
  cid_10: Joi.string().max(10).required(),
  medicacao: Joi.string().max(200).required(),
  tratamento_evolucao: Joi.string().max(200).required(),
  motivo_encaminhamento: Joi.string().max(200).required()
});

const atualizarGuiaSchema = Joi.object({
  prioridade: Joi.number(),
  exames: Joi.array().items(Joi.number()).min(1),
  numero_consultas: Joi.number(),
  tempo_doenca: Joi.string().max(200),
  quadro_clinico: Joi.string().max(200),
  hipotese_diagnostico: Joi.string().max(200),
  cid_10: Joi.string().max(10),
  medicacao: Joi.string().max(200),
  tratamento_evolucao: Joi.string().max(200),
  motivo_encaminhamento: Joi.string().max(200)
});

const statusGuiaSchema = Joi.object({
  status: Joi.string().valid('pendente', 'em_analise', 'aprovado', 'negado').required()
});

module.exports = { criarGuiaSchema, atualizarGuiaSchema, statusGuiaSchema };