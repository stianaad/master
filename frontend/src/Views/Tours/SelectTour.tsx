import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { MapContainer } from '../../Map/MapContainer';
import { Sidebar } from '../../Map/Sidebar';
import { animalService } from '../../Services/AnimalService';
import { tourService } from '../../Services/TourService';
import { DeadSheepPosition } from '../../Types/Sheep';
import { PreditorType } from '../../Types/Jerv';
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
  const loggedIn = useAppSelector((state: any) => state.loggedIn.value)
  const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [activeCombinedSheepTourPositions, setActiveCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [currentSelectedSheepTourPositions, setCurrentSelectedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [startTourIndex, setStartTourIndex] = useState<number>(0)
  const [heatmap, setHeatmap] = useState<boolean>(false)
  const [sheepFlock, setSheepFlock] = useState<boolean>(true)
  const [week, setWeek] = useState<boolean>(true) //False is month
  const toDate = new Date(Date.now())
  var fromDate = new Date(Date.now());
  fromDate.setMonth(fromDate.getMonth() - 1);
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({from: fromDate, to: toDate})
  const [preditors, setPreditors] = useState<{[key: number]: boolean}>({
    1: true,
    2: true,
    3: true,
    4: true
  })

  const handleActivePreditors = (type: number, value: boolean) => {
    setPreditors({...preditors, [type]: value})
  }
  const [opacityBonitet, setOpacityBonitet] = useState<number>(0)
  const [deadSheep, setDeadSheep] = useState<DeadSheepPosition[]>([])

  const fetchTours = async () => {
    if (loggedIn.length > 0) {
      const res = await tourService.getCombinedSheepTourPositions() //authenticationService.getTours()
      if (res.status === 200) {
        setCombinedSheepTourPositions(res.data)
        const startDate = new Date(res.data[0].tourTime)
        const endDate = new Date(res.data[res.data.length - 1].tourTime)
        setDateRange({from: startDate, to: endDate})
        setActiveCombinedSheepTourPositions(res.data)
        setCurrentSelectedSheepTourPositions(res.data.slice(startTourIndex, startTourIndex + 1))
      }
    }
  }

  useEffect(() => {
    const tours = combinedSheepTourPositions.filter((tour) => tour.tourTime.toString() >= dateRange.from.toISOString() && tour.tourTime.toString() <= dateRange.to.toISOString())
    setActiveCombinedSheepTourPositions(tours)
    if(week) {
      setCurrentSelectedSheepTourPositions(tours.slice(0, 1))
    }
  }, [dateRange])

  const fetchDeadSheep = async (fromDate: Date, toDate: Date) => {
    if(loggedIn.length > 0) {
      const res = await animalService.getDeadSheep(fromDate, toDate)
      if (res.status === 200) {
        setDeadSheep(res.data)
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
          deadSheeps={deadSheep}
          dateRange={dateRange}
          opacityBonitet={opacityBonitet}
          setOpacityBonitet={setOpacityBonitet}
          setDateRange={setDateRange}
          sheepFlock={sheepFlock} 
          setSheepFlock={setSheepFlock}  
          currentSelectedSheepTourPositions={currentSelectedSheepTourPositions}
          setCurrentSelectedSheepTourPositions={setCurrentSelectedSheepTourPositions}
          preditors={preditors}
          setActivePreditors={handleActivePreditors}
          heatmap={heatmap} 
          setHeatmap={setHeatmap} 
          combinedSheepTourPositions={combinedSheepTourPositions}
          activeCombinedSheepTourPositions={activeCombinedSheepTourPositions}
          startTourIndex={startTourIndex} 
          setStartTourIndex={setStartTourIndex} 
          week={week}
          setWeek={setWeek}
          />
        </Grid>
        <Grid item xs={9}>
          <MapContainer
            dateRange={dateRange}
            deadSheep={deadSheep}
            opacityBonitet={opacityBonitet} 
            sheepFlock={sheepFlock} 
            preditors={preditors}
            heatmap={heatmap} 
            currentSelectedSheepTourPositions={currentSelectedSheepTourPositions} 
            startTourIndex={startTourIndex} />
        </Grid>
      </Grid>
    </div>
  )
}