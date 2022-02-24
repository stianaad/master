import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import CloseIcon from '@mui/icons-material/Close';
import { DeadSheepPosition } from "../../Types/Sheep";
import { colorSheep, sizeSheep } from "../../Constants/DeadSheepConstants";
import { DeadSheepView } from "./DeadSheepView";
import { CombinedSheepTourPosition } from "../../Types/Tour";
import { Jerv } from "../../Types/Jerv";
import { PreditorView } from "./PreditorView";

const useStyles = makeStyles({
  marker: {
    height: "200px",
    width: "300px",
    backgroundColor: "white",
    //marginLeft: "2vw",
    transform: "translate(5%, -105%)",
  },
  text: {
    color: "black"
  },
  closeIcon: {
    marginTop: "10%"
  }
});

interface InformationBoxMapProps {
  lat: number,
  lng: number,
  onClose: () => void,
  deadSheep?: DeadSheepPosition,
  sheepFlock?: CombinedSheepTourPosition,
  preditor?: Jerv[]
}

export const InformationBoxMap = (props: InformationBoxMapProps) => {
  const classes = useStyles()
  return  <div className={classes.marker} >
    <Grid container>
      <Grid item xs={10}>
        <Typography variant="h6" className={classes.text}></Typography>
      </Grid>
      <Grid item xs={2} >
        <CloseIcon className={classes.closeIcon} onClick={props.onClose} />
      </Grid>
    </Grid>
    { props.deadSheep ? <DeadSheepView deadSheep={props.deadSheep} /> : null }
    { props.preditor ? <PreditorView preditorData={props.preditor} /> : null }
  </div>
}

/**
 * <Card sx={{ maxWidth: 275, zIndex: 10 }}>
    <CardContent>
    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          belent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
  </Card>
 */