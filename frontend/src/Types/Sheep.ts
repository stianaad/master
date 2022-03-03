import { PreditorType } from "./Jerv";

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

export interface DeadSheepPosition {
  id: number,
  longitude: number,
  latitude: number,
  timeOfObservation: Date,
  preditorId: PreditorType,
  size: number,
  color: number,
  idTour: number
}

export interface CombinedSheepPosition {
  totalNumberOfSheep: number,
  flockId: number,
  locations: LatLong[]
}


export interface LatLong {
  latitude: number,
  longitude: number
}