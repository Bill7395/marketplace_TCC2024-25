const express = require('express');
const Product = require('../models/Product');

module.exports = (authMiddleware) => {
    const router = express.Router();

    // Rota protegida para adicionar produto
    router.post('/add', authMiddleware, async (req, res) => {
        try {
            const { name, description, price, image } = req.body;
            if (!name || !description || !price || !image)
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

            const newProduct = new Product({ name, description, price, image });
            await newProduct.save();

            res.status(201).json({ message: 'Produto cadastrado com sucesso!', product: newProduct });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar produto', error });
        }
    });

    // Listar todos os produtos
    router.get('/', async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar produtos', error });
        }
    });

    return router;
};
