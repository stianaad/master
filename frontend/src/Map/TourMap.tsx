import GoogleMapReact from "google-map-react";
import { Polyline } from "./Polyline"
import { MapMarker } from "./MapMarker";
import React, { useState, useEffect } from 'react';
import { authenticationService } from "../Services/AuthenticationService";
import { Tour } from "../Types/Tour";


export function TourMap(props: { tour: Tour, map: any, maps: any }) {
  const path = props.tour.positions.map(pos => { return {lat: pos.longitude, lng: pos.latitude }})
  return(
    <>
      <Polyline 
        path={path} 
        map={props.map}
        maps={props.maps} />
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