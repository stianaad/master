using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using backend.Models;

namespace backend.PDF
{
    public static class TemplatePDF
    {
        public static string GetHTMLString(List<CombinedSheepTourPositionData> combinedSheepTourPositions, List<DeadSheepPositionData> deadSheeps)
        {
            var sb = new StringBuilder();

            sb.AppendFormat(@"
                    <html>
                    <head>
                    </head>
                    <body>
                    <div class='header'><h1>Rapport fra {0} - {1}</h1></div>
                    <table align='center'>
                        <tr>
                            <th>Dato</th>
                            <th>Hvit sau</th>
                            <th>Brun sau</th>
                            <th>Svart sau</th>
                            <th>Død</th>
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

                List<DeadSheepPositionData> listWithDeadSheepsMatchingID = deadSheeps.Where(d => d.IdTour == sheeps.IdTour).ToList();
                List<string> sheepSize = new List<string>() { "lam", "sau" };
                List<string> sheepColor = new List<string>() { "hvit", "svart", "brun" };
                string deadSheepString = "";
                if (listWithDeadSheepsMatchingID.Count > 0)
                {
                    listWithDeadSheepsMatchingID.ForEach((DeadSheepPositionData dead) =>
                    {
                        deadSheepString += "1 " + sheepColor[dead.Color] + " " + sheepSize[dead.Size]+ "<br/>";
                    });
                }

                sb.AppendFormat(@"<tr>
                                    <td>{0}</td>
                                    <td>{1}</td>
                                    <td>{2}</td>
                                    <td>{3}</td>
                                    <td>{4}</td>
                                  </tr>", sheeps.tourTime.ToString().Split(" ")[0], whiteSheep, brownSheep , blackSheep, deadSheepString);
            }
            sb.Append(@"</table>
                      </body>
                     </html>");
            return sb.ToString();
        }

    }
}
