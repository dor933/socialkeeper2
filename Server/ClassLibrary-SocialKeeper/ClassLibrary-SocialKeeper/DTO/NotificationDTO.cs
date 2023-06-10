using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassLibrary_SocialKeeper
{
    public class NotificationDTO
    {
        public string targetuserphonenum { get; set; }

        public string senderphonenum { get; set; }
        public string Body { get; set; }
        public string Title { get; set; }
        public object Data { get; set; }

        public string Notificationtype { get; set; }
    }
}
