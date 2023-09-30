using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Server.Model;

public class UserProfile : UniqueClass
{
    public enum  Role
    {
        Guest,
        Host,
        Admin
    }
    
    public string username { get; set; }
    public string password { get; set; }
    public string name { get; set; }
    public string surname { get; set; }
    
    [DataType(DataType.EmailAddress)]
    public string email { get; set; }
    [DataType(DataType.PhoneNumber)]
    public string phone { get; set; }
    public Role role { get; set; }
    [DataType(DataType.ImageUrl)]
    public string photoUrl { get; set; }

    public bool isApprovedHost { get; set; }
    
    public void ApproveAsHost()
    {
        if (role == Role.Host && !isApprovedHost)
        {
            isApprovedHost = true;
        }
    }
}