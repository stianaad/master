import { Grid, Typography } from "@mui/material"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  body: {
    cursor: "pointer"
  }
})

interface MenuItemProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  header: string
}


export const MenuItem = (props: MenuItemProps) => {
  const classes = useStyles()
  return(
    <div onClick={() => props.setOpen(!props.open)} className={classes.body}>
      <Grid container>
        <Grid item xs={9}>
          <Typography variant="h6">{props.header}</Typography>
        </Grid> 
        <Grid item xs={3}>
          { props.open ?  <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Grid>
      </Grid>
    </div>
  )
}