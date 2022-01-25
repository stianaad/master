using backend.Models;
using System;
using System.Collections.Generic;

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
                    Location location = new Location(columns[1].TryParseDouble(), columns[2].TryParseDouble());
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

        public static double TryParseDouble(this string number)
        {
            double result = 0;
            //if (Double.TryParse(number, out result))
            //    return result;
            //else
            //    return 0;
            try
            {
                return Double.Parse(number);
            }
            catch(Exception ex) { }
            return 0;

        }
    }
}
