import Service from "./Service";

class TourService{
  getTours(token: string){
    return Service.get("/api/tour/location", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getCombinedSheepTourPositions(){
    return Service.get("/api/tour/sheep/positions");
  }

}

export const tourService: TourService = new TourService()