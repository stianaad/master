import GoogleMapReact from "google-map-react";
import { Polyline } from "./Polyline"
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect, Fragment } from 'react';
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
      <>
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
      </>
  )
}