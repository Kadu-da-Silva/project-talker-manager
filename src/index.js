const express = require('express');
const app = express();
app.use(express.json());

const crypto = require('crypto');
const talkers = require('./talker.json');
// const validEmail = require('./middlewares/validEmail.json');

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

const validEmail = (req, res, next) => {
  const { email } = req.body;
  // Se o campo não estiver preenchido responde mensagem de erro
  if (!email) res.status(400).json({ message: 'O campo \"email\" é obrigatório' })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email);
  if (emailValid) {
    // Se o campo email estiver preenchido corretamente
    return next();
  } else {
    res.status(400).json({ message: 'O \"email\" deve ter o formato \"email@email.com\"' });
  }
};

const validPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) res.status(400).json({ message: 'O campo \"password\" é obrigatório'})

  if (password.length >= 6) {
    return next();
  } else {
    res.status(400).json({ message: 'O \"password\" deve ter pelo menos 6 caracteres'})
  }
};

app.post('/login', validEmail, validPassword, (req, res) => {
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
