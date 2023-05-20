using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace books_library.Data.Entities;

public sealed class Book
{
    [Key]
    public string isbn { get; set; }
    public string title { get; set; }
    public int year { get; set; }
    public string publisher { get; set; }
    public string image_url { get; set; }
    public int libraryId { get; set; }
    public int authorId { get; set; }
}