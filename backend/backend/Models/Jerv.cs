using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Jerv
    {
        public string LanguageCode { get; set; }
        public SearchFilterObj SearchFilter { get; set; }
    }

    public class SearchFilterObj
    {
        public List<int> Carnivore { get; set; }
        public List<int> CarnivoreDamage { get; set; }
        public List<int> Evaluation { get; set; }
        public List<int> Observation { get; set; }
        public bool Offspring { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public List<int> Country { get; set; }
        public List<string> Region { get; set; }
        public List<string> County { get; set; }
        public List<string> Municipality { get; set; }
        public string IndividualNameOrID { get; set; }
        public string Barcode { get; set; }
        public bool Rovdjursforum { get; set; }
        public string ID { get; set; }
    }
}
