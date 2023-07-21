const express = require('express');

const app = express();
app.use(express.json());

const crypto = require('crypto');
const talkers = require('./talker.json');
const validToken = require('./middlewares/validToken');
const validEmail = require('./middlewares/validEmail');
const validPassword = require('./middlewares/validPassword');
const { validAge, validName, validTalk } = require('./middlewares/validNewTalker');

// 1 - Crie o endpoint GET /talker

app.get('/talker', (req, res) => {
  res.status(200).json(talkers);
});

// 2 - Crie o endpoint GET /talker/:id

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  if (talker) {
    res.status(200).json(talker);
  } else {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
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

// Variável global para rastrear o último ID usado
let lastId = 0;

// 5 - Crie o endpoint POST /talker
app.post('/talker', validToken, validName, validAge, validTalk,  (req, res) => {
  const { name, age, talk } = req.body;

  // Incrementar o ID para o próximo palestrante
  lastId++;

  // Criar o novo palestrante com as informações fornecidas
  const newTalker = {
    id: lastId,
    name,
    age,
    talk: {
      watchedAt: talk.watchedAt,
      rate: talk.rate
    }
  };

  // Adicionar o novo palestrante ao array de talkers
  talkers.push(newTalker);

  // Retornar somente as informações do novo palestrante
  res.status(201).json(newTalker);
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
