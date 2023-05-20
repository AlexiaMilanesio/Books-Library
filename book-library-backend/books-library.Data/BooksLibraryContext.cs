using books_library.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace books_library.Data;

public class BooksLibraryContext : DbContext
{
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Library> Libraries { get; set; }
    
    public BooksLibraryContext(DbContextOptions<BooksLibraryContext> options) : base(options)
    {
    }
}