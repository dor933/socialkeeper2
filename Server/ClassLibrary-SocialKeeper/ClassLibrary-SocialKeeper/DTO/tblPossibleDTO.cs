using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class tblPossibleDTO
    {
        public string phonenuminvite { get; set; }
        public string phonenuminvited { get; set; }
        public int hobbieNum { get; set; }

        public virtual tblHobbie tblHobbie { get; set; }
        public virtual tblUser tblUser { get; set; }
        public virtual tblUser tblUser1 { get; set; }
    }
}
