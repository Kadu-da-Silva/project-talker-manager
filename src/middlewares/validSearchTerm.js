const readFile = require('../utils/readFile');

const validRate = (rate) => {
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) return true;

  return false;
};

const validSearchTerm = (req, res, next) => {
  const talkers = readFile();
  const searchTerm = req.query.q;
  const rateNumber = Number(req.query.rate);

  if (searchTerm === undefined && rateNumber === undefined) {
    return res.status(200).json([]);
  }

  if (searchTerm === '') {
    return res.status(200).json(talkers);
  }

  if (rateNumber && validRate(rateNumber)) {
    return res.status(400).json({ 
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

module.exports = validSearchTerm;