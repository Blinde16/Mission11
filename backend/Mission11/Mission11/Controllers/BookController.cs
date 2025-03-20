using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetBooks(int pageSize = 10, int pageNumber = 1, string sortOrder = "asc")
        {
            IQueryable<Book> booksQuery = _bookContext.Books;

            // Ensure sorting works explicitly
            booksQuery = sortOrder.ToLower() == "asc"
                ? booksQuery.OrderBy(b => b.Title)
                : booksQuery.OrderByDescending(b => b.Title);

            var books = booksQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _bookContext.Books.Count();

            return Ok(new { books, totalNumBooks });
        }

    }
}
