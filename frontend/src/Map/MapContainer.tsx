import GoogleMapReact from "google-map-react";
import { MapMarker } from "./MapMarker";


export function MapContainer(){
  return(
    <div style={{ height: '100vh', width: '100%' }}>
      <div>heheeh</div>
      <GoogleMapReact 
        bootstrapURLKeys={{key:"AIzaSyB-xQ9kta6HYHD5OtV9SF_ybPAD31Edc0w"}}
        defaultCenter={{lat: 63.446827, lng: 10.421906}}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => {
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
          <MapMarker
            lat={63.446827}
            lng={10.421906}
            text="My Marker"
          />
      </GoogleMapReact>
    </div>
  )
}