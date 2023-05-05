using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class DataDTO
    {
        public string userdto { get; set; }
        public List<Events> userinviteeve { get; set; }

        public int numberofmeetings { get; set; }

       public List<SuggestedDTO> existingsuggested = new List<SuggestedDTO>();

    }
}
