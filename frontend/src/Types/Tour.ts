export interface Tour {
  idTour: number;
  start: Date;
  sheepPositions: SheepPosition[];
  positions: TourLocation[];
}

export interface SheepPosition {
  id: number
  longitude: number
  latitude: number
  timeOfObsevation: Date
  smallBrownSheep: number
  smallWhiteSheep: number
  bigBrownSheep: number
  bigWhiteSheep: number
  tieGreen: number
  tieRed: number
  tieYellow: number
  tieBlue: number
  idTour: number
  totalNumberOfSheep: number
  flockId?: number
}

export interface TourLocation {
  id: number
  longitude: number
  latitude: number
  timePosition: Date
  idTour: number
}

export interface LatLong {
  lat: number,
  lng: number
}