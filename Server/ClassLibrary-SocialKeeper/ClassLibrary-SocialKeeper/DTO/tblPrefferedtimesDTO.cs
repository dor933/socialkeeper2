using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class tblPrefferedtimesDTO
    {
        public int id { get; set; }
        public System.TimeSpan startTime { get; set; }
        public System.TimeSpan endTime { get; set; }
        public string weekDay { get; set; }
        public string rank { get; set; }
        public string phoneNum1 { get; set; }
    }
}
