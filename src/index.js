const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const crypto = require('crypto');
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

const talkersPath = path.resolve(__dirname, './talker.json');

const saveDataToFile = (data) => {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(talkersPath, jsonData);
};

const readFile = () => {
  try {
    const jsonData = fs.readFileSync(talkersPath);
    return JSON.parse(jsonData);
  } catch (error) {
    return [];
  }
};

const talkers = readFile();
// const talkers = require('./talker.json');

// 1 - Crie o endpoint GET /talker

app.get('/talker', (req, res) => {
  res.status(200).json(talkers);
});

// 2 - Crie o endpoint GET /talker/:id

const validId = (req, res, next) => {
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  if (talker) {
    return next();
  }
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
};

app.get('/talker/:id', validId, (req, res) => {
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
  // Adicionar o novo palestrante ao array de talkers
  talkers.push(newTalker);
  // Salvar os dados atualizados no arquivo JSON
  saveDataToFile(talkers);
  // Retornar somente as informações do novo palestrante
  res.status(201).json(newTalker);
});

// 6 - Crie o endpoint PUT /talker/:id

app.put('/talker/:id',
validToken,
validId,
validName,
validAge,
validTalk,
validWatchedAt,
validRate,
(req, res) => {
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === id);
  const indexArray = talkers.indexOf(talker);
  const updatedTalk = { id, ...req.body };
  talkers.splice(indexArray, 1, updatedTalk);

  // Salvar os dados atualizados no arquivo JSON
  saveDataToFile(talkers);

  res.status(200).json(updatedTalk);
});

// Servidor

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
