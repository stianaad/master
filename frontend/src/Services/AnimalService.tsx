import service from './Service'

class AnimalService {

  getDeadSheep(fromDate: Date, toDate: Date, token: string){
    return service.get(`/api/DeadSheep/${fromDate}/${toDate}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  getAnimalPreditors(from: Date, to: Date, types: number[], token: string) {
    const typesStr = types.map((type) => `types=${type}`)
    return service.get(`/api/preditor/rovdata?${typesStr.join('&')}&from=${from.toISOString()}&to=${to.toISOString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getPreditorRegisteredOnApp(fromDate: Date, toDate: Date, token: string){
    return service.get(`/api/preditor?from=${fromDate}&to=${toDate}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })//service.get(`/api/preditor/${fromDate}/${toDate}`)
  }
}

export const animalService: AnimalService = new AnimalService()