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
    console.log('Server running on http://10.10.21.212:3000');
});

// 获取所有商品
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取单个商品详情
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM products WHERE id=?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: '商品不存在' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== 购物车接口 =====

// 查询用户购物车
app.get('/api/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.execute(
            `SELECT c.id, c.product_id, c.quantity, p.name, p.price
             FROM carts c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 添加到购物车
app.post('/api/cart', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        await pool.execute(
            'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [user_id, product_id, quantity]
        );
        res.json({ message: '添加成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 修改购物车数量
app.put('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        await pool.execute(
            'UPDATE carts SET quantity=? WHERE id=?',
            [quantity, id]
        );
        res.json({ message: '更新成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 删除购物车商品
app.delete('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute(
            'DELETE FROM carts WHERE id=?',
            [id]
        );
        res.json({ message: '删除成功' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ===== 订单接口 =====

// 创建订单（从购物车生成）
app.post('/api/orders', async (req, res) => {
    const { user_id } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [cart] = await conn.execute(
            `SELECT c.product_id, c.quantity, p.price
             FROM carts c JOIN products p ON c.product_id=p.id
             WHERE c.user_id=?`, [user_id]
        );
        if (cart.length === 0) {
            await conn.rollback();
            return res.status(400).json({ error: '购物车为空' });
        }

        const total = cart.reduce((s,i)=>s+i.price*i.quantity,0);
        const [orderRes] = await conn.execute(
            'INSERT INTO orders (user_id, total_price) VALUES (?,?)',
            [user_id, total]
        );
        const orderId = orderRes.insertId;

        for (const i of cart) {
            await conn.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
                [orderId, i.product_id, i.quantity, i.price]
            );
        }

        await conn.execute('DELETE FROM carts WHERE user_id=?', [user_id]);
        await conn.commit();
        res.json({ message: '下单成功', order_id: orderId });
    } catch (e) {
        await conn.rollback();
        res.status(500).json({ error: e.message });
    } finally {
        conn.release();
    }
});

// 查询用户订单
app.get('/api/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',
            [userId]
        );
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 修改订单状态
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.execute(
            'UPDATE orders SET status=? WHERE id=?',
            [status, id]
        );
        res.json({ message: '状态更新成功' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
