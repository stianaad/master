import { User } from '../Models/UserModel'
import service from './Service'

class AuthenticationService {
  login(user: User){
    return service.post("api/authentication/login", user)
  }

  test(){
    return service.get("/weatherforecast")
  }
}

export const authenticationService: AuthenticationService = new AuthenticationService()