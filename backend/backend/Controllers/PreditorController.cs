using System;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreditorController : ControllerBase
    {
        private readonly SheepContext _context;

        public PreditorController(SheepContext context)
        {
            _context = context;
        }

        // GET: api/Preditor
        [HttpGet("{fromTime}/{toTime}")]
        public async Task<ActionResult<IEnumerable<PreditorTourPosition>>> GetPreditors(DateTime fromTime, DateTime toTime)
        {
            return await _context.PreditorTourPosition.Where(pred => pred.TimeOfObservation >= fromTime && pred.TimeOfObservation <= toTime).ToListAsync();
            //return await _context.DeadSheepPositions.Where(dead => dead.TimeOfObservation >= fromTime && dead.TimeOfObservation <= toTime).ToListAsync();
        }
    }
}
