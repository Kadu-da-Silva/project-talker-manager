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
  console.log(rate);

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

const validSearchTerm = (req, res, next) => {
  const talkers = readFile();
  const searchTerm = req.query.q;
  const { rate } = req.query;
  console.log(searchTerm);

  if (searchTerm === undefined && rate === undefined) {
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
};