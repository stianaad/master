import Service from "./Service";

class TourService{
  getTours(token: string){
    return Service.get("/api/tour/location", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getCombinedSheepTourPositions(token: string){
    return Service.get("/api/tour/sheep/positions", { headers: {
      Authorization: `Bearer ${token}`
    }});
  }

}

export const tourService: TourService = new TourService()