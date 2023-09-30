using System.Globalization;
using Microsoft.AspNetCore.Identity;
using Server.Model;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using System.Linq;
using MongoDB.Bson;

namespace Server.Services;

public class ListingService<dynamic>
{
    public IMongoCollection<dynamic> listingCollection;
    public IMongoCollection<BsonDocument> calendarCollection;
    public IMongoDatabase mongoDatabase;
    
    public ListingService(IOptions<DatabaseSettings> databaseSettings)
    { 
        var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
        
        var conventionPack = new ConventionPack { new IgnoreExtraElementsConvention(true) };
        ConventionRegistry.Register("IgnoreExtraElements", conventionPack, type => true);

        mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);

        calendarCollection = mongoDatabase.GetCollection<BsonDocument>(MongoDbCollectionsStatics.CALENDAR);
        listingCollection = mongoDatabase.GetCollection<dynamic>(MongoDbCollectionsStatics.LISTING);
    }

    public class TestClass
    {
        public string email;
        public UserProfile.Role role;
    }

    public async Task<List<dynamic>> GetAsyncBySearchObject(SearchObject so)
    {

        // var proj = Builders<BsonDocument>.Projection.Include("email").Exclude("_id").Include("role");
        // var newFilter = Builders<BsonDocument>.Filter.Eq("role" , 1);
        // var joinedCollection = await listingCollection.Aggregate()
        //     .Lookup("test", "username", "username", "username") //join
        //     .Unwind("username") //flatten
        //     .Project(proj)  //select
        //     // .MatchBsonDocument   //where
        //     .As<BsonDocument>()
        //     .ToListAsync();

        // joinedCollection.First()["email"]    
        var allCalendarFilters = Builders<BsonDocument>.Filter.Empty;
        var dateDiff = (so.to - so.from).Days + 1;
        // for (int i = 0; i <= dateDiff; i++)
        // {
        //     var filter = Builders<BsonDocument>.Filter.Eq("date", so.from.AddDays(i).ToString("yyyy-MM-dd"));
        //     allCalendarFilters &= filter;
        // }
        Console.WriteLine("datediff " + dateDiff);
        var projection = Builders<BsonDocument>.Projection.Include("listing_id").Exclude("_id");
        var allFilters = Builders<BsonDocument>.Filter.Empty;
        var sortByPriceFilter = Builders<BsonDocument>.Sort.Ascending("price");
        var guestCountFilter = Builders<BsonDocument>.Filter.Gte("accommodates", so.guestsCount);
        var countFilter = Builders<BsonDocument>.Filter.Eq("count", dateDiff);
        
        var fromFilter = Builders<BsonDocument>.Filter.Gte("date", so.from.ToString("yyyy-MM-dd"));
        var toFilter = Builders<BsonDocument>.Filter.Lte("date", so.to.ToString("yyyy-MM-dd"));
        var availableFilter = Builders<BsonDocument>.Filter.Eq("available", "t");
        allCalendarFilters &= availableFilter & fromFilter & toFilter;

        var joinedCollection = await calendarCollection.Aggregate()
            .Match(allCalendarFilters)
            .Project(projection)
            .Group(u => u["listing_id"],
                i => new
                {
                    countId = i.Key,
                    count = i.Count()
                })
            .As<BsonDocument>()
            .Match(countFilter)
            .ToListAsync();
            // .Aggregate()
            // .Lookup("Calendar", "id", "listing_id", "calendar")
            // .Match(allFilters)
            // .Unwind("calendar")
            // .Sort(sortByPriceFilter)
            // .Limit(10)
            // .Project(projection)
            // .Skip(so.page * 10)
            // .As<BsonDocument>()
            // .ToListAsync();
        
        Console.WriteLine("all: " + joinedCollection.ToJson() + "\n length: " + joinedCollection.Count());
        // var dateFilter = Builders<dynamic>.Filter.Eq("id", 5731498);
        // var dateFilter = Builders<dynamic>.Filter.Eq("id", 5731498);

        // allFilters &= dateFilter;
        // return await collection.FindSync(guestCountFilter).ToListAsync();



        // var qCalendarCollection = calendarCollection.AsQueryable();
        // var qListingCollection = listingCollection.AsQueryable();
    
        // var query =
        //     (from c in listingCollection
        //         where c.age == 5
        //         orderby c.age
        //         select c.age);
                
            // from t in ModelQuery.Query<TestObject>()
            // where (componentIds.Contains(t.ComponentId) 
            //        && productIds.Contains(t.ProductId))
            // select t;
        // return query;
        // qCalendarCollection.Where(c=>)
        return new List<dynamic>();
        // return await listingCollection.FindSync(filter: allFilters, new FindOptions<dynamic>(){Sort = sortByPriceFilter, Limit = 10, Skip = so.page * 10}).ToListAsync();
    }
    
    
    
}