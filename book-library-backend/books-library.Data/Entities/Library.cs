using System.ComponentModel.DataAnnotations;

namespace books_library.Data.Entities;

public sealed class Library
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
}