const jwt = require('jsonwebtoken');
const config = require('../../config');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error("Erro: Token não fornecido no cabeçalho de autorização.");
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.error("Erro: Formato do token inválido. Formato esperado: 'Bearer <token>'.");
    return res.status(401).json({ error: 'Formato do token inválido.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.error("Erro: Esquema do token inválido. Esperado 'Bearer'.");
    return res.status(401).json({ error: 'Formato do token inválido.' });
  }

  // Verificar o token JWT
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error("Erro ao verificar o token: Token expirado. Erro em:", new Date());
        return res.status(401).json({ error: 'Token expirado.' });
      } else {
        console.error("Erro ao verificar o token:", err.message);
        return res.status(401).json({ error: 'Token inválido.' });
      }
    }
  
    req.user = decoded; // Anexa o usuário decodificado ao request
    next();
  });
  
}

module.exports = authMiddleware;
