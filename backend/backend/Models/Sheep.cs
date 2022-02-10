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
        public string Email { get; set; }
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

    //Contains one tour with many big flocks
    public class CombinedSheepTourPositionData
    {
        public int IdTour { get; set; }
        public List<CombinedSheepPositionData> CombinedSheepPositions { get; set; }

        public CombinedSheepTourPositionData(int IdTour, List<CombinedSheepPositionData> combinedSheepPositions)
        {
            this.IdTour = IdTour;
            this.CombinedSheepPositions = combinedSheepPositions;
        }

        public override string ToString()
        {
            string text = "Tour Id " + IdTour+ "\n";
            CombinedSheepPositions.ForEach((CombinedSheepPositionData combined) =>
            {
                text += combined.ToString() + "\n";
            });
            return text;

        }
    }

    //Contains one big flock with multiple small flocks and locations
    public class CombinedSheepPositionData
    {
        public int TotalNumberOfSheep { get; set; }
        public int FlockId { get; set; }
        public List<Location> locations { get; set; }

        public CombinedSheepPositionData(int TotalNumberOfSheep, List<Location> locations, int FlockId)
        {
            this.TotalNumberOfSheep = TotalNumberOfSheep;
            this.locations = locations;
            this.FlockId = FlockId;
        }

        public override string ToString()
        {
            string text = "Total number " + TotalNumberOfSheep + " FlockID " +FlockId + "\n";
            locations.ForEach((Location location) =>
           {
               text += location.ToString() + "\n";
           });
            return text;

        }
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
        public int SmallBlackSheep { get; set; }
        public int BigBrownSheep { get; set; }
        public int BigWhiteSheep { get; set; }
        public int BigBlackSheep { get; set; }
        public int TotalNumberOfSheep { get; set; }
        public int TieGreen { get; set; }
        public int TieRed { get; set; }
        public int TieYellow { get; set; }
        public int TieBlue { get; set; }
        public int IdTour { get; set; }
        [JsonIgnore]
        public TourData Tour { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null) return false;
            SheepPositionData objAsPart = obj as SheepPositionData;
            if (objAsPart == null) return false;
            else return Equals(objAsPart);
        }

        public bool Equals(SheepPositionData other)
        {
            if (other == null) return false;
            return (this.Id ==other.Id);
        }
    }
}
