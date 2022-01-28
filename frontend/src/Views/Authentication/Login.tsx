import { Button, Grid, TextField } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { resolveNs } from "dns";
import { useState } from "react";
import { User } from "../../Models/UserModel";
import { authenticationService } from "../../Services/AuthenticationService";

const useStyles = makeStyles({
  marginTop: {
    marginTop: "3vh"
  },
});


export function Login(){
  const classes = useStyles()
  const [user, setUser] = useState<User>({username: "", password: ""})
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>, key: "username" | "password") => {
    setUser({...user, [key]: event.target.value })
  }

  const sendUserInformationToBackend = async () => {
    try{
      const res = await authenticationService.login(user)
      console.log(res)
      localStorage.setItem("token", res.data.token)
      if(res.status === 200){
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    } catch{
      console.log("Error")
    }
  }

  const getLoggedInContent = async () => {
    try {
      const token: string | null= localStorage.getItem("token")
      console.log("token: ",token)
      if (token) {
        const res = await authenticationService.test(token)
        console.log(res)
      }
    } catch {

    }
  }

  return(
    <div>
      {!loggedIn ? 
      <Grid container>
        <Grid item xs={12}>
          <TextField id="standard-basic" label="Brukernavn" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "username")}/>
        </Grid>
        <Grid item xs={12}>
          <TextField id="standard-basic" label="password" variant="standard" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "password")} />
        </Grid>
        <Grid item xs={12} className={classes.marginTop}>
          <Button variant="contained" onClick={() => sendUserInformationToBackend()}>
            Logg inn
          </Button>
        </Grid>
      </Grid>
      : <Button variant="contained" onClick={() => getLoggedInContent()}>Få hemmelig innhold</Button>}
    </div>
  )
}