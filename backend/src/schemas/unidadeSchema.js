const Joi = require('joi');

const criarUnidadeSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  telefone: Joi.string().max(20),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('unidade').required(),
  rua: Joi.string().max(100).required(),
  numero: Joi.string().max(10).required(),
  bairro: Joi.string().max(50).required(),
  cidade: Joi.string().max(50).required(),
  estado: Joi.string().length(2).required(),
  cep: Joi.string().length(8).required()
});

const atualizarUnidadeSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  telefone: Joi.string().max(20),
  email: Joi.string().email(),
  senha: Joi.string().min(6),
  tipo: Joi.string().valid('unidade'),
  rua: Joi.string().max(100),
  numero: Joi.string().max(10),
  bairro: Joi.string().max(50),
  cidade: Joi.string().max(50),
  estado: Joi.string().length(2),
  cep: Joi.string().length(8)
});

module.exports = { criarUnidadeSchema, atualizarUnidadeSchema };