using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using ClassLibrary_SocialKeeper;
using Microsoft.Ajax.Utilities;
using System.Collections;
using System.Data.Entity.Core.Metadata.Edm;
using Google.Cloud.Firestore;
using System.Threading.Tasks;
using Google.Cloud.Firestore.V1;

namespace WebApplication1.Controllers
{
   
    public class MainAppController : ApiController
    {
        igroup192_DbContext db = new igroup192_DbContext();
        Googlecloudservices _googleservices= new Googlecloudservices();

        public MainAppController()
        {
            _googleservices = new Googlecloudservices();
        }
        


        // GET: api/MainApp
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/MainApp/5
        public string Get(int id)
        {
            return "value";
        }

        public async Task<List<Events>> createlistevents(string phonenumber)
        {
            try
            {
                CollectionReference collectionReference = _googleservices._firestoreDb.Collection(phonenumber);
                QuerySnapshot querySnapshot = await collectionReference.GetSnapshotAsync();
                List<Dictionary<string, object>> documents = new List<Dictionary<string, object>>();
                List<Events> events = new List<Events>();
                string weekday = "";
                TimeSpan starttime= TimeSpan.Zero;
                TimeSpan endtime= TimeSpan.Zero;
                foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
                {
                    documents.Add(documentSnapshot.ToDictionary());
                }

                foreach(var docit in documents)
                {

                    if (docit.TryGetValue("weekday", out object weekdayValue))
                    {
                         weekday = weekdayValue.ToString();
                        // Use the 'weekday' value
                    }

                    if(docit.TryGetValue("starttime",out object startimevalue))
                    {
                        starttime = TimeSpan.Parse(startimevalue.ToString());
                    }

                    if(docit.TryGetValue("endtime",out object endtimevalue)){

                        endtime= TimeSpan.Parse(endtimevalue.ToString());


                    }

                    Events eventoadd = new Events();
                    eventoadd.starttime = starttime;
                    eventoadd.endtime = endtime;
                    eventoadd.weekday = weekday;
                    events.Add(eventoadd);


                    
                }

             

                return events;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }



        }

        // POST: api/MainApp
        [HttpPost]
        [Route("api/MainApp/createmeetings")]
        public async Task<HttpResponseMessage> Createmeetings([FromBody] DataDTO datarec)
        {
            UserDTO userdto = new UserDTO();
            userdto.phoneNum1 = datarec.userdto;
            List<Events> userinviteeve = datarec.userinviteeve;
          
            int numbermeetings = 0;
            List<SuggestedDTO> suggestedmeet= new List<SuggestedDTO>();
            double prefferedtimerate = 0;
            double totalmeetingrank;


            try
            {
                tblUser usertomeeting= db.tblUsers.Where(x=> x.phoneNum1==userdto.phoneNum1).FirstOrDefault();
                List<RatingData> data = new List<RatingData>();
                for (int i = 1; i < 3; i++)
                {

                    for (int j = 1; j < db.tblHobbies.Count()+1; j++)
                    {
                        RatingData rating = new RatingData();
                        rating.UserId = i;
                        rating.HobbieNum = j;
                        rating.Label = 1;
                        data.Add(rating);
                    }

                }


                if (usertomeeting.tblFavoriteContacts.Count > 0 || usertomeeting.tblFavoriteContacts1.Count > 0)
                {

                    foreach(tblUserHobbie hobitem in usertomeeting.tblUserHobbies)
                    {
                        RatingData rtdata = data.Where(x => x.HobbieNum == hobitem.hobbieNum && x.UserId==1).FirstOrDefault();
                        rtdata.Label = int.Parse(hobitem.rank);
                        
                    }
                  

                    foreach (tblFavoriteContact item in usertomeeting.tblFavoriteContacts)
                    {
                        RatingData ratemax= new RatingData();
                        ratemax.HobbieNum = 0;
                        ratemax.Label = 0;
                        Dictionary<int,int> hobbiesmult= new Dictionary<int, int>();
                         numbermeetings = 0;
                        List<Events> userinvitedeve = await createlistevents(item.tblUser1.phoneNum1);



                        foreach (RatingData rating in data)
                        {
                            if (rating.UserId == 2)
                            {
                                rating.Label = 1;
                            }
                        }
                        
                            foreach(tblUserHobbie itehobbie in item.tblUser1.tblUserHobbies)
                            {
                                RatingData rtdata = data.Where(x => x.HobbieNum == itehobbie.hobbieNum && x.UserId == 2).FirstOrDefault();
                                rtdata.Label = int.Parse(itehobbie.rank);
                            }

                            for(int i=1; i<=db.tblHobbies.Count(); i++)
                           {
                            int user1itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 1).FirstOrDefault().Label;
                            int user2itemlab= data.Where(x => x.HobbieNum == i && x.UserId == 2).FirstOrDefault().Label;

                            int multiplynumber = user1itemlab * user2itemlab;
                            if (multiplynumber > ratemax.Label)
                            {
                                ratemax.HobbieNum = i;
                                ratemax.Label = multiplynumber;

                            }

                        }

                         

                        while(numbermeetings<3)
                        {

                            List<tblPreferredTime> usertblpref = usertomeeting.tblPreferredTimes.ToList();
                            List<tblPreferredTime> user1tblpref= item.tblUser1.tblPreferredTimes.ToList();
                            List<Events> commontimeperiods2= new List<Events>();
                            

                            foreach(tblPreferredTime t in usertblpref)
                            {

                                foreach(tblPreferredTime tm in user1tblpref)
                                {
                                    if (t.weekDay == tm.weekDay)
                                    {
                                        Tuple<TimeSpan, TimeSpan> newtup = Meetings.FindCommonTimePeriod(t.startTime, t.endTime, tm.startTime, tm.endTime);

                                        if (newtup != null)
                                        {
                                            Events eventadd= new Events();
                                            eventadd.starttime=newtup.Item1;
                                            eventadd.endtime=newtup.Item2;
                                            eventadd.weekday=tm.weekDay;
                                            commontimeperiods2.Add(eventadd);
                                        }
                                    }
                                }
                            }                      
                                foreach(Events comtime in commontimeperiods2)
                                {
                                if (numbermeetings == 3)
                                {
                                    break;
                                }
                                DateTime thedate = Meetings.GetDateForWeekday(comtime.weekday);
                                    List<Events> userinviteevefixed= new List<Events> ();
                                List<Events> userinvitedfixed = new List<Events>();
                                    foreach(Events eve in userinviteeve)
                                    {
                                        if (eve.weekday == comtime.weekday)
                                        {
                                            userinviteevefixed.Add(eve);
                                        }
                                    }
                                    foreach(Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == comtime.weekday)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }

                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(comtime.starttime, comtime.endtime), userinviteevefixed, userinvitedfixed);
                                 foreach(var lismatchitems in listmatch)
                                {
                                    prefferedtimerate = 1;
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }
                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    sugdto.date = thedate;
                                    sugdto.startTime= lismatchitems.Item1;
                                    sugdto.endTime=lismatchitems.Item2;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (ratemax.Label - 1) / (25 - 1);
                                    double normalizeuserrank = (int.Parse(item.rank) - 1) / (5 - 1);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;
                                    
                                  
                                }

                                }
                                foreach(tblPreferredTime prefit in usertomeeting.tblPreferredTimes)
                                {
                                DateTime thedate = Meetings.GetDateForWeekday(prefit.weekDay);
                                TimeSpan starttime = prefit.startTime;
                                TimeSpan endtime = prefit.endTime;
                               
                               
                                List<Events> userinviteevefixed = new List<Events>();
                                List<Events> userinvitedfixed = new List<Events>();
                                foreach (Events eve in userinviteeve)
                                {
                                    if (eve.weekday == prefit.weekDay)
                                    {
                                        userinviteevefixed.Add(eve);
                                    }
                                }
                                foreach (Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == prefit.weekDay)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }
                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(prefit.startTime, prefit.endTime), userinviteevefixed, userinvitedfixed);
                                foreach (var lismatchitems in listmatch)
                                {
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }
                                    prefferedtimerate = 0.5;
                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    sugdto.date = thedate;
                                    sugdto.startTime = lismatchitems.Item1;
                                    sugdto.endTime = lismatchitems.Item2;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (double.Parse(ratemax.Label.ToString()) - 1.0) / (25.0 - 1.0);
                                    double normalizeuserrank = (double.Parse(item.rank.ToString()) - 1.0) / (5.0 - 1.0);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;                                    
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;
                                    break;

                                }




                            }

                            DateTime dateto= DateTime.Now;
                            dateto = dateto.AddHours(5);

                            while (numbermeetings < 3)
                            {
                                TimeSpan limitedhourtimespan = new TimeSpan(22, 0, 0);
                                double limitedhour = limitedhourtimespan.Hours;


                                List<Events> userinviteevefixed = new List<Events>();
                                List<Events> userinvitedfixed = new List<Events>();
                                int starth = dateto.Hour;
                                DateTime endtime = dateto.AddHours(3);
                                int endth = endtime.Hour;
                                TimeSpan startimespan = TimeSpan.FromHours(starth);
                                TimeSpan endtimespan = TimeSpan.FromHours(endth);

                                int currentDayOfWeekint = (int)dateto.DayOfWeek;
                                string currentDayOfWeek = currentDayOfWeekint.ToString();
                                foreach (Events eve in userinviteeve)
                                {
                                    if (eve.weekday == currentDayOfWeek)
                                    {
                                        userinviteevefixed.Add(eve);
                                    }
                                }
                                foreach (Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == currentDayOfWeek)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }
                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(startimespan, endtimespan), userinviteevefixed, userinvitedfixed);
                                foreach (var lismatchitems in listmatch)
                                {
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }

                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    prefferedtimerate = 0;
                                    sugdto.date = dateto;
                                    sugdto.startTime = startimespan;
                                    sugdto.endTime = endtimespan;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (ratemax.Label - 1) / (25 - 1);
                                    double normalizeuserrank = (int.Parse(item.rank) - 1) / (5 - 1);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;
                                    break;

                                }

                                dateto = dateto.AddHours(2);
                                double currenthour = dateto.Hour;
                                if(currenthour> limitedhour){

                                    dateto = dateto.AddHours(10);

                                }
                            }




                        }
                       
                    } //here

                    foreach (tblFavoriteContact item in usertomeeting.tblFavoriteContacts1)
                    {
                        RatingData ratemax = new RatingData();
                        ratemax.HobbieNum = 0;
                        ratemax.Label = 0;
                        Dictionary<int, int> hobbiesmult = new Dictionary<int, int>();
                        numbermeetings = 0;
                        List<Events> userinvitedeve = await createlistevents(item.tblUser1.phoneNum1);



                        foreach (RatingData rating in data)
                        {
                            if (rating.UserId == 2)
                            {
                                rating.Label = 1;
                            }
                        }

                        foreach (tblUserHobbie itehobbie in item.tblUser.tblUserHobbies)
                        {
                            RatingData rtdata = data.Where(x => x.HobbieNum == itehobbie.hobbieNum && x.UserId == 2).FirstOrDefault();
                            rtdata.Label = int.Parse(itehobbie.rank);
                        }

                        for (int i = 1; i <= db.tblHobbies.Count(); i++)
                        {
                            int user1itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 1).FirstOrDefault().Label;
                            int user2itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 2).FirstOrDefault().Label;

                            int multiplynumber = user1itemlab * user2itemlab;
                            if (multiplynumber > ratemax.Label)
                            {
                                ratemax.HobbieNum = i;
                                ratemax.Label = multiplynumber;

                            }

                        }



                        while (numbermeetings < 3)
                        {

                            List<tblPreferredTime> usertblpref = usertomeeting.tblPreferredTimes.ToList();
                            List<tblPreferredTime> user1tblpref = item.tblUser1.tblPreferredTimes.ToList();
                            List<Events> commontimeperiods2 = new List<Events>();


                            foreach (tblPreferredTime t in usertblpref)
                            {

                                foreach (tblPreferredTime tm in user1tblpref)
                                {
                                    if (t.weekDay == tm.weekDay)
                                    {
                                        Tuple<TimeSpan, TimeSpan> newtup = Meetings.FindCommonTimePeriod(t.startTime, t.endTime, tm.startTime, tm.endTime);

                                        if (newtup != null)
                                        {
                                            Events eventadd = new Events();
                                            eventadd.starttime = newtup.Item1;
                                            eventadd.endtime = newtup.Item2;
                                            eventadd.weekday = tm.weekDay;
                                            commontimeperiods2.Add(eventadd);
                                            break;
                                        }
                                    }
                                }
                            }


                            foreach (Events comtime in commontimeperiods2)
                            {
                                if (numbermeetings == 3)
                                {
                                    break;
                                }
                                DateTime thedate = Meetings.GetDateForWeekday(comtime.weekday);
                                List<Events> userinviteevefixed = new List<Events>();
                                List<Events> userinvitedfixed = new List<Events>();
                                foreach (Events eve in userinviteeve)
                                {
                                    if (eve.weekday == comtime.weekday)
                                    {
                                        userinviteevefixed.Add(eve);
                                    }
                                }
                                foreach (Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == comtime.weekday)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }

                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(comtime.starttime, comtime.endtime), userinviteevefixed, userinvitedfixed);
                                foreach (var lismatchitems in listmatch)
                                {
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }

                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    prefferedtimerate = 1;
                                    sugdto.date = thedate;
                                    sugdto.startTime = lismatchitems.Item1;
                                    sugdto.endTime = lismatchitems.Item2;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (ratemax.Label - 1) / (25 - 1);
                                    double normalizeuserrank = (int.Parse(item.rank) - 1) / (5 - 1);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;


                                }

                            }
                            foreach (tblPreferredTime prefit in usertomeeting.tblPreferredTimes)
                            {
                                DateTime thedate = Meetings.GetDateForWeekday(prefit.weekDay);
                                TimeSpan starttime = prefit.startTime;
                                TimeSpan endtime = prefit.endTime;
                                List<Events> userinviteevefixed = new List<Events>();
                                List<Events> userinvitedfixed = new List<Events>();
                                foreach (Events eve in userinviteeve)
                                {
                                    if (eve.weekday == prefit.weekDay)
                                    {
                                        userinviteevefixed.Add(eve);
                                    }
                                }
                                foreach (Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == prefit.weekDay)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }
                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(prefit.startTime, prefit.endTime), userinviteevefixed, userinvitedfixed);
                                foreach (var lismatchitems in listmatch)
                                {
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }

                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    sugdto.date = thedate;
                                    sugdto.startTime = lismatchitems.Item1;
                                    sugdto.endTime = lismatchitems.Item2;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (ratemax.Label - 1) / (25 - 1);
                                    double normalizeuserrank = (int.Parse(item.rank) - 1) / (5 - 1);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;
                                    break;

                                }




                            }

                            DateTime dateto = DateTime.Now;
                            dateto = dateto.AddHours(5);

                            while (numbermeetings < 3)
                            {
                                TimeSpan limitedhourtimespan = new TimeSpan(22, 0, 0);
                                double limitedhour = limitedhourtimespan.Hours;
                                List<Events> userinviteevefixed = new List<Events>();
                                List<Events> userinvitedfixed = new List<Events>();
                                int starth = dateto.Hour;
                                DateTime endtime = dateto.AddHours(3);
                                int endth = endtime.Hour;
                                TimeSpan startimespan = TimeSpan.FromHours(starth);
                                TimeSpan endtimespan = TimeSpan.FromHours(endth);

                                int currentDayOfWeekint = (int)dateto.DayOfWeek;
                                string currentDayOfWeek = currentDayOfWeekint.ToString();
                                foreach (Events eve in userinviteeve)
                                {
                                    if (eve.weekday == currentDayOfWeek)
                                    {
                                        userinviteevefixed.Add(eve);
                                    }
                                }
                                foreach (Events eve2 in userinvitedeve)
                                {
                                    if (eve2.weekday == currentDayOfWeek)
                                    {
                                        userinvitedfixed.Add(eve2);
                                    }
                                }
                                List<Tuple<TimeSpan, TimeSpan>> listmatch = Meetings.Findifcollapse(new Tuple<TimeSpan, TimeSpan>(startimespan, endtimespan), userinviteevefixed, userinvitedfixed);
                                foreach (var lismatchitems in listmatch)
                                {
                                    if (numbermeetings == 3)
                                    {
                                        break;
                                    }

                                    SuggestedDTO sugdto = new SuggestedDTO();
                                    sugdto.date = dateto;
                                    prefferedtimerate = 0;
                                    sugdto.startTime = startimespan;
                                    sugdto.endTime = endtimespan;
                                    sugdto.phoneNum1 = usertomeeting.phoneNum1;
                                    sugdto.phoneNum2 = item.phoneNum2;
                                    sugdto.hobbieNum = ratemax.HobbieNum;
                                    double normalizehobbierank = (ratemax.Label - 1) / (25 - 1);
                                    double normalizeuserrank = (int.Parse(item.rank) - 1) / (5 - 1);
                                    totalmeetingrank = Meetings.calculatemeetingscore(normalizehobbierank, prefferedtimerate, normalizeuserrank);
                                    sugdto.rank = totalmeetingrank;
                                    //need to add hobbienum to tblsuggestedmeeting
                                    // need to normalize it and calculate score
                                    //if score is under some limit its not added at all.
                                    suggestedmeet.Add(sugdto);
                                    numbermeetings++;
                                    break;

                                }

                                dateto = dateto.AddHours(2);
                                double currenthour = dateto.Hour;
                                if (currenthour > limitedhour)
                                {

                                    dateto = dateto.AddHours(10);

                                }
                            }





                        }

                    }
                    
                    List<SuggestedDTO> suggestedsorted= suggestedmeet.OrderBy(x=> x.rank).ToList();

                    //here it will take the best 5 suggested meetings, get the places
                    //with google places api, add all the suggested meetings to 
                    // database and send them back with all the reelvant information

                    return Request.CreateResponse(HttpStatusCode.OK);


                }
                else
                {

                    return Request.CreateResponse(HttpStatusCode.OK,"no favorite contacts");

                }


            }

            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex);
            }


        }

        // PUT: api/MainApp/5
        [HttpPut]
        [Route("api/MainApp/Updfriendrequest")]
        public HttpResponseMessage Updfriendrequest( [FromBody]RequestResponse item)
        {
            try
            {
                if (item.isAccepted)
                {
                    PossibleFavoriteContact posfavoritereq = db.PossibleFavoriteContacts.Where(x => x.id == item.requestid).FirstOrDefault();
                    tblUser userinvite= db.tblUsers.Where(x=> x.phoneNum1==posfavoritereq.phonenuminvite).FirstOrDefault();
                    tblUser userinvited= db.tblUsers.Where(x=> x.phoneNum1==posfavoritereq.phonenuminvited).FirstOrDefault();
                    tblFavoriteContact favoritecont= new tblFavoriteContact();
                    favoritecont.phoneNum1 = posfavoritereq.phonenuminvite;
                    favoritecont.phoneNum2=posfavoritereq.phonenuminvited;
                    favoritecont.hobbieNum = posfavoritereq.hobbieNum;
                    favoritecont.tblHobbie = posfavoritereq.tblHobbie;
                    favoritecont.tblUser = posfavoritereq.tblUser;
                    favoritecont.tblUser1 = posfavoritereq.tblUser1;
                    favoritecont.rank = "1";
                    userinvite.tblFavoriteContacts.Add(favoritecont);
                    userinvited.tblFavoriteContacts1.Add(favoritecont);
                    db.tblFavoriteContacts.Add(favoritecont);
                    userinvite.PossibleFavoriteContacts.Remove(posfavoritereq);
                    userinvited.PossibleFavoriteContacts1.Remove(posfavoritereq);
                    db.PossibleFavoriteContacts.Remove(posfavoritereq);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);



                }
                else
                {
                    PossibleFavoriteContact posfavoritereq = db.PossibleFavoriteContacts.Where(x => x.id == item.requestid).FirstOrDefault();
                    tblUser userinvite = db.tblUsers.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvite).FirstOrDefault();
                    tblUser userinvited = db.tblUsers.Where(x => x.phoneNum1 == posfavoritereq.phonenuminvited).FirstOrDefault();
                    userinvite.PossibleFavoriteContacts.Remove(posfavoritereq);
                    userinvited.PossibleFavoriteContacts1.Remove(posfavoritereq);
                    db.PossibleFavoriteContacts.Remove(posfavoritereq);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);


                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Request.CreateResponse(HttpStatusCode.InternalServerError,ex.Message);
            }
        }

        // DELETE: api/MainApp/5
        public void Delete(int id)
        {
        }
    }
}
