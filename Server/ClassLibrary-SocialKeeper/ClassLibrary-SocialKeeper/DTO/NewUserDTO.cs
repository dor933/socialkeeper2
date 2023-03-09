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
        public ICollection<tblInvite> invites { get; set; }
        public ICollection<tblUser> tblrelateduser { get; set; }
    }
}
