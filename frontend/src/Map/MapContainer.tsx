import GoogleMapReact, { Heatmap } from "google-map-react";
import { Polyline } from './Polyline'
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { CombinedSheepPosition, CombinedSheepTourPosition, LatLong, SheepPosition, Tour, TourLocation } from "../Types/Tour";
import { TourMap } from "./TourMap";
import { mapFlockOfSheep } from "./MapFlockOfSheep";
import { tourService } from "../Services/TourService";
import { useAppSelector } from "../hooks";
import { animalService } from "../Services/AnimalService";
import { Jerv } from "../Types/Jerv";
let utm = require("utm")
//import utm from "utm"

interface MapContainerProps {
  combinedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  sheepFlock: boolean,
  heatmap: boolean
}

export function MapContainer(props: MapContainerProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [sheepTourPositions, setSheepTourPositions] = useState<LatLong[][]>([])
  //const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [sheepHeatMap, setSheepHeatMap] = useState<any[]>([])
  const [jervData, setJervData] = useState<Jerv[]>([])
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
    //fetchTours()
    fetchGeneratedTours()
    fetchJerv()
  }, [])

  const fetchGeneratedTours = async () => {
    const res = await authenticationService.getGeneratedTours()
    //console.log(res.data)
    //setTours(res.data)
  }

  const fetchJerv = async () => {
    const res = await animalService.getJerv()
    if(res.data.length > 0) {
      //console.log(res.data)
      //The point start at index 7 and ends at length - 1
      const jerv: Jerv[] = await res.data.map((data: Jerv) => {
        const utmPoint = data.wkt.substring(7, data.wkt.length-1).split(" ")
        const {latitude, longitude} = utm.toLatLon(utmPoint[0], utmPoint[1], 33, "N", undefined, false)
        data.latitude = latitude
        data.longitude = longitude
        return data
      })
      setJervData(jerv)
    }
  }

  const path2 = [
    {lng: 10.30509, lat: 63.426847},
    {lng: 10.304835, lat: 63.426892},
    {lng: 10.304678, lat: 63.426715},
    {lng: 10.304814, lat: 63.426684},
    {lng: 10.305027, lat: 63.426528},
    {lng: 10.304994, lat: 63.426273},
    {lng: 10.305177, lat: 63.425854},
  ]

  useEffect(() => {
    if(props.heatmap){
      createHeatMap()
    } else {
      setSheepHeatMap([])
    }
  }, [props.combinedSheepTourPositions, props.heatmap, props.startTourIndex])

  const createHeatMap =  async () => {
    let arr: any = []

    props.combinedSheepTourPositions.slice(props.startTourIndex, props.startTourIndex +1).map((sheepTour: CombinedSheepTourPosition) => {
      sheepTour.combinedSheepPositions.map((sheep: CombinedSheepPosition) => {
        sheep.locations.map((loc: LatLong) => {
          arr.push({lat: loc.latitude, lng: loc.longitude, weight: sheep.totalNumberOfSheep/sheep.locations.length })
        })
      })
    })

    /*tours.map((tour:Tour) => {
      tour.sheepPositions.map((sheep: SheepPosition, index : number) => {
        arr.push({lat: sheep.latitude, lng: sheep.longitude, weight: sheep.totalNumberOfSheep })
      }
    )})*/
    setSheepHeatMap(arr)
  }

  const heatMapData: Heatmap = {
    positions: sheepHeatMap,
    options: {
      radius: 20,
      opacity: 0.6
    }
  }

  return(
    <div style={{ height: '100vh', width: '100%' }}>
      <div>heheeh</div>
      <GoogleMapReact 
        bootstrapURLKeys={{key:"AIzaSyB-xQ9kta6HYHD5OtV9SF_ybPAD31Edc0w"}}
        defaultCenter={{lat: 62.702802875467334, lng: 9.14644192722107}}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        heatmapLibrary={true}
        heatmap={heatMapData}
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
          props.combinedSheepTourPositions.slice(props.startTourIndex, props.startTourIndex +1).map((combinedTour: CombinedSheepTourPosition) => (
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

        { props.combinedSheepTourPositions &&
          props.combinedSheepTourPositions.length > 0 &&
          props.sheepFlock ?
          props.combinedSheepTourPositions.slice(props.startTourIndex, props.startTourIndex +1).map((combinedTour: CombinedSheepTourPosition) => (
            combinedTour.combinedSheepPositions.map((combinedSheep: CombinedSheepPosition) => (
              combinedSheep.locations.map((location: LatLong, index: number) => (
                <MapMarker backgroundColor="red" lat={location.latitude} lng={location.longitude} text={combinedSheep.flockId.toString()} key={index} />
              ))
            ))
          )) : null
        }

        {
          jervData.length > 0 ? 
          jervData.map((jerv: Jerv, index: number) => (
            <MapMarker backgroundColor="blue" lat={jerv.latitude} lng={jerv.longitude} text={jerv.artsIDPrøve} key={index} />
          )) : null
        }
        
        { /*
        tours.length > 0 ? 
          tours.map((tour:Tour) => (
            tour.sheepPositions.map((sheep: SheepPosition, index : number) => (
              <MapMarker lat={sheep.latitude} lng={sheep.longitude} text={sheep.id.toString()} key={index} />
            )
          ))) : null*/
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