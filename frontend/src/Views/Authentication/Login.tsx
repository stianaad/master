import { Button, Grid, TextField } from "@mui/material";
import { makeStyles } from '@mui/styles';
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

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>, key: "username" | "password") => {
    setUser({...user, [key]: event.target.value })
  }

  const sendUserInformationToBackend = async () => {
    try{
      const res = await authenticationService.login(user)
      //const res = await authenticationService.test()
      console.log(res)
      //if(res.status)
    } catch{
      console.log("Error")
    }
  }

  return(
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
  )
}