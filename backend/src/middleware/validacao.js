const validar = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: error.details[0].message });
    }
    next();
  };
};

module.exports = validar;