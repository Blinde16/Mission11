import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Adding the Neccesary CartItems
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { title, bookId } = useParams();
  const [quantity] = useState<number>(1);
  const [subtotal] = useState<number>(0);
  const [total] = useState<number>(0);
  const [price] = useState<number>(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `Categories=${encodeURIComponent(cat)}`)
        .join('&');
      const response = await fetch(
        `https://localhost:4000/api/book/Allbooks?pageSize=${pageSize}&pageNumber=${pageNumber}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNumber, sortOrder, selectedCategories]);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No Book Found',
      price: price,
      quantity: quantity,
      subtotal: subtotal,
      total: total,
    };
    addToCart(newItem);
    {
      books.map((b) => navigate(`/cart/${b.title}/${b.bookId}`));
    }
  };
  return (
    <>
      <h1>Amazon Book List</h1>
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>

      <br />
      {books.map((b) => (
        <div id="projectCard" className="card" key={b.isbn}>
          <h3 className="card-title">{b.title}</h3>
          <ul className="card-body">
            <li>
              <strong>Author:</strong> {b.author}
            </li>
            <li>
              <strong>Publisher:</strong> {b.publisher}
            </li>
            <li>
              <strong>ISBN:</strong> {b.isbn}
            </li>
            <li>
              <strong>Classification:</strong> {b.classification}
            </li>
            <li>
              <strong>Category:</strong> {b.category}
            </li>
            <li>
              <strong>Page Count:</strong> {b.pageCount}
            </li>
            <li>
              <strong>Price:</strong> {b.price}
            </li>
          </ul>

          <button className="btn btn-success" onClick={handleAddToCart}>
            Add To Cart
          </button>
        </div>
      ))}

      <button
        disabled={pageNumber === 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNumber(index + 1)}
          disabled={pageNumber === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNumber >= totalPages}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Page Size:{' '}
        <select
          value={pageSize}
          onChange={(e) => (
            setPageSize(Number(e.target.value)), setPageNumber(1)
          )}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>

      {/* Remove bullets from list items */}
      <style>
        {`
          .card-body {
            list-style-type: none;
            padding: 0;
          }
        `}
      </style>
    </>
  );
}

export default BookList;
