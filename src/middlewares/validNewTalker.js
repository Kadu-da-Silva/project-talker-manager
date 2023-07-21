const validName = (req, res, next) => {
  const { name } = req.body;
  if (!name) res.status(400).json({ message: 'O campo "name" é obrigatório'})

  if (name.length >= 3) return next();
  
  res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
};

const validAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) res.status(400).json({ message: 'O campo "age" é obrigatório'})

  if (typeof age === 'number' && age >= 18 && Number.isInteger(age)) return next();
  
  res.status(400).json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
};

const validTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  // A chave watchedAt e rate é obrigatória.
  if (!('watchedAt' in talk)) res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });	
  if (!('rate' in talk)) res.status(400).json({ message: 'O campo "rate" é obrigatório' });

  // A chave watchedAt deve ser uma data no formato dd/mm/aaaa.
  const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const watchedAtValid = dateRegex.test(talk.watchedAt)
  if (!watchedAtValid) res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });

  // A chave rate deve ser um inteiro entre 1 e 5.
  if (!Number.isInteger(talk.rate) || talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  next();
};

module.exports = {
  validAge,
  validName,
  validTalk,
}