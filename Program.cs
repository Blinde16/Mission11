using Microsoft.EntityFrameworkCore;
using Mission11.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3500")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Optional if you're using cookies/auth
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
