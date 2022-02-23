import GoogleMapReact, { Heatmap } from "google-map-react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
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
import { Jerv, PreditoColors, SkadeType } from "../Types/Jerv";
import { Bonitet } from "../Types/Bonitet";
import { cowIcon, crossIcon, deerIcon, dnaIcon, dogIcon, dotsIcon, eyeIcon, footPrint, goatIcon, hairIcon, sheepIcon } from "../Registrations/rovbaseIcons";
import { getPreditorMarkers } from "./MarkerHelper";
let utm = require("utm")
//import utm from "utm"

interface MapContainerProps {
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  sheepFlock: boolean,
  heatmap: boolean
  preditors: {[key: number]: boolean}
}

export function MapContainer(props: MapContainerProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [sheepTourPositions, setSheepTourPositions] = useState<LatLong[][]>([])
  const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null)
  //const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [sheepHeatMap, setSheepHeatMap] = useState<any[]>([])
  const [jervData, setJervData] = useState<Jerv[]>([])
  const [bonitetData, setBonitetData] = useState<Bonitet>()
  const [map, setMap] = useState<any>()
  const [maps, setMaps] = useState<any>()
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

  useEffect(() => {
    fetchJerv()
  }, [props.startTourIndex])


  useEffect(() => {
    detachPreditorMarkers()
    renderPreditorMarkers(jervData.filter((pred) => props.preditors[pred.rovdyrArtsID]))
  }, [mapProps.loaded, props.preditors, jervData])

  const fetchGeneratedTours = async () => {
    const res = await authenticationService.getGeneratedTours()
    //console.log(res.data)
    //setTours(res.data)
  }

  const fetchJerv = async () => {
    console.log('fetching jerv')
    const activePreditors = []
    for (const key in props.preditors) {
      if (props.preditors[key]) {
        activePreditors.push(parseInt(key))
        
      }
    }
    if (activePreditors.length === 0) {
      setJervData([])
      return
    }
    detachPreditorMarkers()
    const res = await animalService.getAnimalPreditors(new Date(2022,1,1), new Date(2022,2,21), activePreditors)
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
      renderPreditorMarkers(jerv)
    }
  }

  
  const [preditorMarkers, setPreditorMarkers] = useState<any[]>([])
  const renderPreditorMarkers = (preditors: Jerv[]) => {
    const markers = getPreditorMarkers(preditors, mapProps)
    setPreditorMarkers(markers)
    markerCluster?.clearMarkers()
    markerCluster?.addMarkers(markers)
  }

  const detachPreditorMarkers = () => {
    if (mapProps.loaded) {
      for (const marker of preditorMarkers) {
        marker.setMap(null);
      }
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
    setBonitetData({
      sw: {latitude: c.marginBounds.sw.lat, longitude: c.marginBounds.sw.lng}, 
      ne: {latitude: c.marginBounds.ne.lat, longitude: c.marginBounds.ne.lng},
      height: c.size.height,
      width: c.size.width
    })
  }

  return(
    <div style={{ height: '100vh', width: '100%' }}>
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
          setMarkerCluster(new MarkerClusterer({map}))

          /*const t =  new maps.KmlLayer({
            url: 'https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG%3A25833&STYLES=&WIDTH=998&HEIGHT=1204&BBOX=200580.47491253127%2C6965501.835524839%2C206897.8716612783%2C6973123.223987256'
          })
          t.setMap(map)*/

          /*map.mapTypes.set("test", new maps.ImageMapType({
            getTileUrl: async (cord: any, zoom: any) => {
              /*if (bonitetData?.height && bonitetData.ne && bonitetData.sw && bonitetData.width) {
                const sw_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(bonitetData.sw.latitude, bonitetData.sw.longitude, 33)
                const ne_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(bonitetData.ne.latitude, bonitetData.ne.longitude, 33)
                //return `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=${bonitetData.width}&HEIGHT=${bonitetData.height}&BBOX=${sw_utm.easting},${sw_utm.northing},${ne_utm.easting},${ne_utm.northing}`
              }
              return 'https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=1006&HEIGHT=1227&BBOX=190994.57269703568,6959370.228024009,201081.60670746968,6971673.20091745'
            },
            tileSize: new maps.Size(256,256),//(bonitetData?.width,bonitetData?.height),
            name: "t", 
            maxZoom: 18
          }))
          map.setMapTypeId("test")*/

          // map.mapTypes.set("s", new maps.ImageMapType({
          //   getTileUrl: async (cords: any, zoom: any) => {
          //     let boundsNE = await map.getBounds().getNorthEast()
          //     let boundsSW = await map.getBounds().getSouthWest()
          //     const ne_lat = boundsNE.lat()
          //     const ne_lng = boundsNE.lng()
          //     const sw_lat = boundsSW.lat()
          //     const sw_lng = boundsSW.lng()

          //     const sw_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(sw_lat, sw_lng, 33)
          //     const ne_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(ne_lat, ne_lng, 33)
          //     console.log("SW", sw_utm)
              
          //     const str = `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=${map.getDiv().offsetWidth}&HEIGHT=${map.getDiv().offsetHeight}&BBOX=${sw_utm.easting},${sw_utm.northing},${ne_utm.easting},${ne_utm.northing}`
          //     console.log(str)
          //     //return str
          //     return 'https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=1006&HEIGHT=1227&BBOX=190994.57269703568,6959370.228024009,201081.60670746968,6971673.20091745'
          //   },
          //   tileSize: new maps.Size(256, 256),//(bon?.width,bon?.height),
          //   name: "s_master",
          //   maxZoom: 18
          // }))
          // map.setMapTypeId("s")


          /*map.mapTypes.set("norgeskart", new maps.ImageMapType({
            getTileUrl: (cord: any, zoom: any) => {
              console.log(cord)
              //console.log(cord)
              //return `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}`
              //return 'https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=1006&HEIGHT=1227&BBOX=190994.57269703568,6959370.228024009,201081.60670746968,6971673.20091745'
              let boundsNE =  map.getBounds().getNorthEast()
              let boundsSW = map.getBounds().getSouthWest()
              const ne_lat = boundsNE.lat()
              const ne_lng = boundsNE.lng()
              const sw_lat = boundsSW.lat()
              const sw_lng = boundsSW.lng()

              const sw_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(sw_lat, sw_lng, 33)
              const ne_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(ne_lat, ne_lng, 33)
              //console.log("SW", sw_utm)
              
              //const str = `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=${map.getDiv().offsetWidth}&HEIGHT=${map.getDiv().offsetHeight}&BBOX=${sw_utm.easting},${sw_utm.northing},${ne_utm.easting},${ne_utm.northing}`
              const str = `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=256&HEIGHT=256&BBOX=${xyzToBounds(cord.x, cord.y, zoom).join(",")}`
              console.log(str)
              return str
            },
            //tileSize: new maps.Size(256,256),// new maps.Size(map.getDiv().offsetWidth,map.getDiv().offsetHeight),
            name: "master", 
            maxZoom: 18,
            opacity: 0.5
          }))
          map.setMapTypeId("norgeskart")*/

          const height = map.getDiv().offsetHeight;
          const width = map.getDiv().offsetWidth;

          /*const t = new maps.ImageMapType({
            getTileUrl: (cord: any, zoom: any) => {
              //return `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}`
              //return 'https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=1006&HEIGHT=1227&BBOX=190994.57269703568,6959370.228024009,201081.60670746968,6971673.20091745'
              let boundsNE =  map.getBounds().getNorthEast()
              let boundsSW = map.getBounds().getSouthWest()
              const ne_lat = boundsNE.lat()
              const ne_lng = boundsNE.lng()
              const sw_lat = boundsSW.lat()
              const sw_lng = boundsSW.lng()
              console.log("SW, lat ", sw_lat, "long, ", sw_lng)
              //console.log("NE, lat ", ne_lat, "long, ", ne_lng)

              const sw_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(sw_lat, sw_lng, 33)
              const ne_utm: {easting: number, northing: number, zoneLetter: string, zoneNum: number} = utm.fromLatLon(ne_lat, ne_lng, 33)
              
              const str = `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=${width}&HEIGHT=${height}&BBOX=${sw_utm.easting},${sw_utm.northing},${ne_utm.easting},${ne_utm.northing}`
              //console.log(str)
              return str
            },
            tileSize: new maps.Size(width, height),// new maps.Size(map.getDiv().offsetWidth,map.getDiv().offsetHeight),
            name: "master", 
            maxZoom: 18,
            opacity: 1.0
          })
          map.overlayMapTypes.push(t)*/
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
          props.currentSelectedSheepTourPositions.map((combinedTour: CombinedSheepTourPosition) => (
            combinedTour.combinedSheepPositions.map((combinedSheep: CombinedSheepPosition) => (
              combinedSheep.locations.map((location: LatLong, index: number) => (
                <MapMarker backgroundColor="red" lat={location.latitude} lng={location.longitude} text={combinedSheep.flockId.toString()} key={index} />
              ))
            ))
          )) : null
        }

        {
          // jervData.map((jerv: Jerv, index: number) => (
          //   <MapMarker backgroundColor={PreditoColors[jerv.rovdyrArtsID]} lat={jerv.latitude} lng={jerv.longitude} text={jerv.artsIDPrøve} key={index} />
          //   ))
          }

        {
          bonitetData?.ne && bonitetData.sw ?
            <MapMarker backgroundColor="blue" lat={bonitetData.ne.latitude} lng={bonitetData.ne.longitude} text={"ne"} key={1} /> : null
        }

{
          bonitetData?.ne && bonitetData.sw ?
            <MapMarker backgroundColor="blue" lat={bonitetData.sw.latitude} lng={bonitetData.sw.longitude} text={"sw"} key={2} /> : null
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