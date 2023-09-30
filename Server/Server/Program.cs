using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Server.Services;
using Server.Model;


var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("EarthBNBDatabase"));

X509Certificate2 cert = new X509Certificate2("myCA.pfx", "crime2010");
X509Store store = new X509Store(StoreName.My);
store.Open(OpenFlags.ReadWrite);
store.Add(cert);

builder.Services.AddCors(options =>
{
    
    var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy  =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddSingleton<UserProfileService>();
builder.Services.AddSingleton<ListingService<dynamic>>();
// builder.Services.AddSingleton<ReviewService>();
// builder.Services.AddSingleton<CalendarService>();

builder.Services.AddAuthorization();

// Add services to the container.

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string serverPath = @"D:\Alexandros\Projects\EarthBNB\Server\Server";
string keyPath = serverPath + @"\cert\localhost.key";
string crtPath = serverPath + @"\cert\localhost.crt";
System.Diagnostics.Process.Start("CMD.exe", "/c http-server -S -C " + crtPath + " -K "+ keyPath + " "+ serverPath);

builder.Services.AddHostedService<MyInitializer>();

var app = builder.Build();

// http-server -S -C D:\Alexandros\Projects\EarthBNB\Server\Server\cert\localhost.crt -K D:\Alexandros\Projects\EarthBNB\Server\Server\cert\localhost.key D:\Alexandros\Projects\EarthBNB\Server\Server
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseAuthentication();

app.MapControllers();

app.UseCors(MyAllowSpecificOrigins);


app.Run();