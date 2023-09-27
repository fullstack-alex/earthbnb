using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using MongoDB.Bson;
using Server.Model;
using Server.Services;
using JwtSecurityTokenHandler = System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler;

namespace Server.Controllers;

[ApiController, Route("[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public UserProfileController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<string?>> Login([FromBody] Credentials credentials, [FromServices] UserProfileService userProfileService)
    {
        bool isLoginValid = await userProfileService.GetAsyncByCredentials(credentials) != null;
        Console.WriteLine(credentials.ToJson());

        if (isLoginValid)
        {
            string token = GenerateToken(credentials.username);
            
            Response.Headers.Append("Access-Control-Expose-Headers", "Authorization");
            Response.Headers.Append("Authorization", token);

            return new JsonResult(Ok()); 
        }
        
        Response.Headers.Append("Access-Control-Expose-Headers", "UserMessage");
        Response.Headers.Append("UserMessage", "Wrong username or password.");

        return StatusCode(401);
    }
    
    [HttpPost("signup")]
    public async Task<ActionResult<string>> SignUp([FromBody] UserProfile profile, [FromServices] UserProfileService userProfileService)
    {
        profile.uid = Guid.NewGuid().ToString();
        
        UserProfile? oldUser = await userProfileService.GetAsyncByUsername(profile.username);
        
        Console.WriteLine("hello");
        if (string.IsNullOrEmpty(oldUser?.uid))
        {   
            await userProfileService.CreateAsync(profile);

            string token = GenerateToken(profile.username);
            
            Response.Headers.Append("Access-Control-Expose-Headers", "Authorization");
            Response.Headers.Append("Authorization", token);
            
            return new JsonResult(Ok()); 
        }
        
        Response.Headers.Append("Access-Control-Expose-Headers", "UserMessage");
        Response.Headers.Append("UserMessage", $"User with {profile.username} username already exists.");

        return StatusCode(409);
    }

    private string GenerateToken(string username)
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
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Email, username),
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
        var stringToken = tokenHandler.WriteToken(token);

        return stringToken;
    }
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
}