import { cowIcon, crossIcon, deerIcon, dnaIcon, dogIcon, dotsIcon, eyeIcon, footPrint, goatIcon, hairIcon, sheepIcon } from "../Registrations/rovbaseIcons";
import { Jerv, PreditoColors, SkadeType } from "../Types/Jerv";


export const getPreditorMarkers = (preditors: Jerv[], mapProps: any, markerClicked: (preditor: Jerv, marker: any) => void): any[] => {
  const markers = []
  if (mapProps.loaded) {
    for (const pred of preditors) {
      const marker = createPreditorMarker(getPreditorIcon(pred), pred.longitude, pred.latitude, mapProps.maps, mapProps.map, pred)
      marker.addListener('click', () => markerClicked(pred ,marker))
      markers.push(marker)
    }
  }
  return markers
}

export const createPreditorMarker = (icon: string, longitude: number, latitude: number, maps: any, map: any, pred: Jerv) : any => {
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

export const getPreditorIcon = (preditor: Jerv) => {
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
    const path = icon !== null ? `<path fill="white" d="${icon.path}"/>` : ''
    const svg = window.btoa(`
      <svg fill="${PreditoColors[preditor.rovdyrArtsID]}" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
        <circle cx="32" cy="32" r="24.2" />
        ${path}
      </svg>`);
    return svg
}