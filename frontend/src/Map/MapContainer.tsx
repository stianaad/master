import GoogleMapReact from "google-map-react";
import { Polyline } from './Polyline'
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { ActivatableTour, Tour, TourLocation } from "../Types/Tour";
import { TourMap } from "./TourMap";
import { Sidebar } from "./Sidebar";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    textAlign: "center"
  },
  mainContainer: {
    height:"100vh",
    width: "100%",
    display: "flex",
    
  },
  mapContainer: {
    flexGrow: "1"
  }
});

export function MapContainer() {
  const classes = useStyles()
  const [tours, setTours] = useState<ActivatableTour[]>([]);
  const [activeTourMap, setActiveTourMap] = useState<{[key: number]: boolean}>({})
  //const [polylines, setPolylines] = useState<{[key: number]: any}>({})
  let polylines: {[key: number]: any} = {}

  const [testTour, setTestTour] = useState<{lat: number, lng: number}[]>([])
  
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);
  useEffect(() => {
    fetchTours()
    fetchTourLocation()
  }, [])

  const fetchTours = async () => {
    const res = await authenticationService.getGeneratedTours()
    if (res.status === 200) {
      const data: Tour[] = res.data;
      console.log(res.data)
      const tours = data.map((tour) => ({ ...tour, active: true}))
      setTours(tours)
      let tourMap : {[key: number]: boolean} = {}
      for (const tour of tours) {
        tourMap[tour.idTour] = true
      }
      if (mapProps.loaded) {
        initPolylines(mapProps.map, mapProps.maps)
      }

      setActiveTourMap(tourMap)
      //setTours(res.data)
      // if (data.length > 1) {
      //   const _path = data.map((pos) => { return {lat: pos.latitude, lng: pos.longitude } })
      //   console.log(_path)
      //   setPath(_path)
      // }
    }
  }

  function initPolylines(map: any, maps: any) {
    let polylineMap : {[key: number]: any} = {}
    for (const tour of tours) {
      const geodesicPolyline = new maps.Polyline({
        path: tour.positions.map((pos) => ({lat: pos.latitude, lng: pos.longitude})),
        geodesic: false,
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
      })
      polylineMap[tour.idTour] = geodesicPolyline
    }
    //setPolylines(polylineMap)
    polylines = polylineMap
  }

  const fetchTourLocation = async () => {
    const res = await authenticationService.getTourLocations()
    if (res.status === 200) {
      const data: TourLocation[] = res.data;
      setTestTour(data.map((pos) => { return {lat: pos.longitude, lng: pos.latitude}}))
    }
  }
  const onMapLoaded = (map: any, maps: any) => {
    setMapProps({
      map: map,
      maps: maps,
      loaded: true,
    })
    initPolylines(map, maps)
    setPolylinesInMap()
  }

  const setPolylinesInMap = () => {
    for (const id in polylines) {
      const polyline = polylines[id]
      if (activeTourMap[id]) {
        polyline.setMap(mapProps.map)
      } else {
        polyline.setMap(null)
      } 
    }
  }

  // const handleActiveTourChange = (tours: ActivatableTour[]) => {
  //   setTours(tours)
  // }

  const handleActiveTourChange = (active: boolean, idTour: number) => {
    setActiveTourMap({...activeTourMap, [idTour]: active})
    setPolylinesInMap()
  }

  function renderPolylines (map: any, maps: any) {
    let geodesicPolyline = new maps.Polyline({
      path: [],
      geodesic: false,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 4
    })
    console.log("created polyline:", geodesicPolyline)
    geodesicPolyline.setMap(map)
  }

  return(
    <div className={classes.mainContainer}>
      {/* <Sidebar tours={tours} activeMap={activeTourMap} onActiveChange={handleActiveTourChange}/> */}
      <div className={classes.mapContainer}>
        <GoogleMapReact 
          bootstrapURLKeys={{key:"AIzaSyB-xQ9kta6HYHD5OtV9SF_ybPAD31Edc0w"}}
          defaultCenter={{lat: 63.446827, lng: 10.421906}}
          defaultZoom={11}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({map, maps}) => {
            //renderPolylines(map, maps)
            onMapLoaded(map, maps)
            map.mapTypes.set("norgeskart", new maps.ImageMapType({
              getTileUrl: (cord: any, zoom: any) => {
                return `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}`
              },
              tileSize: new maps.Size(256,256),
              name: "master", 
              maxZoom: 18
            }))
            map.setMapTypeId("norgeskart")
          }}
          > 
          {
            // mapProps.loaded ? tours.map((tour) => (
            //   <Polyline
            //     map={mapProps.map}
            //     maps={mapProps.maps}
            //     path={tour.positions.map((pos) => { return {lat: pos.longitude, lng: pos.latitude}})} />
            // )): null
          }
          {
            // mapProps.loaded ? (
            //   <Polyline
            //     map={mapProps.map}
            //     maps={mapProps.maps}
            //     path={testTour} />
            // ): null
          }
            
            {
              // mapProps.loaded ? tours.map((tour: Tour) => activeTourMap[tour.idTour] ? tour.sheepPositions.map((sheep, idx) => (
              //   <MapMarker
              //     lat={sheep.latitude}
              //     lng={sheep.longitude}
              //     text={`${sheep.id}`}
              //     key={idx}
              //   />
              // )) : null) : null

              mapProps.loaded ? tours.map((tour: Tour) => tour.sheepPositions.map((sheep, idx) => (
                <MapMarker
                  lat={sheep.latitude}
                  lng={sheep.longitude}
                  text={`${sheep.id}`}
                  key={idx}
                />
              ))) : null
            }
        </GoogleMapReact>
      </div>
    </div>
  )
}