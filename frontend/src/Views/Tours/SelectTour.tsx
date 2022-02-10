import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MapContainer } from '../../Map/MapContainer';
import { Sidebar } from '../../Map/Sidebar';

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
  return (
    <div className={classes.root}>
      
      <Typography variant="h2">Velg dato</Typography>
      <MapContainer />
    </div>
  )
}