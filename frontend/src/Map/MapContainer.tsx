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

  var EXTENT = [-Math.PI * 6378137, Math.PI * 6378137];

  function xyzToBounds(x: number, y: number, z: number) {
    var tileSize = (EXTENT[1] * 2) / Math.pow(2, z);
    var minx = EXTENT[0] + x * tileSize;
    var maxx = EXTENT[0] + (x + 1) * tileSize;
    // remember y origin starts at top
    var miny = EXTENT[1] - (y + 1) * tileSize;
    var maxy = EXTENT[1] - y * tileSize;
    return [minx, miny, maxx, maxy];
  }

  const TILE_SIZE = 256;
  var EARTH_RADIUS_IN_METERS = 6378137;
	var CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS_IN_METERS;

  function getBounds(x: number, y: number, z: number) {
		y = Math.pow(2, z) - y - 1; // Translate Y value
		
		var resolution = (CIRCUMFERENCE / TILE_SIZE) / Math.pow(2, z); // meters per pixel
		
		var swPoint = getMercatorCoord(x, y, resolution);
		var nePoint = getMercatorCoord(x + 1, y + 1, resolution);
		
		var bounds = {
				swX : swPoint.x,
				swY : swPoint.y,
				neX : nePoint.x,
				neY : nePoint.y
		};
		
		return bounds;
	};

	/*
	 * Translate the xy & resolution to spherical mercator (EPSG:3857, EPSG:900913).
	 */
	function getMercatorCoord(x: number, y: number, resolution: number) {
		var point = {
				x: x * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0,
				y: y * TILE_SIZE * resolution - CIRCUMFERENCE / 2.0
		};
		
		return point;
	};

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
            getTileUrl: async (cord: any, zoom: any) => {
              var proj = map.getProjection();
              console.log(proj)
              var zfactor = Math.pow(2, zoom);
              // get Long Lat coordinates
              var top = proj.fromPointToLatLng(new maps.Point(cord.x * 256 / zfactor, cord.y * 256 / zfactor));
              var bot = proj.fromPointToLatLng(new maps.Point((cord.x + 1) * 256 / zfactor, (cord.y + 1) * 256 / zfactor));

              //corrections for the slight shift of the SLP (mapserver)
              var deltaX = 0.0013;
              var deltaY = 0.00058;

              // var bbox =     (top.lng() + deltaX) + "," +
    	        //                        (bot.lat() + deltaY) + "," +
    	        //                        (bot.lng() + deltaX) + "," +
    	        //                        (top.lat() + deltaY);
      
              // const bounds = map.getBounds();
              // var NECorner = await bounds.getNorthEast();
              // var SWCorner = await bounds.getSouthWest();
              // var NWCorner = new maps.LatLng(NECorner.lat(), SWCorner.lng());
              // var SECorner = new maps.LatLng(SWCorner.lat(), NECorner.lng());
              // console.log(bbox)

              const bounds = getBounds(cord.x, cord.y, zoom)
              console.log(bounds)
              var bbox = bounds.swX + "," + bounds.swY + "," + bounds.neX + "," + bounds.neY;
              
              //return `https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norgeskart_bakgrunn&zoom=${zoom}&x=${cord.x}&y=${cord.y}`
              return `https://wms.nibio.no/cgi-bin/ar250?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=Bonitet&CRS=EPSG:25833&STYLES=&WIDTH=256&HEIGHT=256&BBOX=${bbox}`
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