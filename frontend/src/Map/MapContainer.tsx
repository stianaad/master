import GoogleMapReact, { Heatmap } from "google-map-react";
import { Cluster, MarkerClusterer } from "@googlemaps/markerclusterer";
import { useState, useEffect } from 'react';
import { CombinedSheepTourPosition } from "../Types/Tour";
import { CombinedSheepPosition, LatLong, DeadSheepPosition } from "../Types/Sheep"
import { useAppSelector } from "../hooks";
import { animalService } from "../Services/AnimalService";
import { Preditor, PreditorRegisteredByFarmer, SkadeType } from "../Types/Preditor";
import { InformationBoxMap } from "./InformationBox/InformationBoxMap";
import { ClusterRenderer, getClusterIcon, getPreditorIcon, getPreditorMarkers, getSheepPositioIcon, getSheepPositionMarkers } from "./MarkerHelper";
let utm = require("utm")

interface MapContainerProps {
  currentSelectedSheepTourPositions: CombinedSheepTourPosition[]
  startTourIndex: number,
  sheepFlock: boolean,
  preditors: {[key: number]: boolean}
  dateRange: {from: Date, to: Date}
  heatmap: boolean,
  opacityBonitet: number,
  deadSheep: DeadSheepPosition[],
  preditorRegisteredByFarmer: PreditorRegisteredByFarmer[]
}

export function MapContainer(props: MapContainerProps) {
  const loggedIn = useAppSelector((state: any) => state.loggedIn.value)
  const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null)
  const [sheepPositionCluster, setSheepPositionCluster] = useState<MarkerClusterer | null>(null)
  const [sheepHeatMap, setSheepHeatMap] = useState<any[]>([])
  const [jervData, setPreditorData] = useState<Preditor[]>([])
  const [southWestCorner, setSouthWestCorner] = useState<LatLong>()
  const [selectedDeadSheep, setSelectedDeadSheep] = useState<DeadSheepPosition>()
  const [selectedSheepTourPosition, setSelectedSheepTourPosition] = useState<CombinedSheepTourPosition>()
  const [selectedPreditor, setSelectedPreditor] = useState<Preditor[]>()
  const [map, setMap] = useState<any>()
  const [maps, setMaps] = useState<any>()
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  
  let activeMarker: null | {data: Preditor | CombinedSheepPosition | Cluster, marker: any} = null

  const [openInformationBox, setOpenInformationBox] = useState<boolean>(false)
  //Get preditors
  useEffect(() => {
    fetchPreditor()
  }, [props.dateRange])

  //Render preditor marker
  useEffect(() => {
    rerenderPreditorMarker()
  }, [mapProps.loaded, props.preditors, props.deadSheep, jervData])

  //Render sheep marker
  useEffect(() => {
    rerenderSheepPositions()
  }, [mapProps.loaded, props.currentSelectedSheepTourPositions, props.sheepFlock])

  const rerenderPreditorMarker = () => {
    detachPreditorMarkers()
    let activePreditors = jervData.filter((pred) => props.preditors[pred.rovdyrArtsID])
    const deadSheeps: Preditor[] = props.deadSheep.filter((s) => props.preditors[s.preditorId] || s.preditorId === 0).map((dSheep) => { return { rovdyrArtsID: dSheep.preditorId, longitude: dSheep.longitude, latitude: dSheep.latitude, datatype: 'Rovviltskade', skadetypeID: SkadeType.SAU, dato: dSheep.timeOfObservation } as unknown as Preditor})
    const preditorRegisteredByFarmer: Preditor[] = props.preditorRegisteredByFarmer.map((pred: PreditorRegisteredByFarmer) => {return { rovdyrArtsID: pred.preditor, longitude: pred.longitude, latitude: pred.latitude, datatype: pred.reportType, skadetypeID: SkadeType.SAU, dato: pred.timeOfObservation, observasjoner: [pred.observationType] } as unknown as Preditor})
    activePreditors = activePreditors.concat(deadSheeps)
    activePreditors = activePreditors.concat(preditorRegisteredByFarmer)
    renderPreditorMarkers(activePreditors)
  }

  const fetchPreditor = async () => {
    const activePreditors = []
    for (const key in props.preditors) {
      if (props.preditors[key]) {
        activePreditors.push(parseInt(key))
        
      }
    }
    if (activePreditors.length === 0) {
      setPreditorData([])
      return
    }
    const res = await animalService.getAnimalPreditors(props.dateRange.from, props.dateRange.to, activePreditors, loggedIn)
    if(res.data.length > 0) {
      //The point start at index 7 and ends at length - 1
      const jerv: Preditor[] = await res.data.map((data: Preditor) => {
        const utmPoint = data.wkt.substring(7, data.wkt.length-1).split(" ")
        const {latitude, longitude} = utm.toLatLon(utmPoint[0], utmPoint[1], 33, "N", undefined, false)
        data.latitude = latitude
        data.longitude = longitude
        return data
      })
      setPreditorData(jerv)
    }
  }

  const handlePreditorClicked = (preditor: Preditor, marker: any) => {
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
      const tmpPred: Preditor[] = []
      cluster?.markers.forEach((value: any) => {
        tmpPred.push(value.preditor)
      })
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
          url: `data:image/svg+xml;base64,${getPreditorIcon(activeMarker.data as Preditor, false)}`,
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
  const [sheepPositionMarkers, setSheepPositionMarkers] = useState<any[]>([])

  const renderPreditorMarkers = (preditors: Preditor[]) => {
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

  const rerenderSheepPositions = () => {
    detachSheepPositionMarkers()
    if (props.sheepFlock) {
      renderSheepPositionMarkers(props.currentSelectedSheepTourPositions)
    } else {
      setSheepPositionMarkers([])
    }
  }

  const renderSheepPositionMarkers = (tours: CombinedSheepTourPosition[]) => {
    const markers = getSheepPositionMarkers(tours, mapProps, handleClickOnFlock)
    setSheepPositionMarkers(markers)
  }

  const detachSheepPositionMarkers = () => {
    if (mapProps.loaded) {
      for (const marker of sheepPositionMarkers) {
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
          arr.push({lat: loc.latitude, lng: loc.longitude, weight: sheep.totalNumberOfSheep/sheep.locations.length }) ///sheep.locations.length
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

  const handleClickOnFlock = (indexTour: number, indexSheep: number) => {
    const newTour: CombinedSheepTourPosition = {...props.currentSelectedSheepTourPositions[indexTour]}
    newTour.combinedSheepPositions = [newTour.combinedSheepPositions[indexSheep]]
    setSelectedDeadSheep(undefined)
    setSelectedPreditor(undefined)
    setSelectedSheepTourPosition(newTour)
    setOpenInformationBox(true)
  }

  //Change the opacity on the bonitet map
  useEffect(() => {
    if(map && map.overlayMapTypes !== undefined ){
      map.overlayMapTypes.getAt(1).setOpacity(props.opacityBonitet)
    }
  }, [props.opacityBonitet])

  return(
    <div style={{ height: '100vh', width: '100%', position: "relative" }}>
      <GoogleMapReact 
        bootstrapURLKeys={{key:"AIzaSyCLd2UIZIDuo9OF8Bxx0JaCCIUeX6j5jKg"}}
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
          setSheepPositionCluster(new MarkerClusterer({map: map, renderer: new ClusterRenderer(), onClusterClick: handleClusterClicked}))

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
          southWestCorner && openInformationBox ?
          <InformationBoxMap preditor={selectedPreditor} deadSheep={selectedDeadSheep} sheepFlock={selectedSheepTourPosition} lat={southWestCorner.latitude} lng={southWestCorner.longitude} onClose={() => setOpenInformationBox(false)} /> : null
        }

      </GoogleMapReact>
    </div>
  )
}