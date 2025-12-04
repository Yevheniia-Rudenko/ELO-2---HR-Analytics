using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.API.Data;
using backend.API.Models;

namespace backend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionariesController : ControllerBase
    {
        private readonly backendAPIContext _context;

        public QuestionariesController(backendAPIContext context)
        {
            _context = context;
        }

        // GET: api/Questionaries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questionary>>> GetQuestionary()
        {
            return await _context.Questionary.ToListAsync();
        }

        // GET: api/Questionaries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Questionary>> GetQuestionary(int id)
        {
            var questionary = await _context.Questionary.FindAsync(id);

            if (questionary == null)
            {
                return NotFound();
            }

            return questionary;
        }

        // PUT: api/Questionaries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionary(int id, Questionary questionary)
        {
            if (id != questionary.Id)
            {
                return BadRequest();
            }

            _context.Entry(questionary).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionaryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Questionaries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Questionary>> PostQuestionary(Questionary questionary)
        {
            _context.Questionary.Add(questionary);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionary", new { id = questionary.Id }, questionary);
        }

        // DELETE: api/Questionaries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionary(int id)
        {
            var questionary = await _context.Questionary.FindAsync(id);
            if (questionary == null)
            {
                return NotFound();
            }

            _context.Questionary.Remove(questionary);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionaryExists(int id)
        {
            return _context.Questionary.Any(e => e.Id == id);
        }
    }
}
