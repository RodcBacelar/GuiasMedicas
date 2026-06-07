const Joi = require('joi');

const criarUsuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  telefone: Joi.string().max(20),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('medico', 'paciente', 'unidade').required()
});

const atualizarUsuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  telefone: Joi.string().max(20),
  email: Joi.string().email(),
  senha: Joi.string().min(6),
  tipo: Joi.string().valid('medico', 'paciente', 'unidade')
});

module.exports = { criarUsuarioSchema, atualizarUsuarioSchema };