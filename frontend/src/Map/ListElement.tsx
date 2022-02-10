import { Switch, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { ActivatableTour, Tour } from "../Types/Tour"

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
});

export function ListElement(props: { tour: ActivatableTour, active: boolean, onSwitch: ((active: boolean, idTour: number) => void)}) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <span>Tur {props.tour.idTour}</span>
      <Switch checked={props.active} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onSwitch(event.target.checked, props.tour.idTour)}/>
    </div>
  )
}