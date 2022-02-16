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
  const [startTourIndex, setStartTourIndex] = useState<number>(0)
  const [heatmap, setHeatmap] = useState<boolean>(false)
  const [sheepFlock, setSheepFlock] = useState<boolean>(false)

  const fetchTours = async () => {
    if (loggedIn.length > 0) {
      const res = await tourService.getCombinedSheepTourPositions() //authenticationService.getTours()
      console.log(res.data)
      if (res.status === 200) {
        setCombinedSheepTourPositions(res.data.splice(0,10))
      }
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  return (
    <div className={classes.root}>
      <Typography variant="h2">Velg dato</Typography>
      <Grid container>
        <Grid item xs={3}>
          <NavigateTour sheepFlock={sheepFlock} setSheepFlock={setSheepFlock} heatmap={heatmap} setHeatmap={setHeatmap} combinedSheepTourPositions={combinedSheepTourPositions} startTourIndex={startTourIndex} setStartTourIndex={setStartTourIndex} />
        </Grid>
        <Grid item xs={9}>
          <MapContainer sheepFlock={sheepFlock} heatmap={heatmap} combinedSheepTourPositions={combinedSheepTourPositions} startTourIndex={startTourIndex} />
        </Grid>
      </Grid>
    </div>
  )
}