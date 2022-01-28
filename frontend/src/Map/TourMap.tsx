import GoogleMapReact from "google-map-react";
import { Polygon, Polyline } from "google-maps-react";
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { Tour } from "../Types/Tour";


export function TourMap(props: { tour: Tour }) {
  const path = props.tour.positions.map(pos => { return {lat: pos.latitude, lng: pos.longitude }})
  console.log(path)
  return(
    <>
      <Polyline 
        path={path} 
        options={{ 
        strokeColor: '#00ffff',
        strokeOpacity: 1,
        strokeWeight: 2,
        zIndex: 100,
        }} />
      {
        props.tour.sheepPositions.map((sheep) => (
          <MapMarker
            lat={sheep.latitude}
            lng={sheep.longitude}
            text={`${sheep.timeOfObsevation}`}
            key={sheep.id}
          />
        ))
      }
    </>
  )
}