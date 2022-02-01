import { LatLong, SheepPosition, Tour } from "../Types/Tour";
import { distanceBetweenCoords } from "./MapCalculations";

export async function mapFlockOfSheep(tours: Tour[]){
  //Create two dimensional array with lat and long for each sheepFlock
  const sheepTourPositions: LatLong[][] = []
  if(tours.length > 1){
    tours.forEach( (tour: Tour, indexTour: number) => { 
      tour.sheepPositions.forEach((sheepCurrentTour: SheepPosition, indexSheep: number) => {
        //Set flockId on the first flock
        if(indexTour === 0) {
          sheepCurrentTour.flockId = indexSheep
          sheepTourPositions.push([{lat: sheepCurrentTour.latitude, lng: sheepCurrentTour.longitude}])
        }

        let minDistance = 1000000
        let minSheepPosition: SheepPosition | null = null;
        //Start on the next tour and find the closest position
        if(tours.length > indexTour+1){
          tours[indexTour+1].sheepPositions.forEach((sheepNextTour: SheepPosition, indexNextTourSheep: number) => {
            const distance = distanceBetweenCoords({lat: sheepCurrentTour.latitude, lng: sheepCurrentTour.longitude}, {lat: sheepNextTour.latitude, lng: sheepNextTour.longitude})
            //Check if the flock contains the same amount of sheeps
            const numberOfSheeps = Math.abs(sheepCurrentTour.totalNumberOfSheep - sheepNextTour.totalNumberOfSheep) 
  
            //Check if current distance is less then previous distance
            if(distance < minDistance) {
              minDistance = distance 
              minSheepPosition = sheepNextTour
            }
            //Set flockId on the closest flock
            if((indexNextTourSheep+1) === tours[indexTour+1].sheepPositions.length && minSheepPosition !== null) {
              minSheepPosition.flockId = indexSheep
              sheepTourPositions[indexSheep].push({lat: minSheepPosition.latitude, lng: minSheepPosition.longitude})
            }
          })
          //console.log("Nåværende sheep", sheepCurrentTour, "array", minsheepArray)
        }
      })
    })
  }
  return { tours: tours, sheepTourPositions: sheepTourPositions }
}