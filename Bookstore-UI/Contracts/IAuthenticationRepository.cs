using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bookstore_UI.Models;
using Bookstore_UI.Pages.Users;

namespace Bookstore_UI.Contracts
{
   public  interface IAuthenticationRepository
   {
       public Task<bool> Register(RegisterModel user);
       public Task<bool> Login(LoginModel login);
       public Task Logout();
   }
}
