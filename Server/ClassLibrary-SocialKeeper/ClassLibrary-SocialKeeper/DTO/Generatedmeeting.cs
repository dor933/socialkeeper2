using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class Generatedmeeting
    {
        public string meetingcreatorphone { get; set; }

        public string meetinguserphone { get; set; }
        public DateTime meetingdate { get; set; }
        public TimeSpan meetingendtime { get; set; }

        public TimeSpan meetingstarttime { get; set; }
        public UserhobbiesDTO meetinghobbie { get; set; }
        public LoctationDTO meetinglocation { get; set; }
    }
}
