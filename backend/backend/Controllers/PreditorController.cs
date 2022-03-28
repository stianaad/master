using System;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.authentication;
using Microsoft.AspNetCore.Http;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreditorController : ControllerBase
    {
        private readonly SheepContext _context;
        private readonly HttpClient client = new HttpClient();
        private readonly UserManager<AuthenticationUser> _userManager;

        public PreditorController(SheepContext context, UserManager<AuthenticationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Preditor
        //[HttpGet("{fromTime}/{toTime}")]
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PreditorTourPosition>>> GetPreditors(DateTime fromTime, DateTime toTime)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "Invalid user" });
            }
            return await _context.PreditorTourPosition.Where(pred => pred.Tour.Email == user.Email && pred.TimeOfObservation >= fromTime && pred.TimeOfObservation <= toTime).ToListAsync();
            //return await _context.DeadSheepPositions.Where(dead => dead.TimeOfObservation >= fromTime && dead.TimeOfObservation <= toTime).ToListAsync();
        }
        [Authorize]
        [HttpGet("rovdata")]
        public async Task<ActionResult<string>> GetPreditors([FromQuery] int[] types, string from, string to)
        {
            //Create Jerv JSON to POST request
            Jerv t = new Jerv
            {
                LanguageCode = "no",
                SearchFilter = new SearchFilterObj
                {
                    Carnivore = new List<int>(types),
                    CarnivoreDamage = new List<int> { 1, 2, 3, 4, 5 },
                    Evaluation = new List<int> { 1, 2, 3 },
                    Observation = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11 },
                    Offspring = false,
                    FromDate = from,
                    ToDate = to,
                    Country = new List<int>() { 1 },
                    Region = new List<string>(),
                    County = new List<string>(),
                    Municipality = new List<string>(),
                    IndividualNameOrID = "",
                    Barcode = "",
                    Rovdjursforum = false,
                    ID = ""
                },
            };
            var ser = JsonSerializer.Serialize(t);
            var json = new StringContent(
                ser,
                Encoding.UTF8,
                Application.Json);

            var stringTask = client.PostAsync("https://rovbase.no/api/Feature", json);

            var msg = await stringTask;
            var response = await msg.Content.ReadAsStringAsync();
            //Console.Write(response);
            //msg.EnsureSuccessStatusCode();

            return response;
        }
    }
}
