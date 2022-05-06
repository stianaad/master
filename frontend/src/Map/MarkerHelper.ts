import { cowIcon, crossIcon, deerIcon, dnaIcon, dogIcon, dotsIcon, eyeIcon, footPrint, goatIcon, hairIcon, poopIcon, sheepIcon } from "../RovbaseIcon/rovbaseIcons";
import { Preditor, PreditoColors, SkadeType } from "../Types/Preditor";
import { Renderer, Cluster, ClusterStats } from "@googlemaps/markerclusterer";
import { CombinedSheepPosition } from "../Types/Sheep";
import { CombinedSheepTourPosition } from "../Types/Tour";

const RED_COLOR = '#D9381E'

export const getPreditorMarkers = (preditors: Preditor[], mapProps: any, markerClicked: (preditor: Preditor, marker: any) => void): any[] => {
  const markers = []
  if (mapProps.loaded) {
    for (const pred of preditors) {
      const marker = createPreditorMarker(getPreditorIcon(pred), pred.longitude, pred.latitude, mapProps.maps, mapProps.map, pred)
      marker.addListener('click', () => markerClicked(pred ,marker))
      marker.set('type', 'preditor');
      marker.set('id', pred.id);
      markers.push(marker)
    }
  }
  return markers
}

export const createPreditorMarker = (icon: string, longitude: number, latitude: number, maps: any, map: any, pred: Preditor) : any => {
  const markerImage = {
    url: `data:image/svg+xml;base64,${icon}`,
    scaledSize: new maps.Size(45, 45),
  }
  return new maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    icon: markerImage,
    preditor: pred
  })
}

export const getPreditorIconPath = (preditor: Preditor) => {
  let icon: any | null = null
  if (preditor.datatype === 'Rovviltobservasjon') {
    if (preditor.observasjoner.length > 0) {
      if (preditor.observasjoner.length > 1) {
        icon = dotsIcon
      } else {
        switch (preditor.observasjoner[0]) {
          case 2:
            icon = eyeIcon
            break;
          
          case 3:
            icon = footPrint 
            break;
          
          case 4:
            icon = poopIcon 
            break;

          case 8:
            icon = hairIcon
            break;
        
          default:
            break;
        }
      }
    }

  } else if (preditor.datatype === 'Rovviltskade') {
    switch (parseInt(preditor.skadetypeID)) {
      case SkadeType.SAU:
        icon = sheepIcon
        break;
      
      case SkadeType.GEIT:
        icon = goatIcon 
        break;
      
      case SkadeType.REIN:
        icon = deerIcon
        break;

      case SkadeType.STORFE:
        icon = cowIcon
        break;

      case SkadeType.HUND:
        icon = dogIcon
        break;
    
      default:
        break;
    }
  } else if (preditor.datatype === 'DodeRovdyr') {
    icon = crossIcon
  } else if (preditor.datatype === 'dna') {
    icon = dnaIcon
  }
  let height = 64
  let width = 64
  let size = 64
  if (icon != null) {
    width = icon.width
    height = icon.height
    size = Math.min(height, width)
  }
  return icon
}

export const getPreditorIcon = (preditor: Preditor, active: boolean = false) => {
  const icon = getPreditorIconPath(preditor)
  const color = PreditoColors[preditor.rovdyrArtsID]
  const fillColor = color === 'white' ? 'black' : 'white'
  const path = icon !== null ? `<path fill="${fillColor}" d="${icon.path}"/>` : ''
  const activeCircle = active ? '<circle fill="purple" cx="32" cy="32" r="32" />' : ''
  const svg = window.btoa(`
    <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      ${activeCircle}
      <circle fill="${RED_COLOR}" cx="32" cy="32" r="32" />
      <path fill="${fillColor}" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
      <circle cx="32" cy="32" r="24.2" />
      ${path}
    </svg>`);
  return svg
}


export const getSheepPositionMarkers = (tours: CombinedSheepTourPosition[], mapProps: any, markerClicked: (tourIndex: number, sheepIndex: number) => void): any[] => {
  const markers: any[] = []
  if (mapProps.loaded) {
    tours.forEach((tour, tourIndex) => {
      tour.combinedSheepPositions.forEach((sheep, sheepIndex) => {
        const bound = new google.maps.LatLngBounds();
        for (const locaction of sheep.locations) {
          bound.extend(new google.maps.LatLng(locaction.latitude, locaction.longitude))
        }
        const center = bound.getCenter()
        const marker = createSheepPositioMarker(getSheepPositioIcon(sheep), center.lng(), center.lat(), mapProps.maps, mapProps.map, sheep)
        marker.addListener('click', () => markerClicked(tourIndex ,sheepIndex))
        marker.set('type', 'sheep');
        marker.set('id', sheep.flockId);
        markers.push(marker)
      })
    })
  }
  return markers
}

export const createSheepPositioMarker = (icon: string, longitude: number, latitude: number, maps: any, map: any, sheep: CombinedSheepPosition) : any => {
  const markerImage = {
    url: `data:image/svg+xml;base64,${icon}`,
    scaledSize: new maps.Size(45, 45),
  }
  return new maps.Marker({
    position: { lat: latitude, lng: longitude },
    label: {
      text: String(sheep.totalNumberOfSheep),
      color: "rgba(255,255,255,0.9)",
      fontSize: "12px",
    },
    map: map,
    icon: markerImage,
    sheep: sheep
  })
}

export const getSheepPositioIcon = (sheep: CombinedSheepPosition ,active: boolean = false) => {
  const path = `<path fill="white" d="${sheepIcon.path}"/>`
  const activeCircle = active ? '<circle fill="purple" cx="32" cy="32" r="32" />' : ''
  const svg = window.btoa(`
    <svg fill="green" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      ${activeCircle}
      <path fill="white" d="M32 8.6c12.9 0 23.4 10.5 23.4 23.4S44.9 55.4 32 55.4 8.6 44.9 8.6 32 19.1 8.6 32 8.6M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7z"></path>
      <circle cx="32" cy="32" r="24.2" />
      <circle fill="white" cx="48" cy="12" r="12"/>
      <text fill="black" stroke="black" x="48" y="12" dominant-baseline="middle" text-anchor="middle">${sheep.totalNumberOfSheep}</text>
      ${path}
    </svg>`);
  return svg
}

export class ClusterRenderer implements Renderer {
  
  public render(
    { count, position, markers }: Cluster,
    stats: ClusterStats
  ): any {
    const marker = getClusterMarker(markers, position, count)
    marker.set('type', 'cluster')
    return marker
  }
}


export const getClusterMarker = (markers: google.maps.Marker[] | undefined, position: google.maps.LatLng, count: number, active: boolean = false): google.maps.Marker => {

  // create marker using svg icon
  return new google.maps.Marker({
    position,
    icon: {
      url: `data:image/svg+xml;base64,${getClusterIcon(markers, active)}`,
      scaledSize: new google.maps.Size(45, 45),
    },
    label: {
      text: String(count),
      color: "rgba(255,255,255,0.9)",
      fontSize: "12px",
    },
    title: `Cluster of ${count} markers`,
    // adjust zIndex to be above other markers
    zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
  });
}

export const getClusterIcon = (markers: google.maps.Marker[] | undefined, active: boolean) => {
  let color = 'green'
  let indicatorColor = 'green'
  if (active) {
    indicatorColor = 'orange'
  }
  if (markers && markers.length > 0) {
    color = markers[0].get('type') === 'preditor' ? RED_COLOR : 'red' 
  }

  // create svg url with fill color
  return window.btoa(`
  <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <circle fill="${RED_COLOR}" cx="32" cy="32" opacity="${active ?0.7 : 0.4}" r="32" />
    <circle cx="32" cy="32" r="24.2" />
  </svg>`);
}