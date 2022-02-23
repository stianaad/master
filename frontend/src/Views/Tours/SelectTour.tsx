import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { MapContainer } from '../../Map/MapContainer';
import { Sidebar } from '../../Map/Sidebar';
import { animalService } from '../../Services/AnimalService';
import { tourService } from '../../Services/TourService';
import { DeadSheepPosition } from '../../Types/Sheep';
import { CombinedSheepTourPosition } from '../../Types/Tour';
import { NavigateTour } from './NavigateTour';

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
  mainContainer: {
    display: "flex",
    
  },
  mapContainer: {
    flexGrow: "1"
  }
});


export function SelectTour() {
  const classes = useStyles()
  const loggedIn = useAppSelector((state) => state.loggedIn.value)
  const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [currentSelectedSheepTourPositions, setCurrentSelectedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [startTourIndex, setStartTourIndex] = useState<number>(0)
  const [heatmap, setHeatmap] = useState<boolean>(false)
  const [sheepFlock, setSheepFlock] = useState<boolean>(true)
  const [opacityBonitet, setOpacityBonitet] = useState<number>(0)
  const [deadSheep, setDeadSheep] = useState<DeadSheepPosition[]>([])

  const fetchTours = async () => {
    if (loggedIn.length > 0) {
      const res = await tourService.getCombinedSheepTourPositions() //authenticationService.getTours()
      console.log(res.data)
      if (res.status === 200) {
        setCombinedSheepTourPositions(res.data)
        setCurrentSelectedSheepTourPositions(res.data.slice(startTourIndex, startTourIndex + 1))
      }
    }
  }

  const fetchDeadSheep = async (fromDate: Date, toDate: Date) => {
    if(loggedIn.length > 0) {
      const res = await animalService.getDeadSheep(fromDate, toDate)
      if (res.status === 200) {
        setDeadSheep(res.data)
        console.log(res.data)
      }
    }
  }

  useEffect(() => {
    //If there is only one element selected
    if(currentSelectedSheepTourPositions.length === 1) {
      fetchDeadSheep(currentSelectedSheepTourPositions[0].tourTime, currentSelectedSheepTourPositions[0].tourTime)
    } else if (currentSelectedSheepTourPositions.length > 1) {
      const maxIndex = currentSelectedSheepTourPositions.length -1
      fetchDeadSheep(currentSelectedSheepTourPositions[0].tourTime, currentSelectedSheepTourPositions[maxIndex].tourTime)
    }
  }, [currentSelectedSheepTourPositions])

  useEffect(() => {
    fetchTours()
  }, [])

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={3}>
          <NavigateTour 
          opacityBonitet={opacityBonitet}
          setOpacityBonitet={setOpacityBonitet}
          sheepFlock={sheepFlock} 
          setSheepFlock={setSheepFlock}  
          currentSelectedSheepTourPositions={currentSelectedSheepTourPositions}
          setCurrentSelectedSheepTourPositions={setCurrentSelectedSheepTourPositions} 
          heatmap={heatmap} 
          setHeatmap={setHeatmap} 
          combinedSheepTourPositions={combinedSheepTourPositions} 
          startTourIndex={startTourIndex} 
          setStartTourIndex={setStartTourIndex} />
        </Grid>
        <Grid item xs={9}>
          <MapContainer
          deadSheep={deadSheep}
          opacityBonitet={opacityBonitet} 
          sheepFlock={sheepFlock} 
          heatmap={heatmap} 
          currentSelectedSheepTourPositions={currentSelectedSheepTourPositions} 
          startTourIndex={startTourIndex} />
        </Grid>
      </Grid>
    </div>
  )
}