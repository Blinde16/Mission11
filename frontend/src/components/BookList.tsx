import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
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

  const handleAddToCart = (book: Book) => {
    const newItem: CartItem = {
      bookId: book.bookId,
      title: book.title || 'No Book Found',
      price: book.price,
      quantity: 1,
    };
    addToCart(newItem);
    {
      books.map((b) => navigate(`/cart/${b.title}/${b.bookId}`));
    }
  };

  const cardColors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ];
  return (
    <>
      <h1>Amazon Book List</h1>
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <br />

      {books.map((b, index) => (
        // BOOSTRAP EXTRA #2 Card-Colors
        // Using a randomized index to assign card colors to different cards for the project.
        <div
          id="projectCard"
          className={`card text-white bg-${cardColors[index % cardColors.length]} mb-3`}
          key={b.isbn}
        >
          <div className="card-header">{b.title}</div>
          <div className="card-body">
            <h5 className="card-title">{b.author}</h5>
            <ul className="list-unstyled">
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
                <strong>Price:</strong> ${b.price.toFixed(2)}
              </li>
            </ul>
            <button
              className="btn btn-light"
              onClick={() => handleAddToCart(b)}
            >
              Add To Cart
            </button>
          </div>
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
