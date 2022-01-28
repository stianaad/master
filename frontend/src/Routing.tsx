import {
  Routes,
  Route
} from 'react-router-dom'
import { MapContainer } from './Map/MapContainer'
import { Home } from './Views/Home/Home'
import { SelectTour } from './Views/Tours/SelectTour'


export default function Routing() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tur" element={<SelectTour />} />
    </Routes>
  )
}