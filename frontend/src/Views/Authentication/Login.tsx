import { Button, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { resolveNs } from "dns";
import { useState } from "react";
import { User } from "../../Types/UserModel";
import { authenticationService } from "../../Services/AuthenticationService";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeValue } from "../../redux/LoggedInSlice";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  marginTop: {
    paddingTop: "3vh"
  },
  registerHere: {
    textDecoration: "underline",
    cursor: "pointer"
  },
  registerDiv: {
    paddingTop: "1vh",
    paddingBottom: "2vh"
  }
});

interface LoginProps {
  setLoginAlternatives: (value: string) => void
}


export function Login(props: LoginProps){
  const navigate = useNavigate()
  const classes = useStyles()
  const [user, setUser] = useState<User>({username: "", password: ""})
  const dispatch = useAppDispatch()

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>, key: "username" | "password") => {
    setUser({...user, [key]: event.target.value })
  }

  const sendUserInformationToBackend = async () => {
    try{
      const res = await authenticationService.login(user)
      localStorage.setItem("token", res.data.token)
      dispatch(changeValue(res.data.token))
      navigate("tur")
    } catch{
      console.log("Error")
    }
  }

  return(
    <div>
      <Grid container>
        <Grid item xs={12}>
          <TextField label="Brukernavn" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "username")}/>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Passord" variant="standard" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "password")} />
        </Grid>
        <Grid item xs={12} className={classes.marginTop}>
          <Button variant="contained" onClick={() => sendUserInformationToBackend()}>
            Logg inn
          </Button>
          <Typography className={classes.registerDiv} variant="body2">Ikke bruker enda? <span onClick={() => props.setLoginAlternatives("register")} className={classes.registerHere}>Registrer her</span></Typography>
        </Grid>
      </Grid>
    </div>
  )
}