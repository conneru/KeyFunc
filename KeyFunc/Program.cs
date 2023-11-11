using Microsoft.AspNetCore.Http.Headers;
using KeyFunc.Data;
using KeyFunc.Repos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "KeyFunc.Client/build";
});
builder.Services.AddDbContext<KeyFuncContext>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IChatRepository, ChatRepository>();
builder.Services.AddTransient<IImageRepository, ImageRespository>();
builder.Services.AddTransient<IMessageRepository, MessageRepository>();
builder.Services.AddTransient<IPostRepository, PostRepository>();


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


//dbContext.Add(new User { Username = "crust", Email = "nuts@mail.com", Password = "buts", JoinedOn = DateTime.Now });
//dbContext.Add(new User { Username = "stuft", Email = "n@mail.com", Password = "buts", JoinedOn = DateTime.Now });
//dbContext.Add(new User { Username = "butts", Email = "nu@mail.com", Password = "buts", JoinedOn = DateTime.Now });


//dbContext.Add(new UserFollow { FollowerId = 1, FollowingId = 2 });
//dbContext.Add(new UserFollow { FollowerId = 3, FollowingId = 1 });

//var chat = dbContext.Chats.Where(e => e.Id == 1).Single();
//var user = dbContext.Users.Where(e => e.Id == 1).Include(e=>e.Followers).Include(e=>e.Following).Single();

//user.Following.Add(dbContext.Users.Where(e=>e.Id == 2).Single());
//user.Followers.Add(dbContext.Users.Where(e => e.Id == 3).Single());



//dbContext.SaveChanges();
async void testDb()
{

    //var chat = await dbContext.Chats.Where(e => e.Id == 1).Include(e => e.Messages).Include(e => e.Users).SingleAsync();
    //var message = new Message { UserId = 2, Content = "imghstreghsdetrhstrdeh", CreatedAt = DateTime.Now, Edited = false };
    //var user = await dbContext.Users.Where(e => e.Id == 2).Include(e => e.Chats).SingleAsync();

    //chat.Messages.Add(message);

    //chat.Users.Add(user);

    //user.Chats.Add(chat);

    //dbContext.SaveChanges();

    //foreach (Message m in chat.Messages)
    //{
    //    Console.WriteLine($"{m.User.Username}: {m.Content}");
    //}

    //var user = await dbContext.Users.Where(e => e.Id == 1).Include(e => e.Followers).Include(e => e.Following).FirstAsync();

    //Console.WriteLine("imhere");
    //foreach (User u in user.Followers)
    //{
    //    Console.WriteLine(u.Username);
    //}

    //Console.WriteLine("Following");
    //foreach (User u in user.Following)
    //{
    //    Console.WriteLine(u.Username);
    //}
};

//testDb();

app.Run();

