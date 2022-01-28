import GoogleMapReact from "google-map-react";
import Polyline from './Polyline'
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { Tour, TourLocation } from "../Types/Tour";
import { TourMap } from "./TourMap";


export function MapContainer() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [map, setMap] = useState()
  const [maps, setMaps] = useState()
  const [mapProps, setMapProps] = useState<{map: any |null, maps: any | null, loaded: boolean}>({
    map: null,
    maps: null,
    loaded: false
  })
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);
  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    const res = await authenticationService.getTours()
    if (res.status === 200) {
      const data: Tour[] = res.data;
      setTours(data)
      //setTours(res.data)
      // if (data.length > 1) {
      //   const _path = data.map((pos) => { return {lat: pos.latitude, lng: pos.longitude } })
      //   console.log(_path)
      //   setPath(_path)
      // }
    }
  }
  const onMapLoaded = () => {

  }

  const path2 = [
    {lat: 10.30509, lng: 63.426847},
    {lat: 10.304835, lng: 63.426892},
    {lat: 10.304678, lng: 63.426715},
    {lat: 10.304814, lng: 63.426684},
    {lat: 10.305027, lng: 63.426528},
    {lat: 10.304994, lng: 63.426273},
    {lat: 10.305177, lng: 63.425854},
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
        //   mapProps.loaded ? (
        //     <div style={{display: 'none'}}>
        //       <Polyline
        //         map={mapProps.map}
        //         maps={mapProps.maps}
        //         path={path2} />
        //     </div>
        //   ) : null
        }
          
          {
            tours.map((tour: Tour) => (
              <TourMap tour={tour} key={tour.idTour} />
            ))
          }
      </GoogleMapReact>
    </div>
  )
}