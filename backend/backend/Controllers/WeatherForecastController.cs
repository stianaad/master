using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.authentication;
using backend.Utils;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly UserManager<AuthenticationUser> _userManager;

        public WeatherForecastController(UserManager<AuthenticationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<AuthenticationUser> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            Console.WriteLine("user", user.Email);
            return user;
        }
    }
}
