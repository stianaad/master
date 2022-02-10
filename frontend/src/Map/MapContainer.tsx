import GoogleMapReact from "google-map-react";
import { Polyline } from './Polyline'
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { CombinedSheepPosition, CombinedSheepTourPosition, LatLong, SheepPosition, Tour, TourLocation } from "../Types/Tour";
import { TourMap } from "./TourMap";
import { mapFlockOfSheep } from "./MapFlockOfSheep";
import { tourService } from "../Services/TourService";
import { useAppSelector } from "../hooks";
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
  const [tours, setTours] = useState<Tour[]>([]);
  const [sheepTourPositions, setSheepTourPositions] = useState<LatLong[][]>([])
  const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [map, setMap] = useState()
  const [maps, setMaps] = useState()
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);
  const loggedIn = useAppSelector((state) => state.loggedIn.value)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    if (loggedIn.length > 0) {
      const res = await tourService.getCombinedSheepTourPositions() //authenticationService.getTours()
      console.log(res)
      if (res.status === 200) {
        setCombinedSheepTourPositions(res.data)
        //console.log(data)
        /*const flockTour: {tours: Tour[], sheepTourPositions: LatLong[][] } = await mapFlockOfSheep(data)
        setTours(flockTour.tours)
        setSheepTourPositions(flockTour.sheepTourPositions)
        console.log(flockTour)*/
        //setTours(res.data)
        // if (data.length > 1) {
        //   const _path = data.map((pos) => { return {lat: pos.latitude, lng: pos.longitude } })
        //   console.log(_path)
        //   setPath(_path)
        // }
      }
    }
  }

  // function initPolylines(map: any, maps: any) {
  //   let polylineMap : {[key: number]: any} = {}
  //   for (const tour of tours) {
  //     const geodesicPolyline = new maps.Polyline({
  //       path: tour.positions.map((pos) => ({lat: pos.latitude, lng: pos.longitude})),
  //       geodesic: false,
  //       strokeColor: '#ff0000',
  //       strokeOpacity: 1.0,
  //       strokeWeight: 4
  //     })
  //     polylineMap[tour.idTour] = geodesicPolyline
  //   }
  //   //setPolylines(polylineMap)
  //   polylines = polylineMap
  // }

  const path2 = [
    {lng: 10.30509, lat: 63.426847},
    {lng: 10.304835, lat: 63.426892},
    {lng: 10.304678, lat: 63.426715},
    {lng: 10.304814, lat: 63.426684},
    {lng: 10.305027, lat: 63.426528},
    {lng: 10.304994, lat: 63.426273},
    {lng: 10.305177, lat: 63.425854},
  ]

  return(
    <div style={{ height: '100vh', width: '100%' }}>
      <div>heheeh</div>
      <GoogleMapReact 
        bootstrapURLKeys={{key:"AIzaSyB-xQ9kta6HYHD5OtV9SF_ybPAD31Edc0w"}}
        defaultCenter={{lat: 63.446827, lng: 10.421906}}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => {
          setMap(map)
          setMaps(maps)
          setMapProps({
            map: map,
            maps: maps,
            loaded: true,
          })
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
        mapProps.loaded ? (
          combinedSheepTourPositions.map((combinedTour: CombinedSheepTourPosition) => (
            combinedTour.combinedSheepPositions.map((combinedSheep: CombinedSheepPosition, index: number) => (
              <Polyline
                key={index}
                map={mapProps.map}
                maps={mapProps.maps}
                path={combinedSheep.locations.map((l: LatLong) =>  {return {lat: l.latitude, lng: l.longitude}})} />
            ))
          ))
          /*sheepTourPositions.map((pos: LatLong[], index: number) => 
          <Polyline
            key={index}
            map={mapProps.map}
            maps={mapProps.maps}
            path={pos} />
          )*/
           ) : null
        }

        { combinedSheepTourPositions &&
          combinedSheepTourPositions.length > 0 ?
          combinedSheepTourPositions.map((combinedTour: CombinedSheepTourPosition) => (
            combinedTour.combinedSheepPositions.map((combinedSheep: CombinedSheepPosition) => (
              combinedSheep.locations.map((location: LatLong, index: number) => (
                <MapMarker lat={location.latitude} lng={location.longitude} text={combinedSheep.flockId.toString()} key={index} />
              ))
            ))
          )) : null
        }
        
        { 
        tours.length > 0 ? 
          tours.map((tour:Tour) => (
            tour.sheepPositions.map((sheep: SheepPosition, index : number) => (
              <MapMarker lat={sheep.latitude} lng={sheep.longitude} text={sheep.id.toString()} key={index} />
            )
          ))) : null
        }
        {
          /*tours.map((tour: Tour) => (
            <TourMap tour={tour} key={tour.idTour} />
          ))*/
        }
      </GoogleMapReact>
    </div>
  )
}