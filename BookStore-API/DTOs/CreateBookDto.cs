using System.ComponentModel.DataAnnotations;

namespace BookStore_API.DTOs
{
    public class CreateBookDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public int? Year { get; set; }
        public string ISBN { get; set; }
        public string Summary { get; set; }
        public string Image { get; set; }
        public double? Price { get; set; }
        
    }
}