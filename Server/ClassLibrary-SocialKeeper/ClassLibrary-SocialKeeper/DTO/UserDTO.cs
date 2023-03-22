using ClassLibrary_SocialKeeper;
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
       

        public virtual ICollection<FavoriteContactsDTO> tblFavoriteContacts { get; set; }
        public virtual ICollection<FavoriteContactsDTO> tblFavoriteContacts1 { get; set; }
        public virtual ICollection<tblInvitesDTO> tblInvitesDTO { get; set; }
        public virtual NewUserDTO tblNewUserDTO { get; set; }
        public virtual ICollection<tblPrefferedtimesDTO> tblprefferdDTO { get; set; }
        public virtual ICollection<tblSuggestedMeeting> tblSuggestedMeetings { get; set; }
        public virtual ICollection<tblSuggestedMeeting> tblSuggestedMeetings1 { get; set; }
        public virtual ICollection<UserhobbiesDTO> tblUserHobbiesDTO { get; set; }

        public virtual ICollection<tblPossibleDTO> possibleFavoriteContacts_invite_DTO { get; set; }

        public virtual ICollection<tblPossibleDTO> possibleFavoriteContacts_invited_DTO { get; set; }
    }
}
