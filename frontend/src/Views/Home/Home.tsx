import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Login } from "../Authentication/Login";

export function Home(){
  const navigate = useNavigate()
  return(
    <div>
      <Typography variant="h4">Framside</Typography>
      <Login />
      <br/>
      <Button variant="contained" onClick={() => navigate("tur")}>Turer</Button>
    </div>
  )
}