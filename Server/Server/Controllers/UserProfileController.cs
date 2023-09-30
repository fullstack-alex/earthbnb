using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
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
        UserProfile user = await userProfileService.GetAsyncByCredentials(credentials);
        bool isLoginValid = user != null;
        Console.WriteLine(credentials.ToJson());

        if (isLoginValid)
        {
            string token = GenerateToken(user);
            
            Response.Headers.Append("Access-Control-Expose-Headers", "Authorization");
            Response.Headers.Append("Authorization", token);

            return new JsonResult(Ok()); 
        }
        
        Response.Headers.Append("Access-Control-Expose-Headers", "UserMessage");
        Response.Headers.Append("UserMessage", "Wrong username or password.");

        return StatusCode(401);
    }

    [HttpPost("UploadAvatarImage")]
    public async Task<ActionResult> UploadAvatarImage([FromForm] IFormFile image, [FromForm] string username, [FromServices] UserProfileService userProfileService)
    {
        string name = image.FileName;
        string filePath = @"Images/ProfileImages/" + name;
        await using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(fileStream);
        }

        UserProfile user = await userProfileService.GetAsyncByUsername(username);
        user.photoUrl = filePath;
        await userProfileService.UpdateAsync(user.uid, user);
        
        return new JsonResult(Ok());
    }

    [HttpPost("signup")]
    public async Task<ActionResult<string>> SignUp([FromBody] UserProfile profile, [FromServices] UserProfileService userProfileService)
    {
        profile.uid = Guid.NewGuid().ToString();

        UserProfile? oldUser = await userProfileService.GetAsyncByUsername(profile.username);
        
        if (string.IsNullOrEmpty(oldUser?.uid))
        {   
            await userProfileService.CreateAsync(profile);

            string token = GenerateToken(profile);
            
            Response.Headers.Append("Access-Control-Expose-Headers", "Authorization");
            Response.Headers.Append("Authorization", token);
            
            return new JsonResult(Ok()); 
        }
        
        Response.Headers.Append("Access-Control-Expose-Headers", "UserMessage");
        Response.Headers.Append("UserMessage", $"User with {profile.username} username already exists.");

        return StatusCode(409);
    }

    [HttpPost("getUser")]
    public async Task<ActionResult<UserProfile>> GetUser([FromBody] JObject obj, [FromServices] UserProfileService userProfileService)
    {
        string username = obj["username"].ToString();
        UserProfile? user = await userProfileService.GetAsyncByUsername(username);
        
        if (user != null)
        {   
            return user; 
        }

        return new JsonResult(Unauthorized());
    }

    [HttpPost("approveHost")]
    public async Task<ActionResult<UserProfile>> ApproveHost([FromBody] JObject obj, [FromServices] UserProfileService userProfileService)
    {
        string username = obj["username"].ToString();
        UserProfile? user = await userProfileService.GetAsyncByUsername(username);
        
        if (user != null)
        {
            user.isApprovedHost = true;
            await userProfileService.UpdateAsync(user.uid, user);
            
            return user; 
        }

        return new JsonResult(Unauthorized());
    }

    [HttpPost("getUsers")]
    public async Task<ActionResult<List<UserProfile>>> GetUsers([FromBody] UserProfile user, [FromServices] UserProfileService userProfileService)
    {
        if (user.role == UserProfile.Role.Admin)
        {
            List<UserProfile> users = await userProfileService.GetAsyncAll();
            return users;
        }

        return new JsonResult(Unauthorized());
    }

    private string GenerateToken(UserProfile user)
    {
        var issuer = _configuration.GetValue<string>("Jwt:Issuer");
        var audience = _configuration.GetValue<string>("Jwt:Audience");
        var key = Encoding.ASCII.GetBytes
            (_configuration.GetValue<string>("Jwt:Key"));
        var signingCredentials = new SigningCredentials
        (new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha512Signature);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.username),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = signingCredentials
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