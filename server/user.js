const crypto = require('crypto');
const users = [];

function encodePassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createUser(email, password) {
  if (users.find(u => u.email === email)) return { error: 'Користувач уже існує' };
  const user = {
    email,
    password: encodePassword(password),
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  };
  users.push(user);
  return user;
}

function findUser(email) {
  return users.find(u => u.email === email);
}

function validateUser(email, password) {
  const user = users.find(u => u.email === email && u.password === encodePassword(password));
  return user || null;
}

module.exports = { createUser, findUser, validateUser };