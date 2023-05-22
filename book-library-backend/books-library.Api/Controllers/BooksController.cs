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
using Microsoft.EntityFrameworkCore;
using books_library.Api.Services;
using System.Linq;

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


    //[HttpGet("GetBooks")]
    //public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    //{
    //    try
    //    {
    //        List<Book> books = _context.Books.Take(1000).ToList();
    //        if (books == null) throw new Exception("Couldn't get all books");

    //        return Ok(new Response<List<Book>>(books));
    //    }
    //    catch (Exception e)
    //    {
    //        return NotFound(e);
    //    }
    //}


    //[HttpGet("GetAllBooks")]
    //public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks([FromQuery] PaginationFilter filter)
    //{
    //    try
    //    {
    //        List<Book> allBooks = _context.Books.ToList();
    //        if (allBooks == null) throw new Exception("Couldn't get books");

    //        return Ok(new Response<List<Book>>(allBooks));
    //    }
    //    catch (Exception e)
    //    {
    //        return NotFound(e.Message);
    //    }
    //}


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
    public async Task<ActionResult<IEnumerable<Book>>> GetBooksByLibary(string id)
    {
        try
        {
            string? pageNumber = Request.Query["pageNumber"];
            string? pageSize = Request.Query["pageSize"];

            if (
                string.IsNullOrWhiteSpace(pageNumber) ||
                string.IsNullOrWhiteSpace(pageSize) ||
                string.IsNullOrWhiteSpace(id)
            ) throw new Exception("Didn't get all parameters needed");


            int libraryId;
            if (!int.TryParse(id, out libraryId)) throw new Exception("Not a valid id");

            int pNumber, pSize;
            if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


            var validFilter = new PaginationFilter(pNumber, pSize);

            //List<Book> books = _context.Books.Where(b => b.libraryId == libraryId).Include(book => book.Author).ToList();
            List<Book> books = _context.Books.ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            List<Book> pagedData = books
                .FindAll(book => book.libraryId == libraryId)
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = _context.Books.Where(book => book.libraryId == libraryId).Count();
            int totalPages = (int) Math.Ceiling((double) totalRecords / pSize);


            return Ok(new PagedResponse<List<Book>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpGet("GetBookById/{id}")]
    public async Task<ActionResult<Book>> GetBookById(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id)) throw new Exception("Not a valid id");

            List<Book> foundBook = _context.Books.ToList().FindAll(book => book.isbn.ToLower() == id.ToLower());
            if (foundBook == null) throw new Exception("Book not found");

            return Ok(new Response<List<Book>>(foundBook));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpGet("GetBooksByTitle/{title}")]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooksByTitle(string title)
    {
        try
        {
            string? pageNumber = Request.Query["pageNumber"];
            string? pageSize = Request.Query["pageSize"];

            if (
                string.IsNullOrWhiteSpace(pageNumber) ||
                string.IsNullOrWhiteSpace(pageSize) ||
                string.IsNullOrWhiteSpace(title)
            ) throw new Exception("Didn't get all parameters needed");


            int pNumber, pSize;
            if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<Book> books = _context.Books.ToList();
            if (books == null) throw new Exception("Couldn't get all books");

            List<Book> pagedData = books
                .FindAll(book => book.title.ToLower().Contains(title.ToLower()))
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = _context.Books.Where(book => book.title.ToLower().Contains(title.ToLower())).Count();
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<Book>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    //[HttpGet("GetBooksByAuthor/{author}")]
    //public async Task<ActionResult<IEnumerable<Book>>> GetBooksByAuthor(string author)
    //{
    //    try
    //    {
    //        string? pageNumber = Request.Query["pageNumber"];
    //        string? pageSize = Request.Query["pageSize"];

    //        if (
    //            string.IsNullOrWhiteSpace(pageNumber) ||
    //            string.IsNullOrWhiteSpace(pageSize) ||
    //            string.IsNullOrWhiteSpace(author)
    //        ) throw new Exception("Didn't get all parameters needed");


    //        int pNumber, pSize;
    //        if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


    //        var validFilter = new PaginationFilter(pNumber, pSize);

    //        List<Book> books = _context.Books.ToList();
    //        if (books == null) throw new Exception("Couldn't get all books");

    //        List<Book> pagedData = books
    //            .FindAll(book => book.Author.ToLower().Contains(author.ToLower()))
    //            .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
    //            .Take(validFilter.PageSize)
    //            .ToList();

    //        int totalRecords = _context.Books.Where(book => book.title.ToLower().Contains(author.ToLower())).Count();
    //        int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


    //        return Ok(new PagedResponse<List<Book>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
    //    }
    //    catch (Exception e)
    //    {
    //        return NotFound(e.Message);
    //    }
    //}


    [HttpPost("SortBooksByTitle")]
    public async Task<ActionResult<IEnumerable<Book>>> SortBooksByTitle()
    {
        try
        {
            string? pageNumber = Request.Query["pageNumber"];
            string? pageSize = Request.Query["pageSize"];

            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");
            FilterBody? filter = JsonConvert.DeserializeObject<FilterBody>(body);

            if (
                string.IsNullOrWhiteSpace(pageNumber) ||
                string.IsNullOrWhiteSpace(pageSize) ||
                filter == null
            ) throw new Exception("Didn't get all parameters needed");


            int pNumber, pSize;
            if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


            List<Book>? books = _context.Books.ToList();

            if (filter.FilterType == "libraryId")
            {
                int filt;
                if (!int.TryParse(filter.Filter, out filt)) throw new Exception("Library id is invalid");
                books = _context.Books.Where(books => books.libraryId == filt).ToList();
            }
            if (filter.FilterType == "bookId")
            {
                books = _context.Books.Where(books => books.isbn.ToLower() == filter.Filter.ToLower()).ToList();
            }
            if (filter.FilterType == "bookTitle")
            {
                books = _context.Books.Where(books => books.title.ToLower().Contains(filter.Filter.ToLower())).ToList();
            }


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<Book> sortedBooks = books.OrderBy(book => book.title).ToList();

            List<Book> pagedData = sortedBooks
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Count;
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<Book>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPost("SortBooksByYear")]
    public async Task<ActionResult<IEnumerable<Book>>> SortBooksByYear()
    {
        try
        {
            string? pageNumber = Request.Query["pageNumber"];
            string? pageSize = Request.Query["pageSize"];

            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");
            FilterBody? filter = JsonConvert.DeserializeObject<FilterBody>(body);

            if (
                string.IsNullOrWhiteSpace(pageNumber) ||
                string.IsNullOrWhiteSpace(pageSize) ||
                filter == null
            ) throw new Exception("Didn't get all parameters needed");


            int pNumber, pSize;
            if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


            List<Book>? books = _context.Books.ToList();

            if (filter.FilterType == "libraryId")
            {
                int filt;
                if (!int.TryParse(filter.Filter, out filt)) throw new Exception("Library id is invalid");
                books = _context.Books.Where(books => books.libraryId == filt).ToList();
            }
            if (filter.FilterType == "bookId")
            {
                books = _context.Books.Where(books => books.isbn.ToLower() == filter.Filter.ToLower()).ToList();
            }
            if (filter.FilterType == "bookTitle")
            {
                books = _context.Books.Where(books => books.title.ToLower().Contains(filter.Filter.ToLower())).ToList();
            }


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<Book> sortedBooks = books.OrderBy(book => book.year).ToList();

            List<Book> pagedData = sortedBooks
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Count;
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<Book>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
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

            Book? bookToAdd = JsonConvert.DeserializeObject<Book>(body);
            if (bookToAdd == null) throw new Exception("Book added data is empty");

            _context.Books.Add(bookToAdd);
            _context.SaveChanges();

            return Ok(new Response<Book>(bookToAdd));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPut("EditBook")]
    public async Task<ActionResult<Book>> EditBook()
    {
        try
        {
            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");

            Book? book = JsonConvert.DeserializeObject<Book>(body);
            if (book == null) throw new Exception("Book edited data is empty");

            List<Book> books = _context.Books.ToList();
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

            Book? bookToDelete = _context.Books.ToList().Find(book => book.isbn == id);
            if (bookToDelete == null) throw new Exception("Book not found");

            _context.Books.Remove(bookToDelete);
            _context.SaveChanges();

            return Ok(new Response<Book>(bookToDelete));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }
}
