using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.SpaServices.Extensions;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.EntityFrameworkCore;
using KeyFunc.Data;
using KeyFunc.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "KeyFunc.Client/build";
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

var spaPath = "/spaApp";

if (app.Environment.IsDevelopment())
{
    app.MapWhen(y => y.Request.Path.StartsWithSegments(spaPath), client =>
    {
        client.UseSpa(spa =>
        {
            spa.UseProxyToSpaDevelopmentServer("https://localhost:44448");
        });
    });
}
else
{
    app.Map(new PathString(spaPath), client =>
    {
        client.UseSpaStaticFiles();
        client.UseSpa(spa => {
            spa.Options.SourcePath = "KeyFunc.Client";

            // adds no-store header to index page to prevent deployment issues (prevent linking to old .js files)
            // .js and other static resources are still cached by the browser
            spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue
                    {
                        NoCache = true,
                        NoStore = true,
                        MustRevalidate = true
                    };
                }
            };
        });
    });
}



var dbContext = new KeyFuncContext();


//dbContext.Add(new User { Username = "crust", Email = "nuts@mail.com", Password = "buts", JoinedOn = new DateOnly(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day));
//var following = dbContext.Users.Single(u => u.Id == 1);
//var follower1 = dbContext.Users.Single(u => u.Id == 2);
//var follower2 = dbContext.Users.Single(u => u.Id == 3);



dbContext.Add(new UserFollow { FollowerId = 1, FollowingId = 2 });
//dbContext.Add(new UserFollow { FollowerId = 3, FollowingId = 1});

//dbContext.Add(new User { Username = "must", Email = "nuts@mail.com", Password = "buts", JoinedOn = new DateOnly(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day) });
//dbContext.Add(new User { Username = "bust", Email = "nuts@mail.com", Password = "buts", JoinedOn = new DateOnly(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day) });

dbContext.SaveChanges();
async void testDb() {


    var user = await dbContext.Users.Where(e => e.Id == 1).Include(e => e.Followers).Include(e=>e.Following).FirstAsync();

    Console.WriteLine("imhere");
    foreach (var u in user.Followers)
    {
        var newUser = await dbContext.Users.Where(e => e.Id == u.FollowerId).FirstAsync();
        Console.WriteLine(newUser.Username);
    }

    Console.WriteLine("Following");
    foreach (var u in user.Following)   
    {
        var newUser = await dbContext.Users.Where(e => e.Id == u.FollowingId).FirstAsync();
        Console.WriteLine(newUser.Username);
    }


};

testDb();

app.Run();

