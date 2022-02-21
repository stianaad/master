import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { MapContainer } from '../../Map/MapContainer';
import { Sidebar } from '../../Map/Sidebar';
import { tourService } from '../../Services/TourService';
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
  const [showBonitet, setShowBonitet] = useState<boolean>(false)
  const [opacityBonitet, setOpacityBonitet] = useState<number>(0)

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

  useEffect(() => {
    fetchTours()
  }, [])

  /*useEffect(() => {
    setCurrentSelectedSheepTourPositions(combinedSheepTourPositions.slice(startTourIndex, startTourIndex + 1))
  }, [startTourIndex])*/

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={3}>
          <NavigateTour 
          showBonitet={showBonitet}
          setShowBonitet={setShowBonitet}
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