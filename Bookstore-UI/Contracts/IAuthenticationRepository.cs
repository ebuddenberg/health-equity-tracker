using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bookstore_UI.Models;

namespace Bookstore_UI.Contracts
{
   public  interface IAuthenticationRepository
   {
       public Task<bool> Register(RegisterAndLoginModel user);
       public Task<bool> Login(RegisterAndLoginModel login);
       public Task Logout();
   }
}
