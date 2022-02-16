using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using backend.authentication;
using backend.Models;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourController : ControllerBase
    {

        private readonly SheepContext _context;
        private readonly UserManager<AuthenticationUser> _userManager;
        private readonly HttpClient client = new HttpClient();

        public TourController(SheepContext context, UserManager<AuthenticationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("sheep/test")]
        public async Task<ActionResult<string>> ProcessRepositories()
        {
            //Create Jerv JSON to POST request
            Jerv t = new Jerv {
                LanguageCode = "no",
                SearchFilter = new SearchFilterObj
                {
                    Carnivore = new List<int> { 4},
                    CarnivoreDamage = new List<int> { 1,2,3,4,5},
                    Evaluation = new List<int> { 1,2,3},
                    Observation = new List<int> { 1,2,3,12,11},
                    Offspring = false,
                    FromDate = "2022-01-12T00:00:00.000Z",
                    ToDate = "2022-02-11T00:00:00.000Z",
                    Country = new List<int>() { 1},
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

        //GET api/sheep/positions
        [HttpGet("sheep/positions")]
        public async Task<ActionResult<IEnumerable<CombinedSheepTourPositionData>>> GetSheepPositions()
        {
            List<SheepPositionData> sheepList = await _context.SheepPositions.Include(s => s.Tour).Where(s => s.Tour.Email == "generated@test.com").ToListAsync();
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