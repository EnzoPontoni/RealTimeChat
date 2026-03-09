const jwt = require('jsonwebtoken');

// Middleware para verificar JWT em rotas protegidas
const authMiddleware = (req, res, next) => {
  try {
    // Buscar token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token não fornecido' 
      });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Formato de token inválido' 
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Token mal formatado' 
      });
    }

    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ 
          error: 'Token inválido ou expirado' 
        });
      }

      // Adicionar dados do usuário à requisição
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(401).json({ 
      error: 'Falha na autenticação' 
    });
  }
};

module.exports = authMiddleware;
