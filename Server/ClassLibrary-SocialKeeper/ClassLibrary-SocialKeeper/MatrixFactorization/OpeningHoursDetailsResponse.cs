using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class OpeningHoursDetailsResponse
    {
        [JsonProperty("result")]
        public Result Result { get; set; }
    }

    public class Result
    {
        [JsonProperty("opening_hours")]
        public OpeningHoursDetails OpeningHoursDetails { get; set; }
    }

   
}
