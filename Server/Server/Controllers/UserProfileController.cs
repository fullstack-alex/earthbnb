using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Server.Model;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public UserProfileController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    // [HttpGet("{email}/{password}")]
    // public async Task<ActionResult<Customer?>> Get([FromRoute] string email, string password, [FromServices] CustomerService customerService)
    // {
    //     Console.WriteLine(email + " " + password);
    //     Customer? customer = await customerService.GetAsync(email, password);
    //
    //     if (customer.uid == null)
    //     {   
    //         return NotFound();
    //     }
    //
    //     return customer;
    // }
    //
    // [HttpGet("email/{email}")]
    // public async Task<ActionResult<Customer?>> GetEmail([FromRoute] string email, [FromServices] CustomerService customerService)
    // {
    //     Console.WriteLine(email);
    //     Customer? customer = await customerService.GetAsyncByEmail(email);
    //
    //     if (customer.uid == null)
    //     {   
    //         return NotFound();
    //     }
    //
    //     return customer;
    // }
    
    [HttpPost]
    public async Task<ActionResult<string>> Post(UserProfile profile, [FromServices] UserProfileService userProfileService)
    {
        // customer.uid = Guid.NewGuid().ToString();
        //
        // Console.WriteLine(customer.email);
        // Customer? oldCustomer = await customerService.GetAsyncByEmail(customer.email);
        //
        // if (oldCustomer.uid != null)
        // {   
        //     return StatusCode(409, $"User with '{customer.email}' email already exists.");
        // }
        //
        // customer = await customerService.CreateAsync(customer);
        //
        // return customer;
        
        if (profile.username == "alex" && profile.password == "password")
        {
            var issuer = _configuration.GetValue<string>("Jwt:Issuer");
            var audience = _configuration.GetValue<string>("Jwt:Audience");
            var key = Encoding.ASCII.GetBytes
                (_configuration.GetValue<string>("Jwt:Key"));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, profile.username),
                    new Claim(JwtRegisteredClaimNames.Email, profile.username),
                    new Claim(JwtRegisteredClaimNames.Jti,
                        Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials
                (new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            var stringToken = tokenHandler.WriteToken(token);
            return Ok(stringToken);
        }
        return Unauthorized();
    }
}