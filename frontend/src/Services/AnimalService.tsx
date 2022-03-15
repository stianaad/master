import service from './Service'

class AnimalService {
  getJerv() {
    return service.get("/api/tour/sheep/test")
  }

  getDeadSheep(fromDate: Date, toDate: Date){
    return service.get(`/api/DeadSheep/${fromDate}/${toDate}`)
  }
  getAnimalPreditors(from: Date, to: Date, types: number[]) {
    const typesStr = types.map((type) => `types=${type}`)
    return service.get(`/api/tour/preditors?${typesStr.join('&')}&from=${from.toISOString()}&to=${to.toISOString()}`)
  }

  getPreditorRegisteredOnApp(fromDate: Date, toDate: Date){
    return service.get(`/api/preditor/${fromDate}/${toDate}`)
  }
}

export const animalService: AnimalService = new AnimalService()
/*
{
  "LanguageCode": "no",
    "SearchFilter": {
        "Carnivore": [
            3,
            4
        ],
        "CarnivoreDamage": [
            1,
            2,
            3,
            4,
            5
        ],
        "Evaluation": [
            1,
            2,
            3
        ],
        "Observation": [
            1,
            2,
            3,
            12,
            11
        ],
"Offspring": false,
    "FromDate": "2022-01-12T00:00:00.000Z",
    "ToDate": "2022-02-11T00:00:00.000Z",
    "Country": [],
    "Region": [],
    "County": [],
    "Municipality": [],
    "IndividualNameOrID": "",
    "Barcode": "",
    "Rovdjursforum": false,
    "ID": ""
      }
}*/