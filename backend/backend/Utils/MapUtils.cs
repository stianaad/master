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

            return Math.Abs(EarthRadiusKm * c);

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
    }
}
