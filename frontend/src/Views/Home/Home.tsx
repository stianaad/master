import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Login } from "../Authentication/Login";
import { makeStyles } from '@mui/styles';
import { useState } from "react";
import { Register } from "../Authentication/Register";
import { useAppSelector } from "../../hooks";
import { SignOut } from "../Authentication/SignOut";
import { tourService } from "../../Services/TourService";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
  tours: {
    marginTop: "3vh"
  }
});


export function Home(){
  const classes = useStyles()
  const [loginAlternatives, setLoginAlternatives] = useState<string>("login")
  const loggedIn = useAppSelector((state: any) => state.loggedIn.value)

  const chooseLoginAlternatives = () => {
    if(loginAlternatives === "login") {
      return <div>
          <Login setLoginAlternatives={setLoginAlternatives} />
        </div>
    } else if (loginAlternatives === "register") {
      return <Register setLoginAlternatives={setLoginAlternatives}/>
    } else {
      return null
    }
  }

  return(
    <div className={classes.root}>
      <Typography variant="h4">Framside</Typography>
      {loggedIn.length > 0 ? <SignOut /> : chooseLoginAlternatives()}
    </div>
  )
}