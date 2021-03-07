using System;
using System.Collections.Generic;

namespace BookStore_API.Data
{
    public partial class Authors
    {
        public Authors()
        {
            Books = new HashSet<Books>();
        }

        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Bio { get; set; }

        public virtual ICollection<Books> Books { get; set; }
    }
}
