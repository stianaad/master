import { User } from '../Models/UserModel'
import service from './Service'

class AuthenticationService {
  login(user: User){
    return service.post("api/authentication/login", user)
  }

  test(token: string){
    return service.get("/weatherforecast", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export const authenticationService: AuthenticationService = new AuthenticationService()