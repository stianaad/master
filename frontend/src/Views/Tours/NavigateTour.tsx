import { Button, Divider, FormControlLabel, FormGroup, Grid, Slider, Switch, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PreditorType } from "../../Types/Jerv";
import { CombinedSheepTourPosition } from "../../Types/Tour"

const useStyles = makeStyles({
  pCurrent: {
    color: "red"
  },
  notActiveWeekOrMonth: {
    color: "grey"
  },
  activeWeekOrMonth: {
    color: "blue"
  },
  header:{
    paddingTop: "3vh"
  },
  tourIds: {
    overflowY: "auto",
    height: "50vh"
  },
  switch: {
    marginLeft: "1vw",
  },
  sliderBonitet: {
    marginRight: "2vw",
    marginLeft: "2vw",
    width: "80%"
  }
});


interface NavigateTourProps {
  combinedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  preditors: {[key: number]: boolean},
  setStartTourIndex: Dispatch<SetStateAction<number>>,
  sheepFlock: boolean,
  setSheepFlock: Dispatch<SetStateAction<boolean>>,
  heatmap: boolean,
  setHeatmap: Dispatch<SetStateAction<boolean>>,
  opacityBonitet: number,
  setOpacityBonitet: Dispatch<SetStateAction<number>>,
  setCurrentSelectedSheepTourPositions: Dispatch<SetStateAction<CombinedSheepTourPosition[]>>,
  setActivePreditors: ((type: number, value: boolean) => void),
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[]
}

export const NavigateTour = (props: NavigateTourProps) => {
  const classes = useStyles()
  const [week, setWeek] = useState<boolean>(true) //False is month
  const [monthOverview, setMonthOverview] = useState<string[]>([])
  const [showBonitet, setShowBonitet] = useState<boolean>(false)

  //When the user click next og previeous week/month
  const changeIndex = (value: number) => {
    if(week) {
      changeWeek(value)
    } else {
      changeMonth(value)
    }
  }

  const changeWeek = (value: number) => {
    //Find the current index
    let tempIndex = 0
    if( (props.startTourIndex + value) < props.combinedSheepTourPositions.length && (props.startTourIndex + value) > -1) {
       tempIndex = props.startTourIndex + value
    } else if (props.startTourIndex + value < 0) {
      tempIndex = props.combinedSheepTourPositions.length - 1
    }

    props.setStartTourIndex(tempIndex)
    props.setCurrentSelectedSheepTourPositions(props.combinedSheepTourPositions.slice(tempIndex, tempIndex + 1))
  }

  const changeMonth = (value: number) => {
    //Find the current index
    let tempIndex = 0
    if( (props.startTourIndex + value) < monthOverview.length && (props.startTourIndex + value) > -1 ) {
      tempIndex = props.startTourIndex + value
    } else if (props.startTourIndex + value < 0) {
      tempIndex = monthOverview.length - 1
    }

    const currentMonth = monthOverview[tempIndex]
    const newSheepTourArray = props.combinedSheepTourPositions.filter((sheep: CombinedSheepTourPosition) => sheep.tourTime.toString().slice(0,7) === currentMonth)
    console.log(newSheepTourArray)
    props.setCurrentSelectedSheepTourPositions(newSheepTourArray)
    props.setStartTourIndex(tempIndex)
  }

  //Create a array with all the months
  useEffect(() => {
    if(props.combinedSheepTourPositions.length > 0) {
      let tempMonthArray: string[] = []
      let tempMonth = props.combinedSheepTourPositions[0].tourTime.toString().slice(0,7)
      props.combinedSheepTourPositions.forEach((sheepTour: CombinedSheepTourPosition, index: number) => {
        const currentMonth = sheepTour.tourTime.toString().slice(0,7)
        //Check if the current month is equal to the previous
        if( currentMonth != tempMonth) {
          tempMonthArray.push(tempMonth)
          tempMonth = currentMonth
        }
        //If it is the last index, and the month is not pushed yet
        if(index + 1 === props.combinedSheepTourPositions.length) {
          tempMonthArray.push(tempMonth)
        }
      })
      setMonthOverview(tempMonthArray)
    }
  }, [props.combinedSheepTourPositions])

  //Update the sheepTour array when it changes from week to month and vice versa
  useEffect(() => {
    changeIndex(-props.startTourIndex)
  }, [week])

  const changeOpacityBonitet = (event: Event, newValue: number | number[], activeThumb: number) => {
    if(!Array.isArray(newValue)) {
      props.setOpacityBonitet(newValue)
      //console.log(newValue)
    }
  }

  useEffect(() => {
    if(showBonitet){
      props.setOpacityBonitet(0.5)
    } else {
      props.setOpacityBonitet(0)
    }
  }, [showBonitet])

  
  return(
    <>
      <Typography variant="h4" className={classes.header}>Turoversikt</Typography>
      <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={showBonitet} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setShowBonitet(event.target.checked)} />} label="Bonitet" />
        {showBonitet ? <Slider
          className={classes.sliderBonitet}
          onChange={changeOpacityBonitet}
          size="small"
          min={0}
          max={1}
          step={0.01}
          value={props.opacityBonitet}
          aria-label="Small"
          valueLabelDisplay="auto"
        /> : null}
        <Divider />
        <FormControlLabel control={<Switch checked={props.heatmap} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setHeatmap(event.target.checked)} />} label="Heatmap" />
        <FormControlLabel control={<Switch checked={props.sheepFlock} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSheepFlock(event.target.checked)} />} label="Saueflokker" />
      </FormGroup>

      <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={props.preditors[PreditorType.BJORN]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.BJORN, event.target.checked)} />} label="Bjørn" />
        <FormControlLabel control={<Switch checked={props.preditors[PreditorType.GAUPE]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.GAUPE, event.target.checked)} />} label="Gaupe" />
        <FormControlLabel control={<Switch checked={props.preditors[PreditorType.ULV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.ULV, event.target.checked)} />} label="Ulv" />
        <FormControlLabel control={<Switch checked={props.preditors[PreditorType.JERV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.JERV, event.target.checked)} />} label="Jerv" />
      </FormGroup>
      
      <Grid container>
        <Grid item xs={6}>
          <Button className={week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {setWeek(true); props.setStartTourIndex(0)}} >Uke</Button>
        </Grid>
        <Grid item xs={6}>
          <Button className={!week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {setWeek(false); props.setStartTourIndex(0)}}>Måned</Button>
        </Grid>
      </Grid>
      <div className={classes.tourIds}>
        {props.combinedSheepTourPositions.map((combinedSheep : CombinedSheepTourPosition, index: number) => (
          <p key={index} className={ (week && props.startTourIndex === index || props.currentSelectedSheepTourPositions.some((value: CombinedSheepTourPosition) => value.idTour === combinedSheep.idTour)) ? classes.pCurrent : "" }>{combinedSheep.idTour}</p>
          ))}
      </div>

      <Grid container >
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => changeIndex(-1)}>forrige</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => changeIndex(1)}>neste</Button>
        </Grid>
      </Grid>
    </>
  )
}