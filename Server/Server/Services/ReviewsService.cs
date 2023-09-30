using Microsoft.AspNetCore.Identity;
using Server.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Server.Services;

public class ReviewService : MongoService<Review>
{
    public ReviewService(IOptions<DatabaseSettings> databaseSettings)
        : base(databaseSettings, MongoDbCollectionsStatics.REVIEW)
    {
        mongoDatabase.CreateCollection("Review");

    }
}