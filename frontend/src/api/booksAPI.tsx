import { Book } from '../types/Book';

interface FetchBooksResponse {
  books: Book[];
  totalNumberBooks: number;
}

const API_URL = `https://localhost:4000/api/book`;

export const fetchBooks = async (
  pageSize: number,
  pageNumber: number,
  sortOrder: string,
  selectedCategories: string[],
): Promise<FetchBooksResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `Categories=${encodeURIComponent(cat)}`)
      .join('&');
    const response = await fetch(
      `${API_URL}/Allbooks?pageSize=${pageSize}&pageNumber=${pageNumber}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`,
    );

    if (!response.ok) {
      throw new Error('failed to fetch Books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Books', error);
    throw error;
  }
};

export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('failed to fetch Books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding Book', error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book,
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
      throw new Error('Failed to update Book');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating Book', error);
    throw error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};
