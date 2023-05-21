using ClassLibrary_SocialKeeper;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplication1.Controllers
{
    public class MainappactionsController : DefaultController
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
        [Route("api/MainAppaction/Updmeeting/{meetingnum}/{meetingstat}")]
        public HttpResponseMessage Updatemeetstatus( int meetingnum, string meetingstat)
        {
            try
            {
                if (meetingstat == "W")
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    sugmeet.status = "W";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is waiting");

                }

                else if (meetingstat == "R")
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    sugmeet.status = "R";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is rejected");

                }

                else
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    sugmeet.status = "A";
                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is Approved");
                }
            }
            catch (Exception ex)
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

        [HttpPut]
        [Route("api/MainAppaction/Upduser")]
        public HttpResponseMessage UpdateUser([FromBody] UserDTO ustoupdto)
        {
            try
            {
                tblUser ustoupdate = _db.tblUser.Where(x => x.phoneNum1 == ustoupdto.phoneNum1).FirstOrDefault();
                ustoupdate.userName = ustoupdto.userName;
                ustoupdate.birthDate = ustoupdto.birthDate;
                ustoupdate.city = ustoupdto.city;
                ustoupdate.citylatt = ustoupdto.citylatt;
                ustoupdate.citylong = ustoupdto.citylong;
                _db.SaveChanges();
                UserDTO usertoreturn = GetUser(ustoupdate);

                return Request.CreateResponse(HttpStatusCode.OK, usertoreturn);
            }
            catch(Exception ex)
            {
                
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            
            }
        }

        [HttpPut]
        [Route("api/MainAppaction/Updhobbies")]
        public HttpResponseMessage Updatehobbies([FromBody] List<UserhobbiesDTO> userhobbiesdto) {

            try
            {
                List<tblUserHobbie> userhobbiestoupd = _db.tblUserHobbie.Where(x => x.phoneNum1 == userhobbiesdto[0].phoneNum1).ToList();
                _db.tblUserHobbie.RemoveRange(userhobbiestoupd);
                bool hobbieisfound = false;
                List<tblUserHobbie> newuserhobbies = new List<tblUserHobbie>();



                foreach (UserhobbiesDTO item in userhobbiesdto)
                {
                    foreach (tblUserHobbie ushobbie in userhobbiestoupd)
                    {
                        if (item.hobbieNum == ushobbie.hobbieNum)
                        {
                            ushobbie.rank = item.rank;
                            newuserhobbies.Add(ushobbie);
                            hobbieisfound = true;
                            break;
                        }
                    }
                    if (!hobbieisfound)
                    {
                        tblUserHobbie ushobbie = new tblUserHobbie();
                        ushobbie.hobbieNum = item.hobbieNum;
                        ushobbie.phoneNum1 = item.phoneNum1;
                        ushobbie.rank = item.rank;
                        newuserhobbies.Add(ushobbie);


                    }
                }

                _db.tblUserHobbie.AddRange(newuserhobbies);
                _db.SaveChanges();
                List<UserhobbiesDTO> userhobbiedtoreturn = new List<UserhobbiesDTO>();
                foreach(tblUserHobbie item2 in newuserhobbies)
                {
                    UserhobbiesDTO ushobbiedto= new UserhobbiesDTO();
                    ushobbiedto.hobbieNum= item2.hobbieNum;
                    ushobbiedto.phoneNum1 = item2.phoneNum1;
                    ushobbiedto.rank= item2.rank;
                    tblHobbie hob= _db.tblHobbie.Where(x=> x.hobbieNum==item2.hobbieNum).FirstOrDefault();
                    ushobbiedto.hobbieimage = hob.imageuri;
                    ushobbiedto.hobbiename = hob.hobbieName;
                    userhobbiedtoreturn.Add(ushobbiedto);
                }
               
                return Request.CreateResponse(HttpStatusCode.OK, userhobbiedtoreturn);
            }
            catch (Exception ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex); 
            }

        }

        [HttpPut]
        [Route("api/MainAppaction/Updmeetingstimes")]
        public HttpResponseMessage Updmeeteingstimes([FromBody] List<tblPrefferedtimesDTO> tblPrefferedtimesDTOs)
        {
            try
            {
                List<tblPreferredTime> prefferedexisting = _db.tblPreferredTime.Where(x => x.phoneNum1 == tblPrefferedtimesDTOs[0].phoneNum1).ToList();
                _db.tblPreferredTime.RemoveRange(prefferedexisting);
                List<tblPreferredTime> userpreflist = new List<tblPreferredTime>();
                foreach (tblPrefferedtimesDTO userpref in tblPrefferedtimesDTOs)
                {
                    tblPreferredTime newuserpref = new tblPreferredTime();
                    newuserpref.startTime = userpref.startTime;
                    newuserpref.endTime = userpref.endTime;
                    newuserpref.weekDay = userpref.weekDay;
                    newuserpref.rank = userpref.rank;
                    newuserpref.phoneNum1 = userpref.phoneNum1;
                    userpreflist.Add(newuserpref);

                }

                _db.tblPreferredTime.AddRange(userpreflist);
                _db.SaveChanges();
                List<tblPrefferedtimesDTO> preferredTimeDTOs = new List<tblPrefferedtimesDTO>();

                foreach (tblPreferredTime preff in userpreflist)
                {
                    tblPrefferedtimesDTO prefferedtdo = new tblPrefferedtimesDTO();
                    prefferedtdo.startTime = preff.startTime;
                    prefferedtdo.endTime = preff.endTime;
                    prefferedtdo.weekDay = preff.weekDay;
                    prefferedtdo.phoneNum1 = preff.phoneNum1;
                    prefferedtdo.id = preff.id;
                    prefferedtdo.rank = preff.rank;
                    preferredTimeDTOs.Add(prefferedtdo);
                }

                return Request.CreateResponse(HttpStatusCode.OK, preferredTimeDTOs);
            }
            catch (Exception ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
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
