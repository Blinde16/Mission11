import { useEffect, useState } from 'react';
import { Book } from '../types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `https://localhost:4000/api/book/Allbooks?pageSize=${pageSize}&pageNumber=${pageNumber}&sortOrder=${sortOrder}`,
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNumber, sortOrder]);

  return (
    <>
      <h1>Amazon Book List</h1>
      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sort by Project Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        )
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
