using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class SheepContext : DbContext
    {
        public DbSet<TourData> Tours { get; set; }
        public DbSet<TourLocationData> TourLocations { get; set; }
        public DbSet<SheepPositionData> SheepPositions { get; set; }
        public SheepContext(DbContextOptions<SheepContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TourLocationData>()
                .HasOne(tourLocation => tourLocation.Tour)
                .WithMany(tour => tour.Positions)
                .HasForeignKey(tourLocation => tourLocation.IdTour)
                .HasPrincipalKey(tour => tour.IdTour);

            modelBuilder.Entity<SheepPositionData>()
                .HasOne(sheepPosition => sheepPosition.Tour)
                .WithMany(tour => tour.SheepPositions)
                .HasForeignKey(sheepPosition => sheepPosition.IdTour)
                .HasPrincipalKey(tour => tour.IdTour);
        }

        public DbSet<Sheep> Sheep { get; set; } = null;
    }
}
