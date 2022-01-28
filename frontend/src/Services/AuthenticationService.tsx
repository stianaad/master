import { User } from '../Types/UserModel'
import service from './Service'

class AuthenticationService {
  login(user: User){
    return service.post("api/authentication/login", user)
  }

  test(){
    return service.get("/weatherforecast")
  }

  getTours() {
    return service.get("/api/GetTours")
  }

  getTour(id: number | string) {
    return service.get(`/api/GetTour/${id}`)
  }

  getTourLocations() {
    return service.get(`/api/GetTourLocations`)
  }
}

export const authenticationService: AuthenticationService = new AuthenticationService()