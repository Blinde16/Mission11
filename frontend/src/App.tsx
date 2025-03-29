import './App.css';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import BooksPage from './pages/BooksPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/BooksPage" element={<BooksPage />} />
            <Route path="/BooksPage/:title/:bookId" element={<BooksPage />} />
            <Route path="/cart/:title/:bookId" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
