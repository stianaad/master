import { Typography } from '@mui/material';
import Marker from '../static/marker.png'
import { makeStyles } from '@mui/styles';


const markerStyle: any = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "30px"
};

const useStyles = makeStyles({
  marker: {
    height: "30px",
    width: "30px",
    backgroundColor: "red",
    borderRadius: "50%",
    textAlign: "center",
    marginBottom: "15px",
    transform: "translate(-50%, -50%)",
  },
  text: {
    color: "white"
  }
});


export const MapMarker = (props: {lat: number, lng: number, text?: string}) => {
  const classes = useStyles()
  return <div className={classes.marker}>
    <Typography variant="h6" className={classes.text}>{props.text}</Typography>
    {/*<img style={markerStyle} src={Marker} alt="pin" />*/}
  </div>
  };
