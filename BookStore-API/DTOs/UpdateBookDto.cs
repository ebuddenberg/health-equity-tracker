﻿using System.ComponentModel.DataAnnotations;

namespace BookStore_API.DTOs
{
    public class UpdateBookDto
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public int? Year { get; set; }
        public string ISBN { get; set; }
        [StringLength(500)]
        public string Summary { get; set; }
        public string Image { get; set; }
        public double? Price { get; set; }
        public int? AuthorId { get; set; }
    }
}