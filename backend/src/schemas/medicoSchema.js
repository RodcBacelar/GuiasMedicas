const Joi = require('joi');

const criarMedicoSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  telefone: Joi.string().max(20),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('medico').required(),
  nascimento: Joi.date().required(),
  sexo: Joi.string().valid('masculino', 'feminino', 'outro').required(),
  residencia: Joi.string().max(100).required(),
  especialidade: Joi.string().max(50).required(),
  cargo: Joi.string().max(50).required()
});

const atualizarMedicoSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  telefone: Joi.string().max(20),
  email: Joi.string().email(),
  senha: Joi.string().min(6),
  tipo: Joi.string().valid('medico'),
  nascimento: Joi.date(),
  sexo: Joi.string().valid('masculino', 'feminino', 'outro'),
  residencia: Joi.string().max(100),
  especialidade: Joi.string().max(50),
  cargo: Joi.string().max(50)
});

module.exports = { criarMedicoSchema, atualizarMedicoSchema };