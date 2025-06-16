const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(express.json());

const users = {};

app.post('/sign-up', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email і пароль обовʼязкові' });
  if (password.length < 8) return res.status(400).json({ message: 'Пароль повинен містити мінімум 8 символів' });
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Користувач уже існує' });

  const user = {
    email,
    password: encodePassword(password),
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  };
  users.push(user);
  return res.status(201).json({ message: 'Реєстрація успішна!' });

});

app.post('/register', (req, res) => {
  const userId = generateUserId();
  users[userId] = {
    id: userId,
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  };
  res.status(201).json({ userId, ...users[userId] });
});

app.post('/click', authMiddleware, (req, res) => {
  try {
    const user = req.user;
    user.balance += user.coinsPerClick;
    res.json({ 
      balance: user.balance,
      coinsPerClick: user.coinsPerClick 
    });
  } catch (error) {
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

app.post('/passive-income', authMiddleware, (req, res) => {
  try {
    const user = req.user;
    user.balance += user.passiveIncomePerSecond;
    res.json({ 
      balance: user.balance,
      passiveIncomePerSecond: user.passiveIncomePerSecond 
    });
  } catch (error) {
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
  }
});

app.get('/user', authMiddleware, (req, res) => {
  res.json(req.user);
});

app.post('/upgrade', authMiddleware, (req, res) => {
  const user = req.user;
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({ error: 'Вкажіть тип покращення' });
  }

  const upgradeCost = 10 * (user.coinsPerClick + user.passiveIncomePerSecond);

  if (user.balance < upgradeCost) {
    return res.status(409).json({ error: 'Недостатньо коштів' });
  }

  user.balance -= upgradeCost;

  if (type === 'click') {
    user.coinsPerClick += 1;
  } else if (type === 'passive') {
    user.passiveIncomePerSecond += 1;
  } else {
    return res.status(400).json({ error: 'Невідомий тип покращення' });
  }

  res.json({
    balance: user.balance,
    coinsPerClick: user.coinsPerClick,
    passiveIncomePerSecond: user.passiveIncomePerSecond
  });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});