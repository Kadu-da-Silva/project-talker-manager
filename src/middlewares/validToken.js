const validToken = (req, res, next) => {
  const token = req.headers.authorization;

  // Verifica se o token está presente nos headers da requisição
  if (!token) {
    return res.status(401).json({ message: "Token não encontrado" });
  }

  // Verifica se o token tem o formato correto (exatamente 16 caracteres)
  if (typeof token !== "string" || token.length !== 16) {
    return res.status(401).json({ message: "Token inválido" });
  }

  // Se o token estiver presente e com o formato correto, prossegue para a próxima função de middleware ou rota
  next();
};

module.exports = validToken;