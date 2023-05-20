using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace books_library.Data.Entities;

public sealed class Author
{
    [Key]
    public int Id { get; set; }
    [JsonPropertyName("author")]
    public string Name { get; set; }
    public int Year { get; set; }
}