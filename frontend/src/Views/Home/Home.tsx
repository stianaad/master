import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Home(){
  const navigate = useNavigate()
  return(
    <div>
      <Typography variant="h4">Framside</Typography>
      <Button variant="contained" onClick={() => navigate("map")}>Map</Button>
    </div>
  )
}