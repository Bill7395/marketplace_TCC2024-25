const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const SECRET_KEY = 'seuSegredoSuperSeguro';

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplaceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Model do Usuário
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Middleware de autenticação JWT
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
};

// Rotas de autenticação
app.post('/register', async (req, res) => {
    const { username, password, email, telefone } = req.body;

    // Verifica se todos os campos foram preenchidos
    if (!username || !password || !email || !telefone)
        return res.status(400).json({ message: 'Preencha todos os campos' });

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser)
        return res.status(400).json({ message: 'Usuário já existe' });

    // Criptografando a senha de forma assíncrona
    const hashedPassword = await bcrypt.hash(password, 10);  // Mudança para versão assíncrona
    const newUser = new User({ username, password: hashedPassword, email, telefone });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password))
        return res.status(401).json({ message: 'Credenciais inválidas' });

    // Gera um token de autenticação
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Acesso autorizado', user: req.user });
});

// Rotas de produtos
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes(authMiddleware)); // ✅ Middleware incluído

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
