import { useEffect } from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { MapContainer } from './Map/MapContainer'
import { changeValue } from './redux/LoggedInSlice'
import { Home } from './Views/Home/Home'
import { PageNotFound } from './Views/PageNotFound/PageNotFound'
import { SelectTour } from './Views/Tours/SelectTour'


export default function Routing() {
  const loggedIn = useAppSelector((state) => state.loggedIn.value)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token !== null ) {
      dispatch(changeValue(token))
    } else {
      dispatch(changeValue(""))
    }
  }, [])
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      {loggedIn.length > 0 ?
      <>
        <Route path="/tur" element={<SelectTour />} />
      </>
      : null}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}