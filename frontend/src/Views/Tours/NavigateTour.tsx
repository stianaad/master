import { Button, FormControlLabel, Grid, Switch, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { Dispatch, SetStateAction, useState } from "react";
import { CombinedSheepTourPosition } from "../../Types/Tour"

const useStyles = makeStyles({
  pCurrent: {
    color: "red"
  },
});


interface NavigateTourProps {
  combinedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  setStartTourIndex: Dispatch<SetStateAction<number>>,
  sheepFlock: boolean,
  setSheepFlock: Dispatch<SetStateAction<boolean>>,
  heatmap: boolean,
  setHeatmap: Dispatch<SetStateAction<boolean>>
}

export const NavigateTour = (props: NavigateTourProps) => {
  const classes = useStyles()

  const changeIndex = (value: number) => {
    if( (props.startTourIndex + value) < props.combinedSheepTourPositions.length && (props.startTourIndex + value) > -1) {
      props.setStartTourIndex(props.startTourIndex + value)
    } else if (props.startTourIndex + value >= props.combinedSheepTourPositions.length) {
      props.setStartTourIndex(0)
    } else {
      props.setStartTourIndex(props.combinedSheepTourPositions.length - 1)
    }
  }
  return(
    <>
      <Typography variant="h4">Turoversikt</Typography>
      <FormControlLabel control={<Switch checked={props.heatmap} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setHeatmap(event.target.checked)} />} label="Heatmap" />
      <FormControlLabel control={<Switch checked={props.sheepFlock} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSheepFlock(event.target.checked)} />} label="Saueflokker" />
      
      <Grid container>
        <Grid item xs={6}>
          <Button >Uke</Button>
        </Grid>
        <Grid item xs={6}>
          <Button >Måned</Button>
        </Grid>
      </Grid>

      {props.combinedSheepTourPositions.map((combinedSheep : CombinedSheepTourPosition, index: number) => (
        <p className={props.startTourIndex === index ? classes.pCurrent : "" }>{combinedSheep.idTour}</p>
      ))}

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