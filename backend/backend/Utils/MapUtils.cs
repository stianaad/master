using System;

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

            return EarthRadiusKm * c;

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
            return deg * Math.PI / 100;
        }
    }
}
