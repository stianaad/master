using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using backend.Models;

namespace backend.PDF
{
    public static class TemplatePDF
    {
        public static string GetHTMLString(List<CombinedSheepTourPositionData> combinedSheepTourPositions, List<DeadSheepPositionData> deadSheeps, List<PreditorTourPosition> preditors)
        {
            var sb = new StringBuilder();
            sb.Append("<html><head></head><style>");
            sb.Append("@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');");
            sb.Append("body{font-family:'Open Sans', sans-serif;}");
            sb.Append(".header {text-align: center;color: black;padding-bottom: 10px;font-size: 25px;}");
            sb.Append("table {width: 80%;border-collapse: collapse;}");
            sb.Append("td, th {border: 1px solid gray;padding: 20px;font-size: 25px;text-align: center;}");
            sb.Append("table th {background-color: #B4DBFF;color: black;}");
            sb.AppendFormat(@"
                    </style>
                    <body>
                    <div class='header'><h1>Rapport fra {0} - {1}</h1></div>
                    <table align='center'>
                        <tr>
                            <th>Dato</th>
                            <th>Hvit sau</th>
                            <th>Brun sau</th>
                            <th>Svart sau</th>
                            <th>Død sau</th>
                            <th>Skadet sau </th>
                            <th>Observert rovdyr</th>
                        </tr>", combinedSheepTourPositions[0].tourTime.ToString().Split(" ")[0],
                        combinedSheepTourPositions[combinedSheepTourPositions.Count -1].tourTime.ToString().Split(" ")[0]);

            foreach (var sheeps in combinedSheepTourPositions)
            {
                int blackSheep = 0;
                int whiteSheep = 0;
                int brownSheep = 0;
                //Find total number of sheeps for each color
                foreach (var sheep in sheeps.CombinedSheepPositions)
                {
                    blackSheep += sheep.NumberOfBlackSheep;
                    whiteSheep += sheep.NumberOfWhiteSheep;
                    brownSheep += sheep.NumberOfGreySheep;
                }
                //Find number of dead sheeps to each tour
                List<DeadSheepPositionData> listWithDeadSheepsMatchingID = deadSheeps.Where(d => d.IdTour == sheeps.IdTour).ToList();
                List<string> sheepSize = new List<string>() { "lam", "sau" };
                List<string> sheepColor = new List<string>() { "hvit", "svart", "brun" };
                string deadSheepString = "";
                string injuredString = "";
                if (listWithDeadSheepsMatchingID.Count > 0)
                {
                    listWithDeadSheepsMatchingID.ForEach((DeadSheepPositionData dead) =>
                    {
                        if (dead.Dead)
                        {
                            deadSheepString += "1 " + sheepColor[dead.Color] + " " + sheepSize[dead.Size]+ "<br/>";
                        } else
                        {
                           injuredString += "1 " + sheepColor[dead.Color] + " " + sheepSize[dead.Size] + "<br/>";
                        }
                    });
                }

                //Find number of observed preditors
                List<PreditorPDFEdition> preditorPDF = preditors.Where(pred => pred.ReportType == "Rovviltobservasjon" && pred.IdTour == sheeps.IdTour).GroupBy(p => p.Preditor).Select(p => new PreditorPDFEdition()
                {
                    Preditor = p.Key,
                    NumberOfPreditors = p.Count()
                }).ToList();

                string observedPreditors = "";
                List<string> preditorType = new List<string>() { "ulv", "bjørn", "gaupe", "jerv" };
                if ( preditorPDF.Count > 0)
                {
                    foreach( var t in preditorPDF)
                    {
                        if (t.NumberOfPreditors > 0)
                        {
                            observedPreditors += t.NumberOfPreditors + " " + preditorType[t.Preditor-1] + "<br/>";
                        } 
                    } 
                }

                sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                    <td>{3}</td>
                                    <td>{4}</td>
                                    <td>{5}</td>
                                    <td>{6}</td>
                                  </tr>", sheeps.tourTime.ToString().Split(" ")[0], whiteSheep, brownSheep , blackSheep, deadSheepString, injuredString, observedPreditors);
            }
            sb.Append(@"</table>
                      </body>
                     </html>");
            return sb.ToString();
        }

    }
}
