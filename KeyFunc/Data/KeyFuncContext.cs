﻿using System;
using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore;
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

        public DbSet<UserFollow> FollowRelations
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

            modelBuilder.Entity<UserFollow>(e =>
            {
                e.HasOne(e => e.Follower).WithMany(e => e.Following).HasForeignKey(e => e.FollowerId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(e => e.Following).WithMany(e => e.Followers).HasForeignKey(e => e.FollowingId).OnDelete(DeleteBehavior.Restrict);
                e.HasKey(e=> new { e.FollowerId, e.FollowingId});
            }); ;

            modelBuilder.Entity<User>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Username);
                e.Property(e => e.Email);
                e.Property(e => e.Password);
                e.Property(e => e.JoinedOn);
                e.HasMany(e => e.Posts).WithOne(p => p.User).HasForeignKey(p=>p.UserId);
                e.HasOne(e => e.ProfilePic).WithOne(i => i.User).HasForeignKey<Image>("UserId").IsRequired(false);
                e.HasMany(e => e.Chats).WithMany(c => c.Users);
                e.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Chat>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Name);
                e.HasMany(e => e.Messages).WithOne(e => e.Chat).HasForeignKey("ChatId");
                e.HasMany(e => e.Users).WithMany(e => e.Chats);
                e.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Image>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.PostId);
                e.Property(e => e.OrderNum);
                e.Property(e => e.URL);
                e.HasKey(e=>e.Id);
            });

            modelBuilder.Entity<Post>(e =>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Description);
                e.HasMany(e => e.Comments).WithOne(e => e.Post).HasForeignKey("PostId");
                e.HasMany(e => e.Images).WithOne(e => e.Post).HasForeignKey(e=>e.PostId);
            });

            modelBuilder.Entity<Message>(e=>
            {
                e.Property(e => e.Id).ValueGeneratedOnAdd();
                e.Property(e => e.Content);
                e.Property(e => e.CreatedAt);
                e.Property(e => e.Edited);
                e.HasOne(e => e.User).WithMany().HasForeignKey("UserId");
            });
        }

    }
}
