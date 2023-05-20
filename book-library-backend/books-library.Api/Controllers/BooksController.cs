using System.Numerics;
using books_library.Data;
using books_library.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Cors;
using static System.Reflection.Metadata.BlobBuilder;
using static System.Runtime.InteropServices.JavaScript.JSType;
using books_library.Api.Wrappers;

namespace books_library.Api.Controllers;

[EnableCors("Policy")]
[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly ILogger<BooksController> _logger;
    private readonly BooksLibraryContext _context;

    public BooksController(ILogger<BooksController> logger, BooksLibraryContext context)
    {
        _logger = logger;
        _context = context;
    }


    [HttpGet("GetBooks")]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        try
        {
            List<Book> books = _context.Books.Take(1000).ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            return Ok(new Response<List<Book>>(books));
        }
        catch (Exception e)
        {
            return NotFound(e);
        }
    }


    [HttpGet("GetAllBooks")]
    public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks([FromQuery] PaginationFilter filter)
    {
        try
        {
            var validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            List<Book> pagedBooks = _context.Books
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();
            int totalBookCount = _context.Books.Count();

            if (pagedBooks == null) throw new Exception("Couldn't get paged books");
            if (totalBookCount == 0) throw new Exception("Couldn't get books");

            return Ok(new PagedResponse<List<Book>>(pagedBooks, validFilter.PageNumber, validFilter.PageSize));
        }
        catch(Exception e)
        {
            return NotFound(e.Message);
        } 
    }


    [HttpGet("GetLibraries")]
    public async Task<ActionResult<IEnumerable<Library>>> GetLibraries()
    {
        try
        {
            List<Library> libraries = _context.Libraries.ToList();
            if (libraries == null) throw new Exception("Couldn't get all libraries");

            return Ok(new Response<List<Library>>(libraries));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpGet("GetBooksByLibrary/{id}")]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooksByLibary(string id, [FromQuery] PaginationFilter filter)
    {
        try
        {
            int libraryId;
            if (!int.TryParse(id, out libraryId)) throw new Exception("Not a valid id");

            //var validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            List<Book> books = _context.Books.Take(1000).ToList();
            List<Book> pagedBooks = books
                .FindAll(book => book.libraryId == libraryId);
            //    .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
            //    .Take(validFilter.PageSize)
            //    .ToList();
            //int totalBookCount = _context.Books.Count();

            if (books == null) throw new Exception("Couldn't get all books");
            if (pagedBooks == null) throw new Exception("Couldn't get paged books");
            //if (totalBookCount == 0) throw new Exception("Couldn't get books");

            //return Ok(new PagedResponse<List<Book>>(pagedBooks, validFilter.PageNumber, validFilter.PageSize));
            return Ok(new Response<List<Book>>(pagedBooks));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpGet("GetBookById/{id}")]
    public async Task<IActionResult> GetBookById(string id) 
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id)) throw new Exception("Not a valid id");

            List<Book> books = _context.Books.Take(1000).ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            Book? foundBook = books.Find(book => book.isbn == id);
            if (foundBook == null) throw new Exception("Book not found");

            return Ok(new Response<Book>(foundBook));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPost("AddBook")]
    public async Task<ActionResult<Book>> AddBook()
    {
        try
        {
            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");

            Book? book = JsonConvert.DeserializeObject<Book>(body);
            if (book == null) throw new Exception("Book added data is empty");

            List<Book> books = _context.Books.Take(1000).ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            books.Add(book);
            _context.SaveChanges();

            return Ok(new Response<Book>(book));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("EditBook")]
    public async Task<IActionResult> EditBook()
    {
        try
        {
            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");

            Book? book = JsonConvert.DeserializeObject<Book>(body);
            if (book == null) throw new Exception("Book edited data is empty");

            List<Book> books = _context.Books.Take(1000).ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            Book? editedBook = books.Find(b => b.isbn == book.isbn);
            if (editedBook == null) throw new Exception("Book not found");

            editedBook.title = book.title;
            editedBook.year = book.year;
            editedBook.publisher = book.publisher;
            editedBook.image_url = book.image_url;
            editedBook.libraryId = book.libraryId;
            editedBook.authorId = book.authorId;

            _context.SaveChanges();
                    
            return Ok(new Response<Book>(editedBook));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpDelete("DeleteBook/{id}")]
    public async Task<ActionResult<Book>> DeleteBook(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id)) throw new Exception("Not a valid id");

            List<Book> books = _context.Books.Take(1000).ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            Book? foundBook = books.Find(book => book.isbn == id);
            if (foundBook == null) throw new Exception("Book not found");

            books.Remove(foundBook);
            _context.SaveChanges();

            return Ok(new Response<Book>(foundBook));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}
