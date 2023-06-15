using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Expo.Server.Client;
using Expo.Server.Models;
using Newtonsoft.Json;



namespace ClassLibrary_SocialKeeper
{
     static public class Notificationsmaker
    {

        static igroup192_prodEntities _db = new igroup192_prodEntities();

         static public async Task<string> Notify(NotificationDTO notification)
        {
            tblUser targetuser = _db.tblUser.Where(x => x.phoneNum1 == notification.targetuserphonenum).FirstOrDefault();
            tblUser senderuser = _db.tblUser.Where(x => x.phoneNum1 == notification.senderphonenum).FirstOrDefault();

            if (targetuser == null || senderuser == null)
            {
                return "user not found";
            }
            if(targetuser.ExpoPushToken==null)
            {
                return "token not found";
            }
            try
            {
                PushTicketRequest pushticketrrequest = new PushTicketRequest
                {
                    PushTo = new List<string> { targetuser.ExpoPushToken },
                    PushTitle = notification.Title,
                    PushBody = notification.Body,
                    PushData= JsonConvert.SerializeObject(notification.Data)

                };

                PushApiClient expopushclient = new PushApiClient();
                await expopushclient.PushSendAsync(pushticketrrequest);

                

                return "Push notifiction sent successfully";
            }
            catch (Exception ex)
            {
                return "Push failed";
            }
        }

        static public async Task<String> sendexamplenotif()
        {
            {
            NotificationDTO notification = new NotificationDTO
            {
                targetuserphonenum = "0533312224",
                senderphonenum = "0533312224",
                Title = "test",
                Body = "test",
                Data = new Dictionary<string, string> { { "test", "test" } }
            };
            return await Notify(notification);
            }
        }


    }
}
