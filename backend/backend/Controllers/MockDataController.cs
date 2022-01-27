using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            TourData tour = FileUtils.ReadTourDataFromFiles(tourFile, tourLocationFile, sheepLocationFile);
            if (tour != null)
            {
                _context.Tours.Add(tour);
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
