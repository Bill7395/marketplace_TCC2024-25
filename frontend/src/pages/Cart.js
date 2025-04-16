// src/pages/Cart.js
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems } = useCart();

  return (
    <div>
      <h2>Seu Carrinho</h2>
      {cartItems.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.name} width={50} />
              <strong> {item.name} </strong> - R${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
