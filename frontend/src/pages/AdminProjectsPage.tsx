import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../api/booksAPI';
import Pagination from '../components/pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminProjectsPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(pageSize, pageNumber, sortOrder, []);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumberBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNumber]);

  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?',
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(bookId);
      setBooks(books.filter((p) => p.bookId !== bookId));
    } catch (error) {
      alert('failed to delete book. Please try again. ');
    }
  };

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red 500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Books</h1>
      {!showForm} && (
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(true)}
      >
        Add Project
      </button>
      )
      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNumber, sortOrder, []).then((data) =>
              setBooks(data.books),
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNumber, sortOrder, []).then((data) =>
              setBooks(data.books),
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Regional Program</th>
            <th>Impact</th>
            <th>Phase</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((p) => (
            <tr key={p.bookId}>
              <td>{p.bookId}</td>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>{p.publisher}</td>
              <td>{p.isbn}</td>
              <td>{p.classification}</td>
              <td>{p.category}</td>
              <td>{p.pageCount}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(p.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default AdminProjectsPage;
