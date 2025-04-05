using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using Mission11.Data;

namespace Mission11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookContext _bookContext;

        public BookController(BookContext temp)
        {
            _bookContext = temp;
        }
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNumber = 1, string sortOrder = "asc", [FromQuery] List<string>? categories = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (categories != null && categories.Any())
            {
                query = query.Where(b => categories.Contains(b.Category)).Distinct();
            }


            IQueryable<Book> booksQuery = _bookContext.Books;

            // Ensure sorting works explicitly
            booksQuery = sortOrder.ToLower() == "asc"
                ? booksQuery.OrderBy(b => b.Title)
                : booksQuery.OrderByDescending(b => b.Title);

            var books = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumberBooks = query.Count();

            return Ok(new { books, totalNumberBooks });
        }
        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories ()
        {
            var bookCategories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("updateBook/{bookId}")]
        public IActionResult updateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            return Ok(existingBook);
        }
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new {message = "book not found"});
            }

            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            return NoContent();
        }
    }
}
