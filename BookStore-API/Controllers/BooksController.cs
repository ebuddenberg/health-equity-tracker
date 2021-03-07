using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookStore_API.Contracts;
using BookStore_API.Data;
using BookStore_API.DTOs;

namespace BookStore_API.Controllers
{

    /// <summary>
    /// Endpoint used to use the Books in the book store's database
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public class BookController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;
        private readonly ILoggerService _loggerService;
        private readonly IMapper _mapper;

        public BookController(IBookRepository repo, ILoggerService loggerService, IMapper mapper)
        {
            _bookRepository = repo;
            _loggerService = loggerService;
            _mapper = mapper;
        }

        /// <summary>
        /// Get all books
        /// </summary>
        /// <returns>List of Books</returns>
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            try
            {
                _loggerService.LogInfo($"Attempted to read all books {DateTime.Now}");
                var books = await _bookRepository.FindAll();
                var response = _mapper.Map<List<BookDTO>>(books);
                _loggerService.LogInfo("Successful in retrieving all books");
                return Ok(response);
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }

        }

        private ObjectResult InternalError(string message)
        {
            _loggerService.LogError(message);
            return StatusCode(500, "Something went wrong. Please contact the Administrator");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bookDto"></param>
        /// <returns></returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] CreateBookDto bookDto)
        {
            try
            {
                _loggerService.LogInfo("Book Submission Attempted.");
                if (bookDto == null)
                {
                    _loggerService.LogWarn("The body of the book is empty.");
                    return BadRequest(ModelState);
                }

                _loggerService.LogInfo("Attempting to add book to Data Store");
                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("Book Data is not complete.");
                    return BadRequest(ModelState);
                }

                var response = _mapper.Map<Book>(bookDto);
                var isSuccess = await _bookRepository.Create(response);
                if (!isSuccess)
                {
                    return InternalError($"book creation failed - {DateTime.Today}");
                }

                //return ok
                _loggerService.LogInfo($"Successfully created book {response.Title}");
                return Created("Create", new { response });
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }


        }
        /// <summary>
        /// Update an Book
        /// </summary>
        /// <param name="updatebookDto"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookDto updateBookDto)
        {
            try
            {
                _loggerService.LogInfo($"book updated attempted - id: {id}");
                if (id < 1 || updateBookDto == null || updateBookDto.Id != id)
                {
                    _loggerService.LogWarn($"book Update failed with bad data from id - id{id}");
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("book data was incomplete");
                    return BadRequest(ModelState);
                }

                var book = _mapper.Map<Book>(updateBookDto);
                var isSuccess = await _bookRepository.Update(book);
                if (!isSuccess)
                {
                    return InternalError("Update Operation Failed");
                }

                _loggerService.LogInfo($"book with id: {id} updated successfully");
                return NoContent();
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }

        }
        /// <summary>
        /// Deletes an book
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                _loggerService.LogInfo($"Book updated attempted - id: {id}");
                if (id < 1)
                {
                    _loggerService.LogWarn($"Book Delete failed with bad data from id - id{id}");
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("Book data was incomplete");
                    return BadRequest(ModelState);
                }

                var book = await _bookRepository.FindById(id);
                if (book == null)
                {
                    return NotFound();
                }

                var isSuccess = await _bookRepository.Delete(book);
                if (!isSuccess)
                {
                    return InternalError("Delete Operation Failed");
                }

                _loggerService.LogInfo($"Book with id: {id} Deleted successfully");
                return NoContent();
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }

        }
    }
}
