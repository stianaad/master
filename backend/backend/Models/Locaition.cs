using System;

namespace backend.Models
{
    public class TourLocaition
    {
        public int TourId { get; set; }
        public DateTime Timestamp { get; set; }
        public Location Location { get; set; }

        public TourLocaition(int tourId, DateTime timestamp, Location location)
        {
            TourId = tourId;
            Timestamp = timestamp;
            Location =  location;
        } 

        public TourLocaition(int tourId, long timeSinceEpoch, double longitude, double latitude)
        {
            TourId = tourId;
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            Timestamp = dateTime.AddSeconds(timeSinceEpoch);
            Location = new Location(longitude, latitude);
        }
    }

    public class Location
    {
        public double Longitude { get; set; }
        public double Latitude { get; set; }

        public Location(double longitude, double latitude)
        {
            Longitude = longitude;
            Latitude = latitude;
        }
    }
}
