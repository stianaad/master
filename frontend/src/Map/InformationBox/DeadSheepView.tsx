import { Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { colorSheep, sizeSheep } from "../../Constants/DeadSheepConstants";
import { DeadSheepPosition } from "../../Types/Sheep";

const useStyles = makeStyles({
  body: {
    textAlign: "left",
    marginLeft: "2vw"
  }
});

interface DeadSheepViewProps {
  deadSheep: DeadSheepPosition
}

export const DeadSheepView = (props: DeadSheepViewProps) => {
  const classes = useStyles()
  return(
    <Grid container>
      <Grid item xs={12} className={classes.body}>
        <Typography variant="body1">Tur ID: {props.deadSheep.idTour}</Typography>
        <Typography variant="body1">Dato: {props.deadSheep.timeOfObservation.toString().split("T")[0]}</Typography>
        <Typography variant="body1">Type: {sizeSheep[props.deadSheep.size]}</Typography>
        <Typography variant="body1">Farge: {colorSheep[props.deadSheep.color]}</Typography>
        <Typography variant="body1">Status: Død</Typography>
      </Grid>
    </Grid>
  )
}