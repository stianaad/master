import { PreditorRegisteredByFarmer } from "../Types/Jerv";
import { DeadSheepPosition } from "../Types/Sheep";
import { CombinedSheepTourPosition } from "../Types/Tour";
import Service from "./Service";

class PDFService{
  getPDF(sheeps: CombinedSheepTourPosition[], deadSheeps: DeadSheepPosition[], preditors: PreditorRegisteredByFarmer[], token: string){
    return Service.post("/api/pdf", {sheeps,deadSheeps, preditors}, {responseType: "blob", headers: {
      Authorization: `Bearer ${token}`
    }}) //responseType: "blob", 
  }
}

export const pdfService: PDFService = new PDFService()