import { Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { colorSheep, sizeSheep } from "../../Constants/DeadSheepConstants";
import { DeadSheepPosition } from "../../Types/Sheep";

const useStyles = makeStyles({
  body: {
    textAlign: "left",
    marginLeft: "2vw",
    paddingBottom: "50px",
  },
  divider: {
    width: "90%"
  },
});

interface DeadSheepViewProps {
  deadSheep: DeadSheepPosition,
  setHeader: React.Dispatch<React.SetStateAction<string>>
}

export const DeadSheepView = (props: DeadSheepViewProps) => {
  const classes = useStyles()

  //Set header on information box
  useEffect(() => {
    props.setHeader("Død sau")
  }, [])

  return(
    <Grid container className={classes.body}>
      <Grid item xs={8}>
        <Typography variant="body1"><strong>Tur ID:</strong> {props.deadSheep.idTour}</Typography>
        <Typography variant="body1"><strong>Dato:</strong> {props.deadSheep.timeOfObservation.toString().split("T")[0]}</Typography>
      </Grid>
      <Grid item xs={4}>
        <svg fill="#2582a0" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <path fill="white" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
          <circle cx="32" cy="32" r="24.2" />
          <path fill="white" d="M30.4 30.2h-5.6v-3.8h5.5v-5.7h3.3v5.6h5.5v3.8h-5.5v15.1h-3.3c.1-5 .1-10 .1-15z"/>
        </svg>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">{colorSheep[props.deadSheep.color]} {" " +sizeSheep[props.deadSheep.size]} er funnet død.</Typography>
      </Grid>
    </Grid>
  )
}