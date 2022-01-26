import {
  Routes,
  Route
} from 'react-router-dom'
import { MapContainer } from './Map/MapContainer'
import { Home } from './Views/Home/Home'


export default function Routing() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapContainer />} />
    </Routes>
  )
}