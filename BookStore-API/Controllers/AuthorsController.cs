using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookStore_API.Contracts;
using BookStore_API.Data;
using BookStore_API.DTOs;
using BookStore_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace BookStore_API.Controllers
{
    /// <summary>
    /// Endpoint used to use the Authors in the book store's database
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly ILoggerService _loggerService;
        private readonly IMapper _mapper;

        public AuthorsController(IAuthorRepository repo, ILoggerService loggerService, IMapper mapper)
        {
            _authorRepository = repo;
            _loggerService = loggerService;
            _mapper = mapper;
        }

        /// <summary>
        /// Get all authors
        /// </summary>
        /// <returns>List of Authors</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAuthors()
        {
            try
            {
                _loggerService.LogInfo($"Attempted to read all authors {DateTime.Now}");
                var authors = await _authorRepository.FindAll();
                var response = _mapper.Map<List<AuthorDTO>>(authors);
                _loggerService.LogInfo("Successful in retrieving all authors");
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
        /// <param name="authorDto"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] CreateAuthorDTO authorDto)
        {
            try
            {
                _loggerService.LogInfo("Author Submission Attempted.");
                if (authorDto == null)
                {
                    _loggerService.LogWarn("The body of the author is empty.");
                    return BadRequest(ModelState);
                }

                _loggerService.LogInfo("Attempting to add Author to Data Store");
                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("Author Data is not complete.");
                    return BadRequest(ModelState);
                }

                var response = _mapper.Map<Author>(authorDto);
                var isSuccess = await _authorRepository.Create(response);
                if (!isSuccess)
                {
                    return InternalError($"Author creation failed - {DateTime.Today}");
                }

                //return ok
                _loggerService.LogInfo($"Successfully created Author {response.FirstName}");
                return Created("Create", new {response});
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }


        }
        /// <summary>
        /// Update an author
        /// </summary>
        /// <param name="updateAuthorDto"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update(int id,[FromBody] UpdateAuthorDTO updateAuthorDto)
        {
            try
            {
                _loggerService.LogInfo($"Author updated attempted - id: {id}");
                if (id < 1 || updateAuthorDto == null || updateAuthorDto.Id != id)
                {
                    _loggerService.LogWarn($"Author Update failed with bad data from id - id{id}");
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("Author data was incomplete");
                    return BadRequest(ModelState);
                }

                var authors = _mapper.Map<Author>(updateAuthorDto);
                var isSuccess = await _authorRepository.Update(authors);
                if (!isSuccess)
                {
                    return InternalError("Update Operation Failed");
                }

                _loggerService.LogInfo($"Author with id: {id} updated successfully");
                return NoContent();
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }

        }
        /// <summary>
        /// Deletes an author
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                _loggerService.LogInfo($"Author updated attempted - id: {id}");
                if (id < 1 )
                {
                    _loggerService.LogWarn($"Author Delete failed with bad data from id - id{id}");
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    _loggerService.LogWarn("Author data was incomplete");
                    return BadRequest(ModelState);
                }

                var author = await _authorRepository.FindById(id);
                if (author == null)
                {
                    return NotFound();
                }

                var isSuccess = await _authorRepository.Delete(author);
                if (!isSuccess)
                {
                    return InternalError("Delete Operation Failed");
                }

                _loggerService.LogInfo($"Author with id: {id} Deleted successfully");
                return NoContent();
            }
            catch (Exception e)
            {
                return InternalError($"{e.Message} - {e.InnerException}");
            }

        }
    }
}

   