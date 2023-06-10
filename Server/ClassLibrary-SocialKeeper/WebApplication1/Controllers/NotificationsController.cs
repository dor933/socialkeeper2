using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Expo.Server.Client;
using Expo.Server.Models;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using System.Data.Entity;
using System.Runtime.Remoting.Messaging;
using ClassLibrary_SocialKeeper;

namespace WebApplication1.Controllers
{

    public class NotificationsController : MainAppController
    {

        igroup192_prodEntities _db;

        public NotificationsController()
        {
            _db = dbcontext._db;
        }

        [EnableCors(origins: "*", headers: "*", methods: "*")]

        [HttpPost]
        [Route("api/Notifications/Notify")]
        public async Task<IHttpActionResult> Notify([FromBody]NotificationDTO notification)
        {
            tblUser targetuser = _db.tblUser.Where(x => x.phoneNum1 == notification.targetuserphonenum).FirstOrDefault();
            tblUser senderuser = _db.tblUser.Where(x => x.phoneNum1 == notification.senderphonenum).FirstOrDefault();

            if (targetuser == null || senderuser == null)
            {
                return BadRequest("user not found");
            }
            try
            {
                PushTicketRequest pushticketrrequest = new PushTicketRequest
                {
                    PushTo = new List<string> { targetuser.ExpoPushToken },
                    PushTitle = notification.Title,
                    PushBody = notification.Body
                    
                };

                PushApiClient expopushclient= new PushApiClient();
                await expopushclient.PushSendAsync(pushticketrrequest);
              
              
                return Ok("Push notifiction sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }

}
