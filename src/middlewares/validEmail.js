const validEmail = (req, res, next) => {
  const { email } = req.body;
  // Se o campo não estiver preenchido responde mensagem de erro
  if (!email) res.status(400).json({ message: 'O campo "email" é obrigatório' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email);
  
  // Se o campo email estiver preenchido corretamente
  if (emailValid) return next();
  
  res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
};

module.exports = validEmail;