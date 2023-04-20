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
        public int id { get; set; }

        public virtual tblhobbieDTO tblHobbiedto { get; set; }
        public virtual Usersummary tblUser { get; set; }
        public virtual Usersummary tblUser1 { get; set; }
    }
}
