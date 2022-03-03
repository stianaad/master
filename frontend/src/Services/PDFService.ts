import { DeadSheepPosition } from "../Types/Sheep";
import { CombinedSheepTourPosition } from "../Types/Tour";
import Service from "./Service";

class PDFService{
  getPDF(sheeps: CombinedSheepTourPosition[], deadSheeps: DeadSheepPosition[]){
    return Service.post("/api/pdf", {sheeps,deadSheeps}, {responseType: "blob"}) //responseType: "blob", 
  }
}

export const pdfService: PDFService = new PDFService()