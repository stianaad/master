import { Grid, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Jerv } from "../../Types/Jerv";

const useStyles = makeStyles({
  body: {
    textAlign: "left",
    marginLeft: "2vw"
  }
});

interface PreditorViewProps {
  preditorData: Jerv[]
}

export const PreditorView = (props: PreditorViewProps) => {
  const classes = useStyles()
  const [currentPreditor, setCurrentPreditor] = useState<Jerv>()
  const predName = ["ulv", "bjørn", "gaupe", "jerv"]
  const damagedAnimal = ["sau", "rein", "hund", "geit", "storfe"]

  useEffect(() => {
    if(props.preditorData.length > 0) {
      setCurrentPreditor(props.preditorData[0])
    }
  }, [props.preditorData])

  const createText = (pred: Jerv, header: boolean) => {
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
        informationText = `${damagedAnimal[parseInt(pred.skadetypeID)]} er drept `
    }
    return header ? headerText : informationText
  }



  /*
  artsId = 4 felt under jakt
  = 
  */

  return (
    <>
    {currentPreditor ?
    <Grid container>
      <Grid item xs={12} className={classes.body}>
        <Typography variant="h6">{createText(currentPreditor, true)} </Typography>
        <Typography variant="body1">Dato: {currentPreditor?.dato.toString().split("T")[0]}</Typography>
        <Typography variant="body1">Sted: {currentPreditor.kommune}</Typography>
        <Typography variant="body1">{createText(currentPreditor, false)}</Typography>
      </Grid>
    </Grid>
    : null}
    </>
  )
}