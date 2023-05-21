using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class FavoriteContactsDTO
    {
        public int ID { get; set; }
        public string phoneNum1 { get; set; }
        public string phoneNum2 { get; set; }
        public string rank { get; set; }
        public int hobbieNum { get; set; }
        public virtual Usersummary tblUser1 { get; set; }
        public virtual tblhobbieDTO tblHobbie { get; set; }
    }
}
