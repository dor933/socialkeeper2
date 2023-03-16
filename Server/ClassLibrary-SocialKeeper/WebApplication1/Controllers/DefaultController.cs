using ClassLibrary_SocialKeeper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Google.Apis.Auth;
using Newtonsoft.Json.Linq;
using System.Web;
using System.Data.Entity.Validation;
using System.Web.UI.WebControls;

namespace WebApplication1.Controllers
{
    public class DefaultController : ApiController
    {
        igroup192_DbContext db = new igroup192_DbContext();


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



                var user = db.tblUsers.Where(u => u.email == email).FirstOrDefault();
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
            usertoret.image = GetImage(checkifuser.imageUri);
            usertoret.birthDate = Convert.ToDateTime(checkifuser.birthDate);
            usertoret.email = checkifuser.email;
            usertoret.city = checkifuser.city;
            usertoret.gender = checkifuser.gender;

            List<FavoriteContactsDTO> FavoriteContactsDTOs = new List<FavoriteContactsDTO>();

            foreach (tblFavoriteContact favo in checkifuser.tblFavoriteContacts)
            {

                FavoriteContactsDTO favodto = new FavoriteContactsDTO();
                favodto.phoneNum1 = favo.phoneNum1;
                favodto.phoneNum2 = favo.phoneNum2;
                favodto.hobbieNum = favo.hobbieNum;
                UserDTO user1dto = new UserDTO();
                user1dto.phoneNum1 = favo.tblUser1.phoneNum1;
                user1dto.userName = favo.tblUser1.userName;
                user1dto.birthDate = Convert.ToDateTime(favo.tblUser1.birthDate);
                user1dto.city = favo.tblUser1.city;
                user1dto.gender = favo.tblUser1.gender;
                user1dto.email = favo.tblUser1.email;
                user1dto.image = GetImage(favo.tblUser1.imageUri);
                favodto.tblUser1 = user1dto;
                tblhobbieDTO hobbieDTO = new tblhobbieDTO();
                hobbieDTO.hobbieNum = favo.tblHobbie.hobbieNum;
                hobbieDTO.hobbieName = favo.tblHobbie.hobbieName;
                favodto.tblHobbie = hobbieDTO;
                favodto.hobbieNum = hobbieDTO.hobbieNum;
                FavoriteContactsDTOs.Add(favodto);


            }
            List<FavoriteContactsDTO> FavoriteContactsDTOs1 = new List<FavoriteContactsDTO>();

            foreach (tblFavoriteContact favo in checkifuser.tblFavoriteContacts1)
            {

                FavoriteContactsDTO favodto = new FavoriteContactsDTO();
                favodto.phoneNum1 = favo.phoneNum1;
                favodto.phoneNum2 = favo.phoneNum2;
                favodto.hobbieNum = favo.hobbieNum;
                UserDTO user1dto = new UserDTO();
                user1dto.phoneNum1 = favo.tblUser1.phoneNum1;
                user1dto.userName = favo.tblUser1.userName;
                user1dto.birthDate = Convert.ToDateTime(favo.tblUser1.birthDate);
                user1dto.city = favo.tblUser1.city;
                user1dto.gender = favo.tblUser1.gender;
                user1dto.email = favo.tblUser1.email;
                user1dto.image = GetImage(favodto.tblUser1.imageUri);
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

            foreach (tblPreferredTime preff in checkifuser.tblPreferredTimes)
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
            foreach (tblUserHobbie item in checkifuser.tblUserHobbies)
            {
                UserhobbiesDTO hobbieDTO = new UserhobbiesDTO();
                hobbieDTO.phoneNum1 = item.phoneNum1;
                hobbieDTO.hobbieNum = item.hobbieNum;
                hobbieDTO.rank = item.rank;
                userhobbiesDTOs.Add(hobbieDTO);
            }
            usertoret.tblUserHobbiesDTO = userhobbiesDTOs;

            return usertoret;

            // יש פה צורך לעשות המרה של אובייקטי ה-DTO לאובייקטים רגילים ואז להחזיר
        }


        [HttpPost]
        [Route("api/Default/Addsuggestedmeeting")]
        public HttpResponseMessage Addsugmeeting(SuggestedDTO suggestdto)
        {

            // Will generate a number of suggested meetings and insert them to a list.
            // Will create suggested hobbies also. will happen due to chosen parameters that will fit
            // to the user 
            // Here it will create a suggested hoobie for the meeting
            List<SuggestedDTO> newsugmeetinglist = new List<SuggestedDTO>();
            return Request.CreateResponse(HttpStatusCode.OK, newsugmeetinglist);



        }

        [HttpPost]
        [Route("api/Default/Addimage")]
        public IHttpActionResult UploadFile()
        {
            var httpRequest = HttpContext.Current.Request;
            string identi = httpRequest["identis"];
            tblUser myusertosave = db.tblUsers.Where(x => x.phoneNum1 == identi).FirstOrDefault();

            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                byte[] fileContents;
                using (var binaryReader = new BinaryReader(postedFile.InputStream))
                {
                    fileContents = binaryReader.ReadBytes(postedFile.ContentLength);
                }
                string filepath = SaveImage(fileContents, identi);
                myusertosave.imageUri = filepath;

                return Ok(myusertosave);

            }
            else
            {
                return BadRequest();
            }

        }

        public string GetImage(string Imageuri)
        {
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
                tblUser checkifuser = db.tblUsers.Where(u => u.phoneNum1 == Mynewuser.phoneNum1).FirstOrDefault();
                if (checkifuser != null)
                {
                    return "There is already a user";
                }
                else
                {
                    tblNewUser newuserif = db.tblNewUsers.Where(x => x.phoneNum1 == Mynewuser.phoneNum1).FirstOrDefault();
                    if (newuserif == null)
                    {
                        newuserif=new tblNewUser();
                        newuserif.phoneNum1=Mynewuser.phoneNum1;
                        newuserif.nickName = "NR";
                        db.tblNewUsers.Add(newuserif);
                        db.SaveChanges();
                    }
                    tblUser newuser = new tblUser();
                    newuser.phoneNum1 = newuserif.phoneNum1;
                    newuser.userName = Mynewuser.userName;
                    newuser.birthDate = Mynewuser.birthDate;
                    newuser.gender = Mynewuser.gender;
                    newuser.city = Mynewuser.city;
                    newuser.email = Mynewuser.email;
                    newuser.tblNewUser = newuserif;

                    List<tblUserHobbie> userhoobies = new List<tblUserHobbie>();
                    foreach (UserhobbiesDTO userhob in Mynewuser.tblUserHobbiesDTO)
                    {
                        tblUserHobbie newuserhobbie = new tblUserHobbie();
                        tblHobbie hobbie = db.tblHobbies.Where(h => h.hobbieNum == userhob.hobbieNum).FirstOrDefault();
                        newuserhobbie.hobbieNum = userhob.hobbieNum;
                        newuserhobbie.phoneNum1 = Mynewuser.phoneNum1;
                        newuserhobbie.rank = userhob.rank;
                        newuserhobbie.tblUser = newuser;
                        newuserhobbie.tblHobbie = hobbie;
                        hobbie.tblUserHobbies.Add(newuserhobbie);
                        userhoobies.Add(newuserhobbie);
                        db.tblUserHobbies.Add(newuserhobbie);


                    }
                    newuser.tblUserHobbies = userhoobies;
                    List<tblPreferredTime> userpreflist = new List<tblPreferredTime>();

                    //bring me the last row in the table tblprefeeredtimes


                    tblPreferredTime lastidprefferedtime = db.tblPreferredTimes.OrderByDescending(t => t.id).FirstOrDefault();
                    int lastidpreffered;
                    if (lastidprefferedtime == null)
                    {
                        
                        lastidpreffered= 0;
                    }
                    else
                    {
                        lastidpreffered = lastidprefferedtime.id++;
                    }


                    foreach (tblPrefferedtimesDTO userpref in Mynewuser.tblprefferdDTO)
                    {
                        tblPreferredTime newuserpref = new tblPreferredTime();
                        newuserpref.startTime = userpref.startTime;
                        newuserpref.endTime = userpref.endTime;
                        newuserpref.weekDay = userpref.weekDay;
                        newuserpref.id = lastidpreffered;
                        newuserpref.rank = userpref.rank;
                        newuserpref.phoneNum1 = Mynewuser.phoneNum1;
                        newuserpref.tblUser = newuser;
                        userpreflist.Add(newuserpref);
                        db.tblPreferredTimes.Add(newuserpref);
                        lastidpreffered++;
                    }
                    newuser.tblPreferredTimes = userpreflist;
                    List<PossibleFavoriteContact> tblpossFavoriteContacts = new List<PossibleFavoriteContact>();
                    foreach (tblPossibleDTO favcontact in Mynewuser.possibleFavoriteContacts_invite_DTO)
                    {
                        PossibleFavoriteContact newpossfavcontact = new PossibleFavoriteContact();
                        tblUser user1 = newuser;
                        tblUser user2 = db.tblUsers.Where(x => x.phoneNum1 == favcontact.phonenuminvited).FirstOrDefault();
                        newpossfavcontact.phonenuminvite = favcontact.phonenuminvite;
                        newpossfavcontact.phonenuminvited = favcontact.phonenuminvited;
                        tblHobbie hobbie = db.tblHobbies.Where(h => h.hobbieNum == favcontact.hobbieNum).FirstOrDefault();
                        newpossfavcontact.tblHobbie = hobbie;
                        newpossfavcontact.hobbieNum = newpossfavcontact.tblHobbie.hobbieNum;
                        hobbie.PossibleFavoriteContacts.Add(newpossfavcontact);
                        tblpossFavoriteContacts.Add(newpossfavcontact);
                        user2.PossibleFavoriteContacts1.Add(newpossfavcontact);
                        db.PossibleFavoriteContacts.Add(newpossfavcontact);
                    }

                    newuser.PossibleFavoriteContacts = tblpossFavoriteContacts;

                    foreach (tblInvitesDTO invite in Mynewuser.tblInvitesDTO)
                    {
                        tblInvite newinvite = new tblInvite();
                        newinvite.phoneNum1 = invite.phoneNum1;
                        newinvite.phoneNum2 = invite.phoneNum2;
                        newinvite.date = DateTime.Now;
                        newinvite.status = invite.status;
                        tblUser user1invite = newuser;
                        tblNewUser user2invite = db.tblNewUsers.Where(x => x.phoneNum1 == invite.phoneNum2).FirstOrDefault();
                        if (user2invite == null)
                        {
                            user2invite = new tblNewUser();
                            user2invite.phoneNum1 = invite.phoneNum2;
                            user2invite.nickName = invite.Nickname;

                        }
                        newinvite.tblUser = user1invite;
                        newinvite.tblNewUser = user2invite;
                        newuser.tblInvites.Add(newinvite);
                        user2invite.tblInvites.Add(newinvite);
                        db.tblInvites.Add(newinvite);
                        db.tblNewUsers.Add(user2invite); //  here

                    }

                    db.tblUsers.Add(newuser);
                    db.SaveChanges();
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
        public string SaveImage(byte[] imageData, string identifier)
        {
            try
            {
                // Specify the file path where you want to save the image
                string filePath = "C:\\MyImages\\Users\\" + identifier + ".png";

                // Create a file stream and write the image data to it
                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    stream.Write(imageData, 0, imageData.Length);
                }

                // Return a success response
                return filePath;
            }
            catch (Exception ex)
            {
                // Return an error response
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

