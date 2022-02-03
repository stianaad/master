import { User } from '../Types/UserModel'
import service from './Service'

class AuthenticationService {
  login(user: User){
    return service.post("api/authentication/login", user)
  }

  register(user: User) {
    return service.post("/api/authentication/register", user)
  }

  test(token: string){
    return service.get("/weatherforecast", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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