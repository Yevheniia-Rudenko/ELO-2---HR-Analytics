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
    public class UsercredentialsController : ControllerBase
    {
        private readonly backendAPIContext _context;

        public UsercredentialsController(backendAPIContext context)
        {
            _context = context;
        }

        // GET: api/Usercredentials
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usercredentials>>> GetUsercredentials()
        {
            return await _context.Usercredentials.ToListAsync();
        }

        // GET: api/Usercredentials/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usercredentials>> GetUsercredentials(int id)
        {
            var usercredentials = await _context.Usercredentials.FindAsync(id);

            if (usercredentials == null)
            {
                return NotFound();
            }

            return usercredentials;
        }

        // PUT: api/Usercredentials/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsercredentials(int id, Usercredentials usercredentials)
        {
            if (id != usercredentials.Id)
            {
                return BadRequest();
            }

            _context.Entry(usercredentials).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsercredentialsExists(id))
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

        // POST: api/Usercredentials
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usercredentials>> PostUsercredentials(Usercredentials usercredentials)
        {
            _context.Usercredentials.Add(usercredentials);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsercredentials", new { id = usercredentials.Id }, usercredentials);
        }

        // DELETE: api/Usercredentials/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsercredentials(int id)
        {
            var usercredentials = await _context.Usercredentials.FindAsync(id);
            if (usercredentials == null)
            {
                return NotFound();
            }

            _context.Usercredentials.Remove(usercredentials);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsercredentialsExists(int id)
        {
            return _context.Usercredentials.Any(e => e.Id == id);
        }
    }
}
