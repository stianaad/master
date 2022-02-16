using backend.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace backend.Utils
{
    public static class FileUtils
    {
        public static List<TourLocaition> ReadTourLocationsFromGPXFile(this string path, int tourId, DateTime startTime)
        {
            List<TourLocaition> tourLocations = new List<TourLocaition>();
            try
            {
                DateTime currentTime = startTime;
                TimeSpan minute = TimeSpan.FromMinutes(1);
                string[] lines = System.IO.File.ReadAllLines(path);
                for (int i = 1; i < lines.Length; i++)
                {
                    string[] columns = lines[i].Split('\t');
                    Location location = new Location(columns[1].ToDouble(), columns[2].ToDouble());
                    tourLocations.Add(new TourLocaition(tourId, currentTime, location));
                    currentTime = currentTime + minute;
                }
                return tourLocations;
            } 
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            
        }

        public static TourData ReadTourDataFromFiles(IFormFile tourFile, IFormFile tourLocationFile, IFormFile sheepPositionFile, double speed)
        {
            if (tourFile != null && tourFile.Length > 0 && tourLocationFile != null && tourLocationFile.Length > 0 && sheepPositionFile != null && sheepPositionFile.Length > 0)
            {
                try
                {
                    TourData tourData = null;
                    using (StreamReader sr = new StreamReader(tourFile.OpenReadStream()))
                    {
                        tourData = ReadTourData(sr);
                    }
                    if (tourData != null)
                    {
                        List<TourLocationData> tourLocations = null;
                        using (StreamReader sr = new StreamReader(tourLocationFile.OpenReadStream()))
                        {
                            tourLocations = ReadTourLocations(sr, tourData.Start, speed);
                        }
                        List<SheepPositionData> sheepPositions = null;
                        using (StreamReader sr = new StreamReader(sheepPositionFile.OpenReadStream()))
                        {
                            sheepPositions = ReadSheepPositions(sr);
                        }
                        if (sheepPositions != null && tourLocations != null)
                        {
                            tourData.SheepPositions = sheepPositions;
                            tourData.Positions = tourLocations;
                            return tourData;
                        }

                    }

                }
                catch (Exception ex)
                {
                }

            }
            return null;
        }

        public static List<TourLocationData> ReadTourLocations(StreamReader sr, DateTime startTime, double speed)
        {
            List<TourLocationData> tourLocations = new List<TourLocationData>();
            DateTime currentTime = startTime;
            double lastLat = 0;
            double lastLong = 0;
            TimeSpan minute = TimeSpan.FromMinutes(1);
            sr.ReadLine();
            string line;
            // Read and display lines from the file until the end of
            // the file is reached.
            while ((line = sr.ReadLine()) != null)
            {
                string[] columns = line.Split('\t');
                double longitude = columns[1].ToDouble();
                double latitude = columns[2].ToDouble();
                if (lastLat != 0 && lastLong != 0)
                    currentTime = currentTime + TimeSpan.FromHours(MapUtils.GetTimeFromSpeed(lastLat, lastLong, latitude, longitude, speed));
                tourLocations.Add(new TourLocationData() { Latitude = latitude, Longitude = longitude, TimePosition = currentTime });
                lastLat = latitude;
                lastLong = longitude;
                //currentTime = currentTime + minute;
            }
            return tourLocations;
        }

        public static List<SheepPositionData> ReadSheepPositions(StreamReader sr)
        {
            List<SheepPositionData> sheepPositions = new List<SheepPositionData>();
            sr.ReadLine();
            string line;
            // Read and display lines from the file until the end of
            // the file is reached.
            while ((line = sr.ReadLine()) != null)
            {
                string[] columns = line.Split('\t');
                double longitude = columns[1].ToDouble();
                double latitude = columns[2].ToDouble();
                double longitudeDelta = columns[3].ToDouble();
                double latitudeDelta = columns[4].ToDouble();
                DateTime timeOfObsevation = columns[5].ToDateTime();
                int smallBrownSheeps = columns[6].ToInt();
                int smallWhiteSheeps = columns[7].ToInt();
                int bigBrownSheeps = columns[8].ToInt();
                int bigWhiteSheeps = columns[9].ToInt();
                int totalNumberOfSheeps = columns[10].ToInt();
                int tieGreen = columns[11].ToInt();
                int tieRed = columns[12].ToInt();
                int tieYellow = columns[13].ToInt();
                int tieBlue = columns[14].ToInt();
                sheepPositions.Add(new SheepPositionData()
                {
                    Longitude = longitude,
                    Latitude = latitude,
                    TimeOfObsevation = timeOfObsevation,
                    SmallBrownSheep = smallBrownSheeps,
                    SmallWhiteSheep = smallWhiteSheeps,
                    BigBrownSheep = bigBrownSheeps,
                    BigWhiteSheep = bigWhiteSheeps,
                    TotalNumberOfSheep = totalNumberOfSheeps,
                    TieGreen = tieGreen,
                    TieBlue = tieBlue,
                    TieYellow = tieYellow,
                    TieRed = tieRed,
                });

            }
            return sheepPositions;
        }

        public static TourData ReadTourData(StreamReader sr)
        {
            TourData tour = new TourData();
            sr.ReadLine();
            string tourData = sr.ReadLine();
            if (tourData != null)
            {
                string[] ss = tourData.Split('\t');
                tour.IdTour = ss[0].Trim().ToInt();
                return new TourData() { Start = ss[1].ToDateTime() };
            }
            return null;
        }

        public static double ToDouble(this string number)
        {
            double result = 0;
            //if (Double.TryParse(number, out result))
            //    return result;
            //else
            //    return 0;
            try
            {
                return Double.Parse(number, CultureInfo.InvariantCulture);
            }
            catch(Exception ex) { }
            return 0;

        }

        public static int ToInt(this string number)
        {
            try
            {
                return int.Parse(number, CultureInfo.InvariantCulture);
            }
            catch (Exception ex) { }
            return 0;
        }

        public static DateTime ToDateTime(this string datetime)
        {
            try
            {
                return DateTime.Parse(datetime, CultureInfo.InvariantCulture);
            }
            catch (Exception ex) { }
            return DateTime.MinValue;
        }

        public static List<TourData> GenerateTours()
        {
            List<TourData> tours = new List<TourData>();
            DateTime start = new DateTime(2019, 5, 17);
            (List<SheepPositionTestData> sheepPositions, SheepPositionTestData baseSheep) = ReadTestDataHerds();
            int id = 0;
            for (int year = 2019; year < 2020; year++)
            {
                GenerateYearlyTours(year, tours, sheepPositions, baseSheep, id);
            }
            return tours;
        }

        public static void GenerateYearlyTours(int year, List<TourData> tours, List<SheepPositionTestData> measPoints, SheepPositionTestData baseSheep, int id)
        {
            DateTime currentTime = new DateTime(year, 5, 17);
            DateTime endTime = new DateTime(year, 9, 15);
            GenerateDeparturePeriod(tours, currentTime);
            while (currentTime < endTime.Subtract(TimeSpan.FromDays(14)))
            {
                Random random = new Random();
                List<SheepPositionData> sheepPositions = new List<SheepPositionData>();
                foreach(SheepPositionTestData sheep in measPoints)
                {
                    int degrees = random.Next(0, 360);
                    int distance = random.Next(50, 500);
                    (double lat, double lng) = MapUtils.CalculateNewPoint(sheep.Latitude, sheep.Longitude, distance, degrees);
                    sheepPositions.Add(new SheepPositionData()
                    {
                        Latitude = lat,
                        Longitude = lng,
                        TotalNumberOfSheep = sheep.TotalNumberOfSheep,
                        TimeOfObsevation = currentTime,
                    });
                }
                tours.Add(new TourData()
                {
                    SheepPositions = sheepPositions,
                    Positions = new List<TourLocationData>(),
                    Start = currentTime,
                    IdTour = id
                });
                currentTime = currentTime.AddDays(7);
                id++;
            }

            GenerateArrivalePeriod(tours, currentTime);
            
        }

        public static void GenerateDeparturePeriod(List<TourData> tours, DateTime currentTime)
        {

        }

        public static void GenerateArrivalePeriod(List<TourData> tours, DateTime currentTime)
        {

        }

        public static (List<SheepPositionTestData>, SheepPositionTestData) ReadTestDataHerds()
        {
            List<SheepPositionTestData> sheeps = new List<SheepPositionTestData>();
            SheepPositionTestData baseSheeps = null; 
            try
            {
                string[] lines = System.IO.File.ReadAllLines(Path.Combine(Directory.GetCurrentDirectory(), "TestData/Svein-olaf-tur.tsv"));
                if (lines.Length > 2)
                {
                    string[] columns = lines[1].Split('\t');
                    baseSheeps = new SheepPositionTestData()
                    {
                        Latitude = columns[1].ToDouble(),
                        Longitude = columns[0].ToDouble(),
                        TotalNumberOfSheep = columns[2].ToInt()
                    };
                    for (int i = 2; i < lines.Length; i++)
                    {
                        columns = lines[i].Split('\t');
                        sheeps.Add(new SheepPositionTestData()
                        {
                            Latitude = columns[1].ToDouble(),
                            Longitude = columns[0].ToDouble(),
                            TotalNumberOfSheep = columns[2].ToInt(),
                            FromAngle = columns[3].ToInt(),
                            ToAngle = columns[4].ToInt(),
                            Distance = columns[5].ToInt(),
                        });

                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return (sheeps, baseSheeps);
        }
    }
}
