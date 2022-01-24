using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class SheepContext : DbContext
    {
        public SheepContext(DbContextOptions<SheepContext> options) : base(options)
        { }

        public DbSet<Sheep> Sheep { get; set; } = null;
    }
}
