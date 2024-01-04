using System;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using KeyFunc.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace KeyFunc.Data
{
	public class KeyFuncContext : DbContext
	{

        public DbSet<User> Users
        {
            get;set;
        }

        public DbSet<Post> Posts
        {
            get;set;
        }

        public DbSet<Image> Images
        {
            get;set;
        }

        public DbSet<Message> Messages
        {
            get;set;
        }

        public DbSet<Chat> Chats
        {
            get;set;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=127.0.0.1;port=3306;user=root;password=bustanut;database=KeyFunc;");
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Username);
                e.Property(e => e.Email);
                e.Property(e => e.Password);
                e.Property(e => e.JoinedOn);
                e.Property(e => e.ProfilePic).IsRequired(false);
                e.Property(e => e.RefreshToken).IsRequired(false);
                e.Property(e => e.RefreshTokenExp).IsRequired(false);
                e.HasMany(e => e.Following).WithMany(e=>e.Followers).UsingEntity(e=> e.ToTable("UserFollows"));
                e.HasMany(e => e.Posts).WithOne(p => p.User).HasForeignKey(p=>p.UserId);
                e.HasMany(e => e.Chats).WithMany(c => c.Users);
                e.HasMany(e => e.Messages).WithOne(e => e.User).HasForeignKey(e=>e.UserId);
                e.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Chat>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Name);
                e.HasMany(e => e.Messages).WithOne(e => e.Chat).HasForeignKey(e=>e.ChatId);
                e.HasMany(e => e.Users).WithMany(u => u.Chats);
                e.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Image>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.PostId).IsRequired(false);
                e.Property(e => e.OrderNum).IsRequired(false);
                e.Property(e => e.URL);
                e.HasKey(e=>e.Id);
            });

            modelBuilder.Entity<Post>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Description);
                e.Property(e => e.Likes);
                e.Property(e => e.createdAt);
                e.HasMany(e => e.Comments).WithOne(e => e.Post).HasForeignKey(e=>e.PostId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
                e.HasMany(e => e.Images).WithOne(e => e.Post).HasForeignKey(e=>e.PostId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Message>(e=>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Content);
                e.Property(e => e.CreatedAt);
                e.Property(e => e.Edited);
                e.Property(e => e.UserId);
            });
        }

    }
}

