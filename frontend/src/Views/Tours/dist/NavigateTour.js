"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.NavigateTour = void 0;
var material_1 = require("@mui/material");
var styles_1 = require("@mui/styles");
var lab_1 = require("@mui/lab");
var AdapterDateFns_1 = require("@mui/lab/AdapterDateFns");
var react_1 = require("react");
var Jerv_1 = require("../../Types/Jerv");
var MenuItem_1 = require("./MenuItem");
var useStyles = styles_1.makeStyles({
    pCurrent: {
        color: "red"
    },
    notActiveWeekOrMonth: {
        color: "grey"
    },
    activeWeekOrMonth: {
        color: "blue"
    },
    header: {
        paddingTop: "3vh",
        paddingBottom: "3vh"
    },
    tourIds: {
        overflowY: "auto",
        height: "30vh"
    },
    "switch": {
        marginLeft: "1vw"
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
exports.NavigateTour = function (props) {
    var classes = useStyles();
    var _a = react_1.useState(true), week = _a[0], setWeek = _a[1]; //False is month
    var _b = react_1.useState([]), monthOverview = _b[0], setMonthOverview = _b[1];
    var _c = react_1.useState(false), showBonitet = _c[0], setShowBonitet = _c[1];
    var _d = react_1.useState(false), showPreditor = _d[0], setShowPreditor = _d[1];
    var _e = react_1.useState(false), showSheep = _e[0], setShowSheep = _e[1];
    //When the user click next og previeous week/month
    var changeIndex = function (value) {
        if (week) {
            changeWeek(value);
        }
        else {
            changeMonth(value);
        }
    };
    var changeWeek = function (value) {
        //Find the current index
        var tempIndex = 0;
        if ((props.startTourIndex + value) < props.combinedSheepTourPositions.length && (props.startTourIndex + value) > -1) {
            tempIndex = props.startTourIndex + value;
        }
        else if (props.startTourIndex + value < 0) {
            tempIndex = props.combinedSheepTourPositions.length - 1;
        }
        props.setStartTourIndex(tempIndex);
        props.setCurrentSelectedSheepTourPositions(props.combinedSheepTourPositions.slice(tempIndex, tempIndex + 1));
    };
    var changeMonth = function (value) {
        //Find the current index
        var tempIndex = 0;
        if ((props.startTourIndex + value) < monthOverview.length && (props.startTourIndex + value) > -1) {
            tempIndex = props.startTourIndex + value;
        }
        else if (props.startTourIndex + value < 0) {
            tempIndex = monthOverview.length - 1;
        }
        var currentMonth = monthOverview[tempIndex];
        var newSheepTourArray = props.combinedSheepTourPositions.filter(function (sheep) { return sheep.tourTime.toString().slice(0, 7) === currentMonth; });
        console.log(newSheepTourArray);
        props.setCurrentSelectedSheepTourPositions(newSheepTourArray);
        props.setStartTourIndex(tempIndex);
    };
    //Create a array with all the months
    react_1.useEffect(function () {
        if (props.combinedSheepTourPositions.length > 0) {
            var tempMonthArray_1 = [];
            var tempMonth_1 = props.combinedSheepTourPositions[0].tourTime.toString().slice(0, 7);
            props.combinedSheepTourPositions.forEach(function (sheepTour, index) {
                var currentMonth = sheepTour.tourTime.toString().slice(0, 7);
                //Check if the current month is equal to the previous
                if (currentMonth != tempMonth_1) {
                    tempMonthArray_1.push(tempMonth_1);
                    tempMonth_1 = currentMonth;
                }
                //If it is the last index, and the month is not pushed yet
                if (index + 1 === props.combinedSheepTourPositions.length) {
                    tempMonthArray_1.push(tempMonth_1);
                }
            });
            setMonthOverview(tempMonthArray_1);
        }
    }, [props.combinedSheepTourPositions]);
    //Update the sheepTour array when it changes from week to month and vice versa
    react_1.useEffect(function () {
        changeIndex(-props.startTourIndex);
    }, [week]);
    var changeOpacityBonitet = function (event, newValue, activeThumb) {
        if (!Array.isArray(newValue)) {
            props.setOpacityBonitet(newValue);
            //console.log(newValue)
        }
    };
    react_1.useEffect(function () {
        if (showBonitet) {
            props.setOpacityBonitet(0.5);
        }
        else {
            props.setOpacityBonitet(0);
        }
    }, [showBonitet]);
    return (React.createElement("div", null,
        React.createElement(material_1.Typography, { variant: "h4", className: classes.header }, "Turoversikt"),
        React.createElement(material_1.FormGroup, { className: classes["switch"] },
            React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: showBonitet, onChange: function (event) { return setShowBonitet(event.target.checked); } }), label: "Bonitet" }),
            showBonitet ? React.createElement(material_1.Slider, { className: classes.sliderBonitet, onChange: changeOpacityBonitet, size: "small", min: 0, max: 1, step: 0.01, value: props.opacityBonitet, "aria-label": "Small", valueLabelDisplay: "auto" }) : null,
            React.createElement(material_1.Divider, { className: classes.divider })),
        React.createElement(MenuItem_1.MenuItem, { open: showPreditor, setOpen: setShowPreditor, header: "Rovdyr" }),
        showPreditor ?
            React.createElement(material_1.Grid, { container: true, className: classes.preditorSwitch },
                React.createElement(material_1.Grid, { item: true, xs: 6 },
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.preditors[Jerv_1.PreditorType.BJORN], onChange: function (event) { return props.setActivePreditors(Jerv_1.PreditorType.BJORN, event.target.checked); } }), label: "Bj\u00F8rn" })),
                React.createElement(material_1.Grid, { item: true, xs: 6 },
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.preditors[Jerv_1.PreditorType.GAUPE], onChange: function (event) { return props.setActivePreditors(Jerv_1.PreditorType.GAUPE, event.target.checked); } }), label: "Gaupe" })),
                React.createElement(material_1.Grid, { item: true, xs: 6 },
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.preditors[Jerv_1.PreditorType.ULV], onChange: function (event) { return props.setActivePreditors(Jerv_1.PreditorType.ULV, event.target.checked); } }), label: "Ulv" })),
                React.createElement(material_1.Grid, { item: true, xs: 6 },
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.preditors[Jerv_1.PreditorType.JERV], onChange: function (event) { return props.setActivePreditors(Jerv_1.PreditorType.JERV, event.target.checked); } }), label: "Jerv" })))
            : null,
        React.createElement(material_1.Divider, { className: classes.divider }),
        React.createElement(MenuItem_1.MenuItem, { open: showSheep, setOpen: setShowSheep, header: "Sauer" }),
        showSheep ?
            React.createElement("div", null,
                React.createElement(material_1.FormGroup, { className: classes["switch"] },
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.heatmap, onChange: function (event) { return props.setHeatmap(event.target.checked); } }), label: "Heatmap" }),
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { checked: props.sheepFlock, onChange: function (event) { return props.setSheepFlock(event.target.checked); } }), label: "Saueflokker" })))
            :
    ));
    React.createElement(lab_1.LocalizationProvider, { dateAdapter: AdapterDateFns_1["default"] },
        React.createElement(lab_1.DatePicker, { value: props.dateRange.from, inputFormat: "dd/MM/yyyy", onChange: function (date) {
                if (date != null) {
                    props.setDateRange({ from: date, to: props.dateRange.to });
                }
            }, renderInput: function (params) { return React.createElement(material_1.TextField, __assign({}, params)); } }),
        React.createElement(lab_1.DatePicker, { value: props.dateRange.to, inputFormat: "dd/MM/yyyy", onChange: function (date) {
                if (date != null) {
                    props.setDateRange({ from: props.dateRange.from, to: date });
                }
            }, renderInput: function (params) { return React.createElement(material_1.TextField, __assign({}, params)); } }));
    { /* <FormGroup className={classes.switch}>
        <FormControlLabel control={
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker value={props.dateRange.from} onChange={(date: React.ChangeEvent<HTMLInputElement> | null) => {
              if (date != null && date.target.value) {
                props.setDateRange({from: new Date(date.target.value), to: props.dateRange.to})
              }
            }} renderInput={(params) => <TextField {...params} />} />
          </LocalizationProvider>
        } label="Fra" />
        <FormControlLabel control={
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker value={props.dateRange.to} onChange={(date: React.ChangeEvent<HTMLInputElement> | null) => {
              if (date != null && date.target.value) {
                props.setDateRange({from: props.dateRange.from, to: new Date(date.target.value)})
              }
            }} renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider>
        } label="Til og med" />
    </FormGroup> */
    }
    React.createElement(material_1.Grid, { container: true },
        React.createElement(material_1.Grid, { item: true, xs: 6 },
            React.createElement(material_1.Button, { className: week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth, onClick: function () { setWeek(true); props.setStartTourIndex(0); } }, "Uke")),
        React.createElement(material_1.Grid, { item: true, xs: 6 },
            React.createElement(material_1.Button, { className: !week ? classes.activeWeekOrMonth : classes.notActiveWeekOrMonth, onClick: function () { setWeek(false); props.setStartTourIndex(0); } }, "M\u00E5ned")))
        ,
            (React.createElement("div", { className: classes.tourIds }, props.combinedSheepTourPositions.map(function (combinedSheep, index) { return (React.createElement("p", { key: index, className: (week && props.startTourIndex === index || props.currentSelectedSheepTourPositions.some(function (value) { return value.idTour === combinedSheep.idTour; })) ? classes.pCurrent : "" }, combinedSheep.idTour)); }))
                ,
                    React.createElement(material_1.Grid, { container: true },
                        React.createElement(material_1.Grid, { item: true, xs: 6 },
                            React.createElement(material_1.Button, { variant: "contained", onClick: function () { return changeIndex(-1); } }, "forrige")),
                        React.createElement(material_1.Grid, { item: true, xs: 6 },
                            React.createElement(material_1.Button, { variant: "contained", onClick: function () { return changeIndex(1); } }, "neste"))));
};
div > ;
React.createElement(material_1.Divider, { className: classes.divider });
div >
;
