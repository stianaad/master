using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class SheepContext : DbContext
    {
        public DbSet<TourData> Tours { get; set; }
        public DbSet<TourLocationData> TourLocations { get; set; }
        public DbSet<SheepPositionData> SheepPositions { get; set; }
        public DbSet<DeadSheepPositionData> DeadSheepPositions { get; set; }
        public DbSet<PreditorTourPosition> PreditorTourPosition { get; set; }
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

            modelBuilder.Entity<DeadSheepPositionData>()
                .HasOne(deadSheep => deadSheep.Tour)
                .WithMany(tour => tour.DeadSheepPositions)
                .HasForeignKey(deadSheep => deadSheep.IdTour)
                .HasPrincipalKey(tour => tour.IdTour);

            modelBuilder.Entity<PreditorTourPosition>()
                .HasOne(pred => pred.Tour)
                .WithMany(tour => tour.PreditorTourPosition)
                .HasForeignKey(pred => pred.IdTour)
                .HasPrincipalKey(tour => tour.IdTour);
        }

        public DbSet<Sheep> Sheep { get; set; } = null;
    }
}
