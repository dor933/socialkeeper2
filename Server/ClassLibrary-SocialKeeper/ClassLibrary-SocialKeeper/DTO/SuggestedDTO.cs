using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class SuggestedDTO
    {
        public int meetingNum { get; set; }
        public TimeSpan startTime { get; set; }
        public TimeSpan endTime { get; set; }
        public string status { get; set; }
        public string phoneNum1 { get; set; }
        public string phoneNum2 { get; set; }
        public DateTime date { get; set; }
        public string rejectReason { get; set; }
        public double longitude { get; set; }
        public double latitude { get; set; }

        public int hobbieNum { get; set; }

        public string event_id { get; set; }

        public string event_id_user2 { get; set; }

        public string event_id_default_calender { get; set; }

        public string event_id_default_calender_user2 { get; set; }

        public double prefferedtimerate;

        public double normalizeuserrank { get; set; }

        public double normalizehobbierank { get; set; }

        public double rank { get; set; }
        public LoctationDTO locatation { get; set; }
        public List<suggestedhobbiesdto> suggestedHobbies { get; set; } = new List<suggestedhobbiesdto>();
        public ExistsingUsers user1 { get; set; }
        public ExistsingUsers user2 { get; set; }

        public PlaceResult place = new PlaceResult();
    }
}
