using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.authentication;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourController : ControllerBase
    {

        private readonly SheepContext _context;
        private readonly UserManager<AuthenticationUser> _userManager;

        public TourController(SheepContext context, UserManager<AuthenticationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        //GET api/sheep/positions
        [HttpGet("sheep/positions")]
        public async Task<ActionResult<IEnumerable<CombinedSheepTourPositionData>>> GetSheepPositions()
        {
            List<SheepPositionData> sheepList = await _context.SheepPositions.Include(s => s.Tour).Where(s => s.Tour.Email == "anders@test.com").ToListAsync();
            List<CombinedSheepTourPositionData> combined = await MapUtils.FindBigFlock(sheepList);
            List<CombinedSheepTourPositionData> res = await MapUtils.FindClosestFlockOnNextTour(combined);
            res.ForEach((CombinedSheepTourPositionData test) => {
                Console.WriteLine(test.ToString());
            });
            return combined;
        }

        [Authorize]
        [HttpGet("location")] 
        public async Task<ActionResult<IEnumerable<TourData>>> getTourLocations()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Invalid user" });
            }
            return await _context.Tours.Where(t => t.Email == user.Email).Include(t => t.SheepPositions).Include(t => t.Positions).ToListAsync();
        }


    }
}