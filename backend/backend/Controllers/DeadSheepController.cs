using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeadSheepController: ControllerBase
    {
        private readonly SheepContext _context;

        public DeadSheepController(SheepContext sheepContext)
        {
            _context = sheepContext;
        }

        // GET: api/DeadSheep
        [HttpGet("{fromTime}/{toTime}")]
        public async Task<ActionResult<IEnumerable<DeadSheepPositionData>>> GetSheep(DateTime fromTime, DateTime toTime)
        {
            return await _context.DeadSheepPositions.Where(dead => dead.TimeOfObservation >= fromTime && dead.TimeOfObservation  <= toTime).ToListAsync();
        }
    }
}
