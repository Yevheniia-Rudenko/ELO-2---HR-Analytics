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
    public class ApraisalsController : ControllerBase
    {
        private readonly backendAPIContext _context;

        public ApraisalsController(backendAPIContext context)
        {
            _context = context;
        }

        // GET: api/Apraisals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Apraisal>>> GetApraisal()
        {
            return await _context.Apraisal.ToListAsync();
        }

        // GET: api/Apraisals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Apraisal>> GetApraisal(int id)
        {
            var apraisal = await _context.Apraisal.FindAsync(id);

            if (apraisal == null)
            {
                return NotFound();
            }

            return apraisal;
        }

        // PUT: api/Apraisals/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApraisal(int id, Apraisal apraisal)
        {
            if (id != apraisal.Id)
            {
                return BadRequest();
            }

            _context.Entry(apraisal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApraisalExists(id))
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

        // POST: api/Apraisals
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Apraisal>> PostApraisal(Apraisal apraisal)
        {
            _context.Apraisal.Add(apraisal);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApraisal", new { id = apraisal.Id }, apraisal);
        }

        // DELETE: api/Apraisals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApraisal(int id)
        {
            var apraisal = await _context.Apraisal.FindAsync(id);
            if (apraisal == null)
            {
                return NotFound();
            }

            _context.Apraisal.Remove(apraisal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApraisalExists(int id)
        {
            return _context.Apraisal.Any(e => e.Id == id);
        }
    }
}
