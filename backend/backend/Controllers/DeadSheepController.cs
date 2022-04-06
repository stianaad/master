using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.authentication;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeadSheepController: ControllerBase
    {
        private readonly SheepContext _context;
        private readonly UserManager<AuthenticationUser> _userManager;

        public DeadSheepController(SheepContext sheepContext, UserManager<AuthenticationUser> userManager)
        {
            _context = sheepContext;
            _userManager = userManager;
        }

        // GET: api/DeadSheep
        [Authorize]
        [HttpGet("{fromTime}/{toTime}")]
        public async Task<ActionResult<IEnumerable<DeadSheepPositionData>>> GetSheep(DateTime fromTime, DateTime toTime)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Invalid user" });
            }
            return await _context.DeadSheepPositions.Where(dead => dead.TimeOfObservation >= fromTime && dead.Tour.Email == user.Email && dead.TimeOfObservation  <= toTime).ToListAsync();
        }
    }
}
