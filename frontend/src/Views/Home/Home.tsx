import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Login } from "../Authentication/Login";
import { makeStyles } from '@mui/styles';
import { useState } from "react";
import { Register } from "../Authentication/Register";
import { Counter } from "../../redux/LoggedIn";
import { useAppSelector } from "../../hooks";
import { SignOut } from "../Authentication/SignOut";
import { authenticationService } from "../../Services/AuthenticationService";
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
  const navigate = useNavigate()
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

  const getLoggedInContent = async () => {
    try {
      const token: string | null= localStorage.getItem("token")
      console.log("token: ",token)
      if (token) {
        const res = await tourService.getTours(token)
        console.log(res)
      }
    } catch (e: any){
      console.log(e.response)
    }
  }

  return(
    <div className={classes.root}>
      <Typography variant="h4">Framside</Typography>
      {loggedIn.length > 0 ? <SignOut /> : chooseLoginAlternatives()}
      {/*<Button variant="contained" onClick={() => getLoggedInContent() }>Data</Button>*/}
    </div>
  )
}