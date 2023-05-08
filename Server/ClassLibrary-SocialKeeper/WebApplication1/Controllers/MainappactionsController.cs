using ClassLibrary_SocialKeeper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplication1.Controllers
{
    public class MainappactionsController : ApiController
    {
        igroup192_prodEntities _db;

        public MainappactionsController()
        {
            _db = dbcontext._db;
        }

        // GET: api/Mainappactions
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Mainappactions/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Mainappactions
        public void Post([FromBody]string value)
        {
        }

        [HttpPut]
        [Route("api/MainAppaction/Updmeeting/{meetingstat}")]
        public HttpResponseMessage Updatemeetstatus(char meetingstat, [FromBody]SuggestedDTO sugdto)
        {
            try
            {
                if (meetingstat == 'W')
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == sugdto.meetingNum).FirstOrDefault();
                    sugmeet.status = "W";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is waiting");

                }

                else if (meetingstat == 'R')
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == sugdto.meetingNum).FirstOrDefault();
                    sugmeet.status = "R";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is rejected");

                }

                else
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == sugdto.meetingNum).FirstOrDefault();
                    sugmeet.status = "A";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is Approved");
                }
            }
            catch(Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, ex.Message);
            }

        }

        // PUT: api/Mainappactions/5
        [HttpPut]
        [Route("api/MainAppaction/Updfriendrequest")]
        public HttpResponseMessage Updfriendrequest([FromBody] RequestResponse item)
        {
            try
            {
                if (item.isAccepted)
                {
                    PossibleFavoriteContact posfavoritereq = _db.PossibleFavoriteContact.Where(x => x.id == item.requestid).FirstOrDefault();
                    tblUser userinvite = _db.tblUser.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvite).FirstOrDefault();
                    tblUser userinvited = _db.tblUser.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvited).FirstOrDefault();
                    tblFavoriteContact favoritecont = new tblFavoriteContact();
                    favoritecont.phoneNum1 = posfavoritereq.phonenuminvite;
                    favoritecont.phoneNum2 = posfavoritereq.phonenuminvited;
                    favoritecont.hobbieNum = posfavoritereq.hobbieNum;
                    favoritecont.tblHobbie = posfavoritereq.tblHobbie;
                    favoritecont.tblUser = posfavoritereq.tblUser;
                    favoritecont.tblUser1 = posfavoritereq.tblUser1;
                    favoritecont.rank = "1";
                    userinvite.tblFavoriteContact.Add(favoritecont);
                    userinvited.tblFavoriteContact1.Add(favoritecont);
                    _db.tblFavoriteContact.Add(favoritecont);
                    userinvite.PossibleFavoriteContact.Remove(posfavoritereq);
                    userinvited.PossibleFavoriteContact1.Remove(posfavoritereq);
                    _db.PossibleFavoriteContact.Remove(posfavoritereq);
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);



                }
                else
                {
                    PossibleFavoriteContact posfavoritereq = _db.PossibleFavoriteContact.Where(x => x.id == item.requestid).FirstOrDefault();
                    tblUser userinvite = _db.tblUser.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvite).FirstOrDefault();
                    tblUser userinvited = _db.tblUser.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvited).FirstOrDefault();
                    userinvite.PossibleFavoriteContact.Remove(posfavoritereq);
                    userinvited.PossibleFavoriteContact1.Remove(posfavoritereq);
                    _db.PossibleFavoriteContact.Remove(posfavoritereq);
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);


                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        // DELETE: api/Mainappactions/5
        [HttpDelete]
        [Route("api/MainAppaction/deletefriendship")]
        public HttpResponseMessage Delete([FromBody] FavoriteContactsDTO favtodel)
        {
            try
            {
                tblFavoriteContact favtodelorg = _db.tblFavoriteContact.Where(x => x.phoneNum1 == favtodel.phoneNum1 && x.phoneNum2 == favtodel.phoneNum2).FirstOrDefault();
                _db.tblFavoriteContact.Remove(favtodelorg);
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Favorite object deleted");
            }
            catch (Exception ex)
            {
               return Request.CreateResponse(HttpStatusCode.NoContent, ex.Message);
            }
        }
    }
}
