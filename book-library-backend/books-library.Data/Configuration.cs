using System.Collections;
using System.Text;
using System.Text.Json;
using books_library.Data.Entities;

namespace books_library.Data;

public static class Configuration
{
    public static void Seed(BooksLibraryContext context)
    {
        var booksDataFile = "books.json";
        var librariesDataFile = "libraries.json";

        var booksJsonData = GetResource(booksDataFile);
        var librariesJsonData = GetResource(librariesDataFile);

        var listTypeBook = typeof(IEnumerable<>).MakeGenericType(typeof(Book));
        var listTypeLibrary = typeof(IEnumerable<>).MakeGenericType(typeof(Library));
        var listTypeAuthors = typeof(IEnumerable<>).MakeGenericType(typeof(Author));
        var listTypeBookAuthors = typeof(IEnumerable<>).MakeGenericType(typeof(BookAuthorMapping));

        List<Author> AuthorEntities = (List<Author>)JsonSerializer.Deserialize(booksJsonData, listTypeAuthors)!;
        List<BookAuthorMapping> BookAuthorEntities = (List<BookAuthorMapping>)JsonSerializer.Deserialize(booksJsonData, listTypeBookAuthors)!;

        Hashtable BookAuthorMapping = new Hashtable();
        foreach(var mapping in BookAuthorEntities)
        {
            BookAuthorMapping.Add(mapping.isbn, mapping.author);
        }

        Random rnd = new Random();

        List<Author> authorList = new List<Author>();
        Hashtable authorsHashes = new Hashtable();
        int idTemp = 1;
        foreach (var ent in AuthorEntities)
        {
            if (!authorsHashes.ContainsKey(ent.Name))
            {
                Author author = new Author();
                author.Year = rnd.Next(1800, 2023);
                author.Name = ent.Name;
                author.Id = idTemp++;
                authorsHashes.Add(ent.Name,author.Id);
                authorList.Add(author);
            }
        }

        

        var BookEntities = JsonSerializer.Deserialize(booksJsonData, listTypeBook) ??
                       throw new NullReferenceException(nameof(listTypeBook));

       
        var temp = ((IEnumerable<Book>)BookEntities).ToList();
        temp.ForEach(x => x.libraryId = rnd.Next(1, 5));
        temp.ForEach(x => x.authorId = (int)authorsHashes[BookAuthorMapping[x.isbn]!]!);
        BookEntities = temp;

        var libraryEntities = JsonSerializer.Deserialize(librariesJsonData, listTypeLibrary);


        var entitiesList = BookEntities as IEnumerable ?? throw new NullReferenceException(nameof(listTypeBook));
        foreach (var e in entitiesList)
        {
            context.Add(e);
        }

        var entitiesLibraryList = libraryEntities as IEnumerable ?? throw new NullReferenceException(nameof(listTypeBook));
        foreach (var e in entitiesLibraryList)
        {
            context.Add(e);
        }

        foreach (var e in authorList)
        {
            context.Add(e);
        }

        context.SaveChanges();
    }

    private static string GetResource(string resourceName)
    {
        var result = string.Empty;
        var assembly = typeof(Configuration).Assembly;

        char separator = Path.DirectorySeparatorChar;    
        
        using (var reader = new StreamReader(Directory.GetCurrentDirectory() + $"{separator}bin{separator}Debug{separator}net7.0{separator}" + resourceName, Encoding.GetEncoding("iso-8859-1")))
        {
            result = reader.ReadToEnd();
        }

        return result;
    }
}

internal class BookAuthorMapping
{
    public string isbn { get; set; }
    public string author { get; set; }
}