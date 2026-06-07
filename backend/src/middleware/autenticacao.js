const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
};

const autorizar = (...tipos) => {
  return (req, res, next) => {
    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    next();
  };
};

module.exports = { autenticar, autorizar };