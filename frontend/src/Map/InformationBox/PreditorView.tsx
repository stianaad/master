import { Button, Divider, Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { sensitiveHeaders } from "http2";
import { useEffect, useState } from "react";
import { Preditor, PreditoColors } from "../../Types/Jerv";
import { getPreditorIconPath } from "../MarkerHelper";

const useStyles = makeStyles({
  body: {
    textAlign: "left",
    paddingLeft: "2vw",
    paddingBottom: "50px",
  },
  pagination: {
    paddingBottom: "20px"
  },
  divider: {
    width: "90%"
  },
  dateAndPlace: {
    marginTop: "1vh"
  }
});

interface PreditorViewProps {
  preditorData: Preditor[],
  setHeader: React.Dispatch<React.SetStateAction<string>>
}

export const PreditorView = (props: PreditorViewProps) => {
  const classes = useStyles()
  const [currentPreditor, setCurrentPreditor] = useState<Preditor>()
  const predName = ["ulv", "bjørn", "gaupe", "jerv"]
  const damagedAnimal = ["sau", "rein", "hund", "geit", "storfe"]
  const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    if(props.preditorData.length > 0) {
      setCurrentPreditor(props.preditorData[0])
      props.setHeader(`1 av ${props.preditorData.length}`)
      setIndex(0)
    }
  }, [props.preditorData])

  const pagination = (value: number) => {
    const newValue = index+value
    setIndex(newValue)
    props.setHeader(`${newValue+1} av ${props.preditorData.length}`)
    setCurrentPreditor(props.preditorData[newValue])
  }

  const createText = (pred: Preditor, header: boolean) => {
    let informationText = ""
    let headerText = ""
    switch (pred.datatype) {
      case "dna":
        headerText = "DNA"
        informationText = `En DNA-prøve av ${predName[pred.rovdyrArtsID-1]} er levert inn.`
        break

      case "Rovviltobservasjon":
        headerText = "Observasjon"
        informationText = `${predName[pred.rovdyrArtsID-1]} er observert`
        break

      case "DodeRovdyr":
        headerText = "Dødt dyr"
        informationText = `Død ${predName[pred.rovdyrArtsID-1]}. Dyrets kjønn var ${pred.kjønnID === "1" ? "hann" : "hunn"}, og vekt var ${pred.vekt} kg.`
        break
      case "Rovviltskade":
        headerText = "Skade"
        informationText = `${damagedAnimal[parseInt(pred.skadetypeID)-1]} er drept `
    }
    return header ? headerText : informationText
  }


  return (
    <div>
      {currentPreditor ?
      <Grid container className={classes.body}>
        <Grid item xs={12}>
          <Typography variant="h6">{createText(currentPreditor, true)} </Typography>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={8} className={classes.dateAndPlace}>
          <Typography variant="body1"><strong>Dato:</strong> {currentPreditor?.dato.toString().split("T")[0]}</Typography>
          <Typography variant="body1"><strong>Sted:</strong> {currentPreditor.kommune}</Typography>
        </Grid>
        <Grid item xs={4}>
        <svg fill={PreditoColors[props.preditorData[index].rovdyrArtsID]} xmlns="http://www.w3.org/2000/svg" width="64" height="64">
          <path fill="white" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
          <circle cx="32" cy="32" r="24.2" />
          <path fill="white" d={getPreditorIconPath(currentPreditor).path}/>
        </svg>
        </Grid>
        <Grid item xs={12}>

          <Typography variant="body1">{createText(currentPreditor, false)}</Typography>
        </Grid>
      </Grid>
      : null}
      {
        props.preditorData.length > 1 ?
        <Grid container className={classes.pagination}>
          <Grid item xs={6}>
            {index -1 < 0 ? null: <Button variant="contained" onClick={() => pagination(-1)}>Forrige</Button> }
          </Grid>
          <Grid item xs={6}>
            { index +1 >= props.preditorData.length ? null : <Button variant="contained" onClick={() => pagination(1)}>Neste</Button> }
          </Grid>
        </Grid> : null
      }
    </div>
  )
}