const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const SECRET_KEY = 'seuSegredoSuperSeguro';

// Configuração do MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplaceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Criar Schema e Model do Usuário
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

app.use(cors());
app.use(express.json());

// Rota de registro
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Rota protegida do perfil
app.get('/profile', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });

        res.json({ message: 'Acesso autorizado', user: decoded });
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

// Rota de produtos
app.get('/products', (req, res) => {
    // Mock de produtos
    const products = [
        {
            id: 1,
            name: 'Produto 1',
            description: 'Descrição do Produto 1',
            price: 99.99,
            image: 'https://via.placeholder.com/150' // Use uma imagem mockada ou um link real
        },
        {
            id: 2,
            name: 'Produto 2',
            description: 'Descrição do Produto 2',
            price: 149.99,
            image: 'https://via.placeholder.com/150'
        },
        {
            id: 3,
            name: 'Produto 3',
            description: 'Descrição do Produto 3',
            price: 79.99,
            image: 'https://via.placeholder.com/150'
        }
    ];

    res.json(products); // Retorna os produtos como resposta
});
