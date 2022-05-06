import { User } from '../Types/UserModel'
import service from './Service'

class AuthenticationService {
  login(user: User){
    return service.post("api/authentication/login", user)
  }

  register(user: User) {
    return service.post("/api/authentication/register", user)
  }

  getTours() {
    return service.get("/api/GetTours")
  }

  getGeneratedTours() {
    return service.get("/api/GetTestData")
  }

  getTour(id: number | string) {
    return service.get(`/api/GetTour/${id}`)
  }

  getTourLocations() {
    return service.get(`/api/GetTourLocations`)
  }
}

export const authenticationService: AuthenticationService = new AuthenticationService()