using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Utils;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SheepController : ControllerBase
    {
        private readonly SheepContext _context;

        public SheepController(SheepContext context)
        {
            _context = context;
        }

        // GET: api/Sheep
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sheep>>> GetSheep()
        {
            return await _context.Sheep.ToListAsync();
        }

        // GET: api/Sheep/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sheep>> GetSheep(int id)
        {
            var sheep = await _context.Sheep.FindAsync(id);

            if (sheep == null)
            {
                return NotFound();
            }

            return sheep;
        }

        // PUT: api/Sheep/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSheep(int id, Sheep sheep)
        {
            if (id != sheep.Id)
            {
                return BadRequest();
            }

            _context.Entry(sheep).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SheepExists(id))
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

        // POST: api/Sheep
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        //public async Task<ActionResult<Sheep>> PostSheep(Sheep sheep)
        //{
        //    _context.Sheep.Add(sheep);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetSheep), new { id = sheep.Id }, sheep);
        //}

        public async Task<ActionResult> PostSheep(Sheep sheep)
        {
            //_context.Sheep.Add(sheep);
            var _files = Request.Form.Files;
            var tourFile = _files.GetFile("Tour");
            var tourLocationFile = _files.GetFile("TourLocations");
            var sheepLocationFile = _files.GetFile("SheepPositions");
            TourData tour = FileUtils.ReadTourDataFromFiles(tourFile, tourLocationFile, sheepLocationFile);
            //if(tour != null)
            //{
            //    _context.Tours.Add(tour);
            //    await _context.SaveChangesAsync();
            //}
            return Ok();
        }

        // DELETE: api/Sheep/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSheep(int id)
        {
            var sheep = await _context.Sheep.FindAsync(id);
            if (sheep == null)
            {
                return NotFound();
            }

            _context.Sheep.Remove(sheep);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SheepExists(int id)
        {
            return _context.Sheep.Any(e => e.Id == id);
        }
    }
}
