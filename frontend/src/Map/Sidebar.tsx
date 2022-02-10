import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { ActivatableTour, Tour } from "../Types/Tour"
import { ListElement } from "./ListElement";

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
});

export function Sidebar(props: { tours: ActivatableTour[], activeMap: {[key: number] : boolean}, onActiveChange: ((active: boolean, idTour: number) => void)}) {//, onActiveChange: ((tours: ActivatableTour[]) => void)}) {
  const classes = useStyles()
  const allTours : {[id: number] : boolean} = {}
  for (const tour of props.tours) {
    allTours[tour.idTour] = true
  }
  //props.tours.forEach((tour) => allTours[tour.idTour] = true)
  const [activeTours, setActiveTours] = useState(allTours)

  const handleActiveChange = (active: boolean, idTour: number) => {
    const newTours = props.tours
    const tour = newTours.find((tour) => tour.idTour === idTour)
    if (tour) {
      tour.active = active
      //props.onActiveChange(newTours)
    }
  }

  return (
    <div className={classes.root}>
      {
        props.tours.map((tour) => (
          <ListElement tour={tour} key={tour.idTour} active={props.activeMap[tour.idTour]} onSwitch={props.onActiveChange} />
        ))
      }
    </div>
  )
}