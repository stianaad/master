import GoogleMapReact, { Heatmap } from "google-map-react";
import { Polyline } from './Polyline'
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { CombinedSheepTourPosition, Tour, TourLocation } from "../Types/Tour";
import { CombinedSheepPosition, SheepPosition, LatLong, DeadSheepPosition } from "../Types/Sheep"
import { TourMap } from "./TourMap";
import { mapFlockOfSheep } from "./MapFlockOfSheep";
import { tourService } from "../Services/TourService";
import { useAppSelector } from "../hooks";
import { animalService } from "../Services/AnimalService";
import { Jerv } from "../Types/Jerv";
import { Bonitet } from "../Types/Bonitet";
import { InformationBoxMap } from "./InformationBox/InformationBoxMap";
let utm = require("utm")
//import utm from "utm"

interface MapContainerProps {
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  sheepFlock: boolean,
  heatmap: boolean,
  opacityBonitet: number,
  deadSheep: DeadSheepPosition[]
}

export function MapContainer(props: MapContainerProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [sheepTourPositions, setSheepTourPositions] = useState<LatLong[][]>([])
  //const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [sheepHeatMap, setSheepHeatMap] = useState<any[]>([])
  const [jervData, setJervData] = useState<Jerv[]>([])
  const [southWestCorner, setSouthWestCorner] = useState<LatLong>()
  const [selectedDeadSheep, setSelectedDeadSheep] = useState<DeadSheepPosition>()
  const [selectedSheepTourPosition, setSelectedSheepTourPosition] = useState<CombinedSheepTourPosition>()
  const [map, setMap] = useState<any>()
  const [maps, setMaps] = useState<any>()
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  const [openInformationBox, setOpenInformationBox] = useState<boolean>(false)
  
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

  useEffect(() => {
    if(props.heatmap){
      createHeatMap()
    } else {
      setSheepHeatMap([])
    }
  }, [props.currentSelectedSheepTourPositions, props.heatmap, props.startTourIndex])

  const createHeatMap =  async () => {
    let arr: any = []

    props.currentSelectedSheepTourPositions.map((sheepTour: CombinedSheepTourPosition) => {
      sheepTour.combinedSheepPositions.map((sheep: CombinedSheepPosition) => {
        sheep.locations.map((loc: LatLong) => {
          arr.push({lat: loc.latitude, lng: loc.longitude, weight: sheep.totalNumberOfSheep/sheep.locations.length })
        })
      })
    })
    setSheepHeatMap(arr)
  }

  const heatMapData: Heatmap = {
    positions: sheepHeatMap,
    options: {
      radius: 20,
      opacity: 0.6
    }
  }

  var EXTENT = [-Math.PI * 6378137, Math.PI * 6378137];

  function xyzToBounds(x: number, y: number, z: number) {
      var tileSize = EXTENT[1] * 2 / Math.pow(2, z);
      var minx = EXTENT[0] + x * tileSize;
      var maxx = EXTENT[0] + (x + 1) * tileSize;
      // remember y origin starts at top
      var miny = EXTENT[1] - (y + 1) * tileSize;
      var maxy = EXTENT[1] - y * tileSize;
      return [minx, miny, maxx, maxy];
  }

  const change = (c: any) => {
    setSouthWestCorner({latitude: c.marginBounds.sw.lat, longitude: c.marginBounds.sw.lng})
  }

  const handleClickOnDeadAnimal = (index: number) => {
    setSelectedDeadSheep(props.deadSheep[index])
    setOpenInformationBox(true)
  }

  const handleClickOnFlock = (indexTour: number, indexSheep: number) => {
    const newTour: CombinedSheepTourPosition = {...props.currentSelectedSheepTourPositions[indexTour]}
    newTour.combinedSheepPositions = [newTour.combinedSheepPositions[indexSheep]]
    console.log(newTour)
    setSelectedSheepTourPosition(newTour)
  }

  //Change the opacity on the bonitet map
  useEffect(() => {
    if(map && map.overlayMapTypes.Ed.length > 1){
      map.overlayMapTypes.Ed[1].setOpacity(props.opacityBonitet)
    }
  }, [props.opacityBonitet])

  return(
    <div style={{ height: '100vh', width: '100%', position: "relative" }}>
      <GoogleMapReact 
        bootstrapURLKeys={{key:"AIzaSyB-xQ9kta6HYHD5OtV9SF_ybPAD31Edc0w"}}
        defaultCenter={{lat: 62.702802875467334, lng: 9.14644192722107}}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        heatmapLibrary={true}
        heatmap={heatMapData}
        onChange={change}
        onGoogleApiLoaded={({map, maps}) => {
          setMap(map)
          setMaps(maps)
          setMapProps({
            map: map,
            maps: maps,
            loaded: true,
          })
          const norgeskartLayer = new maps.ImageMapType({
            getTileUrl: (cord: any, zoom: any) => {
              
              const str = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}` 
              return str
            },
            tileSize: new maps.Size(256, 256),
            name: "norgeskart_master", 
            maxZoom: 18,
            opacity: 1
          })

          const bonitetLayer = new maps.ImageMapType({
            getTileUrl: (cord: any, zoom: any) => {
              const str = `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:3857&STYLES=&WIDTH=${256}&HEIGHT=${256}&BBOX=${xyzToBounds(cord.x, cord.y, zoom).join(",")}` 
              return str
            },
            tileSize: new maps.Size(256, 256),
            name: "bonitet_master", 
            maxZoom: 18,
            opacity: props.opacityBonitet
          })
          map.overlayMapTypes.push(norgeskartLayer)
          map.overlayMapTypes.push(bonitetLayer)
        }}
        > 
        {
        mapProps.loaded ? (
          props.currentSelectedSheepTourPositions.map((combinedTour: CombinedSheepTourPosition) => (
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

        { props.currentSelectedSheepTourPositions &&
          props.currentSelectedSheepTourPositions.length > 0 &&
          props.sheepFlock ?
          props.currentSelectedSheepTourPositions.map((combinedTour: CombinedSheepTourPosition, indexCombinedTour: number) => (
            combinedTour.combinedSheepPositions.map((combinedSheep: CombinedSheepPosition, indexCombinedSheep: number) => (
              combinedSheep.locations.map((location: LatLong, index: number) => (
                <MapMarker backgroundColor="red" handleClick={(indexTour) => handleClickOnFlock(indexTour, indexCombinedSheep)} index={indexCombinedTour} lat={location.latitude} lng={location.longitude} text={combinedSheep.flockId.toString()} key={index} />
              ))
            ))
          )) : null
        }

        {
          props.deadSheep.map((dead: DeadSheepPosition, index: number) => (
            <MapMarker backgroundColor="purple" handleClick={handleClickOnDeadAnimal} index={index} lat={dead.latitude} lng={dead.longitude} text={dead.id.toString()} key={index} />
          ))
        }

        {
          jervData.length > 0 ? 
          jervData.map((jerv: Jerv, index: number) => (
            <MapMarker backgroundColor="blue" index={index} handleClick={handleClickOnDeadAnimal} lat={jerv.latitude} lng={jerv.longitude} text={jerv.artsIDPrøve} key={index} />
            )) : null
        }
        {
          southWestCorner && openInformationBox ?
          <InformationBoxMap deadSheep={selectedDeadSheep} sheepFlock={selectedSheepTourPosition} lat={southWestCorner.latitude} lng={southWestCorner.longitude} onClose={() => setOpenInformationBox(false)} /> : null
        }

      </GoogleMapReact>
    </div>
  )
}