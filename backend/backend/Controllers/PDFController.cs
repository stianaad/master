using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Models;
using backend.PDF;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase
    {

        private IConverter _converter;

        public PDFController(IConverter converter)
        {
            _converter = converter;
        }

        public class SheepTourAndDeadSheeps
        {
            public List<CombinedSheepTourPositionData> sheeps { get; set; }
            public List<DeadSheepPositionData> deadSheeps { get; set; }


        }

        [HttpPost]
        public async Task<IActionResult> createPDF([FromBody] SheepTourAndDeadSheeps sheepTourAndDead) //[FromBody] List< DeadSheepPositionData > deadSheeps
        {
            sheepTourAndDead.sheeps.ForEach((CombinedSheepTourPositionData value) =>
            {
                Console.WriteLine(value);
            });
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10 },
                //DocumentTitle = "PDF Report",
                //Out = @"test.pdf"
            };
            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = TemplatePDF.GetHTMLString(sheepTourAndDead.sheeps, sheepTourAndDead.deadSheeps),
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = Path.Combine(Directory.GetCurrentDirectory(), "PDF", "pdfstyles.css") },
                //HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                //FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
            }; 
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };
            return File(_converter.Convert(pdf), "application/octet-stream", "SimplePdf.pdf");
        }
    }
}
