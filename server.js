const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];

function encodePassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(email) {
    const timestamp = Date.now().toString();
    return crypto.createHash('sha256').update(email + timestamp).digest('hex');
}

app.post('/sign-up', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email та пароль обов\'язкові' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Пароль повинен містити мінімум 8 символів' });
        }

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = encodePassword(password);
        users.push({ email, password: hashedPassword });

        res.status(201).json({ message: 'Реєстрація успішна!' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

app.post('/sign-in', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email та пароль обов\'язкові' });
        }

        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Користувача не знайдено' });
        }

        const hashedPassword = encodePassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }

        const token = generateToken(email);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});