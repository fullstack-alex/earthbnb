namespace Server.Model;

public class UserProfile : UniqueClass
{
    public string username { get; set; }
    public string password { get; set; }
    public string name { get; set; }
    public string surname { get; set; }
    public string email { get; set; }
    public string phone { get; set; }
    public string role { get; set; }
    public string photoUrl { get; set; }
}