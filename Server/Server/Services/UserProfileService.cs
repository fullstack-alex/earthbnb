using Server.Model;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Server.Services;

public class UserProfileService : MongoService<UserProfile>
{
    public UserProfileService(IOptions<DatabaseSettings> databaseSettings)
        : base(databaseSettings, MongoDbCollectionsStatics.USER_PROFILE)
    {}
    
    public async Task<UserProfile?> GetAsyncByUsername(string username) =>
        await _collection.Find(x => x.username == username).FirstOrDefaultAsync();
    
    public async Task<UserProfile?> GetAsyncByCredentials(Credentials credentials) =>
        await _collection.Find(x => x.username == credentials.username && x.password == credentials.password).FirstOrDefaultAsync();
    //
    // public async void CreateUserProfile()
    // {
    //     UserProfile up = new UserProfile();
    //     up.uid = Guid.NewGuid().ToString();
    //
    //     await CreateAsync(up);
    //     
    //     return up;
    // }
}