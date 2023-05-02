using ClassLibrary_SocialKeeper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using Google.Cloud.Storage.V1;
using Google.Apis.Storage.v1.Data;
using System.Text.RegularExpressions;
using System.Web.UI.WebControls;
using System.Data;

namespace WebApplication1.Controllers
{
    public class DefaultController : ApiController
    {
        
        igroup192_prodEntities _db;
        public Googlecloudservices _googleservices;

        public DefaultController()
        {
            _googleservices = Creategooglecloudservice.Googlecloudservices();
            

            _db = dbcontext._db;
        
        }




        // GET: api/Default


        [HttpPost]
        [Route("api/Default/Signin")]
        public HttpResponseMessage Signin([FromBody] EmailDTO email1)
        {
            string email = email1.email;

            //check with the email after google auth if user exist
            //if yes, return his deatils, if not return null (In client side 
            // he will be redirected to the sign up page)
            try
            {
                



                var user = _db.tblUser.Where(u => u.email == email).FirstOrDefault();
                if (user != null)
                {
                    UserDTO usertoret = GetUser(user);
                    return Request.CreateResponse(HttpStatusCode.OK, usertoret);
                }

                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "no user was found");
                    //then in the client side, if the user is null, then the user will be redirected to the sign up page
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, ex);
            }
        }

        public UserDTO GetUser(tblUser checkifuser)
        {
            UserDTO usertoret = new UserDTO();
            usertoret.phoneNum1 = checkifuser.phoneNum1;
            usertoret.userName = checkifuser.userName;
            usertoret.imageUri = checkifuser.imageUri;
            usertoret.birthDate = Convert.ToDateTime(checkifuser.birthDate);
            usertoret.email = checkifuser.email;
            usertoret.city = checkifuser.city;
            usertoret.citylatt= Convert.ToDouble(checkifuser.citylatt);
            usertoret.citylong= Convert.ToDouble(checkifuser.citylong);
            usertoret.gender = checkifuser.gender;

            List<FavoriteContactsDTO> FavoriteContactsDTOs = new List<FavoriteContactsDTO>();

            foreach (tblFavoriteContact favo in checkifuser.tblFavoriteContact)
            {

                FavoriteContactsDTO favodto = new FavoriteContactsDTO();
                favodto.phoneNum1 = favo.phoneNum1;
                favodto.phoneNum2 = favo.phoneNum2;
                favodto.hobbieNum = favo.hobbieNum;
                Usersummary user1dto = new Usersummary();
                user1dto.phoneNum1 = favo.tblUser1.phoneNum1;
                user1dto.userName = favo.tblUser1.userName;
                user1dto.birthDate = Convert.ToDateTime(favo.tblUser1.birthDate);
                user1dto.city = favo.tblUser1.city;
                user1dto.gender = favo.tblUser1.gender;
                user1dto.email = favo.tblUser1.email;
                user1dto.imageUri = favo.tblUser1.imageUri;
                favodto.tblUser1 = user1dto;
                tblhobbieDTO hobbieDTO = new tblhobbieDTO();
                hobbieDTO.hobbieNum = favo.tblHobbie.hobbieNum;
                hobbieDTO.hobbieName = favo.tblHobbie.hobbieName;
                favodto.tblHobbie = hobbieDTO;
                favodto.hobbieNum = hobbieDTO.hobbieNum;
                FavoriteContactsDTOs.Add(favodto);


            }
            List<FavoriteContactsDTO> FavoriteContactsDTOs1 = new List<FavoriteContactsDTO>();

            foreach (tblFavoriteContact favo in checkifuser.tblFavoriteContact1)
            {

                FavoriteContactsDTO favodto = new FavoriteContactsDTO();
                favodto.phoneNum1 = favo.phoneNum1;
                favodto.phoneNum2 = favo.phoneNum2;
                favodto.hobbieNum = favo.hobbieNum;
                Usersummary user1dto = new Usersummary();
                user1dto.phoneNum1 = favo.tblUser.phoneNum1;
                user1dto.userName = favo.tblUser.userName;
                user1dto.birthDate = Convert.ToDateTime(favo.tblUser.birthDate);
                user1dto.city = favo.tblUser.city;
                user1dto.gender = favo.tblUser.gender;
                user1dto.email = favo.tblUser.email;
                if (favo.tblUser1.imageUri != null)
                {
                    user1dto.imageUri = favo.tblUser.imageUri;
                }
                favodto.tblUser1 = user1dto;
                tblhobbieDTO hobbieDTO = new tblhobbieDTO();
                hobbieDTO.hobbieNum = favo.tblHobbie.hobbieNum;
                hobbieDTO.hobbieName = favo.tblHobbie.hobbieName;
                favodto.tblHobbie = hobbieDTO;
                favodto.hobbieNum = hobbieDTO.hobbieNum;
                FavoriteContactsDTOs1.Add(favodto);


            }

            usertoret.tblFavoriteContacts = FavoriteContactsDTOs;
            usertoret.tblFavoriteContacts1 = FavoriteContactsDTOs1;

            List<tblPrefferedtimesDTO> preferredTimeDTOs = new List<tblPrefferedtimesDTO>();

            foreach (tblPreferredTime preff in checkifuser.tblPreferredTime)
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

            usertoret.tblprefferdDTO = preferredTimeDTOs;
            //usertoret.tblSuggestedMeetings = checkifuser.tblSuggestedMeetings;
            //usertoret.tblSuggestedMeetings1 = checkifuser.tblSuggestedMeetings1;
            //will be done through algorhitm

            List<UserhobbiesDTO> userhobbiesDTOs = new List<UserhobbiesDTO>();
            foreach (tblUserHobbie item in checkifuser.tblUserHobbie)
            {
                UserhobbiesDTO hobbieDTO = new UserhobbiesDTO();
                hobbieDTO.phoneNum1 = item.phoneNum1;
                hobbieDTO.hobbieNum = item.hobbieNum;
                hobbieDTO.rank = item.rank;
                tblHobbie ushob = _db.tblHobbie.Where(x => x.hobbieNum == item.hobbieNum).FirstOrDefault();
                hobbieDTO.hobbiename = ushob.hobbieName;
                hobbieDTO.hobbieimage = ushob.imageuri;
                userhobbiesDTOs.Add(hobbieDTO);
            }
            usertoret.tblUserHobbiesDTO = userhobbiesDTOs;

            List<tblPossibleDTO> possibleinvite = new List<tblPossibleDTO>();
            List<tblPossibleDTO> possibleinvited = new List<tblPossibleDTO>();

            foreach (PossibleFavoriteContact pos in checkifuser.PossibleFavoriteContact)
            {
                tblPossibleDTO posdto = new tblPossibleDTO();
                posdto.phonenuminvite = pos.phonenuminvite;
                posdto.phonenuminvited = pos.phonenuminvited;
                posdto.hobbieNum = pos.hobbieNum;
                posdto.id = pos.id;
                Usersummary user = new Usersummary();
                user.userName = pos.tblUser.userName;
                user.phoneNum1 = pos.tblUser.phoneNum1;
                user.birthDate = Convert.ToDateTime(pos.tblUser.birthDate);
                user.email = pos.tblUser.email;
                user.gender = pos.tblUser.gender;
                user.city = pos.tblUser.city;
                user.imageUri = pos.tblUser.imageUri;
                posdto.tblUser = user;
                Usersummary user1 = new Usersummary();
                user1.userName = pos.tblUser1.userName;
                user1.phoneNum1 = pos.tblUser1.phoneNum1;
                user1.birthDate = Convert.ToDateTime(pos.tblUser1.birthDate);
                user1.email = pos.tblUser1.email;
                user1.gender = pos.tblUser1.gender;
                user1.city = pos.tblUser1.city;
                user1.imageUri = pos.tblUser1.imageUri;
                posdto.tblUser1 = user1;
                tblhobbieDTO hobbiedto = new tblhobbieDTO();
                hobbiedto.hobbieName = pos.tblHobbie.hobbieName;
                hobbiedto.hobbieNum = pos.tblHobbie.hobbieNum;
                hobbiedto.imageuri = pos.tblHobbie.imageuri;
                posdto.tblHobbiedto = hobbiedto;


                possibleinvite.Add(posdto);
            }

            foreach (PossibleFavoriteContact posinvited in checkifuser.PossibleFavoriteContact1)
            {
                tblPossibleDTO posdoinviteddto = new tblPossibleDTO();
                posdoinviteddto.phonenuminvite = posinvited.phonenuminvite;
                posdoinviteddto.phonenuminvited = posinvited.phonenuminvited;
                posdoinviteddto.hobbieNum = posinvited.hobbieNum;
                Usersummary user = new Usersummary();
                user.userName = posinvited.tblUser.userName;
                user.phoneNum1 = posinvited.tblUser.phoneNum1;
                user.birthDate = Convert.ToDateTime(posinvited.tblUser.birthDate);
                user.gender = posinvited.tblUser.gender;
                user.city = posinvited.tblUser.city;
                user.imageUri = posinvited.tblUser.imageUri;
                posdoinviteddto.tblUser = user;
                Usersummary user1 = new Usersummary();
                user1.userName = posinvited.tblUser1.userName;
                user1.phoneNum1 = posinvited.tblUser1.phoneNum1;
                user.birthDate = Convert.ToDateTime(posinvited.tblUser1.birthDate);
                user1.gender = posinvited.tblUser1.gender;
                user1.city = posinvited.tblUser1.city;
                user1.imageUri = posinvited.tblUser1.imageUri;
                posdoinviteddto.tblUser1 = user1;
                tblhobbieDTO hobbiedto = new tblhobbieDTO();
                hobbiedto.hobbieName = posinvited.tblHobbie.hobbieName;
                hobbiedto.hobbieNum = posinvited.tblHobbie.hobbieNum;
                hobbiedto.imageuri = posinvited.tblHobbie.imageuri;
                posdoinviteddto.tblHobbiedto = hobbiedto;
                possibleinvited.Add(posdoinviteddto);
            }

            usertoret.possibleFavoriteContacts_invite_DTO = possibleinvite;
            usertoret.possibleFavoriteContacts_invited_DTO = possibleinvited;

            List<SuggestedDTO> suggestedbyuser= new List<SuggestedDTO>();
            List<SuggestedDTO> suggestedbyfriend= new List<SuggestedDTO>();
            foreach(tblSuggestedMeeting sugit in checkifuser.tblSuggestedMeeting1)
            {
                DateTime currentDate = new DateTime(sugit.date.Year, sugit.date.Month, sugit.date.Day);
                DateTime datetocheck = currentDate.AddHours(sugit.startTime.Hours);


                if (datetocheck >= DateTime.Now)
                {
                    SuggestedDTO suggested = new SuggestedDTO();
                    string placeid = _db.tblLoctation.Where(x => x.latitude == sugit.latitude && x.longitude == sugit.longitude).FirstOrDefault().Placeid;
                    
                    suggested.place.PlaceId = placeid;
                    suggested.phoneNum1= sugit.phoneNum1;
                    suggested.date= sugit.date;
                    suggested.phoneNum2= sugit.phoneNum2;
                    suggested.meetingNum= sugit.meetingNum;
                    suggested.startTime = sugit.startTime;
                    suggested.endTime = sugit.endTime;
                    suggested.rank = Convert.ToDouble(sugit.rank);
                    suggested.hobbieNum = int.Parse(sugit.hobbieNum.ToString());
                    suggested.longitude= sugit.longitude;
                    suggested.latitude= sugit.latitude;
                    suggested.status= sugit.status;
                    tblUser user1= _db.tblUser.Where(x => x.phoneNum1 == sugit.phoneNum1).FirstOrDefault();
                    tblUser user2= _db.tblUser.Where(x => x.phoneNum1 == sugit.phoneNum2).FirstOrDefault();
                    ExistsingUsers userexist= new ExistsingUsers();
                    ExistsingUsers userexist2= new ExistsingUsers();
                    userexist.userName = user1.userName;
                    userexist.phonenumbers.Add(user1.phoneNum1);
                    userexist.birthDate = Convert.ToDateTime(user1.birthDate);
                    userexist.imageUri = user1.imageUri;
                    userexist.email = user1.email;
                    userexist.gender = user1.gender;
                    userexist.city  =user1.city;
                    userexist2.userName = user2.userName;
                    userexist2.phonenumbers.Add(user2.phoneNum1);
                    userexist2.birthDate = Convert.ToDateTime(user2.birthDate);
                    userexist2.imageUri = user2.imageUri;
                    userexist2.email = user2.email;
                    userexist2.gender = user2.gender;
                    userexist2.city = user2.city;
                    suggested.user1 = userexist;
                    suggested.user2 = userexist2;


                    suggestedbyfriend.Add(suggested);
                }
                
            }

            foreach(tblSuggestedMeeting sugitm in checkifuser.tblSuggestedMeeting)
            {
                DateTime currentDate = new DateTime(sugitm.date.Year, sugitm.date.Month, sugitm.date.Day);
                DateTime datetocheck = currentDate.AddHours(sugitm.startTime.Hours);

                if (datetocheck >= DateTime.Now)
                {

                    SuggestedDTO suggested = new SuggestedDTO();
                    string placeid = _db.tblLoctation.Where(x => x.latitude == sugitm.latitude && x.longitude == sugitm.longitude).FirstOrDefault().Placeid;
                    suggested.place.PlaceId = placeid;
                    suggested.date= sugitm.date;
                    suggested.phoneNum1 = sugitm.phoneNum1;
                    suggested.phoneNum2 = sugitm.phoneNum2;
                    suggested.meetingNum = sugitm.meetingNum;
                    
                    suggested.startTime = sugitm.startTime;
                    suggested.endTime = sugitm.endTime;
                    suggested.rank = Convert.ToDouble(sugitm.rank);
                    suggested.hobbieNum = int.Parse(sugitm.hobbieNum.ToString());
                    suggested.longitude = sugitm.longitude;
                    suggested.latitude = sugitm.latitude;
                    suggested.status = sugitm.status;
                    tblUser user1 = _db.tblUser.Where(x => x.phoneNum1 == sugitm.phoneNum1).FirstOrDefault();
                    tblUser user2 = _db.tblUser.Where(x => x.phoneNum1 == sugitm.phoneNum2).FirstOrDefault();
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
                    suggestedbyuser.Add(suggested);
                }
                
            }

            usertoret.tblSuggestedMeetings = suggestedbyuser;
            usertoret.tblSuggestedMeetings1 = suggestedbyfriend;


            return usertoret;


            // יש פה צורך לעשות המרה של אובייקטי ה-DTO לאובייקטים רגילים ואז להחזיר
        }


 

        [HttpPost]
        [Route("api/Default/getexistingmembers")]
        public HttpResponseMessage Getexistingmembers(ExistsingUsers[] ExistingUsereser)
        {


            List<tblUser> listtblusers= _db.tblUser.ToList();
            List<ExistsingUsers> existsingUsers= new List<ExistsingUsers>();

            foreach(ExistsingUsers existuser in ExistingUsereser)
            {
                foreach(string phonenum in existuser.phonenumbers)
                {
                    string cleanedPhoneNumber = Utils.cleanphonenumber(phonenum);


                    tblUser usera = listtblusers.Where(x=> x.phoneNum1==cleanedPhoneNumber).FirstOrDefault();
                    ExistsingUsers ex= existsingUsers.Where(x=> x.phonenumbers.Contains(cleanedPhoneNumber)).FirstOrDefault();
                    if(usera!=null && ex==null)
                    {
                        ExistsingUsers Existinguser = new ExistsingUsers();
                        Existinguser.phonenumbers.Add(usera.phoneNum1);
                        Existinguser.userName = usera.userName;
                        Existinguser.birthDate = Convert.ToDateTime(usera.birthDate);
                        Existinguser.gender = usera.gender;
                        Existinguser.city = usera.city;
                        Existinguser.imageUri = usera.imageUri;
                        Existinguser.email = usera.email;
                        List<UserhobbiesDTO> listuserhobbiesdto = new List<UserhobbiesDTO>();

                        foreach (tblUserHobbie hob in usera.tblUserHobbie)
                        {
                            UserhobbiesDTO userhobdto = new UserhobbiesDTO();
                            userhobdto.hobbieNum = hob.hobbieNum;
                            userhobdto.phoneNum1 = hob.phoneNum1;
                            userhobdto.rank = hob.rank;
                            tblHobbie ushob= _db.tblHobbie.Where(x => x.hobbieNum == hob.hobbieNum).FirstOrDefault();
                            userhobdto.hobbiename = ushob.hobbieName;
                            userhobdto.hobbieimage = ushob.imageuri;
                            listuserhobbiesdto.Add(userhobdto);
                        }

                        Existinguser.tblUserHobbiesDTO= listuserhobbiesdto;
                        existsingUsers.Add(Existinguser);
                        break;

                    }

                }
            }

            if (existsingUsers.Count > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, existsingUsers);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, "No Users");
            }

         

        }

        [HttpPost]
        [Route("api/Default/Addimage")]
        public async Task<IHttpActionResult> UploadFile()
        {
            var httpRequest = HttpContext.Current.Request;
            string identi = httpRequest["identis"];
            tblUser myusertosave = _db.tblUser.Where(x => x.phoneNum1 == identi).FirstOrDefault();

            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                byte[] fileContents;
                using (var binaryReader = new BinaryReader(postedFile.InputStream))
                {
                    fileContents = binaryReader.ReadBytes(postedFile.ContentLength);
                }
                string remotefilepath = $"Images/Profiles/{identi}";
                string downloadurl = await UploadToGoogleCloudStorage(fileContents, postedFile.ContentType, remotefilepath);
                myusertosave.imageUri = downloadurl;
                _db.SaveChanges();

                UserDTO usertoret = GetUser(myusertosave);


                return Ok(usertoret);

            }
            else
            {
                return BadRequest();
            }

        }

        [HttpGet]
        [Route("api/Default/getallhobbies")]

        public HttpResponseMessage Getallhobbies()
        {
            try
            {
                List<tblHobbie> listhobbies = _db.tblHobbie.ToList();
                List<tblhobbieDTO> listhobbiesdto = new List<tblhobbieDTO>();
                foreach (tblHobbie item in listhobbies)
                {
                    tblhobbieDTO hobbiedto = new tblhobbieDTO();
                    hobbiedto.hobbieNum = item.hobbieNum;
                    hobbiedto.hobbieName = item.hobbieName;
                    if (item.imageuri != null)
                    {
                        hobbiedto.imageuri = item.imageuri;
                    }

                    listhobbiesdto.Add(hobbiedto);
                }
                return Request.CreateResponse(HttpStatusCode.OK, listhobbiesdto);
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);

            }
        }

        private async Task<string> UploadToGoogleCloudStorage(byte[] fileContents, string contentType, string remoteFilePath)
        {
            MemoryStream fileStream = new MemoryStream(fileContents);
            var uploadedObject = await _googleservices._storageClient.UploadObjectAsync(_googleservices._bucketName, remoteFilePath, contentType, fileStream,new UploadObjectOptions());
            fileStream.Dispose();

            var acl= uploadedObject.Acl ?? new List<ObjectAccessControl>();
            acl.Add(new ObjectAccessControl
            {
                Entity = "allUsers",
                Role = "READER"
            }
                );

            uploadedObject.Acl= acl;
            var updatedObject = await _googleservices._storageClient.UpdateObjectAsync(uploadedObject);

            var publicUrl = $"https://storage.googleapis.com/{_googleservices._bucketName}/{remoteFilePath}";
            return publicUrl;




        }


        public string GetImage(string Imageuri)
        {
            //May be not neccessary
            string imageData = null;
            using (var imageStream = new FileStream(Imageuri, FileMode.Open))
            {
                using (var memoryStream = new MemoryStream())
                {
                    imageStream.CopyTo(memoryStream);
                    byte[] imageBytes = memoryStream.ToArray();
                    imageData = Convert.ToBase64String(imageBytes);
                }
            }

            return imageData;

        }

        // POST: api/Default

        [HttpPost]
        [Route("api/Default/AddUser")]
        public string Post(UserDTO Mynewuser)
        {
            try
            {
                var checkifuserphone = _db.tblUser.Where(u => u.phoneNum1 == Mynewuser.phoneNum1).FirstOrDefault();
                var checkifusername= _db.tblUser.Where(u => u.userName == Mynewuser.userName).FirstOrDefault();
                if (checkifuserphone != null)
                {
                    return "Phone Number already exists";
                }

                else if (checkifusername != null)
                {
                    return "User name already exists";
                }
                

                else
                {
                    tblNewUser newuserif = _db.tblNewUser.Where(x => x.phoneNum1 == Mynewuser.phoneNum1).FirstOrDefault();
                    if (newuserif == null)
                    {
                        newuserif=new tblNewUser();
                        newuserif.phoneNum1=Mynewuser.phoneNum1;
                        newuserif.nickName = "NR";
                        
                        _db.tblNewUser.Add(newuserif);
                        _db.SaveChanges();
                    }
                    tblUser newuser = new tblUser();
                    newuser.phoneNum1 = newuserif.phoneNum1;
                    newuser.userName = Mynewuser.userName;
                    newuser.birthDate = Mynewuser.birthDate;
                    newuser.gender = Mynewuser.gender;
                    newuser.city = Mynewuser.city;
                    newuser.citylatt= Mynewuser.citylatt;
                    newuser.citylong = Mynewuser.citylong;
                    newuser.email = Mynewuser.email;
                    newuser.tblNewUser = newuserif;

                    List<tblUserHobbie> userhoobies = new List<tblUserHobbie>();
                    foreach (UserhobbiesDTO userhob in Mynewuser.tblUserHobbiesDTO)
                    {
                        tblUserHobbie newuserhobbie = new tblUserHobbie();
                        tblHobbie hobbie = _db.tblHobbie.Where(h => h.hobbieNum == userhob.hobbieNum).FirstOrDefault();
                        newuserhobbie.hobbieNum = userhob.hobbieNum;
                        newuserhobbie.phoneNum1 = Mynewuser.phoneNum1;
                        newuserhobbie.rank = userhob.rank;
                        newuserhobbie.tblUser = newuser;
                        newuserhobbie.tblHobbie = hobbie;
                        hobbie.tblUserHobbie.Add(newuserhobbie);
                        userhoobies.Add(newuserhobbie);
                        _db.tblUserHobbie.Add(newuserhobbie);


                    }
                    newuser.tblUserHobbie = userhoobies;
                    List<tblPreferredTime> userpreflist = new List<tblPreferredTime>();

                    //bring me the last row in the table tblprefeeredtimes
                    int lastrow = _db.tblPreferredTime.OrderByDescending(x => x.id).FirstOrDefault().id;
                    lastrow++;


                    foreach (tblPrefferedtimesDTO userpref in Mynewuser.tblprefferdDTO)
                    {
                        tblPreferredTime newuserpref = new tblPreferredTime();
                        newuserpref.startTime = userpref.startTime;
                        newuserpref.endTime = userpref.endTime;
                        newuserpref.weekDay = userpref.weekDay;
                        newuserpref.id = lastrow;
                        newuserpref.rank = userpref.rank;
                        newuserpref.phoneNum1 = Mynewuser.phoneNum1;
                        newuserpref.tblUser = newuser;
                        userpreflist.Add(newuserpref);
                        _db.tblPreferredTime.Add(newuserpref);
                    }
                    newuser.tblPreferredTime = userpreflist;
                    List<PossibleFavoriteContact> tblpossFavoriteContacts = new List<PossibleFavoriteContact>();
                    foreach (tblPossibleDTO favcontact in Mynewuser.possibleFavoriteContacts_invite_DTO)
                    {
                        PossibleFavoriteContact newpossfavcontact = new PossibleFavoriteContact();
                        tblUser user1 = newuser;
                        tblUser user2 = _db.tblUser.Where(x => x.phoneNum1 == favcontact.phonenuminvited).FirstOrDefault();
                        newpossfavcontact.phonenuminvite = favcontact.phonenuminvite;
                        newpossfavcontact.phonenuminvited = favcontact.phonenuminvited;
                        tblHobbie hobbie = _db.tblHobbie.Where(h => h.hobbieNum == favcontact.hobbieNum).FirstOrDefault();
                        newpossfavcontact.tblHobbie = hobbie;
                        newpossfavcontact.hobbieNum = newpossfavcontact.tblHobbie.hobbieNum;
                        hobbie.PossibleFavoriteContact.Add(newpossfavcontact);
                        tblpossFavoriteContacts.Add(newpossfavcontact);
                        user2.PossibleFavoriteContact1.Add(newpossfavcontact);
                        newpossfavcontact.tblUser = user1;
                        newpossfavcontact.tblUser1 = user2;
                        _db.PossibleFavoriteContact.Add(newpossfavcontact);
                        
                    }

                    newuser.PossibleFavoriteContact = tblpossFavoriteContacts;

                    foreach (tblInvitesDTO invite in Mynewuser.tblInvitesDTO)
                    {
                        tblInvite newinvite = new tblInvite();
                        newinvite.phoneNum1 = invite.phoneNum1;
                        newinvite.phoneNum2 = Utils.cleanphonenumber(invite.phoneNum2);
                        newinvite.date = DateTime.Now;
                        newinvite.status = invite.status;
                        tblUser user1invite = newuser;
                        tblNewUser user2invite = _db.tblNewUser.Where(x => x.phoneNum1 == newinvite.phoneNum2).FirstOrDefault();
                        if (user2invite == null)
                        {
                            user2invite = new tblNewUser();
                            user2invite.phoneNum1 = newinvite.phoneNum2;
                            user2invite.nickName = invite.Nickname;
                            _db.tblNewUser.Add(user2invite);


                        }
                        newinvite.tblUser = user1invite;
                        newinvite.tblNewUser = user2invite;
                        newuser.tblInvite.Add(newinvite);
                        user2invite.tblInvite.Add(newinvite);
                        _db.tblInvite.Add(newinvite);

                    }

                    _db.tblUser.Add(newuser);
                    _db.SaveChanges();
                    return "User added";

                }
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

                return "Error: " + ex.Message;
            }
        }
    
        // PUT: api/Default/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Default/5
        public void Delete(int id)
        {
        }


    }



}

