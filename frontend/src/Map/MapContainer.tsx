import GoogleMapReact, { Heatmap } from "google-map-react";
import { Cluster, MarkerClusterer } from "@googlemaps/markerclusterer";
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
import { Jerv, PreditoColors, SkadeType } from "../Types/Jerv";
import { Bonitet } from "../Types/Bonitet";
import { InformationBoxMap } from "./InformationBox/InformationBoxMap";
import { cowIcon, crossIcon, deerIcon, dnaIcon, dogIcon, dotsIcon, eyeIcon, footPrint, goatIcon, hairIcon, sheepIcon } from "../Registrations/rovbaseIcons";
import { ClusterRenderer, getClusterIcon, getPreditorIcon, getPreditorMarkers } from "./MarkerHelper";
let utm = require("utm")
//import utm from "utm"

interface MapContainerProps {
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  sheepFlock: boolean,
  preditors: {[key: number]: boolean}
  heatmap: boolean,
  opacityBonitet: number,
  deadSheep: DeadSheepPosition[]
}

export function MapContainer(props: MapContainerProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [sheepTourPositions, setSheepTourPositions] = useState<LatLong[][]>([])
  const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null)
  //const [combinedSheepTourPositions, setCombinedSheepTourPositions] = useState<CombinedSheepTourPosition[]>([])
  const [sheepHeatMap, setSheepHeatMap] = useState<any[]>([])
  const [jervData, setJervData] = useState<Jerv[]>([])
  const [southWestCorner, setSouthWestCorner] = useState<LatLong>()
  const [selectedDeadSheep, setSelectedDeadSheep] = useState<DeadSheepPosition>()
  const [selectedSheepTourPosition, setSelectedSheepTourPosition] = useState<CombinedSheepTourPosition>()
  const [selectedPreditor, setSelectedPreditor] = useState<Jerv[]>()
  const [map, setMap] = useState<any>()
  const [maps, setMaps] = useState<any>()
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  
  let activeMarker: null | {data: Jerv | CombinedSheepPosition | Cluster, marker: any} = null

  const [openInformationBox, setOpenInformationBox] = useState<boolean>(false)
  
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

  const handlePreditorClicked = (preditor: Jerv, marker: any) => {
    // if (activeMarker !== null) {
    //   const markerImage = {
    //     url: `data:image/svg+xml;base64,${getPreditorIcon(activeMarker.data as Jerv, false)}`,
    //     scaledSize: new maps.Size(45, 45),
    //   }
    //   activeMarker.marker.setIcon(markerImage)
    // }
    removeActiveMarker()
    const markerImage = {
      url: `data:image/svg+xml;base64,${getPreditorIcon(preditor, true)}`,
      scaledSize: new google.maps.Size(45, 45),
    }
    marker.setIcon(markerImage)
    activeMarker = {
      data: preditor,
      marker: marker
    }

    console.log(preditor)
    setSelectedDeadSheep(undefined)
    setSelectedSheepTourPosition(undefined)
    setSelectedPreditor([preditor])
    setOpenInformationBox(true)
  }

  const handleClusterClicked = (event: google.maps.MapMouseEvent, cluster: Cluster, map: google.maps.Map) => {
    removeActiveMarker()
    const markerImage = {
      url: `data:image/svg+xml;base64,${getClusterIcon(cluster.markers, true)}`,
      scaledSize: new google.maps.Size(45, 45),
    }
    cluster.marker.setIcon(markerImage)
    activeMarker = {
      data: cluster,
      marker: cluster.marker
    }

    //Add selected markers in cluster to informationbox
    if(cluster !== undefined && cluster.markers) {
      const tmpPred: Jerv[] = []
      cluster?.markers.forEach((value: any) => {
        tmpPred.push(value.preditor)
      })
      console.log(tmpPred)
      setSelectedDeadSheep(undefined)
      setSelectedSheepTourPosition(undefined)
      setSelectedPreditor(tmpPred)
      setOpenInformationBox(true)
    }
  }

  const removeActiveMarker = () => {
    if (activeMarker != null) {
      let markerImage = {
        url: '',
        scaledSize: new google.maps.Size(45, 45),
      }
      const type = activeMarker.marker.get('type')
      if (type === 'preditor') {
        markerImage = {
          url: `data:image/svg+xml;base64,${getPreditorIcon(activeMarker.data as Jerv, false)}`,
          scaledSize: new google.maps.Size(45, 45),
        }
      } else if (type === 'cluster') {
        const cluster = activeMarker.data as Cluster
        markerImage = {
          url: `data:image/svg+xml;base64,${getClusterIcon(cluster.markers, false)}`,
          scaledSize: new google.maps.Size(45, 45),
        }
      }
      if (markerImage.url !== '') {
        activeMarker.marker.setIcon(markerImage)
      }
    }
  }
  
  const [preditorMarkers, setPreditorMarkers] = useState<any[]>([])
  const renderPreditorMarkers = (preditors: Jerv[]) => {
    const markers = getPreditorMarkers(preditors, mapProps, handlePreditorClicked)
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
    setSelectedSheepTourPosition(undefined)
    setSelectedPreditor(undefined)
    setSelectedDeadSheep(props.deadSheep[index])
    setOpenInformationBox(true)
  }

  const handleClickOnFlock = (indexTour: number, indexSheep: number) => {
    const newTour: CombinedSheepTourPosition = {...props.currentSelectedSheepTourPositions[indexTour]}
    newTour.combinedSheepPositions = [newTour.combinedSheepPositions[indexSheep]]
    console.log(newTour)
    setSelectedDeadSheep(undefined)
    setSelectedPreditor(undefined)
    setSelectedSheepTourPosition(newTour)
    setOpenInformationBox(true)
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
        options={{maxZoom: 20}}
        onGoogleApiLoaded={({map, maps}) => {
          setMap(map)
          setMaps(maps)
          setMapProps({
            map: map,
            maps: maps,
            loaded: true,
          })
          setMarkerCluster(new MarkerClusterer({map: map, renderer: new ClusterRenderer(), onClusterClick: handleClusterClicked}))

          const norgeskartLayer = new maps.ImageMapType({
            getTileUrl: (cord: any, zoom: any) => {
              
              const str = `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}` 
              return str
            },
            tileSize: new maps.Size(256, 256),
            name: "norgeskart_master", 
            maxZoom: 20,
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

        {/*
          jervData.length > 0 ? 
          jervData.map((jerv: Jerv, index: number) => (
            <MapMarker backgroundColor="blue" index={index} handleClick={handleClickOnDeadAnimal} lat={jerv.latitude} lng={jerv.longitude} text={jerv.artsIDPrøve} key={index} />
            )) : null*/
        }
        {
          southWestCorner && openInformationBox ?
          <InformationBoxMap preditor={selectedPreditor} deadSheep={selectedDeadSheep} sheepFlock={selectedSheepTourPosition} lat={southWestCorner.latitude} lng={southWestCorner.longitude} onClose={() => setOpenInformationBox(false)} /> : null
        }

      </GoogleMapReact>
    </div>
  )
}