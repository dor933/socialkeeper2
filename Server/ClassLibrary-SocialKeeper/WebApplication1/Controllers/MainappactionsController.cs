using ClassLibrary_SocialKeeper;
using Firebase.Auth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.UI.WebControls;
using System.Xml.Linq;

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
        [HttpGet]
        [Route("api/MainAppaction/testnotif")]
        public async Task<string> testnotif()
        {
            
            await Notificationsmaker.sendexamplenotif();
            return "ok";
            
        }

        // POST: api/Mainappactions
        public void Post([FromBody]string value)
        {
        }


        [HttpPut]
        [Route("api/MainAppaction/Updmeeting/{meetingnum}/{meetingstat}")]
        public async Task<HttpResponseMessage> Updatemeetstatus( int meetingnum, string meetingstat, SuggestedDTO sugdto)
        {
            NotificationDTO notifyfriendrequest = new NotificationDTO();

            if (sugdto != null)
            {
                tblLoctation newlocation = _db.tblLoctation.Where(x => x.latitude == sugdto.latitude && x.longitude == sugdto.longitude).FirstOrDefault();
                if (newlocation == null)
                {
                    newlocation = new tblLoctation();
                    newlocation.latitude = sugdto.latitude;
                    newlocation.longitude = sugdto.longitude;
                    newlocation.Placeid = sugdto.place.PlaceId;
                    newlocation.city = sugdto.place.Name;
                    _db.tblLoctation.Add(newlocation);
                    _db.SaveChanges();
                }
                tblSuggestedMeeting sugtochange = _db.tblSuggestedMeeting.Where(x => x.meetingNum == sugdto.meetingNum).FirstOrDefault();
                sugtochange.hobbieNum = sugdto.hobbieNum;
                sugtochange.latitude= sugdto.latitude;
                sugtochange.longitude= sugdto.longitude;
                _db.SaveChanges();
            }

            try
            {
                if (meetingstat == "W")
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    sugmeet.status = "W";
                    _db.SaveChanges();
                    notifyfriendrequest.Notificationtype = "Suggested meeting";
                    notifyfriendrequest.senderphonenum = sugmeet.phoneNum1;
                    notifyfriendrequest.targetuserphonenum = sugmeet.phoneNum2;
                    notifyfriendrequest.Title = "Meeting suggested by friend!";
                    notifyfriendrequest.Body = $"{sugmeet.tblUser.userName} invite you to a meeting!";
                    notifyfriendrequest.Data = new Dictionary<string, string>
                    {
                        {"meetingnum", $"{meetingnum}" },
                        {"meetingstat", $"{meetingstat}" },
                        {"notiftype", "Suggestedmeeting" },
                         {"notification", JsonConvert.SerializeObject(new {icon="https://firebasestorage.googleapis.com/v0/b/responsive-cab-377615.appspot.com/o/Images%2FSocialkeeper2new.png?alt=media&token=f10bdc4f-3e23-43c7-a7ee-5c988a7b972e&_gl=1*gcy9wx*_ga*NTAyMjQ1MTEuMTY4MTk3OTcyMA..*_ga_CW55HF8NVT*MTY4NTk1MDk2OC4yMy4xLjE2ODU5NTExNzMuMC4wLjA."}) }

                    };
                    await Notificationsmaker.Notify(notifyfriendrequest);
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is waiting");

                }

                else if (meetingstat == "R")
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    string currentstatus = sugmeet.status;
                    sugmeet.status = "R";

                 


                    _db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is rejected");

                }

                else
                {
                    tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
                    sugmeet.status = "A";
                    _db.SaveChanges();
                    notifyfriendrequest.Notificationtype = "Approved meeting";
                    notifyfriendrequest.senderphonenum = sugmeet.phoneNum2;
                    notifyfriendrequest.targetuserphonenum = sugmeet.phoneNum1;
                    notifyfriendrequest.Title = "Meeting has been approved!";
                    notifyfriendrequest.Body = $"{sugmeet.tblUser1.userName} Aprroved the meeting!";
                    notifyfriendrequest.Data = new Dictionary<string, string>
                    {
                        {"meetingnum", $"{meetingnum}" },
                        {"meetingstat", $"{meetingstat}" },
                        {"notiftype", "Approvedmeeting"},
                       {"notification", JsonConvert.SerializeObject(new {icon="https://firebasestorage.googleapis.com/v0/b/responsive-cab-377615.appspot.com/o/Images%2FSocialkeeper2new.png?alt=media&token=f10bdc4f-3e23-43c7-a7ee-5c988a7b972e&_gl=1*gcy9wx*_ga*NTAyMjQ1MTEuMTY4MTk3OTcyMA..*_ga_CW55HF8NVT*MTY4NTk1MDk2OC4yMy4xLjE2ODU5NTExNzMuMC4wLjA."}) }

                    };
                    await Notificationsmaker.Notify(notifyfriendrequest);
                    return Request.CreateResponse(HttpStatusCode.OK, "Meeting is Approved");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, ex.Message);
            }

        }

        [HttpPost]
        [Route("api/MainAppaction/sendcancelnotif/{meetingnum}/{cancelphonenumber}")]

        public async Task<HttpResponseMessage> Sendcancelnotif( int meetingnum, string cancelphonenumber) 
        {
            tblSuggestedMeeting sugmeet = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
            string currentstatus = sugmeet.status;
            NotificationDTO notifyfriendrequest= new NotificationDTO();

           

                string senderphonenum;

                if (cancelphonenumber == sugmeet.phoneNum1)
                {
                    senderphonenum = sugmeet.phoneNum2;

                }
                else
                {
                    senderphonenum = sugmeet.phoneNum1;
                }

                notifyfriendrequest.Notificationtype = "Canceled Meeting";
                notifyfriendrequest.senderphonenum = senderphonenum;
                notifyfriendrequest.targetuserphonenum = cancelphonenumber;
                notifyfriendrequest.Title = "Meeting Canceled by friend!";
                notifyfriendrequest.Body = "Meeting is canceled!";
                notifyfriendrequest.Data = new Dictionary<string, string>
                    {
                        {"meetingnum", $"{meetingnum}" },
                        {"notiftype", "Meeting Canceled" }
                    };

                await Notificationsmaker.Notify(notifyfriendrequest);

                return Request.CreateResponse(HttpStatusCode.OK, "notified");



            


        }

        // PUT: api/Mainappactions/5
        [HttpPut]
        [Route("api/MainAppaction/Updfriendrequest")]
        public async Task<HttpResponseMessage> Updfriendrequest([FromBody] RequestResponse item)
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
                    favdto.ID = favoritecont.ID;
                    string IDstring= favdto.ID.ToString();
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
                        preferredTimeDTOs1.Add(prefferedtdo);
                    }
                    usersum1.tblprefferdDTO = preferredTimeDTOs1;
                    favdto.tblUser1= usersum1;

                    NotificationDTO notifyfriendrequest = new NotificationDTO();
                    notifyfriendrequest.Notificationtype = "Friend Request Approved!";
                    notifyfriendrequest.senderphonenum = userinvited.phoneNum1;
                    notifyfriendrequest.targetuserphonenum = userinvite.phoneNum1;
                    notifyfriendrequest.Title = "Friend Request Approved!";
                    notifyfriendrequest.Body = $"{userinvited.userName} Approved your friend request!";
                    notifyfriendrequest.Data = new Dictionary<string, string>
                        {
                            {"notiftype", "Approvedfriendrequest" },
                        {"phonenuminvited",userinvited.phoneNum1 },
                        {"ID", IDstring },
                        {"notification", JsonConvert.SerializeObject(new {icon="https://firebasestorage.googleapis.com/v0/b/responsive-cab-377615.appspot.com/o/Images%2FSocialkeeper2new.png?alt=media&token=f10bdc4f-3e23-43c7-a7ee-5c988a7b972e&_gl=1*gcy9wx*_ga*NTAyMjQ1MTEuMTY4MTk3OTcyMA..*_ga_CW55HF8NVT*MTY4NTk1MDk2OC4yMy4xLjE2ODU5NTExNzMuMC4wLjA."}) }

                        };

                    await Notificationsmaker.Notify(notifyfriendrequest);


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

        [HttpPost]
        [Route("api/MainAppaction/updateeventid")]

        public HttpResponseMessage Updateeventid(SuggestedDTO dtosugupdate)
        {
            try
            {
                tblSuggestedMeeting sugtoupdate = _db.tblSuggestedMeeting.Where(x => x.meetingNum == dtosugupdate.meetingNum).FirstOrDefault();
                if (dtosugupdate.event_id != null)
                {

                    sugtoupdate.event_id = dtosugupdate.event_id;

                }
                else
                {
                    sugtoupdate.event_id_user2 = dtosugupdate.event_id_user2;
                }

                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpPost]
        [Route("api/MainAppaction/updateeventiddefcal")]
        public HttpResponseMessage Updateeventiddefaultcal(SuggestedDTO dtosugupdate)
        {
            try
            {
                tblSuggestedMeeting sugtoupdate = _db.tblSuggestedMeeting.Where(x => x.meetingNum == dtosugupdate.meetingNum).FirstOrDefault();

                if (dtosugupdate.event_id_default_calender != null)
                {
                    sugtoupdate.event_id_defaultcal = dtosugupdate.event_id_default_calender;
                }

                else
                {
                    sugtoupdate.event_id_defaultcal_user2 = dtosugupdate.event_id_default_calender_user2;
                }

                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                 return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);


            }

        }



        [HttpGet]
        [Route("api/MainAppaction/getactualmeeting/{meetingnum}")]
        public HttpResponseMessage Getactualmeeting(int meetingnum)
        {
            tblSuggestedMeeting suggestedactual = _db.tblSuggestedMeeting.Where(x => x.meetingNum == meetingnum).FirstOrDefault();
            if(suggestedactual != null)
            {
                SuggestedDTO suggested = new SuggestedDTO();
                string placeid = _db.tblLoctation.Where(x => x.latitude == suggestedactual.latitude && x.longitude == suggestedactual.longitude).FirstOrDefault().Placeid;
                suggested.place.PlaceId = placeid;
                suggested.phoneNum1 = suggestedactual.phoneNum1;
                suggested.date = suggestedactual.date;
                suggested.phoneNum2 = suggestedactual.phoneNum2;
                suggested.meetingNum = suggestedactual.meetingNum;
                suggested.startTime = suggestedactual.startTime;
                suggested.endTime = suggestedactual.endTime;
                suggested.rank = Convert.ToDouble(suggestedactual.rank);
                suggested.hobbieNum = int.Parse(suggestedactual.hobbieNum.ToString());
                suggested.longitude = suggestedactual.longitude;
                suggested.latitude = suggestedactual.latitude;
                suggested.status = suggestedactual.status;
                tblUser user1 = _db.tblUser.Where(x => x.phoneNum1 == suggestedactual.phoneNum1).FirstOrDefault();
                tblUser user2 = _db.tblUser.Where(x => x.phoneNum1 == suggestedactual.phoneNum2).FirstOrDefault();
                ExistsingUsers userexist = new ExistsingUsers();
                ExistsingUsers userexist2 = new ExistsingUsers();
                userexist.userName = user1.userName;
                userexist.phonenumbers.Add(user1.phoneNum1);
                userexist.birthDate = Convert.ToDateTime(user1.birthDate);
                userexist.imageUri = user1.imageUri;
                userexist.email = user1.email;
                userexist.gender = user1.gender;
                userexist.city = user1.city;
                userexist2.userName = user2.userName;
                userexist2.phonenumbers.Add(user2.phoneNum1);
                userexist2.birthDate = Convert.ToDateTime(user2.birthDate);
                userexist2.imageUri = user2.imageUri;
                userexist2.email = user2.email;
                userexist2.gender = user2.gender;
                userexist2.city = user2.city;
                suggested.user1 = userexist;
                suggested.user2 = userexist2;
                var actumeet = _db.tblActualMeeting.Find(suggestedactual.meetingNum, suggestedactual.hobbieNum,suggestedactual.longitude,suggestedactual.latitude);
                _db.Entry(actumeet).Reload();
                if (actumeet != null)
                {
                    Actualmeetingdto actdto = new Actualmeetingdto();
                    actdto.latitude = actumeet.latitude;
                    actdto.longitude = actumeet.longitude;
                    actdto.meetingNum = actumeet.meetingNum;
                    actdto.hobbieNum = actumeet.hobbieNum;
                    actdto.rankUser1 = actumeet.rankUser1;
                    actdto.rankUser2 = actumeet.rankUser2;
                    actdto.tblSuggestedMeeting = suggested;
                    return Request.CreateResponse(HttpStatusCode.OK, actdto);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NoContent);
                }


            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.NoContent, "meeting not exist");
            }
        }

        [HttpPut]
        [Route("api/MainAppaction/updateactrank")]

        public HttpResponseMessage Updatemeetrank(Actualmeetingdto actdto)
        {
            try
            {
                tblActualMeeting actmeeting = _db.tblActualMeeting.Where(x => x.meetingNum == actdto.meetingNum).FirstOrDefault();
                if (actmeeting != null)
                {
                    if (actdto.rankUser1 != null)
                    {

                        actmeeting.rankUser1 = actdto.rankUser1;

                    }
                    else
                    {
                        actmeeting.rankUser2 = actdto.rankUser2;

                    }

                    _db.SaveChanges();

                    return Request.CreateResponse(HttpStatusCode.OK, "rating updated");

                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Meeting not found");
                }
            }
            catch (Exception ex)
            {
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
        public async Task<HttpResponseMessage> Addfriendrequest([FromBody] tblPossibleDTO possibledto)
        {
            
            try
                {
                PossibleFavoriteContact possible = new PossibleFavoriteContact();
                possible.phonenuminvite = possibledto.phonenuminvite;
                possible.phonenuminvited = possibledto.phonenuminvited;
                tblUser userinvite= _db.tblUser.Where(x=> x.phoneNum1==possibledto.phonenuminvite).FirstOrDefault();
                tblUser userinvited= _db.tblUser.Where(x=> x.phoneNum1==possibledto.phonenuminvited).FirstOrDefault();
                tblHobbie hob= _db.tblHobbie.Where(x=> x.hobbieNum==possibledto.hobbieNum).FirstOrDefault();
                if (hob != null)
                {
                    possible.hobbieNum = hob.hobbieNum;
                }
                _db.PossibleFavoriteContact.Add(possible);
                _db.SaveChanges();
                tblPossibleDTO posdto = new tblPossibleDTO();
                posdto.phonenuminvite = possible.phonenuminvite;
                posdto.phonenuminvited = possible.phonenuminvited;
                posdto.hobbieNum = possible.hobbieNum;
                posdto.id = possible.id;
                string IDstring= possible.id.ToString();
                Usersummary user = new Usersummary();
                user.userName = possible.tblUser.userName;
                user.phoneNum1 = possible.tblUser.phoneNum1;
                user.birthDate = Convert.ToDateTime(possible.tblUser.birthDate);
                user.email = possible.tblUser.email;
                user.gender = possible.tblUser.gender;
                user.city = possible.tblUser.city;
                user.imageUri = possible.tblUser.imageUri;
                posdto.tblUser = user;
                Usersummary user1 = new Usersummary();
                user1.userName = possible.tblUser1.userName;
                user1.phoneNum1 = possible.tblUser1.phoneNum1;
                user1.birthDate = Convert.ToDateTime(possible.tblUser1.birthDate);
                user1.email = possible.tblUser1.email;
                user1.gender = possible.tblUser1.gender;
                user1.city = possible.tblUser1.city;
                user1.imageUri = possible.tblUser1.imageUri;
                List<UserhobbiesDTO> userhobbiesdtolist = new List<UserhobbiesDTO>();
                foreach (tblUserHobbie userhobbie in possible.tblUser1.tblUserHobbie)
                {
                    UserhobbiesDTO userhobbiedto = new UserhobbiesDTO();
                    userhobbiedto.hobbieNum = userhobbie.hobbieNum;
                    userhobbiedto.phoneNum1 = userhobbie.phoneNum1;
                    tblHobbie hobi = _db.tblHobbie.Where(h => h.hobbieNum == userhobbie.hobbieNum).FirstOrDefault();
                    userhobbiedto.hobbiename = hobi.hobbieName;
                    userhobbiesdtolist.Add(userhobbiedto);
                }
                user1.tblUserHobbiesDTO = userhobbiesdtolist;
                posdto.tblUser1 = user1;
                tblhobbieDTO hobbiedto = new tblhobbieDTO();
                hobbiedto.hobbieName = possible.tblHobbie.hobbieName;
                hobbiedto.hobbieNum = possible.tblHobbie.hobbieNum;
                hobbiedto.imageuri = possible.tblHobbie.imageuri;
                posdto.tblHobbiedto = hobbiedto;

                NotificationDTO notifyfriendrequest = new NotificationDTO();
                notifyfriendrequest.Notificationtype = "New friend request";
                notifyfriendrequest.senderphonenum = possibledto.phonenuminvite;
                notifyfriendrequest.targetuserphonenum = possibledto.phonenuminvited;
                notifyfriendrequest.Title = "New Friend Request!";
                notifyfriendrequest.Body = $"You have a new friend request from {userinvite.userName}!";
                notifyfriendrequest.Data = new Dictionary<string, string>
                        {
                    {"ID", IDstring },
                            {"notiftype", "newFriendrequest" },
                           {"notification", JsonConvert.SerializeObject(new {icon="https://firebasestorage.googleapis.com/v0/b/responsive-cab-377615.appspot.com/o/Images%2FSocialkeeper2new.png?alt=media&token=f10bdc4f-3e23-43c7-a7ee-5c988a7b972e&_gl=1*gcy9wx*_ga*NTAyMjQ1MTEuMTY4MTk3OTcyMA..*_ga_CW55HF8NVT*MTY4NTk1MDk2OC4yMy4xLjE2ODU5NTExNzMuMC4wLjA."}) }


                        };
                await Notificationsmaker.Notify(notifyfriendrequest);
                return Request.CreateResponse(HttpStatusCode.OK,posdto);
            }
            catch (Exception ex)
                {

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        
        }

        [HttpGet]
        [Route("api/MainAppaction/Getnewreq/{reqid}")]
        public HttpResponseMessage Getnewreq(string reqid)
        {
            try
            {
                int reqidint = int.Parse(reqid);
                PossibleFavoriteContact possible = _db.PossibleFavoriteContact.Where(x => x.id == reqidint).FirstOrDefault();
                tblPossibleDTO posdto = new tblPossibleDTO();
                posdto.phonenuminvite = possible.phonenuminvite;
                posdto.phonenuminvited = possible.phonenuminvited;
                posdto.hobbieNum = possible.hobbieNum;
                posdto.id = possible.id;
                string IDstring = possible.id.ToString();
                Usersummary user = new Usersummary();
                user.userName = possible.tblUser.userName;
                user.phoneNum1 = possible.tblUser.phoneNum1;
                user.birthDate = Convert.ToDateTime(possible.tblUser.birthDate);
                user.email = possible.tblUser.email;
                user.gender = possible.tblUser.gender;
                user.city = possible.tblUser.city;
                user.imageUri = possible.tblUser.imageUri;
                posdto.tblUser = user;
                Usersummary user1 = new Usersummary();
                user1.userName = possible.tblUser1.userName;
                user1.phoneNum1 = possible.tblUser1.phoneNum1;
                user1.birthDate = Convert.ToDateTime(possible.tblUser1.birthDate);
                user1.email = possible.tblUser1.email;
                user1.gender = possible.tblUser1.gender;
                user1.city = possible.tblUser1.city;
                user1.imageUri = possible.tblUser1.imageUri;
                List<UserhobbiesDTO> userhobbiesdtolist = new List<UserhobbiesDTO>();
                foreach (tblUserHobbie userhobbie in possible.tblUser1.tblUserHobbie)
                {
                    UserhobbiesDTO userhobbiedto = new UserhobbiesDTO();
                    userhobbiedto.hobbieNum = userhobbie.hobbieNum;
                    userhobbiedto.phoneNum1 = userhobbie.phoneNum1;
                    tblHobbie hobi = _db.tblHobbie.Where(h => h.hobbieNum == userhobbie.hobbieNum).FirstOrDefault();
                    userhobbiedto.hobbiename = hobi.hobbieName;
                    userhobbiedto.hobbieimage = hobi.imageuri;
                    userhobbiesdtolist.Add(userhobbiedto);
                }
                user1.tblUserHobbiesDTO = userhobbiesdtolist;
                posdto.tblUser1 = user1;
                tblhobbieDTO hobbiedto = new tblhobbieDTO();
                hobbiedto.hobbieName = possible.tblHobbie.hobbieName;
                hobbiedto.hobbieNum = possible.tblHobbie.hobbieNum;
                hobbiedto.imageuri = possible.tblHobbie.imageuri;
                posdto.tblHobbiedto = hobbiedto;
                return Request.CreateResponse(HttpStatusCode.OK, posdto);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        [Route("api/MainAppaction/Getmeetnew/{meetingnumber}")]
        public HttpResponseMessage Getmeeting(int meetingnumber)
        {
            try
            {
                tblSuggestedMeeting sugemmeting= _db.tblSuggestedMeeting.Where(x=> x.meetingNum==meetingnumber).FirstOrDefault();
                SuggestedDTO suggestedto= new SuggestedDTO();
                suggestedto.phoneNum1 = sugemmeting.phoneNum1;
                suggestedto.phoneNum2 = sugemmeting.phoneNum2;
                suggestedto.meetingNum = sugemmeting.meetingNum;
                suggestedto.startTime = sugemmeting.startTime;
                suggestedto.endTime= sugemmeting.endTime;
                tblLoctation loctmeet= _db.tblLoctation.Where(x=> x.longitude==sugemmeting.longitude && x.latitude==sugemmeting.latitude).FirstOrDefault();
                suggestedto.place = new PlaceResult();
                suggestedto.place.PlaceId = loctmeet.Placeid;
                suggestedto.status = "W";
                suggestedto.date = sugemmeting.date;
                tblHobbie hob= _db.tblHobbie.Where(x=> x.hobbieNum==sugemmeting.hobbieNum).FirstOrDefault();
                suggestedto.hobbieNum = hob.hobbieNum;
                suggestedto.longitude = sugemmeting.longitude;
                suggestedto.latitude= sugemmeting.latitude;
                ExistsingUsers user1 = new ExistsingUsers();
                user1.phonenumbers.Add(sugemmeting.tblUser.phoneNum1);
                user1.birthDate = Convert.ToDateTime(sugemmeting.tblUser.birthDate);
                user1.imageUri = sugemmeting.tblUser.imageUri;
                user1.city = sugemmeting.tblUser.city;
                user1.gender = sugemmeting.tblUser.gender;
                user1.userName= sugemmeting.tblUser.userName;
                user1.email = sugemmeting.tblUser.email;
                user1.citylatt = Convert.ToDouble(sugemmeting.tblUser.citylatt);
                user1.citylong = Convert.ToDouble(sugemmeting.tblUser.citylong);
                ExistsingUsers user2 = new ExistsingUsers();
                user2.phonenumbers.Add(sugemmeting.tblUser1.phoneNum1);
                user2.birthDate = Convert.ToDateTime(sugemmeting.tblUser1.birthDate);
                user2.imageUri = sugemmeting.tblUser1.imageUri;
                user2.city = sugemmeting.tblUser1.city;
                user2.gender = sugemmeting.tblUser1.gender;
                user2.userName = sugemmeting.tblUser1.userName;
                user2.email = sugemmeting.tblUser1.email;
                user2.citylatt = Convert.ToDouble(sugemmeting.tblUser1.citylatt);
                user2.citylong = Convert.ToDouble(sugemmeting.tblUser1.citylong);
                suggestedto.user1 = user1;
                suggestedto.user2 = user2;

                return Request.CreateResponse(HttpStatusCode.OK, suggestedto);


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
