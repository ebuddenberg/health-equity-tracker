using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookStore_API.Data;

namespace BookStore_API.Contracts
{
   public  interface IRepositoryBase<T> where T: class
   {
       Task<List<T>> FindAll();
       Task<T> FindById(int id);
       Task<bool> Create(T entity);
       Task<bool> Update(T entity);
       Task<bool> Delete(T entity);
       Task<bool> Save();

   }
}
