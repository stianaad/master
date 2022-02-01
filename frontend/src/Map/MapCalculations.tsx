import { LatLong } from "../Types/Tour";

export const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};

export const distanceBetweenCoords = (coord1: LatLong, coord2: LatLong) => {
  const earthRadiusKm = 6371;

  let dLat = degToRad(coord2.lat - coord1.lat);
  let dLon = degToRad(coord2.lng - coord1.lng);

  let lat1 = degToRad(coord1.lat);
  let lat2 = degToRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
};