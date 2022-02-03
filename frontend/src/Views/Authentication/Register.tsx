import { Button, Grid, TextField, Typography } from "@mui/material"
import { makeStyles, propsToClassKey } from '@mui/styles';
import { useState } from "react";
import { authenticationService } from "../../Services/AuthenticationService";
import { User } from "../../Types/UserModel";

const useStyles = makeStyles({
  marginTop: {
    marginTop: "2vh"
  },
  errorMessage: {
    color : "red",
    paddingBottom: "1vh"
  },
  registerDiv: {
    paddingTop: "2vh",
    paddingBottom: "2vh"
  },
  registerHere: {
    textDecoration: "underline",
    cursor: "pointer"
  },
});

interface RegisterProps {
  setLoginAlternatives: (value: string) => void
}


export const Register = (props: RegisterProps) => {
  const classes = useStyles()
  const [user, setUser] = useState<User>({username: "", password: "", repeatPassword: "",email: ""})
  const [errorMessage, setErrorMessage] = useState<string>("")

  const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>, key: "username" | "password" | "email" | "repeatPassword") => {
    setUser({...user, [key]: event.target.value })
  }

  const sendUserInformationToBackend = async () => {
    console.log(user)
    if(checkInputFields()) {
      try{
        const res = await authenticationService.register(user)
        console.log(res)
        const resLogin = await authenticationService.login(user)
        localStorage.setItem("token", resLogin.data.token)
        console.log(resLogin)
      } catch (e: any){
        console.log("Error", e.response)
        if(e.response.data.message === "User already exists!") {
          setErrorMessage("Bruker eksisterer allerede")
        } else if (e.response.data.message === "User creation failed!") {
          setErrorMessage("Passordet må inneholdet spesialtegn, tall, store og små bokstaver")
        }
      }
    }
  }

  const checkInputFields = () => {
    if(user.username === "" || user.password === "" || user.email === "" || user.repeatPassword === "") {
      setErrorMessage("Fyll ut alle felter")
      return false
    } else if(user.password !== user.repeatPassword) {
      setErrorMessage("Passordene må være like")
      return false
    }
    setErrorMessage("")
    return true
  }

  return(
    <div>
      <Grid container>
        <Grid item xs={12}>
          <TextField label="E-post" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "email")}/>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Brukernavn" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "username")}/>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Passord" variant="standard" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "password")} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Gjenta passord" variant="standard" type="password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeUser(e, "repeatPassword")} />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.marginTop}>
          {errorMessage.length > 0 ? <Typography variant="body2" className={classes.errorMessage}>{errorMessage}</Typography> : null}
          <Button variant="contained" className={classes.marginTop} onClick={() => sendUserInformationToBackend()}>
            Registrer bruker
          </Button>
          <Typography className={classes.registerDiv} variant="body2">Allerede bruker? <span onClick={() => props.setLoginAlternatives("login")} className={classes.registerHere}>Logg inn</span></Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}