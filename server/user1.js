let user = {
  balance: 0,
  coinsPerClick: 1,
  passiveIncomePerSecond: 1
};

function getUser() {
  return user;
}

function click() {
  if (!user) return { error: 'User not found', code: 404 };
  user.balance += user.coinsPerClick;
  return { balance: user.balance };
}

function passiveIncome() {
  if (!user) return { error: 'User not found', code: 404 };
  user.balance += user.passiveIncomePerSecond;
  return { balance: user.balance };
}

module.exports = { getUser, click, passiveIncome };