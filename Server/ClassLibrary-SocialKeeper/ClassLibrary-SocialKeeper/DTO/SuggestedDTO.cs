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
        public int longitude { get; set; }
        public int latitude { get; set; }

        public int hobbieNum { get; set; }

        public double rank { get; set; }
        public List<tblLoctation> loctations { get; set; } = new List<tblLoctation>();
        public List<tblSuggestedHobbie> suggestedHobbies { get; set; } = new List<tblSuggestedHobbie>();
        public List<tblActualMeeting> actualMeetings { get; set; } = new List<tblActualMeeting>();
        public tblUser user1 { get; set; }
        public tblUser user2 { get; set; }
    }
}
