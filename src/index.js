const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const talkers = require('./talker.json');

app.get('/talker', (req, res) => {
  res.status(200).json(talkers);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const talker = talkers.find((t) => t.id === Number(id));
  if (talker) {
    res.status(200).json(talker);
  } else {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

// Função para gerar um token aleatório
function generateRandomToken(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Converte para hexadecimal
    .slice(0, length); // Limita ao tamanho desejado
}

// Simulação de um usuário registrado
// const registeredUser = {
//   email: 'email@email.com',
//   password: '123456',
// };

app.post('/login', (req, res) => {
  const token = generateRandomToken(16);
  res.status(200).json({ token: `${token}` });

  // const { email, password } = req.body;

  // if (email && email === registeredUser.email && password === registeredUser.password) {
  //   const token = generateRandomToken(16);
  //   res.status(200).json({ token: `${token}` });
  // } else {
  //   res.status(401).json({ error: 'Login failed' });
  // }
});

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
