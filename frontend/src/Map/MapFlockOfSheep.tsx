import { SheepPosition, Tour } from "../Types/Tour";
import { distanceBetweenCoords } from "./MapCalculations";

export async function mapFlockOfSheep(tours: Tour[]){
  if(tours.length > 1){
    tours.forEach( (tour: Tour, indexTour: number) => { 
      tour.sheepPositions.forEach((sheepCurrentTour: SheepPosition, indexSheep: number) => {
        //Set flockId on the first flock
        if(indexTour === 0) {
          sheepCurrentTour.flockId = indexSheep
        }

        let minDistance = 1000000
        let minSheepPosition: SheepPosition | null = null;
        let minsheepArray: any = []
        //Start on the next tour and find the closest position
        if(tours.length > indexTour+1){
          tours[indexTour+1].sheepPositions.forEach((sheepNextTour: SheepPosition, indexNextTourSheep: number) => {
            const distance = distanceBetweenCoords({latitude: sheepCurrentTour.latitude, longitude: sheepCurrentTour.longitude}, {latitude: sheepNextTour.latitude, longitude: sheepNextTour.longitude})
            //Check if the flock contains the same amount of sheeps
            const numberOfSheeps = Math.abs(sheepCurrentTour.totalNumberOfSheep - sheepNextTour.totalNumberOfSheep) 
            minsheepArray.push({"distance": distance, "sameAmountOfSheep": numberOfSheeps, ...sheepNextTour})
  
            //Check if current distance is less then previous distance
            if(distance < minDistance) {
              minDistance = distance 
              minSheepPosition = sheepNextTour
            }
            //Set flockId on the closest flock
            if((indexNextTourSheep+1) === tours[indexTour+1].sheepPositions.length && minSheepPosition !== null) {
              minSheepPosition.flockId = indexSheep
            }
          })
          //console.log("Nåværende sheep", sheepCurrentTour, "array", minsheepArray)
        }
      })
    })
  }
  return tours
}