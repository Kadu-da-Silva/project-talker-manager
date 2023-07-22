const readFile = require('../utils/readFile');

const validRate = (rate) => {
  const rateNumber = Number(rate);

  if (typeof rateNumber !== 'number') return true;
  if (!Number.isInteger(rateNumber)) return true;
  if (rateNumber < 1) return true;
  if (rateNumber > 5) return true; 

  return false;
};

const validRateTerm = (req, res, next) => {
  const { rate } = req.query;

  if (rate === undefined) {
    next();
  }

  if (validRate(rate)) {
    return res.status(400).json({ 
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }

  next();
};

const validDateTerm = (req, res, next) => {
  const talkers = readFile();
  const watchedAt = req.query.date;

  if (watchedAt === undefined) {
    next();
  }
  if (watchedAt === '') {
    return res.status(200).json(talkers);
  }

  const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const watchedAtValid = dateRegex.test(watchedAt);
  if (!watchedAtValid) {
    return res.status(400).json({
      message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const validSearchTerm = (req, res, next) => {
  const talkers = readFile();
  const searchTerm = req.query.q;
  const { rate } = req.query;
  const watchedAt = req.query.date;

  if (searchTerm === undefined && rate === undefined && watchedAt === undefined) {
    return res.status(200).json([]);
  }

  if (searchTerm === '') {
    return res.status(200).json(talkers);
  }

  next();
};

module.exports = {
  validSearchTerm,
  validRateTerm,
  validDateTerm,
};