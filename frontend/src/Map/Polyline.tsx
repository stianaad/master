//import { Component } from 'react'

// export default class Polyline extends Component {
//   renderPolylines () {
//   const { path, map, maps }: any = this.props

//     /** Example of rendering geodesic polyline */
//     let geodesicPolyline = new maps.Polyline({
//       path: path,
//       geodesic: true,
//       strokeColor: '#00a1e1',
//       strokeOpacity: 1.0,
//       strokeWeight: 4
//     })
//     geodesicPolyline.setMap(map)

//     /** Example of rendering non geodesic polyline (straight line) */
//     // let nonGeodesicPolyline = new maps.Polyline({
//     //   path: path,
//     //   geodesic: false,
//     //   strokeColor: '#e4e4e4',
//     //   strokeOpacity: 0.7,
//     //   strokeWeight: 3
//     // })
//     // nonGeodesicPolyline.setMap(map)
//   }

//   render () {
//     this.renderPolylines()
//     return null
//   }
// }

export function Polyline(props: {path: {lat: number, lng: number}[], map: any, maps: any}) {
  const { path, map, maps }: any = props
  function renderPolylines () {
    let geodesicPolyline = new maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 1
    })
    geodesicPolyline.setMap(map)
  }
  return (
    <>
    {
      renderPolylines()
    }
    </>
  )
}