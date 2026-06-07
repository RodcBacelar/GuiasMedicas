const Joi = require('joi');

const criarPacienteSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  telefone: Joi.string().max(20),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('paciente').required(),
  nascimento: Joi.date().required(),
  sexo: Joi.string().valid('masculino', 'feminino', 'outro').required()
});

const atualizarPacienteSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  telefone: Joi.string().max(20),
  email: Joi.string().email(),
  senha: Joi.string().min(6),
  tipo: Joi.string().valid('paciente'),
  nascimento: Joi.date(),
  sexo: Joi.string().valid('masculino', 'feminino', 'outro')
});

module.exports = { criarPacienteSchema, atualizarPacienteSchema };