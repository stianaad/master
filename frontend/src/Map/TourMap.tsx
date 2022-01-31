import GoogleMapReact from "google-map-react";
import { Polygon, Polyline } from "google-maps-react";
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { Tour } from "../Types/Tour";


export function TourMap(props: { tour: Tour }) {
  //const path = props.tour.positions.map(pos => { return {lat: pos.latitude, lng: pos.longitude }})
  console.log("HELLO", props.tour.sheepPositions)
  {/*<Polyline 
        path={path} 
        options={{ 
        strokeColor: '#00ffff',
        strokeOpacity: 1,
        strokeWeight: 2,
        zIndex: 100,
        }} />*/}
  return(
      <div>
        {
        props.tour.sheepPositions.map((sheep) => (
          <MapMarker
            lat={sheep.latitude}
            lng={sheep.longitude}
            text={`${sheep.id}`}
            //key={sheep.id}
          />
        ))
      }
      </div>
  )
}