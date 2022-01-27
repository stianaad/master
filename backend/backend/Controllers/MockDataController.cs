using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public class MockDataController : ControllerBase
    {
        private readonly SheepContext _context;

        public MockDataController(SheepContext context)
        {
            _context = context;
        }

        [HttpPost("api/uploadTour")]
        public async Task<IActionResult> UploadTour()
        {
            var _files = Request.Form.Files;
            var tourFile = _files.GetFile("Tour");
            var tourLocationFile = _files.GetFile("TourLocations");
            var sheepLocationFile = _files.GetFile("SheepPositions");
            TourData tour = FileUtils.ReadTourDataFromFiles(tourFile, tourLocationFile, sheepLocationFile, 5);
            if (tour != null)
            {
                _context.Tours.Add(tour);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }

        [HttpGet("api/GetTour/{id}")]
        public async Task<ActionResult<TourData>> GetTour(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return tour;
        }

        [HttpGet("api/GetTours")]
        public async Task<ActionResult<IEnumerable<TourData>>> GetTours()
        {
            return await _context.Tours.Include(t => t.SheepPositions).Include(t => t.Positions).ToListAsync();
        }
    }
}
