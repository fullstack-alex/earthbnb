using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Server.Model;
using Server.Services;

namespace Server.Controllers;

[ApiController, Route("[controller]")]
public class ListingController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ListingController(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    

    [HttpPost("simpleSearch")]
    public async Task<ActionResult<dynamic>> GetUser([FromBody] SearchObject searchObject, [FromServices] ListingService<dynamic> listingService)
    {
        List<dynamic> listings = await listingService.GetAsyncBySearchObject(searchObject);
        
        return listings;
    }
}