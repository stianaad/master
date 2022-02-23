import { CombinedSheepPosition, SheepPosition } from "./Sheep";

export interface Tour {
  idTour: number;
  start: Date;
  sheepPositions: SheepPosition[];
  positions: TourLocation[];
}

export interface CombinedSheepTourPosition {
  idTour: number,
  combinedSheepPositions: CombinedSheepPosition[],
  tourTime: Date
}

export interface ActivatableTour extends Tour {
  active: boolean
}

export interface TourLocation {
  id: number
  longitude: number
  latitude: number
  timePosition: Date
  idTour: number
}