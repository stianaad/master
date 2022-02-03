import { Button } from "@mui/material";
import { useAppDispatch } from "../../hooks";
import { changeValue } from "../../redux/LoggedInSlice";

export function SignOut(){
  const dispatch = useAppDispatch()

  const removeToken = async () => {
    localStorage.setItem("token", "")
    dispatch(changeValue(""))
  }

  return(
    <Button variant="contained" onClick={() => removeToken()}>Logg ut</Button>
  )
}