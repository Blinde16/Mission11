import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, total } = useCart();

  console.log('Cart Contents:', cart); // Debugging log

  return (
    <>
      <div>
        <h2>Your Cart:</h2>
        <div>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            //------------------BOOSTRAP Stylized Formatting for Bulleted List HERE #1 ------------------
            <ul className="list-group">
              {cart.map((item: CartItem) => (
                <li
                  key={item.bookId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.title}</strong>
                    <br />
                    <span>Price: ${item.price.toFixed(2)}</span>
                    <br />
                    <span>Qty: {item.quantity}</span>
                    <br />
                    <span>
                      Sub-Total: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h4>Total: ${total.toFixed(2)}</h4>
        <button>Checkout:</button>
        <button onClick={() => navigate('/BooksPage')}>
          Continue Shopping:
        </button>
      </div>
    </>
  );
}
export default CartPage;
