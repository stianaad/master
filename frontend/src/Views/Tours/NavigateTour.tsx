import { Button, Divider, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, Select, Slider, Switch, TextField, Typography, MenuItem as MuiMenuItem } from "@mui/material"
import { makeStyles } from "@mui/styles";
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PreditorType } from "../../Types/Jerv";
import { CombinedSheepTourPosition } from "../../Types/Tour"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MenuItem } from "./MenuItem";
import { pdfService } from "../../Services/PDFService";
import { DeadSheepPosition } from "../../Types/Sheep";
import { animalService } from "../../Services/AnimalService";
import { responsiveProperty } from "@mui/material/styles/cssUtils";

const useStyles = makeStyles({
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
  tourIds: {
    overflowY: "auto",
    height: "30vh"
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
  }
});


interface NavigateTourProps {
  combinedSheepTourPositions: CombinedSheepTourPosition[]
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
  deadSheeps: DeadSheepPosition[]
}

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 30 * 3

export const NavigateTour = (props: NavigateTourProps) => {
  const classes = useStyles()
  const [week, setWeek] = useState<boolean>(true) //False is month
  const [monthOverview, setMonthOverview] = useState<string[]>([])
  const [showBonitet, setShowBonitet] = useState<boolean>(false)
  const [showPreditor, setShowPreditor] = useState<boolean>(false)
  const [showSheep, setShowSheep] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>(props.dateRange)

  //When the user click next og previeous week/month
  const changeIndex = (value: number) => {
    if(week) {
      changeWeek(value)
    } else {
      changeMonth(value)
    }
  }

  const changeWeek = (value: number) => {
    //Find the current index
    let tempIndex = 0
    if( (props.startTourIndex + value) < props.combinedSheepTourPositions.length && (props.startTourIndex + value) > -1) {
       tempIndex = props.startTourIndex + value
    } else if (props.startTourIndex + value < 0) {
      tempIndex = props.combinedSheepTourPositions.length - 1
    }

    props.setStartTourIndex(tempIndex)
    props.setCurrentSelectedSheepTourPositions(props.combinedSheepTourPositions.slice(tempIndex, tempIndex + 1))
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
    if (week) {
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
    const newSheepTourArray = props.combinedSheepTourPositions.filter((sheep: CombinedSheepTourPosition) => sheep.tourTime.toString().slice(0,7) === currentMonth)
    props.setCurrentSelectedSheepTourPositions(newSheepTourArray)
    props.setStartTourIndex(tempIndex)
  }

  //Create a array with all the months
  useEffect(() => {
    if(props.combinedSheepTourPositions.length > 0) {
      let tempMonthArray: string[] = []
      let tempMonth = props.combinedSheepTourPositions[0].tourTime.toString().slice(0,7)
      props.combinedSheepTourPositions.forEach((sheepTour: CombinedSheepTourPosition, index: number) => {
        const currentMonth = sheepTour.tourTime.toString().slice(0,7)
        //Check if the current month is equal to the previous
        if( currentMonth != tempMonth) {
          tempMonthArray.push(tempMonth)
          tempMonth = currentMonth
        }
        //If it is the last index, and the month is not pushed yet
        if(index + 1 === props.combinedSheepTourPositions.length) {
          tempMonthArray.push(tempMonth)
        }
      })
      setMonthOverview(tempMonthArray)
    }
  }, [props.combinedSheepTourPositions])

  //Update the sheepTour array when it changes from week to month and vice versa
  useEffect(() => {
    changeIndex(-props.startTourIndex)
  }, [week])

  const changeOpacityBonitet = (event: Event, newValue: number | number[], activeThumb: number) => {
    if(!Array.isArray(newValue)) {
      props.setOpacityBonitet(newValue)
      //console.log(newValue)
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
      const deadSheep = await animalService.getDeadSheep(props.combinedSheepTourPositions[0].tourTime, props.combinedSheepTourPositions[props.combinedSheepTourPositions.length -1].tourTime)
      const res = await pdfService.getPDF(props.combinedSheepTourPositions, deadSheep.data)
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
    <div>
      <Typography variant="h4" className={classes.header}>Turoversikt</Typography>
      <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={showBonitet} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setShowBonitet(event.target.checked)} />} label="Bonitet" />
        {showBonitet ? <Slider
          className={classes.sliderBonitet}
          onChange={changeOpacityBonitet}
          size="small"
          min={0}
          max={1}
          step={0.01}
          value={props.opacityBonitet}
          aria-label="Small"
          valueLabelDisplay="auto"
        /> : null}
        <Divider className={classes.divider} />
      </FormGroup>

      <Button variant="contained" onClick={downloadPDF}>Last ned</Button>


      <MenuItem open={showPreditor} setOpen={setShowPreditor} header="Rovdyr" />
      { showPreditor ? 
        <Grid container className={classes.preditorSwitch}>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={props.preditors[PreditorType.BJORN]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.BJORN, event.target.checked)} />} label="Bjørn" />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={props.preditors[PreditorType.GAUPE]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.GAUPE, event.target.checked)} />} label="Gaupe" />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={props.preditors[PreditorType.ULV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.ULV, event.target.checked)} />} label="Ulv" />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={props.preditors[PreditorType.JERV]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setActivePreditors(PreditorType.JERV, event.target.checked)} />} label="Jerv" />
          </Grid>
        </Grid>
      : null }
      <Divider className={classes.divider} />
      
      <MenuItem open={showSheep} setOpen={setShowSheep} header="Sauer" />
      { showSheep ?
      <div>
      <FormGroup className={classes.switch}>
        <FormControlLabel control={<Switch checked={props.heatmap} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setHeatmap(event.target.checked)} />} label="Heatmap" />
        <FormControlLabel control={<Switch checked={props.sheepFlock} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.setSheepFlock(event.target.checked)} />} label="Saueflokker" />
      </FormGroup>
      
      <Divider className={classes.divider} />

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
        }} renderInput={(params) => <TextField {...params} />} />
        <DatePicker value={dateRange.to} inputFormat="dd/MM/yyyy" onChange={(date: Date | null) => {
            if (date != null) {
              //setDateRange({from: dateRange.from, to: date})
              let interval = date.getTime() - dateRange.from.getTime()
              if (interval > 0) {
                interval = Math.min(interval, THREE_MONTHS)
                const newFromDate: Date = new Date(date.getTime() - interval)
                setDateRange({from: newFromDate, to: date})
              }
            }
          }} renderInput={(params) => <TextField {...params} />} />
      </LocalizationProvider>
      <Button variant="contained" disabled={dateRange.from === props.dateRange.from && dateRange.to === props.dateRange.to} onClick={() => handleDatePickerClose()}>Søk</Button>

      {/* <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">År</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={getCurrentYear()}
          label="Age"
          onChange={handleYearChange}
        >
          {
            getYears().map((year) => (
              <MuiMenuItem key={year} value={year}>{year.toString()}</MuiMenuItem>
            ))
          }
        </Select>
    </FormControl> */}

      <Grid container>
        <Grid item xs={6}>
          <Button className={week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {setWeek(true); props.setStartTourIndex(0)}} >Uke</Button>
        </Grid>
        <Grid item xs={6}>
          <Button className={!week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth} onClick={() => {setWeek(false); props.setStartTourIndex(0)}}>Måned</Button>
        </Grid>
      </Grid>
      <div className={classes.tourIds}>
        {props.combinedSheepTourPositions.map((combinedSheep : CombinedSheepTourPosition, index: number) =>  (
          <p key={index} className={ (week && props.startTourIndex === index || props.currentSelectedSheepTourPositions.some((value: CombinedSheepTourPosition) => value.idTour === combinedSheep.idTour)) ? classes.pCurrent : "" }>Tur - {combinedSheep.tourTime}</p>
          ))}
      </div>
      {/* <div className={classes.tourIds}>
        {props.combinedSheepTourPositions.map((combinedSheep : CombinedSheepTourPosition, index: number) =>  (
          <p key={index} className={ combinedSheep.tourTime.toString() >= props.dateRange.from.toISOString() && combinedSheep.tourTime.toString() <= props.dateRange.to.toISOString() ? classes.pCurrent : "" }>{combinedSheep.idTour}</p>
          ))}
      </div> */}

      <Grid container >
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