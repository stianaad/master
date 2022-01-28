using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Sheep
    {
        public int Id { get; set; }
        public int Name { get; set; }
    }

    public class TourLocationData
    {
        [Key]
        public int Id { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public DateTime TimePosition { get; set; }
        public int IdTour { get; set; }
        [JsonIgnore]
        public TourData Tour { get; set; }
    }

    public class TourData
    {
        [Key]
        public int IdTour { get; set; }
        public List<TourLocationData> Positions { get; set; }
        public List<SheepPositionData> SheepPositions { get; set; }
        public DateTime Start { get; set; }
    }

    public class MapAreaData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public double LongitudeDelta { get; set; }
        public double LatitudeDelta { get; set; }
        public DateTime TimePosition { get; set; }
    }

    public class SheepPositionData
    {
        [Key]
        public int Id { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public DateTime TimeOfObsevation { get; set; }
        public int SmallBrownSheep { get; set; }
        public int SmallWhiteSheep { get; set; }
        public int BigBrownSheep { get; set; }
        public int BigWhiteSheep { get; set; }
        public int TotalNumberOfSheep { get; set; }
        public int TieGreen { get; set; }
        public int TieRed { get; set; }
        public int TieYellow { get; set; }
        public int TieBlue { get; set; }
        public int IdTour { get; set; }
        [JsonIgnore]
        public TourData Tour { get; set; }

    }
}
