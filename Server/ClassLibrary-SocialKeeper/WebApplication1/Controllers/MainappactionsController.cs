using ClassLibrary_SocialKeeper;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
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
                    FavoriteContactsDTO favdto= new FavoriteContactsDTO();
                    favdto.phoneNum1 = favoritecont.phoneNum1;
                    favdto.phoneNum2 = favoritecont.phoneNum2;
                    favdto.hobbieNum = favoritecont.hobbieNum;
                    favdto.rank = favoritecont.rank;
                    favdto.ID = favoritecont.ID;
                    tblhobbieDTO hobdto= new tblhobbieDTO();
                    hobdto.hobbieName= favoritecont.tblHobbie.hobbieName;
                    hobdto.hobbieNum= favoritecont.tblHobbie.hobbieNum;
                    hobdto.imageuri= favoritecont.tblHobbie.imageuri;
                    favdto.tblHobbie = hobdto;
                    Usersummary usersum1= new Usersummary();
                    usersum1.phoneNum1 = userinvite.phoneNum1;
                    usersum1.userName = userinvite.userName;
                    usersum1.birthDate = Convert.ToDateTime(userinvite.birthDate);
                    usersum1.gender = userinvite.gender;
                    usersum1.imageUri = userinvite.imageUri;
                    usersum1.city = userinvite.city;
                    usersum1.email = userinvite.email;

            
                    List<UserhobbiesDTO> userhobbiesdtolist1 = new List<UserhobbiesDTO>();
                    foreach (tblUserHobbie userhobbie in userinvite.tblUserHobbie)
                    {
                        UserhobbiesDTO userhobbiedto = new UserhobbiesDTO();
                        userhobbiedto.hobbieNum = userhobbie.hobbieNum;
                        userhobbiedto.phoneNum1 = userhobbie.phoneNum1;
                        tblHobbie hob = _db.tblHobbie.Where(h => h.hobbieNum == userhobbie.hobbieNum).FirstOrDefault();
                        userhobbiedto.hobbiename = hob.hobbieName;
                        userhobbiedto.rank = userhobbie.rank;
                        userhobbiedto.hobbieimage= hob.imageuri;
                        userhobbiesdtolist1.Add(userhobbiedto);
                    }
                    usersum1.tblUserHobbiesDTO = userhobbiesdtolist1;

                    List<tblPrefferedtimesDTO> preferredTimeDTOs = new List<tblPrefferedtimesDTO>();

                

                    List<tblPrefferedtimesDTO> preferredTimeDTOs1 = new List<tblPrefferedtimesDTO>();
                    foreach (tblPreferredTime preff in userinvite.tblPreferredTime)
                    {
                        tblPrefferedtimesDTO prefferedtdo = new tblPrefferedtimesDTO();
                        prefferedtdo.startTime = preff.startTime;
                        prefferedtdo.endTime = preff.endTime;
                        prefferedtdo.weekDay = preff.weekDay;
                        prefferedtdo.phoneNum1 = preff.phoneNum1;
                        prefferedtdo.id = preff.id;
                        prefferedtdo.rank = preff.rank;
                        preferredTimeDTOs1.Add(prefferedtdo);
                    }
                    usersum1.tblprefferdDTO = preferredTimeDTOs1;
                    favdto.tblUser1= usersum1;
                   


                    return Request.CreateResponse(HttpStatusCode.OK,favdto);



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
                string phonenumber= userhobbiesdto[0].phoneNum1;
                List<tblUserHobbie> userhobbiestoupd = _db.tblUserHobbie.Where(x => x.phoneNum1 == phonenumber).ToList();
                if (userhobbiestoupd.Count > 0) { 
                _db.tblUserHobbie.RemoveRange(userhobbiestoupd);
                _db.SaveChanges();
                    }
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
                    hobbieisfound = false;
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
                string phonenumber= tblPrefferedtimesDTOs[0].phoneNum1;
                List<tblPreferredTime> prefferedexisting = _db.tblPreferredTime.Where(x => x.phoneNum1 == phonenumber).ToList();
                if (prefferedexisting.Count > 0) {
                    _db.tblPreferredTime.RemoveRange(prefferedexisting);
                    _db.SaveChanges();
                }
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
                    prefferedtdo.rank = preff.rank;
                    prefferedtdo.id = preff.id;
                    preferredTimeDTOs.Add(prefferedtdo);
                }

                return Request.CreateResponse(HttpStatusCode.OK, preferredTimeDTOs);
            }
            catch (DbEntityValidationException ex)
            {
                foreach (var error in ex.EntityValidationErrors)
                {
                    foreach (var validationError in error.ValidationErrors)
                    {
                        Console.WriteLine($"Property: {validationError.PropertyName} Error: {validationError.ErrorMessage}");
                    }
                }

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            //catch velidation errors


        }

        [HttpPost]
        [Route("api/MainAppaction/addfriendrequest")]
        public HttpResponseMessage Addfriendrequest([FromBody] tblPossibleDTO possibledto)
        {
            
            try
                {
                PossibleFavoriteContact possible = new PossibleFavoriteContact();
                possible.phonenuminvite = possibledto.phonenuminvite;
                possible.phonenuminvited = possibledto.phonenuminvited;
                tblHobbie hob= _db.tblHobbie.Where(x=> x.hobbieNum==possibledto.hobbieNum).FirstOrDefault();
                if (hob != null)
                {
                    possible.hobbieNum = hob.hobbieNum;
                }
                _db.PossibleFavoriteContact.Add(possible);
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
                {

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        
        }


        // DELETE: api/Mainappactions/5
        [HttpDelete]
        [Route("api/MainAppaction/deletefriendship/{friendid}")]
        public HttpResponseMessage Delete(int friendid)
        {
            try
            {
                int myfriendid = friendid;
                tblFavoriteContact favtodelorg = _db.tblFavoriteContact.Where(x=> x.ID==myfriendid).FirstOrDefault();
                List<int> suggestedtodelete= new List<int>();
                _db.tblFavoriteContact.Remove(favtodelorg);
                List<tblSuggestedMeeting> suggestedtodel = _db.tblSuggestedMeeting.Where(x => (x.phoneNum1 == favtodelorg.phoneNum1 && x.phoneNum2 == favtodelorg.phoneNum2) ||

                (x.phoneNum1 == favtodelorg.phoneNum2 && x.phoneNum2 == favtodelorg.phoneNum1)).ToList();

                foreach(tblSuggestedMeeting item in suggestedtodel)
                {
                    tblSuggestedHobbie sughobbietodel= _db.tblSuggestedHobbie.Where(x=> x.meetingNum==item.meetingNum).FirstOrDefault();
                    if (sughobbietodel != null)
                    {
                        _db.tblSuggestedHobbie.Remove(sughobbietodel);
                    }
                    tblActualMeeting acttodel = _db.tblActualMeeting.Where(x => x.meetingNum == item.meetingNum).FirstOrDefault();
                    if(acttodel!=null)
                    {
                        _db.tblActualMeeting.Remove(acttodel);
                    }
                    suggestedtodelete.Add(item.meetingNum);
                    _db.SaveChanges();
                }

                _db.tblSuggestedMeeting.RemoveRange(suggestedtodel);
                
             
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, suggestedtodelete);
            }
            catch (Exception ex)
            {
               return Request.CreateResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }
    }
}
