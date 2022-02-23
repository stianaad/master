import { Tour } from "../Types/Tour";
import { LatLong, SheepPosition } from '../Types/Sheep'
import { distanceBetweenCoords } from "./MapCalculations";
import { SheepTourPolyline } from "./SheepTourPolyline";

export async function mapFlockOfSheep(tours: Tour[]){
  //Create two dimensional array with lat and long for each sheepFlock
  const sheepTourPositions: LatLong[][] = []
  let flockOfSheep: SheepPosition[][] = []
  if(tours.length > 0){
    //flockOfSheep.push([tours[0].sheepPositions[0]])
    tours.forEach( (tour: Tour, indexTour: number) => { 
      tour.sheepPositions.forEach(async (sheepCurrentTour: SheepPosition, indexSheep: number) => {
        //Set flockId on the first flock
        if(indexTour === 0) {
          sheepCurrentTour.flockId = indexSheep
          sheepTourPositions.push([{latitude: sheepCurrentTour.latitude, longitude: sheepCurrentTour.longitude}])
        }

        //Calculate distance to the other flock on same tour
        flockOfSheep = await findBigFlock(sheepCurrentTour, tour, flockOfSheep)
        let minDistance = 1000000
        let minSheepPosition: SheepPosition | null = null;
        //Start on the next tour and find the closest position
        if(tours.length > indexTour+1){
          tours[indexTour+1].sheepPositions.forEach((sheepNextTour: SheepPosition, indexNextTourSheep: number) => {
            const distance = distanceBetweenCoords({latitude: sheepCurrentTour.latitude, longitude: sheepCurrentTour.longitude}, {latitude: sheepNextTour.latitude, longitude: sheepNextTour.longitude})
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
              sheepTourPositions[indexSheep].push({latitude: minSheepPosition.latitude, longitude: minSheepPosition.longitude})
            }
          })
        }
      })
    })
    console.log(flockOfSheep)
  }
  return { tours: tours, sheepTourPositions: sheepTourPositions }
}

async function findBigFlock(sheepCurrentTour: SheepPosition, currentTour: Tour, flockOfSheep: SheepPosition[][]){
  let flock: SheepPosition[] = []
  let indexFlock = -1
  //Find array with the current sheepCurrentTour
  const twoDimensionalFlock = flockOfSheep.filter((flock: SheepPosition[], index: number) => {
    if (flock.find((sheep) => sheep.id === sheepCurrentTour.id)) {
      indexFlock = index
      return flock
    }
  })
  //If the sheepflock exist from before
  if(twoDimensionalFlock.length === 1) {
    flock = twoDimensionalFlock[0]
  } else {
    flock.push(sheepCurrentTour)
  }
  //Loop through Tour.sheepPositions 
  currentTour.sheepPositions.forEach((sheepNextTour: SheepPosition, index: number) => {
    const distance = distanceBetweenCoords({latitude: sheepCurrentTour.latitude, longitude: sheepCurrentTour.longitude}, {latitude: sheepNextTour.latitude, longitude: sheepNextTour.longitude})
    //Check if distance is less then X and if the sheepflock already exist
    if (distance < 150 && distance !== 0 && flock.filter((sheep: SheepPosition) => sheep.id === sheepNextTour.id).length === 0) {
      //console.log("fra id",sheepCurrentTour.id, "til id", sheepNextTour.id, "dis", distance)
      flock.push(sheepNextTour)
    }
  })
  //ADD the new array with flock to twodimensional array
  if(indexFlock > -1) {
    flockOfSheep[indexFlock] = flock
  } else {
    flockOfSheep.push(flock)
  }
  return flockOfSheep
}