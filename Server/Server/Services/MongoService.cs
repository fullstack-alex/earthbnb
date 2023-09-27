using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using Server.Model;

namespace Server.Services;

public abstract class MongoService<T> where  T : UniqueClass
{
    public readonly IMongoCollection<T> _collection;

    public MongoService(IOptions<DatabaseSettings> databaseSettings, string collectionName)
    {
        var mongoClient = new MongoClient(
            databaseSettings.Value.ConnectionString);
        
        var conventionPack = new ConventionPack { new IgnoreExtraElementsConvention(true) };
        ConventionRegistry.Register("IgnoreExtraElements", conventionPack, type => true);

        var mongoDatabase = mongoClient.GetDatabase(
            databaseSettings.Value.DatabaseName);

        _collection = mongoDatabase.GetCollection<T>(
            collectionName);
    }

    public async Task<List<T>> GetAsync() =>
        await _collection.Find(_ => true).ToListAsync();

    public async Task<T?> GetAsync(string uid) =>
        await _collection.Find(x => x.uid == uid).FirstOrDefaultAsync();

    public async Task CreateAsync(T newUserProfile) =>
        await _collection.InsertOneAsync(newUserProfile);

    public async Task UpdateAsync(string uid, T updatedUserProfile) =>
        await _collection.ReplaceOneAsync(x => x.uid == uid, updatedUserProfile);

    public async Task RemoveAsync(string uid) =>
        await _collection.DeleteOneAsync(x => x.uid == uid);
}