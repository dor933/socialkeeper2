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
using System.Runtime.InteropServices;
using System.Data;

namespace WebApplication1.Controllers
{
   
    public class MainAppController : ApiController
    {
        igroup192_prodEntities _db;
        Googlecloudservices _googleservices;

        public MainAppController()
        {
            _googleservices = Creategooglecloudservice.Googlecloudservices();
            _db = dbcontext._db;
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
                List<Events> events = new List<Events>();
                CollectionReference collectionReference = _googleservices._firestoreDb.Collection(phonenumber);
                QuerySnapshot querySnapshot = await collectionReference.GetSnapshotAsync();
                if (querySnapshot.Count > 0)
                {
                    List<Dictionary<string, object>> documents = new List<Dictionary<string, object>>();
                    DateTime today= DateTime.Now;
                    today=new DateTime(today.Year, today.Month, today.Day);
                    string weekday = "";
                    TimeSpan starttime = TimeSpan.Zero;
                    TimeSpan endtime = TimeSpan.Zero;
                    foreach (DocumentSnapshot documentSnapshot in querySnapshot.Documents)
                    {
                        documents.Add(documentSnapshot.ToDictionary());
                    }

                    foreach (var docit in documents)
                    {
                        if(docit.TryGetValue("date",out object date))
                        {
                            Timestamp timestamp = (Timestamp)date;
                            
                            DateTime dateevent = timestamp.ToDateTime();

                            if (dateevent < today)
                         {
                            continue;
                         }
                            
                        }

                        if (docit.TryGetValue("weekday", out object weekdayValue))
                        {
                            weekday = weekdayValue.ToString();
                            // Use the 'weekday' value
                        }

                        if (docit.TryGetValue("starttime", out object startimevalue))
                        {
                            starttime = TimeSpan.Parse(startimevalue.ToString());
                        }

                        if (docit.TryGetValue("endtime", out object endtimevalue))
                        {

                            endtime = TimeSpan.Parse(endtimevalue.ToString());


                        }

                        Events eventoadd = new Events();
                        eventoadd.starttime = starttime;
                        eventoadd.endtime = endtime;
                        eventoadd.weekday = weekday;
                        events.Add(eventoadd);



                    }



                    return events;
                }
                else
                {
                    return events;
                }
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
            List<RatingData> ratedhobbies = new List<RatingData>();
            List<SuggestedDTO> existingsugmeetings = datarec.existingsuggested;

            int numbermeetings = 0;
            int totalmeetingsnumber = datarec.numberofmeetings;
            List<SuggestedDTO> suggestedmeet= new List<SuggestedDTO>();
            double totalmeetingrank;
            bool existingperiod = false;
            int meetingnumber = _db.tblSuggestedMeeting.OrderByDescending(x => x.meetingNum).FirstOrDefault().meetingNum + 1;


            try
            {
                tblUser usertomeeting= _db.tblUser.Where(x=> x.phoneNum1==userdto.phoneNum1).FirstOrDefault();
                ExistsingUsers usertomeetingexist = new ExistsingUsers();
                usertomeetingexist.phonenumbers.Add(usertomeeting.phoneNum1);
                usertomeetingexist.birthDate = Convert.ToDateTime(usertomeeting.birthDate);
                usertomeetingexist.city= usertomeeting.city;
                usertomeetingexist.email=usertomeeting.email;
                usertomeetingexist.userName=usertomeeting.userName;
                usertomeetingexist.imageUri=usertomeeting.imageUri;
                usertomeetingexist.gender= usertomeeting.gender;
                usertomeetingexist.citylatt = Convert.ToDouble(usertomeeting.citylatt);
                usertomeetingexist.citylong = Convert.ToDouble(usertomeeting.citylong);
                
                
                List<RatingData> data = new List<RatingData>();
                for (int i = 1; i < 3; i++)
                {

                    for (int j = 1; j < _db.tblHobbie.Count()+1; j++)
                    {
                        RatingData rating = new RatingData();
                        rating.UserId = i;
                        rating.HobbieNum = j;
                        rating.Label = 1;
                        data.Add(rating);
                    }

                }


                if (usertomeeting.tblFavoriteContact.Count > 0 || usertomeeting.tblFavoriteContact1.Count > 0)
                {

                    foreach(tblUserHobbie hobitem in usertomeeting.tblUserHobbie)
                    {
                        RatingData rtdata = data.Where(x => x.HobbieNum == hobitem.hobbieNum && x.UserId==1).FirstOrDefault();
                        rtdata.Label = int.Parse(hobitem.rank);
                        
                    }
                  

                    foreach (tblFavoriteContact item in usertomeeting.tblFavoriteContact)
                    {
                        RatingData ratemax= new RatingData();
                        ratemax.HobbieNum = 0;
                        ratemax.Label = 0;
                        Dictionary<int,int> hobbiesmult= new Dictionary<int, int>();
                         numbermeetings = 0;
                        List<Events> userinvitedeve = await createlistevents(item.tblUser1.phoneNum1);
                        ExistsingUsers user1exist = new ExistsingUsers();
                        user1exist.phonenumbers.Add(item.tblUser1.phoneNum1);
                        user1exist.birthDate = Convert.ToDateTime(item.tblUser1.birthDate);
                        user1exist.city = item.tblUser1.city;
                        user1exist.email = item.tblUser1.email;
                        user1exist.userName = item.tblUser1.userName;
                        user1exist.imageUri=item.tblUser1.imageUri;
                        user1exist.gender= item.tblUser1.gender;
                        user1exist.citylatt = Convert.ToDouble(item.tblUser1.citylatt);
                        user1exist.citylong = Convert.ToDouble(item.tblUser1.citylong);





                        foreach (RatingData rating in data)
                        {
                            if (rating.UserId == 2)
                            {
                                rating.Label = 1;
                            }
                        }
                        
                            foreach(tblUserHobbie itehobbie in item.tblUser1.tblUserHobbie)
                            {
                                RatingData rtdata = data.Where(x => x.HobbieNum == itehobbie.hobbieNum && x.UserId == 2).FirstOrDefault();
                                rtdata.Label = int.Parse(itehobbie.rank);
                            }

                            for(int i=1; i<=_db.tblHobbie.Count(); i++)
                           {
                            double user1itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 1).FirstOrDefault().Label;
                            double user2itemlab= data.Where(x => x.HobbieNum == i && x.UserId == 2).FirstOrDefault().Label;
                            tblHobbie hobie= _db.tblHobbie.Where(x=> x.hobbieNum==i).FirstOrDefault();
                            

                            double multiplynumber = user1itemlab * user2itemlab;
                            RatingData rated = new RatingData();
                            rated.Label = multiplynumber;
                            rated.HobbieNum = i;
                            rated.Minhours = Convert.ToDouble(hobie.Minhours);
                            ratedhobbies.Add(rated);
                                                    

                        }

                        ratedhobbies.Sort((x, y) => y.Label.CompareTo(x.Label));

                         

                        while(numbermeetings<3 )
                        {

                            List<tblPreferredTime> usertblpref = usertomeeting.tblPreferredTime.ToList();
                            List<tblPreferredTime> user1tblpref= item.tblUser1.tblPreferredTime.ToList();
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
                            foreach (Events comtime in commontimeperiods2)
                            {
                                existingperiod = false;

                                if (numbermeetings == 3)
                                {
                                    break;
                                }
                                DateTime thedate = Meetings.GetDateForWeekday(comtime.weekday,comtime.starttime);
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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && lismatchitems.Item2 == itesug.endTime && itesug.date == thedate)
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    if (!existingperiod)
                                    {
                                        if (numbermeetings == 3)
                                        {
                                            break;
                                        }
                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.status = "P";
                                        sugdto.prefferedtimerate = 1.0;
                                        sugdto.date = thedate;
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.user2 = user1exist;
                                        sugdto.startTime = lismatchitems.Item1;
                                        sugdto.endTime = lismatchitems.Item2;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }

                                    existingperiod = false;
                                }
                                
                            }
                                foreach(tblPreferredTime prefit in usertomeeting.tblPreferredTime)
                                {
                                DateTime thedate = Meetings.GetDateForWeekday(prefit.weekDay,prefit.startTime);
                                TimeSpan starttime = prefit.startTime;
                                TimeSpan endtime = prefit.endTime;
                                existingperiod = false;



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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && itesug.endTime == lismatchitems.Item2 && itesug.date == thedate)
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    foreach(SuggestedDTO sugdto in suggestedmeet)
                                    {
                                        if(lismatchitems.Item1==sugdto.startTime && lismatchitems.Item2==sugdto.endTime && sugdto.date==thedate && sugdto.phoneNum2 == item.phoneNum2)
                                        {
                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    //to check if the meeting is already suggested or not in suggestedmeet
                                    if (!existingperiod)
                                    {
                                        

                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.date = thedate;
                                        sugdto.status = "P";
                                        sugdto.prefferedtimerate = 0.5;
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.user2 = user1exist;
                                        sugdto.startTime = lismatchitems.Item1;
                                        sugdto.endTime = lismatchitems.Item2;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }

                                    existingperiod = false;


                                }


                            }

                            DateTime dateto= DateTime.Now;
                            dateto = dateto.AddHours(5);
                            if (dateto.Hour > 22 || (dateto.Hour>= 00 && dateto.Hour< 09))
                            {
                                int hoursUntilNextMorning = (9 - dateto.Hour + 24) % 24;
                                dateto = dateto.AddHours(hoursUntilNextMorning).AddMinutes(-dateto.Minute).AddSeconds(-dateto.Second).AddMilliseconds(-dateto.Millisecond);

                            }

                            while (numbermeetings < 3)
                            {
                                TimeSpan limitedhourtimespan = new TimeSpan(22, 0, 0);
                                double limitedhour = limitedhourtimespan.Hours;
                                existingperiod = false;


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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && lismatchitems.Item2 == endtimespan && itesug.date == new DateTime(dateto.Year, dateto.Month, dateto.Day))
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    foreach (SuggestedDTO sugdto in suggestedmeet)
                                    {
                                        if (lismatchitems.Item1 == sugdto.startTime && lismatchitems.Item2 == sugdto.endTime && sugdto.date == dateto && sugdto.phoneNum2 == item.phoneNum2)
                                        {
                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    if (!existingperiod)
                                    {
                                        if (numbermeetings == 3)
                                        {
                                            break;
                                        }

                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.prefferedtimerate = 0;
                                        sugdto.status = "P";
                                        sugdto.date = dateto;
                                        sugdto.startTime = lismatchitems.Item1;
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.user2 = user1exist;
                                        sugdto.endTime = lismatchitems.Item2;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }


                                    existingperiod = false;




                                }
                                dateto = dateto.AddHours(2);
                                if (dateto.Hour > limitedhour || (dateto.Hour >= 00 && dateto.Hour < 09))
                                {
                                    int hoursUntilNextMorning = (9 - dateto.Hour + 24) % 24;
                                    dateto = dateto.AddHours(hoursUntilNextMorning).AddMinutes(-dateto.Minute).AddSeconds(-dateto.Second).AddMilliseconds(-dateto.Millisecond);

                                }
                            }

                        }
                       
                    } //here

                    foreach (tblFavoriteContact item in usertomeeting.tblFavoriteContact1)
                    {
                        RatingData ratemax = new RatingData();
                        ratemax.HobbieNum = 0;
                        ratemax.Label = 0;
                        Dictionary<int, int> hobbiesmult = new Dictionary<int, int>();
                        numbermeetings = 0;
                        List<Events> userinvitedeve = await createlistevents(item.tblUser.phoneNum1);
                        ExistsingUsers user1exist = new ExistsingUsers();
                        user1exist.phonenumbers.Add(item.tblUser.phoneNum1);
                        user1exist.birthDate = Convert.ToDateTime(item.tblUser.birthDate);
                        user1exist.city = item.tblUser.city;
                        user1exist.email = item.tblUser.email;
                        user1exist.userName = item.tblUser.userName;
                        user1exist.imageUri = item.tblUser.imageUri;
                        user1exist.gender = item.tblUser.gender;
                        user1exist.citylatt = Convert.ToDouble(item.tblUser.citylatt);
                        user1exist.citylong = Convert.ToDouble(item.tblUser.citylong);



                        foreach (RatingData rating in data)
                        {
                            if (rating.UserId == 2)
                            {
                                rating.Label = 1;
                            }
                        }

                        foreach (tblUserHobbie itehobbie in item.tblUser.tblUserHobbie)
                        {
                            RatingData rtdata = data.Where(x => x.HobbieNum == itehobbie.hobbieNum && x.UserId == 2).FirstOrDefault();
                            rtdata.Label = int.Parse(itehobbie.rank);
                        }

                        for (int i = 1; i <= _db.tblHobbie.Count(); i++)
                        {
                       
                            double user1itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 1).FirstOrDefault().Label;
                            double user2itemlab = data.Where(x => x.HobbieNum == i && x.UserId == 2).FirstOrDefault().Label;
                            tblHobbie hobie = _db.tblHobbie.Where(x => x.hobbieNum == i).FirstOrDefault();


                            double multiplynumber = user1itemlab * user2itemlab;
                            RatingData rated = new RatingData();
                            rated.Label = multiplynumber;
                            rated.HobbieNum = i;
                            rated.Minhours = Convert.ToDouble(hobie.Minhours);
                            ratedhobbies.Add(rated);


                        }



                        while (numbermeetings < 3 )
                        {

                            List<tblPreferredTime> usertblpref = usertomeeting.tblPreferredTime.ToList();
                            List<tblPreferredTime> user1tblpref = item.tblUser.tblPreferredTime.ToList();
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
                                existingperiod = false;

                           
                                DateTime thedate = Meetings.GetDateForWeekday(comtime.weekday,comtime.starttime);
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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && itesug.endTime == lismatchitems.Item2 && itesug.date == thedate)
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    if (!existingperiod)
                                    {
                                     

                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.prefferedtimerate = 1;
                                        sugdto.date = thedate;
                                        sugdto.status = "P";
                                        sugdto.startTime = lismatchitems.Item1;
                                        sugdto.endTime = lismatchitems.Item2;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.user2 = user1exist;
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }

                                    existingperiod = false;
                                }

                                
                            }

                            foreach (tblPreferredTime prefit in usertomeeting.tblPreferredTime)
                            {
                               
                                existingperiod = false;
                                DateTime thedate = Meetings.GetDateForWeekday(prefit.weekDay,prefit.startTime);
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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && itesug.endTime == lismatchitems.Item2 && itesug.date == thedate)
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    foreach (SuggestedDTO sugdto in suggestedmeet)
                                    {
                                        if (lismatchitems.Item1 == sugdto.startTime && lismatchitems.Item2 == sugdto.endTime && sugdto.date == thedate && sugdto.phoneNum2 == item.phoneNum2)
                                        {
                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    if (!existingperiod)
                                    {
                                       

                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.date = thedate;
                                        sugdto.prefferedtimerate = 0.5;
                                        sugdto.status = "P";
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.user2 = user1exist;
                                        sugdto.startTime = lismatchitems.Item1;
                                        sugdto.endTime = lismatchitems.Item2;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }

                                    existingperiod = false;



                                }

                            }


                            DateTime dateto = DateTime.Now;
                            dateto = dateto.AddHours(5);
                            if (dateto.Hour > 22 || (dateto.Hour >= 00 && dateto.Hour < 09))
                            {
                                int hoursUntilNextMorning = (9 - dateto.Hour + 24) % 24;
                                dateto = dateto.AddHours(hoursUntilNextMorning).AddMinutes(-dateto.Minute).AddSeconds(-dateto.Second).AddMilliseconds(-dateto.Millisecond);

                            }

                            while (numbermeetings < 3 )
                            {
                                existingperiod = false;
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
                                    foreach (SuggestedDTO itesug in existingsugmeetings)
                                    {
                                        if (itesug.startTime == lismatchitems.Item1 && itesug.endTime == lismatchitems.Item2 && itesug.date == new DateTime(dateto.Year, dateto.Month, dateto.Day))
                                        {

                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    foreach (SuggestedDTO sugdto in suggestedmeet)
                                    {
                                        if (lismatchitems.Item1 == sugdto.startTime && lismatchitems.Item2 == sugdto.endTime && sugdto.date == dateto && sugdto.phoneNum2 == item.phoneNum2)
                                        {
                                            existingperiod = true;
                                            break;
                                        }
                                    }
                                    if (!existingperiod)
                                    {
                                        if (numbermeetings == 3)
                                        {
                                            break;
                                        }

                                        SuggestedDTO sugdto = new SuggestedDTO();
                                        sugdto.date = dateto;
                                        sugdto.prefferedtimerate = 0;
                                        sugdto.user1 = usertomeetingexist;
                                        sugdto.status = "P";
                                        sugdto.user2 = user1exist;
                                        sugdto.startTime = startimespan;
                                        sugdto.endTime = endtimespan;
                                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                                        foreach (RatingData rat in ratedhobbies)
                                        {
                                            if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                            {
                                                sugdto.hobbieNum = rat.HobbieNum;
                                                ratemax = rat;
                                                break;
                                            }
                                        }
                                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (25.0 - 1.0);
                                        sugdto.normalizeuserrank = (Convert.ToDouble(item.rank) - 1.0) / (5.0 - 1.0);
                                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, sugdto.normalizeuserrank);
                                        sugdto.rank = totalmeetingrank;
                                        //need to add hobbienum to tblsuggestedmeeting
                                        // need to normalize it and calculate score
                                        //if score is under some limit its not added at all.
                                        suggestedmeet.Add(sugdto);
                                        numbermeetings++;


                                    }

                                    existingperiod = false;

                                }

                                    dateto = dateto.AddHours(2);
                                    if (dateto.Hour > 22 || (dateto.Hour >= 00 && dateto.Hour < 09))
                                    {
                                        int hoursUntilNextMorning = (9 - dateto.Hour + 24) % 24;
                                        dateto = dateto.AddHours(hoursUntilNextMorning).AddMinutes(-dateto.Minute).AddSeconds(-dateto.Second).AddMilliseconds(-dateto.Millisecond);

                                    }
                                
                                
                            }





                        }

                    }
                    
                    List<SuggestedDTO> suggestedsorted= suggestedmeet.OrderByDescending(x=> x.rank).ToList();
                    List<SuggestedDTO> top5Suggestions = suggestedsorted.Take(5-totalmeetingsnumber).ToList();
                    List<SuggestedDTO> meetingslist= await Meetings.Generatemeetings(_googleservices,top5Suggestions,_db,ratedhobbies);
                    meetingslist.Sort((x, y) => y.rank.CompareTo(x.rank));

                    List<SuggestedDTO> meetingstoreturn= new List<SuggestedDTO>();
                    foreach(SuggestedDTO meetitem in meetingslist)
                    {
                        if (meetitem.place.PlaceId != null)
                        {
                            meetitem.date = new DateTime(meetitem.date.Year, meetitem.date.Month, meetitem.date.Day, 23, 59, 59);
                            tblSuggestedMeeting sugmeetadd = new tblSuggestedMeeting();
                            if (meetitem.endTime.Days > 0)
                            {
                                TimeSpan adjusttimespan= new TimeSpan(meetitem.endTime.Hours,meetitem.endTime.Minutes,meetitem.endTime.Seconds);
                                meetitem.endTime = adjusttimespan;
                            }
                            sugmeetadd.date = meetitem.date;
                            sugmeetadd.meetingNum = meetitem.meetingNum;
                            sugmeetadd.phoneNum1 = meetitem.phoneNum1;
                            sugmeetadd.phoneNum2 = meetitem.phoneNum2;
                            sugmeetadd.latitude = meetitem.latitude;

                            sugmeetadd.longitude = meetitem.longitude;
                            sugmeetadd.startTime = meetitem.startTime;
                            sugmeetadd.endTime = meetitem.endTime;
                            sugmeetadd.rank = (float)meetitem.rank;
                            sugmeetadd.hobbieNum = meetitem.hobbieNum;
                            sugmeetadd.status = "P";
                            _db.tblSuggestedMeeting.Add(sugmeetadd);
                            _db.SaveChanges();
                            int generatedmeetingnumber = sugmeetadd.meetingNum;
                            meetitem.meetingNum = generatedmeetingnumber;
                            tblSuggestedHobbie sughobbie = new tblSuggestedHobbie();
                            sughobbie.hobbieNum = meetitem.hobbieNum;
                            sughobbie.meetingNum = sugmeetadd.meetingNum;
                            _db.tblSuggestedHobbie.Add(sughobbie);
                            _db.SaveChanges();
                            meetingstoreturn.Add(meetitem);
                        }





                    }


                    //here it will take the best 5 suggested meetings, get the places
                    //with google places api, add all the suggested meetings to 
                    // database and send them back with all the reelvant information

                    return Request.CreateResponse(HttpStatusCode.OK,meetingstoreturn);


                }
                else
                {
                    List<SuggestedDTO> list = new List<SuggestedDTO>();

                    return Request.CreateResponse(HttpStatusCode.OK,list);

                }


            }

            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex);
            }


        }

       

      
    }
}
