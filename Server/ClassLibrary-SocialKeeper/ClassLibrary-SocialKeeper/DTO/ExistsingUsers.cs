using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class ExistsingUsers
    {
        public List<string> phonenumbers { get; set; } = new List<string>();
        public string userName { get; set; }
        public DateTime birthDate { get; set; }
        public string city { get; set; }
        public string gender { get; set; }
        public string imageUri { get; set; }
        public virtual ICollection<UserhobbiesDTO> tblUserHobbiesDTO { get; set; }

    }
}
