import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MapContainer } from '../../Map/MapContainer';

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
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