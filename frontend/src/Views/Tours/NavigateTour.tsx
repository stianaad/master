import { Button, Divider, FormControlLabel, FormGroup, Grid, Slider, Switch, TextField, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PreditoColors, PreditorRegisteredByFarmer, PreditorType } from "../../Types/Preditor";
import { CombinedSheepTourPosition } from "../../Types/Tour"
import { MenuItem } from "./MenuItem";
import { pdfService } from "../../Services/PDFService";
import { DeadSheepPosition } from "../../Types/Sheep";
import { animalService } from "../../Services/AnimalService";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import SquareIcon from '@mui/icons-material/Square';
import { useAppSelector } from "../../hooks";

const useStyles = makeStyles({
  root: {
    overflowY: "auto",
    height: "100vh",
    overflowX: "hidden"
  },
  pCurrent: {
    color: "red"
  },
  notActiveWeekOrMonth: {
    color: "grey"
  },
  activeWeekOrMonth: {
    color: "blue"
  },
  header:{
    paddingTop: "3vh",
    paddingBottom: "3vh"
  },
  switch: {
    marginLeft: "1vw",
  },
  sliderBonitet: {
    marginRight: "2vw",
    marginLeft: "2vw",
    width: "80%"
  },
  divider: {
    marginTop: "2vh",
    marginBottom: "2vh"
  },
  preditorSwitch: {
    textAlign: "left",
    marginLeft: "2vw"
  },
  download: {
    margin: "2vh 0",
    textTransform: "none"
  },
  dateMargin: {
    marginBottom: "1vh"
  },
  sheepNextPrev: {
    marginBottom: "2vh"
  },
  preditorColor: {
    width: "20px",
    height: "20px",
    borderRadius: "3px" 
  }
});


interface NavigateTourProps {
  combinedSheepTourPositions: CombinedSheepTourPosition[],
  activeCombinedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  preditors: {[key: number]: boolean},
  setStartTourIndex: Dispatch<SetStateAction<number>>,
  sheepFlock: boolean,
  setSheepFlock: Dispatch<SetStateAction<boolean>>,
  heatmap: boolean,
  setHeatmap: Dispatch<SetStateAction<boolean>>,
  opacityBonitet: number,
  dateRange: {from: Date, to: Date}
  setOpacityBonitet: Dispatch<SetStateAction<number>>,
  setCurrentSelectedSheepTourPositions: Dispatch<SetStateAction<CombinedSheepTourPosition[]>>,
  setDateRange: Dispatch<SetStateAction<{from: Date, to: Date}>>,
  setActivePreditors: ((type: number, value: boolean) => void),
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[],
  deadSheeps: DeadSheepPosition[],
  week: boolean,
  setWeek: Dispatch<SetStateAction<boolean>>,
  preditorRegisteredByFarmer: PreditorRegisteredByFarmer[]
}

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 30 * 3

export const NavigateTour = (props: NavigateTourProps) => {
  const classes = useStyles()
  const loggedIn = useAppSelector((state: any) => state.loggedIn.value)
  const [monthOverview, setMonthOverview] = useState<string[]>([])
  const [showBonitet, setShowBonitet] = useState<boolean>(false)
  const [showBonitetButton, setShowBonitetButton] = useState<boolean>(false)
  const [showPreditor, setShowPreditor] = useState<boolean>(false)
  const [showSheep, setShowSheep] = useState<boolean>(false)
  const [showPDFGenerator, setShowPDFGenerator] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>(props.dateRange)
  const bonitetNames = ["Jordbruksareal", "Skog, produktiv", "Skog, impediment", "Snaumark, frisk vegetasjon", "Snaumark, skrinn vegetasjon", "Myr", "Bart fjell og blokkmark", "Bebygd og samferdsel", "Snøisbre", "Ferskvann", "Hav"]
  const bonitetColors = ["#F1D66A", "#8AC788", "#D1E3B8", "#C4B493", "#ECE3C7", "#9FA1D5", "#C0C0C0", "#DA6C77", "#FFFFFF", "#A3E5FD", "#D9FFFF"]

  //When the user click next og previeous week/month
  const changeIndex = (value: number) => {
    if(props.week) {
      changeWeek(value)
    } else {
      changeMonth(value)
    }
  }

  const changeWeek = (value: number) => {
    //Find the current index
    let tempIndex = 0
    if( (props.startTourIndex + value) < props.activeCombinedSheepTourPositions.length && (props.startTourIndex + value) > -1) {
       tempIndex = props.startTourIndex + value
    } else if (props.startTourIndex + value < 0) {
      tempIndex = props.activeCombinedSheepTourPositions.length - 1
    }

    props.setStartTourIndex(tempIndex)
    props.setCurrentSelectedSheepTourPositions(props.activeCombinedSheepTourPositions.slice(tempIndex, tempIndex + 1))
  }

  useEffect(() => {
    setDateRange(props.dateRange)
  }, [props.dateRange])

  const getYears =  () => {
    const now = new Date(Date.now()).getFullYear()
    const years: number[] = []
    for (let i = now; i > now - 6; i--) {
      years.push(i)
    }
    return years
  }

  const getCurrentYear = () => {
    return props.dateRange.from.getFullYear()
  }

  const handleYearChange = (event: any) => {
    const year: number = event.target.value
    if (props.week) {
      const fromDate = getDateOfISOWeek(1, year);
      const toDate = new Date(fromDate.getTime())
      toDate.setDate(toDate.getDate() + 7)
      props.setDateRange({from: fromDate, to: toDate})
    } else {
      const fromDate = new Date(year, 0, 1);
      const toDate = new Date(year, 1, 0);
      props.setDateRange({from: fromDate, to: toDate})
    }
  }

  const handleDatePickerClose = () => {
    props.setStartTourIndex(0)
    props.setDateRange(dateRange)
  }

  const getDateOfISOWeek = (w: number, y: number) => {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

  const changeMonth = (value: number) => {
    //Find the current index
    let tempIndex = 0
    if( (props.startTourIndex + value) < monthOverview.length && (props.startTourIndex + value) > -1 ) {
      tempIndex = props.startTourIndex + value
    } else if (props.startTourIndex + value < 0) {
      tempIndex = monthOverview.length - 1
    }

    const currentMonth = monthOverview[tempIndex]
    const newSheepTourArray = props.activeCombinedSheepTourPositions.filter((sheep: CombinedSheepTourPosition) => sheep.tourTime.toString().slice(0,7) === currentMonth)
    props.setCurrentSelectedSheepTourPositions(newSheepTourArray)
    props.setStartTourIndex(tempIndex)
  }

  //Create a array with all the months
  useEffect(() => {
    if(props.activeCombinedSheepTourPositions.length > 0) {
      let tempMonthArray: string[] = []
      let tempMonth = props.activeCombinedSheepTourPositions[0].tourTime.toString().slice(0,7)
      props.activeCombinedSheepTourPositions.forEach((sheepTour: CombinedSheepTourPosition, index: number) => {
        const currentMonth = sheepTour.tourTime.toString().slice(0,7)
        //Check if the current month is equal to the previous
        if( currentMonth != tempMonth) {
          tempMonthArray.push(tempMonth)
          tempMonth = currentMonth
        }
        //If it is the last index, and the month is not pushed yet
        if(index + 1 === props.activeCombinedSheepTourPositions.length) {
          tempMonthArray.push(tempMonth)
        }
      })
      setMonthOverview(tempMonthArray)
      if(!props.week) {
        const newSheepTourArray = props.activeCombinedSheepTourPositions.filter((sheep: CombinedSheepTourPosition) => sheep.tourTime.toString().slice(0,7) === tempMonthArray[0])
        props.setCurrentSelectedSheepTourPositions(newSheepTourArray)
      }
    }
  }, [props.activeCombinedSheepTourPositions])

  //Update the sheepTour array when it changes from week to month and vice versa
  useEffect(() => {
    changeIndex(-props.startTourIndex)
  }, [props.week])

  const changeOpacityBonitet = (event: Event, newValue: number | number[], activeThumb: number) => {
    if(!Array.isArray(newValue)) {
      props.setOpacityBonitet(newValue)
    }
  }

  useEffect(() => {
    if(showBonitet){
      props.setOpacityBonitet(0.5)
    } else {
      props.setOpacityBonitet(0)
    }
  }, [showBonitet])

  const downloadPDF = async () => {
    try{
      const deadSheep = await animalService.getDeadSheep(props.activeCombinedSheepTourPositions[0].tourTime, props.activeCombinedSheepTourPositions[props.activeCombinedSheepTourPositions.length -1].tourTime, loggedIn)
      const res = await pdfService.getPDF(props.activeCombinedSheepTourPositions, deadSheep.data, props.preditorRegisteredByFarmer)
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SimplePdf.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (e){
      console.log(e)
    }
  }
  
  return(
    <div className={classes.root}>
      <Typography variant="h4" className={classes.header}>Turoversikt</Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker value={dateRange.from} inputFormat="dd/MM/yyyy" onChange={(date: Date | null) => {
            if (date != null) {
              let interval = dateRange.to.getTime() - date.getTime()
              if (interval > 0) {
                interval = Math.min(interval, THREE_MONTHS)
                const newToDate: Date = new Date(date.getTime() + interval)
                setDateRange({from: date, to: newToDate})
              }
            }
          }} renderInput={(params) => <TextField {...params} className={classes.dateMargin} />} />
          <DatePicker value={dateRange.to} inputFormat="dd/MM/yyyy" onChange={(date: Date | null) => {
              if (date != null) {
                let interval = date.getTime() - dateRange.from.getTime()
                if (interval > 0) {
                  interval = Math.min(interval, THREE_MONTHS)
                  const newFromDate: Date = new Date(date.getTime() - interval)
                  setDateRange({from: newFromDate, to: date})
                }
              }
            }} renderInput={(params) => <TextField {...params} className={classes.dateMargin} />} />
        </LocalizationProvider>
        <br/>
        <Button variant="contained" disabled={dateRange.from === props.dateRange.from && dateRange.to === props.dateRange.to} onClick={() => handleDatePickerClose()}>Søk</Button>

      <Divider className={classes.divider} />

      <MenuItem open={showPDFGenerator} setOpen={setShowPDFGenerator} header="Årsrapport" />
      {
        showPDFGenerator ?
        <Grid container>
          <Grid item xs={12}>
            <Button className={classes.download} variant="outlined" startIcon={<FileDownloadIcon />} onClick={downloadPDF}>Generer årsrapport</Button>
          </Grid>
        </Grid>
        : null
      }
      <Divider className={classes.divider} />

      <MenuItem open={showBonitetButton} setOpen={setShowBonitetButton} header="Bonitet" />
      {
        showBonitetButton ? 
        <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={showBonitet} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setShowBonitet(event.target.checked)} />} label="Bonitet" />
        {showBonitet ? <div><Slider
          className={classes.sliderBonitet}
          onChange={changeOpacityBonitet}
          size="small"
          min={0}
          max={1}
          step={0.01}
          value={props.opacityBonitet}
          aria-label="Small"
          valueLabelDisplay="auto"
          /> 
          {bonitetNames.map((name: string, index: number) => (
            <Grid container>
              <Grid item xs={12}>
                <Typography style={{ float: "left"}} > <SquareIcon style={{color: bonitetColors[index], verticalAlign: "middle"}} />{name}</Typography>
              </Grid>
            </Grid>
          ))}
          </div>: null}
      </FormGroup>
      : null
      }
      <Divider className={classes.divider} />

      <MenuItem open={showPreditor} setOpen={setShowPreditor} header="Rovdyr" />
      { showPreditor ? 
        <Grid container className={classes.preditorSwitch}>
          <Grid item xs={6}>
            <Box display="flex" alignItems={'center'}>
            <Switch checked={props.preditors[PreditorType.BJORN]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.BJORN, event.target.checked)} />
              <div className={classes.preditorColor} style={{backgroundColor: PreditoColors[2]}}></div>
              <Typography variant="body1" style={{marginLeft: "0.7vw"}}>Bjørn</Typography>
              
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems={'center'}>
            <Switch checked={props.preditors[PreditorType.GAUPE]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.GAUPE, event.target.checked)} />
              <div className={classes.preditorColor} style={{backgroundColor: PreditoColors[3]}}></div>
              <Typography variant="body1" style={{marginLeft: "0.7vw"}}>Gaupe</Typography>
            </Box>  
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems={'center'}>
              
              <Switch checked={props.preditors[PreditorType.ULV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.ULV, event.target.checked)} />
              <div className={classes.preditorColor} style={{backgroundColor: PreditoColors[1]}}></div>
              <Typography variant="body1" style={{marginLeft: "0.7vw"}}>Ulv</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" alignItems={'center'}>
            <Switch checked={props.preditors[PreditorType.JERV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.JERV, event.target.checked)} />
              <div className={classes.preditorColor} style={{backgroundColor: PreditoColors[4]}}></div>
              <Typography variant="body1" style={{marginLeft: "0.7vw"}}>Jerv</Typography>
            </Box>
          </Grid>
        </Grid>
      : null }
      <Divider className={classes.divider} />
      
      <MenuItem open={showSheep} setOpen={setShowSheep} header="Sau" />
      { showSheep ?
      <div>
      <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={props.heatmap} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setHeatmap(event.target.checked)} />} label="Heatmap" />
        <FormControlLabel control={<Switch checked={props.sheepFlock} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSheepFlock(event.target.checked)} />} label="Saueflokker" />
      </FormGroup>
      
      <Divider className={classes.divider} />

      <Grid container>
        <Grid item xs={6}>
          <Button className={props.week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {props.setWeek(true); props.setStartTourIndex(0)}} >Uke</Button>
        </Grid>
        <Grid item xs={6}>
          <Button className={!props.week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {props.setWeek(false); props.setStartTourIndex(0)}}>Måned</Button>
        </Grid>
      </Grid>
      <div>
        {props.activeCombinedSheepTourPositions.map((combinedSheep : CombinedSheepTourPosition, index: number) =>  (
          <p key={index} className={ (props.week && props.startTourIndex === index || props.currentSelectedSheepTourPositions.some((value: CombinedSheepTourPosition) => value.idTour === combinedSheep.idTour)) ? classes.pCurrent : "" }>Tur - {combinedSheep.tourTime}</p>
          ))}
      </div>

      <Grid container className={classes.sheepNextPrev}>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => changeIndex(-1)}>forrige</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={() => changeIndex(1)}>neste</Button>
        </Grid>
      </Grid>
      </div>  : <Divider className={classes.divider} /> }
    </div>
  )
}