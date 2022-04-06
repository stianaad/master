import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import { DeadSheepPosition } from "../../Types/Sheep";
import { colorSheep, sizeSheep } from "../../Constants/DeadSheepConstants";
import { DeadSheepView } from "./DeadSheepView";
import { CombinedSheepTourPosition } from "../../Types/Tour";
import { Preditor } from "../../Types/Preditor";
import { PreditorView } from "./PreditorView";
import { useState } from "react";
import { SheepFlockView } from "./SheepFlockView";

const useStyles = makeStyles({
  marker: {
    width: "300px",
    backgroundColor: "white",
    transform: "translate(5%, -105%)",
  },
  text: {
    color: "black"
  },
  closeIcon: {
    marginTop: "10%"
  },
  header:{
    backgroundColor: "#B4DBFF"
  }
});

interface InformationBoxMapProps {
  lat: number,
  lng: number,
  onClose: () => void,
  deadSheep?: DeadSheepPosition,
  sheepFlock?: CombinedSheepTourPosition,
  preditor?: Preditor[]
}

export const InformationBoxMap = (props: InformationBoxMapProps) => {
  const classes = useStyles()
  const [header, setHeader] = useState<string>("")
  return  <div className={classes.marker} >
    <Grid container className={classes.header}>
      <Grid item xs={2}></Grid>
      <Grid item xs={8}>
        <Typography variant="h6" className={classes.text}>{header}</Typography>
      </Grid>
      <Grid item xs={2} >
        <CloseIcon className={classes.closeIcon} onClick={props.onClose} />
      </Grid>
    </Grid>
    { props.deadSheep ? <DeadSheepView deadSheep={props.deadSheep} setHeader={setHeader} /> : null }
    { props.preditor ? <PreditorView preditorData={props.preditor} setHeader={setHeader} /> : null }
    { props.sheepFlock ? <SheepFlockView setHeader={setHeader} sheepFlock={props.sheepFlock} /> : null }
  </div>
}