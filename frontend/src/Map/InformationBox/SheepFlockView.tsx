import { Divider, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
import { CombinedSheepTourPosition } from "../../Types/Tour";

const useStyles = makeStyles({
  body: {
    textAlign: "left",
    marginLeft: "2vw",
    paddingBottom: "50px"
  },
  divider: {
    width: "90%"
  },
});

interface SheepFlockViewProps {
  sheepFlock: CombinedSheepTourPosition,
  setHeader: React.Dispatch<React.SetStateAction<string>>
}

export const SheepFlockView = (props: SheepFlockViewProps) => {
  const classes = useStyles()

  useEffect(() => {
    props.setHeader("Saueflokk")
  }, [])

  return(
    <Grid container className={classes.body}>

      <Grid item xs={8}>
        <Typography variant="body1"><strong>Tur ID:</strong> {props.sheepFlock.idTour}</Typography>
        <Typography variant="body1"><strong>Dato:</strong> {props.sheepFlock.tourTime.toString().split("T")[0]}</Typography>
        <Typography variant="body1"><strong>Flokk ID:</strong> {props.sheepFlock.combinedSheepPositions[0].flockId}</Typography>
        <Typography variant="body1"><strong>Antall sauer:</strong> {props.sheepFlock.combinedSheepPositions[0].totalNumberOfSheep}</Typography>
      </Grid>
      <Grid item xs={4}>
        <svg fill="#2582a0" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <path fill="white" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
          <circle cx="32" cy="32" r="24.2" />
          <path fill="white" d="M40.6 37.7c-.2 0-.4.1-.6.1-.4 0-.7-.1-.9-.4-.3-.3-.8-.5-1.2-.7-.5-.1-.9 0-1.4 0-1.3 0-2.6-.1-3.9-.1-.8 0-1.6-.1-2.4-.1-.4 0-1 .7-1 1.3 0 1.1 0 2.1.1 3.2 0 .6-.4 1.4-.9 1.4-.2 0-.4-.1-.7-.2l.3-.6c0-.1.1-.1.2-.2-.3 0-.6-.1-1.1-.2 1.3-.9.9-2.1 1-3.2v-.2c-.1-.9-.2-.9-1-1-.2 0-.4-.1-.6-.2-.7-.4-1.3-.8-2.1-1.1-.4-.1-.8-.6-.9-1-.1-1-.5-1.9-.8-2.8-.1-.3-.4-.5-.4-.7-.4-1.3-.8-2.6-1.1-3.9-.4 0-.8-.1-1.2-.1-.4 0-.8 0-1.2.1-.4.1-.7.1-.8-.4-.3-1-.2-1.1.6-1.6s1.5-1.1 2.3-1.5c.8-.4 1.6-.3 2.4 0 .3.1.6.1.9 0 .3-.1.7-.1 1.3-.2-.2.3-.3.5-.4.7 1.4.7 2.8 1.4 4.4 1.8 1.9.5 3.7.3 5.4.1 1.4-.2 2.7-.1 4.1-.3 1.5-.1 2.6.6 3.7 1.4 1 .7 1.4 1.7 1.9 2.7.3.5.2 1.3.2 1.9 0 .7-.2 1.5-.3 2.2 0 .2-.1.4-.2.7-.1-.2-.2-.3-.3-.5l-.1.1s-.1 0-.1.1c-.1.4 0 .8-.5 1.1-.1.1-.1.4-.2.6-.1.2 0 .6-.5.5 0 0-.2.3-.2.5-.1 1.3-.1 2.7-.1 4v.4c.3.6-.4.8-.3 1.3-.4 0-.8.1-1.2.1 0-.1-.1-.1-.1-.1.8-1.1 1.4-2.3.7-3.8-.3.3-.4.7-.4 1.1-.1.4 0 .9-.4 1.2-.1.1-.1.4-.1.7-.3 0-.7.1-1.3.1.8-1.4 1.7-2.6 1.4-4.3z"/>
        </svg>
        </Grid>
    </Grid>
  )
}