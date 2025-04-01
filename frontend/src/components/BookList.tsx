import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { fetchBooks } from '../api/booksAPI';
import Pagination from './pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Adding the Neccesary CartItems
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNumber,
          sortOrder,
          selectedCategories,
        );
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumberbooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNumber, sortOrder, selectedCategories]);

  if (loading) return <p>Loadings Books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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
      <Pagination
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
      />
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
