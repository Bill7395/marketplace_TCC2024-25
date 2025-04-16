// src/pages/Products.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho.');
      navigate('/login');
    } else {
      addToCart(product);
      alert('Produto adicionado ao carrinho!');
    }
  };

  return (
    <div>
      <h2>Produtos</h2>
      <div className="product-list">
        {products.length === 0 ? (
          <p>Carregando produtos...</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>R${product.price.toFixed(2)}</p>
              <button onClick={() => handleAddToCart(product)}>Adicionar ao Carrinho</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
