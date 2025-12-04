using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.API.Models;
using Azure;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.VisualBasic;
using backend.API.Models;

namespace backend.API.Data
{
    public class backendAPIContext : DbContext
    {
        public DbSet<backend.API.Models.Usercredentials> Usercredentials { get; set; } = default!;
        public DbSet<backend.API.Models.User> User { get; set; } = default!;
        public DbSet<backend.API.Models.Questionary> Questionary { get; set; } = default!;
        public DbSet<backend.API.Models.Apraisal> Apraisal { get; set; } = default!;

        public backendAPIContext(DbContextOptions<backendAPIContext> options): base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //BuildDateFields(modelBuilder);

            modelBuilder.Entity<Apraisal>().Property(x => x.Date).HasDefaultValueSql("getdate()");
            modelBuilder.Entity<Questionary>().Property(x => x.Date).HasDefaultValueSql("getdate()");


            //EF to create relations in Database Manager - User - Subordinate
            modelBuilder.Entity<Apraisal>(entity =>
            {
                entity.ToTable("Apraisal");

                entity.HasOne(s => s.Subordinate)
                    .WithMany(u => u.ApraisalsReceived)
                    .HasForeignKey(s => s.SubordinateId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.Manager)
                    .WithMany(u => u.ApraisalsMade)
                    .HasForeignKey(s => s.ManagerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<User>()
            .HasOne(u => u.Manager)
            .WithMany(m => m.Subordinates)
            .HasForeignKey(u => u.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        }

    }
}
