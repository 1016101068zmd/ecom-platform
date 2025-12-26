console.log('USING DB USER = appuser');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

const SECRET = 'mysecretkey';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'appuser',
    password: 'App123456!',
    database: 'ecommerce'
});


// 启动时测试
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log('数据库连接成功');
        conn.release();
    } catch (err) {
        console.error('数据库连接失败:', err);
    }
})();

// 注册
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        res.json({ message: '注册成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 登录
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username=? AND password=?',
            [username, password]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        const token = jwt.sign(
            { id: rows[0].id, username },
            SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: '登录成功', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
