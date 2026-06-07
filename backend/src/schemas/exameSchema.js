const Joi = require('joi');

const criarExameSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  descricao: Joi.string().max(200).required()
});

const atualizarExameSchema = Joi.object({
  nome: Joi.string().min(3).max(50),
  descricao: Joi.string().max(200)
});

module.exports = { criarExameSchema, atualizarExameSchema };