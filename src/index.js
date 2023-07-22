const express = require('express');

const app = express();
app.use(express.json());

const crypto = require('crypto');
const validId = require('./middlewares/validId');
const validToken = require('./middlewares/validToken');
const validEmail = require('./middlewares/validEmail');
const validPassword = require('./middlewares/validPassword');
const {
  validAge,
  validName,
  validTalk,
  validWatchedAt,
  validRate,
} = require('./middlewares/validNewTalker');
const { validSearchTerm, validRateTerm, validDateTerm } = require('./middlewares/validSearchTerm');

const readFile = require('./utils/readFile');
const saveDataToFile = require('./utils/saveDataToFile');

// Servidor

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// 1 - Crie o endpoint GET /talker

app.get('/talker', (req, res) => {
  const talkers = readFile();
  res.status(200).json(talkers);
});

// 8 - Crie o endpoint GET /talker/search e o parâmetro de consulta q=searchTerm
// 9 - Crie no endpoint GET /talker/search o parâmetro de consulta rate=rateNumber

app.get('/talker/search', validToken, validSearchTerm, validRateTerm, validDateTerm, (req, res) => {
  const talkers = readFile();
  const searchTerm = req.query.q;
  const rateNumber = Number(req.query.rate);
  const watchedAt = req.query.date;

  let filteredTalkers = talkers;
  if (searchTerm) {
    filteredTalkers = filteredTalkers.filter((talker) => talker.name.includes(searchTerm));
  }
  if (rateNumber) {
    filteredTalkers = filteredTalkers.filter((talker) => talker.talk.rate === rateNumber);
  }
  if (watchedAt) {
    filteredTalkers = filteredTalkers.filter((talker) => talker.talk.watchedAt === watchedAt);
  }

  res.status(200).json(filteredTalkers);
});

// 2 - Crie o endpoint GET /talker/:id

app.get('/talker/:id', validId, (req, res) => {
  const talkers = readFile();
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  if (talker) {
    return res.status(200).json(talker);
  }
});

// 3 - Crie o endpoint POST /login
// 4 - Adicione as validações para o endpoint /login

// Função para gerar um token aleatório
function generateRandomToken(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Converte para hexadecimal
    .slice(0, length); // Limita ao tamanho desejado
}

app.post('/login', validEmail, validPassword, (req, res) => {
  const token = generateRandomToken(16);
  res.status(200).json({ token: `${token}` });
});

// 5 - Crie o endpoint POST /talker

app.post('/talker',
validToken,
validName,
validAge,
validTalk,
validWatchedAt,
validRate,
(req, res) => {
  const talkers = readFile();
  const { name, age, talk } = req.body;
  // Encontrar o maior ID atual na lista de talkers
  const lastId = talkers.reduce((maxId, talker) => Math.max(maxId, talker.id), 0);
  const newTalker = {
    id: lastId + 1,
    name,
    age,
    talk: {
      watchedAt: talk.watchedAt,
      rate: talk.rate,
    },
  };
  talkers.push(newTalker);
  // Salvar os dados atualizados no arquivo JSON
  saveDataToFile(talkers);
  // Retornar somente as informações do novo palestrante
  res.status(201).json(newTalker);
});

// 6 - Crie o endpoint PUT /talker/:id

app.put('/talker/:id',
validToken,
validName,
validAge,
validTalk,
validWatchedAt,
validRate,
validId,
(req, res) => {
  const talkers = readFile();
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  const indexArray = talkers.indexOf(talker);
  const updatedTalk = { id: Number(id), ...req.body };
  talkers.splice(indexArray, 1, updatedTalk);

  // Salvar os dados atualizados no arquivo JSON
  saveDataToFile(talkers);

  res.status(200).json(updatedTalk);
});

// 7 - Crie o endpoint DELETE /talker/:id
app.delete('/talker/:id', validToken, (req, res) => {
  const talkers = readFile();
  const { id } = req.params;

  // Remover o palestrante do array usando o filter()
  const updateTalkers = talkers.filter((t) => t.id !== Number(id));

  // Salvar os dados atualizados no arquivo JSON
  saveDataToFile(updateTalkers);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
