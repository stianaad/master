using System;
using System.Collections.Generic;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Utils
{
    public static class MapUtils
    {
        const int EarthRadiusKm = 6371;
        // Returns distance in km
        public static double GetDistance(double fromLat, double fromLong, double toLat, double toLong)
        {
            double dLat = (toLat - fromLat).DegressToRadians();
            double dLong = (toLong - fromLong).DegressToRadians();

            double lat1 = fromLat.DegressToRadians();
            double lat2 = toLat.DegressToRadians();

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Sin(dLong / 2) * Math.Sin(dLong / 2) * Math.Cos(lat1) * Math.Cos(lat2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return EarthRadiusKm * c * 1000;

        }

        // Returns time in hours 
        public static double GetTimeFromSpeed(double distance, double speed)
        {
            return distance / speed;
        }

        public static double GetTimeFromSpeed(double fromLat, double fromLong, double toLat, double toLong, double speed)
        {
            return GetDistance(fromLat, fromLong, toLat, toLong) / speed;
        }

        public static double DegressToRadians(this double deg)
        {
            return deg * Math.PI / 180;
        }

        public static double RadiansToDegrees(this double rad)
        {
            return (180 / Math.PI) * rad;
        }

        public static (double, double) CalculateNewPoint(double lat, double lng, double distance, double angle)
        {
            distance = distance / 1000;

            double brng = angle.DegressToRadians();
            //double newLat = lat + (distance * Math.Cos(angle.DegressToRadians()));
            //double newLng = lng + (distance / 1000 * Math.Sin(angle.DegressToRadians()));
            double latRad = lat.DegressToRadians(); // #Current lat point converted to radians
            double lonRad = lng.DegressToRadians(); // #Current long point converted to radians

            double distFrac = distance / EarthRadiusKm;

            double lat2 = Math.Asin(Math.Sin(latRad) * Math.Cos(distFrac) + Math.Cos(latRad) * Math.Sin(distFrac) * Math.Cos(brng));

            //double lon2 = lonRad + Math.Atan2(Math.Sin(brng) * Math.Sin(distFrac) * Math.Cos(lat2),
            //             Math.Cos(distFrac) - Math.Sin(lat2) * Math.Sin(lat2));

            double lon2 = lonRad + Math.Atan2(Math.Sin(brng) * Math.Sin(distFrac) * Math.Cos(latRad), Math.Cos(distFrac) - Math.Sin(latRad) * Math.Sin(lat2));

            //lon2 = (lonRad + lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

            lat2 = lat2.RadiansToDegrees();
            lon2 = lon2.RadiansToDegrees();
            return (lat2, lon2);
        }

        //Find the closest flock on the next tour
        public static async Task<List<CombinedSheepTourPositionData>> FindClosestFlockOnNextTour(List<CombinedSheepTourPositionData> listCombinedTour)
        {
            int index = 0;
            listCombinedTour.ForEach((CombinedSheepTourPositionData combinedSheepTour) =>
            {
                combinedSheepTour.CombinedSheepPositions.ForEach((CombinedSheepPositionData combinedSheep) =>
                {
                    //Check the next tour
                    if (listCombinedTour.Count > index + 1)
                    {
                        double closestDistance = 1000000;
                        int closestCombinedSheepIndex = -1;
                        combinedSheep.locations.ForEach(async (Location currentLocation) =>
                        {
                        
                            (closestDistance, closestCombinedSheepIndex) = await FindClosestFlock(listCombinedTour, index, currentLocation, closestDistance, closestCombinedSheepIndex);
                        });
                    //Set Id on the closest flock
                    listCombinedTour[index + 1].CombinedSheepPositions[closestCombinedSheepIndex].FlockId = combinedSheep.FlockId;
                    }
                });
                index++;
                //Console.WriteLine(combinedSheepTour);
            });

            return listCombinedTour;
        }

        public static async Task<(double, int)> FindClosestFlock(List<CombinedSheepTourPositionData> listCombinedTour, int index, Location currentLocation, double closestDistance, int closestCombinedSheepIndex)
        {
            int indexCombinedSheepPosition = 0;
            //Loop through every big flock
            listCombinedTour[index + 1].CombinedSheepPositions.ForEach((CombinedSheepPositionData nextCombinedSheep) =>
            {
                //Each flock in the big flock
                nextCombinedSheep.locations.ForEach((Location nextLocation) =>
                {
                    double distance = GetDistance(currentLocation.Latitude, currentLocation.Longitude, nextLocation.Latitude, nextLocation.Longitude);
                    if(distance < closestDistance)
                    {
                        closestDistance = distance;
                        closestCombinedSheepIndex = indexCombinedSheepPosition;
                    }
                });
                indexCombinedSheepPosition++;
            });

            return (closestDistance, closestCombinedSheepIndex);
        }

        //Return big flocks to each tour
        public static async Task<List<CombinedSheepTourPositionData>> FindBigFlock(List<SheepPositionData> sheepPositions)
        {
            List<List<SheepPositionData>> flockOfSheep = new List<List<SheepPositionData>>();
            foreach ( SheepPositionData sheepCurrentTour in sheepPositions )
            {
                int indexFlock = await FindCurrentSheepFlockData(flockOfSheep, sheepCurrentTour);
                List<SheepPositionData> flock = new List<SheepPositionData>();

                //If the sheepflock exist from before
                if (indexFlock > -1)
                {
                    flock = flockOfSheep[indexFlock];
                } else
                {
                    flock.Add(sheepCurrentTour );
                }
                //Loop through all positions on same tour
                foreach (SheepPositionData sheepNextTour in sheepPositions)
                {
                    //Check that it is the same tour
                    if(sheepNextTour.IdTour != sheepCurrentTour.IdTour)
                    {
                        continue;
                    }
                    double distance = GetDistance(sheepCurrentTour.Latitude, sheepCurrentTour.Longitude, sheepNextTour.Latitude, sheepNextTour.Longitude);
                    if(distance < 500 && distance != 0 && !flock.Exists(s => s.Id == sheepNextTour.Id))
                    {
                        flock.Add(sheepNextTour);
                        //Console.WriteLine("Fra ID" + sheepCurrentTour.Id + "Til ID" + sheepNextTour.Id+ "Distance  " + distance);
                    }
                }
                //ADD the new array with flock to twodimensional array
                if (indexFlock > -1)
                {
                    flockOfSheep[indexFlock] = flock;
                } else
                {
                    flockOfSheep.Add(flock);
                }
            }

            List<CombinedSheepTourPositionData> resCombined = await CreateCombinedSheepPosition(flockOfSheep);
            return resCombined;
        }

        //Create a new list with objects containing total number and positions.
        public static async Task<List<CombinedSheepTourPositionData>> CreateCombinedSheepPosition(List<List<SheepPositionData>> flockOfSheep)
        {
            int index = 0;
            List<CombinedSheepTourPositionData> combinedTour = new List<CombinedSheepTourPositionData>();
            List<CombinedSheepPositionData> combined = new List<CombinedSheepPositionData>();
            flockOfSheep.ForEach((List<SheepPositionData> sheepFlock) =>
            {
                if (sheepFlock.Count() > 0)
                {
                    int totalNumberOfSheep = 0;
                    int numberOfBlackSheep = 0;
                    int numberOfGreySheep = 0;
                    int numberOfWhiteSheep = 0;
                    List<Location> locations = new List<Location>();
                    int idTour = sheepFlock[0].IdTour;
                    DateTime dateTime = sheepFlock[0].TimeOfObsevation;
                    sheepFlock.ForEach((SheepPositionData sheep) =>
                    {
                        numberOfBlackSheep += sheep.BigBlackSheep + sheep.SmallBlackSheep;
                        numberOfGreySheep += sheep.BigBrownSheep + sheep.SmallBrownSheep;
                        numberOfWhiteSheep += sheep.BigWhiteSheep + sheep.SmallWhiteSheep;
                        totalNumberOfSheep += sheep.TotalNumberOfSheep;
                        locations.Add(new Location(sheep.Longitude, sheep.Latitude));
                    });
                    CombinedSheepPositionData data = new CombinedSheepPositionData(totalNumberOfSheep, locations, index, numberOfBlackSheep, numberOfWhiteSheep, numberOfGreySheep);
                    //Console.WriteLine(data.ToString());
                    combined.Add(data);
                    //If the next sheepFlock is on the next tour, add all CombinedSheepPosition to the CombinedSheepTourPosition
                    if((flockOfSheep.Count > index+1 && flockOfSheep[index+1][0].IdTour != sheepFlock[0].IdTour) || flockOfSheep.Count == index + 1)
                    {
                        CombinedSheepTourPositionData dataTour =  new CombinedSheepTourPositionData(sheepFlock[0].IdTour, combined, dateTime);
                        //Console.WriteLine(dataTour);
                        combinedTour.Add(dataTour);
                        combined = new List<CombinedSheepPositionData>();
                    }
                }
                index++;
            });

            return combinedTour;
        }

        //Find array with the current sheepCurrentTour
        public static async Task<int> FindCurrentSheepFlockData(List<List<SheepPositionData>> flockOfSheep, SheepPositionData sheepCurrentTour)
        {
            int index = 0;
            int indexFlock = -1;
            flockOfSheep.ForEach((List<SheepPositionData> flock) =>
            {
                Boolean res = flock.Exists(x => x.Id == sheepCurrentTour.Id);
                if(res)
                {
                    indexFlock = index;
                }
                index++;
            });

            return indexFlock;
        }
    }
}
