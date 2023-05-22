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

            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach(var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }


            if (books == null) throw new Exception("Couldn't get all books");

            List<BookWithAuthor> pagedData = books
                .FindAll(book => book.libraryId == libraryId)
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = _context.Books.Where(book => book.libraryId == libraryId).Count();
            int totalPages = (int) Math.Ceiling((double) totalRecords / pSize);


            return Ok(new PagedResponse<List<BookWithAuthor>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
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

            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach (var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }

            List<BookWithAuthor> foundBook = books.FindAll(book => book.isbn.ToLower() == id.ToLower());
            if (foundBook == null) throw new Exception("Book not found");

            return Ok(new Response<List<BookWithAuthor>>(foundBook));
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

            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach (var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }

            if (books == null) throw new Exception("Couldn't get all books");

            List<BookWithAuthor> pagedData = books
                .FindAll(book => book.title.ToLower().Contains(title.ToLower()))
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Where(book => book.title.ToLower().Contains(title.ToLower())).Count();
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<BookWithAuthor>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpGet("GetBooksByAuthor/{authorName}")]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooksByAuthor(string authorName)
    {
        try
        {
            string? pageNumber = Request.Query["pageNumber"];
            string? pageSize = Request.Query["pageSize"];

            if (
                string.IsNullOrWhiteSpace(pageNumber) ||
                string.IsNullOrWhiteSpace(pageSize) ||
                string.IsNullOrWhiteSpace(authorName)
            ) throw new Exception("Didn't get all parameters needed");


            int pNumber, pSize;
            if (!int.TryParse(pageNumber, out pNumber) || !int.TryParse(pageSize, out pSize)) throw new Exception("Parameters have to be numbers");


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach (var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }

            if (books == null) throw new Exception("Couldn't get all books");

            List<BookWithAuthor> pagedData = books
                .FindAll(book => book.author.ToLower().Contains(authorName.ToLower()))
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Where(book => book.author.ToLower().Contains(authorName.ToLower())).Count();
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<BookWithAuthor>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


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


            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach (var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }


            if (filter.FilterType == "libraryId")
            {
                int filt;
                if (!int.TryParse(filter.Filter, out filt)) throw new Exception("Library id is invalid");
                books = books.Where(books => books.libraryId == filt).ToList();
            }
            if (filter.FilterType == "bookId")
            {
                books = books.Where(books => books.isbn.ToLower() == filter.Filter.ToLower()).ToList();
            }
            if (filter.FilterType == "bookTitle")
            {
                books = books.Where(books => books.title.ToLower().Contains(filter.Filter.ToLower())).ToList();
            }


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<BookWithAuthor> sortedBooks = books.OrderBy(book => book.title).ToList();

            List<BookWithAuthor> pagedData = sortedBooks
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Count;
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<BookWithAuthor>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
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


            List<BookWithAuthor> books = new List<BookWithAuthor>();

            var list = (
                from book in _context.Books
                join author in _context.Authors on book.authorId equals author.Id
                select new { book.isbn, book.title, book.year, book.publisher, book.image_url, book.libraryId, author.Name }
            ).ToList();

            foreach (var item in list)
            {
                BookWithAuthor book = new BookWithAuthor();

                book.isbn = item.isbn;
                book.title = item.title;
                book.year = item.year;
                book.publisher = item.publisher;
                book.image_url = item.image_url;
                book.libraryId = item.libraryId;
                book.author = item.Name;

                books.Add(book);
            }


            if (filter.FilterType == "libraryId")
            {
                int filt;
                if (!int.TryParse(filter.Filter, out filt)) throw new Exception("Library id is invalid");
                books = books.Where(books => books.libraryId == filt).ToList();
            }
            if (filter.FilterType == "bookId")
            {
                books = books.Where(books => books.isbn.ToLower() == filter.Filter.ToLower()).ToList();
            }
            if (filter.FilterType == "bookTitle")
            {
                books = books.Where(books => books.title.ToLower().Contains(filter.Filter.ToLower())).ToList();
            }


            var validFilter = new PaginationFilter(pNumber, pSize);

            List<BookWithAuthor> sortedBooks = books.OrderBy(book => book.year).ToList();

            List<BookWithAuthor> pagedData = sortedBooks
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            int totalRecords = books.Count;
            int totalPages = (int)Math.Ceiling((double)totalRecords / pSize);


            return Ok(new PagedResponse<List<BookWithAuthor>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalPages, totalRecords));
        }
        catch (Exception e)
        {
            return NotFound(e.Message);
        }
    }


    [HttpPost("AddBook")]
    public async Task<ActionResult<BookWithAuthor>> AddBook()
    {
        try
        {
            string body = await new StreamReader(Request.Body).ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) throw new Exception("Body is empty or a white space");

            BookWithAuthor? bookToAdd = JsonConvert.DeserializeObject<BookWithAuthor>(body);
            if (bookToAdd == null) throw new Exception("Book added data is empty");

            Author? author = _context.Authors.ToList().Find(a => a.Name == bookToAdd.author);
            int authorId = -1;

            if (author != null)
            {
                authorId = _context.Authors.ToList().Find(a => a.Name == bookToAdd.author).Id;
            }

            if (author == null)
            {
                int maxId = _context.Authors.Max(author => author.Id);
                int year;
                if(!int.TryParse(DateTime.Now.ToString("yyyy"), out year)) throw new Exception ("There's been an error while converting year into number");

                Author newAuthor = new Author();

                newAuthor.Id = maxId + 1;
                newAuthor.Name = bookToAdd.author;
                newAuthor.Year = year;

                _context.Authors.Add(newAuthor);
                _context.SaveChanges();

                authorId = _context.Authors.ToList().Find(a => a.Name == bookToAdd.author).Id;
            }

            if (authorId < 0) throw new Exception("There has been a problem while getting author id");


            Book addedBook = new Book();

            addedBook.isbn = bookToAdd.isbn;
            addedBook.title = bookToAdd.title;
            addedBook.year = bookToAdd.year;
            addedBook.publisher = bookToAdd.publisher;
            addedBook.image_url = bookToAdd.image_url;
            addedBook.libraryId = bookToAdd.libraryId;
            addedBook.authorId = authorId;

            _context.Books.Add(addedBook);
            _context.SaveChanges();

            
            return Ok(new Response<BookWithAuthor>(bookToAdd));
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

            BookWithAuthor? bookToEdit = JsonConvert.DeserializeObject<BookWithAuthor>(body);
            if (bookToEdit == null) throw new Exception("Book edited data is empty");

            Author? author = _context.Authors.ToList().Find(a => a.Name == bookToEdit.author);
            int authorId = -1;

            if (author != null)
            {
                authorId = _context.Authors.ToList().Find(a => a.Name == bookToEdit.author).Id;
            }

            if (author == null)
            {
                int maxId = _context.Authors.Max(author => author.Id);
                int year;
                if (!int.TryParse(DateTime.Now.ToString("yyyy"), out year)) throw new Exception("There's been an error while converting year into number");

                Author newAuthor = new Author();

                newAuthor.Id = maxId + 1;
                newAuthor.Name = bookToEdit.author;
                newAuthor.Year = year;

                _context.Authors.Add(newAuthor);
                _context.SaveChanges();

                authorId = _context.Authors.ToList().Find(a => a.Name == bookToEdit.author).Id;
            }

            if (authorId < 0) throw new Exception("There has been a problem while getting author id");


            Book? editedBook = _context.Books.ToList().Find(book => book.isbn == bookToEdit.isbn);

            if (editedBook != null)
            {
                editedBook.isbn = bookToEdit.isbn;
                editedBook.title = bookToEdit.title;
                editedBook.year = bookToEdit.year;
                editedBook.publisher = bookToEdit.publisher;
                editedBook.image_url = bookToEdit.image_url;
                editedBook.libraryId = bookToEdit.libraryId;
                editedBook.authorId = authorId;

                _context.SaveChanges();

                return Ok(new Response<BookWithAuthor>(bookToEdit));
            }
            else
            {
                throw new Exception("Couldn't edit book");
            }
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
