import { Typography } from '@mui/material';
import Marker from '../static/marker.png'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  marker: {
    height: "30px",
    width: "30px",
    //backgroundColor: "red",
    borderRadius: "50%",
    textAlign: "center",
    marginBottom: "15px",
    transform: "translate(-50%, -50%)",
  },
  text: {
    color: "white"
  }
});


export const MapMarker = (props: {lat: number, lng: number, text?: string, backgroundColor: string, dead: boolean, handleClick: (index: number) => void, index: number}) => {
  const classes = useStyles()

  return <div className={classes.marker} onClick={() => props.handleClick(props.index)} style={{backgroundColor: props.backgroundColor, zIndex: 2}}>
    {props.dead ?
    <svg fill="#800080" xmlns="http://www.w3.org/2000/svg" width="64" height="64" style={{transform : "scale(0.7) translate(-40%, -40%)"}}>
        <path fill="white" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
        <circle cx="32" cy="32" r="24.2" />
        <path fill="white" d="M30.4 30.2h-5.6v-3.8h5.5v-5.7h3.3v5.6h5.5v3.8h-5.5v15.1h-3.3c.1-5 .1-10 .1-15z"/>
      </svg> :
      <Typography variant="h6" className={classes.text}>{props.text}</Typography>
    }
    {/*<img style={markerStyle} src={Marker} alt="pin" />*/}
  </div>
  };
