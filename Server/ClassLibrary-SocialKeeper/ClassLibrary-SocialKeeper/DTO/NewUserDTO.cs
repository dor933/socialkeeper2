using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class NewUserDTO
    {
        public string phoneNum1 { get; set; }
        public string nickName { get; set; }
        public ICollection<tblInvitesDTO> invitesDTO { get; set; }
        public ICollection<UserDTO> tblrelateduserDTO { get; set; }
    }
}
