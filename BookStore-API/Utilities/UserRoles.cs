using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NLog;

namespace BookStore_API.Utilities
{
    public static class UserRoles
    {
        public static string Customer { get; set; } = "Customer";
        public static string Manager { get; set; } = "Manager";

        public static string Administrator { get; set; } = "Administrator";


    }
}
