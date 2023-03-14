using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class tblInvitesDTO
    {
        public string phoneNum1 { get; set; }
        public string phoneNum2 { get; set; }
        public string status { get; set; }
        public System.DateTime date { get; set; }

        public string Nickname { get; set; }

        public virtual UserDTO tblUser { get; set; }

        public virtual NewUserDTO tblNewUser { get; set; }

    }
}
