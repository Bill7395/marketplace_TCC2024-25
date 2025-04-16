import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Vender() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Você precisa estar logado para vender um produto.');
            navigate('/login');
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/products/add', {
                name,
                description,
                price,
                image
            }, {
                headers: { Authorization: token }
            });
            alert('Produto cadastrado com sucesso!');
            navigate('/profile');
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert('Erro ao cadastrar produto');
        }
    };

    return (
        <div>
            <h2>Vender Produto</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome do produto" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                <input type="number" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="text" placeholder="URL da Imagem" value={image} onChange={(e) => setImage(e.target.value)} required />
                <button type="submit">Publicar</button>
            </form>
        </div>
    );
}

export default Vender;
