const readFile = require('../utils/readFile');

const validId = (req, res, next) => {
  const talkers = readFile();
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  next();
};

module.exports = validId;