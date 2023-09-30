using Microsoft.AspNetCore.Identity;
using Server.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Server.Services;

public class CalendarService : MongoService<Calendar>
{
    public CalendarService(IOptions<DatabaseSettings> databaseSettings)
        : base(databaseSettings, MongoDbCollectionsStatics.CALENDAR)
    {
        mongoDatabase.CreateCollection("Calendar");

    }
}