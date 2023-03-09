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

namespace WebApplication1.Controllers
{
    public class DefaultController : ApiController
    {
        igroup192_DbContext db= new igroup192_DbContext();


        // GET: api/Default


        [HttpPost]
        [Route("api/Default/Signin")]
        public HttpResponseMessage Signin([FromBody] JObject token)
        {
            //do stuff with google auth to authenticate
            //then check if the email exists. if it does, then return the user object
            //if the user exists return the user object
            try
            {
                var mytoken = token.GetValue("token").ToString();
                var validPayload = GoogleJsonWebSignature.ValidateAsync(mytoken).Result;
                var email = validPayload.Email;
                string emailconv = email.ToString();


                tblUser user = db.tblUsers.Where(u => u.email == emailconv).FirstOrDefault();
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
            catch(Exception ex)
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
            usertoret.gender = checkifuser.gender;
            usertoret.tblFavoriteContacts = checkifuser.tblFavoriteContacts;
            usertoret.tblFavoriteContacts1 = checkifuser.tblFavoriteContacts1;
            usertoret.tblInvites = checkifuser.tblInvites;
            usertoret.tblPreferredTimes = checkifuser.tblPreferredTimes;
            usertoret.tblSuggestedMeetings = checkifuser.tblSuggestedMeetings;
            usertoret.tblSuggestedMeetings1 = checkifuser.tblSuggestedMeetings1;
            usertoret.tblUserHobbies = checkifuser.tblUserHobbies;
            return usertoret;
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
            tblUser myusertosave= db.tblUsers.Where(x=> x.phoneNum1==identi).FirstOrDefault();

            if(httpRequest.Files.Count> 0)
            {
                var postedFile = httpRequest.Files[0];
                byte[] fileContents;
                using (var binaryReader = new BinaryReader(postedFile.InputStream))
                {
                    fileContents = binaryReader.ReadBytes(postedFile.ContentLength);
                }
                string filepath=SaveImage(fileContents,identi);
                myusertosave.imageUri= filepath;

                return Ok(myusertosave);

            }
            else
            {
                return BadRequest();
            }

        }

        // POST: api/Default


        [HttpPost]
        [Route("api/Default/AddUser")]
        public string Post(UserDTO Mynewuser)
        {
            tblUser checkifuser = db.tblUsers.Where(u => u.phoneNum1 == Mynewuser.phoneNum1).FirstOrDefault();
            if (checkifuser != null)
            {
                return "There is already a user";
            }
            else
            {
                tblUser newuser = new tblUser();
                newuser.phoneNum1 = Mynewuser.phoneNum1;
                newuser.userName = Mynewuser.userName;
                newuser.birthDate = Mynewuser.birthDate;
                newuser.gender = Mynewuser.gender;
                newuser.city = Mynewuser.city;
                newuser.email = Mynewuser.email;
                List<tblUserHobbie> userhoobies = new List<tblUserHobbie>();
                foreach (tblUserHobbie userhob in Mynewuser.tblUserHobbies)
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


                }
                newuser.tblUserHobbies = userhoobies;
                List<tblPreferredTime> userpreflist = new List<tblPreferredTime>();

                foreach (tblPreferredTime userpref in Mynewuser.tblPreferredTimes)
                {
                    tblPreferredTime newuserpref = new tblPreferredTime();
                    newuserpref.startTime = userpref.startTime;
                    newuserpref.endTime = userpref.endTime;
                    newuserpref.weekDay = userpref.weekDay;
                    newuserpref.rank = userpref.rank;
                    newuserpref.phoneNum1 = Mynewuser.phoneNum1;
                    newuserpref.tblUser = newuser;
                    userpreflist.Add(newuserpref);
                }
                newuser.tblPreferredTimes = userpreflist;
                List<tblFavoriteContact> tblFavoriteContacts = new List<tblFavoriteContact>();
                foreach (tblFavoriteContact favcontact in Mynewuser.tblFavoriteContacts)
                {
                    tblFavoriteContact newfavcontact = new tblFavoriteContact();
                    tblUser user1= db.tblUsers.Where(x=> x.phoneNum1==favcontact.phoneNum1).FirstOrDefault();
                    tblUser user2=db.tblUsers.Where(x=> x.phoneNum1==favcontact.phoneNum2).FirstOrDefault();
                    newfavcontact.phoneNum1 = Mynewuser.phoneNum1;
                    newfavcontact.phoneNum2 = favcontact.phoneNum2;
                    newfavcontact.tblUser = newuser;
                    newfavcontact.rank = favcontact.rank;
                    tblHobbie hobbie = db.tblHobbies.Where(h => h.hobbieNum == favcontact.hobbieNum).FirstOrDefault();
                    newfavcontact.tblHobbie = hobbie;
                    newfavcontact.tblUser= user1;
                    newfavcontact.tblUser1 = user2;
                    hobbie.tblFavoriteContacts.Add(newfavcontact);
                    tblFavoriteContacts.Add(newfavcontact);
                }
                newuser.tblFavoriteContacts = tblFavoriteContacts;
           
                SaveImage(Mynewuser.image, Mynewuser.phoneNum1);
                newuser.imageUri = "C:\\MyImages\\Users\\" + Mynewuser.phoneNum1 + ".png";

                db.tblUsers.Add(newuser);
                db.SaveChanges();
                return "User added";
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

