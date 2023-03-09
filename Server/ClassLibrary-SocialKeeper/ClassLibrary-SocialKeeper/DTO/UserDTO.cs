using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class UserDTO
    {
        public string phoneNum1 { get; set; }
        public string userName { get; set; }
        public DateTime birthDate { get; set; }
        public string email { get; set; }
        public string city { get; set; }
        public string gender { get; set; }
        public string imageUri { get; set; }
        public byte[] image { get; set; }
        public string GoogleID { get; set; }
        public string MicrosoftID { get; set; }

        public virtual ICollection<tblFavoriteContact> tblFavoriteContacts { get; set; }
        public virtual ICollection<tblFavoriteContact> tblFavoriteContacts1 { get; set; }
        public virtual ICollection<tblInvite> tblInvites { get; set; }
        public virtual tblNewUser tblNewUser { get; set; }
        public virtual ICollection<tblPreferredTime> tblPreferredTimes { get; set; }
        public virtual ICollection<tblSuggestedMeeting> tblSuggestedMeetings { get; set; }
        public virtual ICollection<tblSuggestedMeeting> tblSuggestedMeetings1 { get; set; }
        public virtual ICollection<tblUserHobbie> tblUserHobbies { get; set; }
    }
}
