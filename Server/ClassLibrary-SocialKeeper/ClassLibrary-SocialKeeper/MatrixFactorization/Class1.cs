using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Core.Metadata.Edm;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using System.Diagnostics;
using System.Numerics;
using System.Collections;

namespace ClassLibrary_SocialKeeper
{
    public class RatingData
    {
         public float UserId;
         public int HobbieNum;
        public double Label;
        public double Minhours;
       
        
    }

    public class Place
    {
        public string Name { get; set; }
        public string PlaceId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Rating { get; set; }

        public string formatted_address { get; set; }



    }

    public class PhotoInfo
    {
        public int Height { get; set; }
        public int Width { get; set; }
        public string PhotoReference { get; set; }
    }


    public class Meetings
    {
        public static List<PlaceResult> calculatebaysienrank(List<PlaceResult> placelist)
        {
            double avaragerank = placelist.Average(x => x.Rating);
            double minimumreiews = 15;

            foreach(PlaceResult place in placelist)
            {
                place.bayesianrank= (place.UserRatingsTotal/(place.UserRatingsTotal+minimumreiews)) * place.Rating + (minimumreiews/(place.UserRatingsTotal+minimumreiews)) * avaragerank;
            }

            return placelist;

        }

        public static void Timeandhobbiegenerator(List<Events> userinviteeve, List<Events> userinvitedeve, List<SuggestedDTO> existingsugmeetings, ExistsingUsers user1exist, tblUser usertomeeting,
          ExistsingUsers usertomeetingexist, List<RatingData> ratedhobbies, RatingData ratemax, tblFavoriteContact item, ref double totalmeetingrank, ref int numbermeetings, List<SuggestedDTO> suggestedmeet,
          double prefferdtimerate, List<tblPreferredTime> commontimeperiods2, igroup192_prodEntities _db)
        {
            bool existingperiod = false;
            List<tblPreferredTime> usertblpref = item.tblUser.tblPreferredTime.ToList();
            List<tblPreferredTime> user1tblpref = item.tblUser1.tblPreferredTime.ToList();



            if (prefferdtimerate == 1)
            {


                foreach (tblPreferredTime t in usertblpref)
                {

                    foreach (tblPreferredTime tm in user1tblpref)
                    {
                        if (t.weekDay == tm.weekDay)
                        {
                            Tuple<TimeSpan, TimeSpan> newtup = FindCommonTimePeriod(t.startTime, t.endTime, tm.startTime, tm.endTime);

                            if (newtup != null)
                            {
                                tblPreferredTime eventadd = new tblPreferredTime();
                                eventadd.startTime = newtup.Item1;
                                eventadd.endTime = newtup.Item2;
                                eventadd.weekDay = tm.weekDay;
                                commontimeperiods2.Add(eventadd);
                            }
                        }
                    }
                }
            }
            foreach (tblPreferredTime comtime in commontimeperiods2)
            {
                existingperiod = false;

                if (numbermeetings == 5)
                {
                    break;
                }
                DateTime thedate = GetDateForWeekday(comtime.weekDay, comtime.startTime);
                List<List<Events>> myevents = returneventsfixed(userinviteeve, userinvitedeve, comtime);
                List<Events> userinviteevefixed = myevents[0];
                List<Events> userinvitedfixed = myevents[1];




                List<Tuple<TimeSpan, TimeSpan>> listmatch = Findifcollapse(new Tuple<TimeSpan, TimeSpan>(comtime.startTime, comtime.endTime), userinviteevefixed, userinvitedfixed);
                foreach (var lismatchitems in listmatch)
                {
         
                    foreach (SuggestedDTO itesug in existingsugmeetings)
                    {
                        if (itesug.startTime == lismatchitems.Item1 && lismatchitems.Item2 == itesug.endTime && new DateTime(itesug.date.Year,itesug.date.Month,itesug.date.Day) == new DateTime(thedate.Year,thedate.Month,thedate.Day))
                        {

                            existingperiod = true;
                            break;
                        }
                    }
                    if (!existingperiod)
                    {
                        if (numbermeetings == 5)
                        {
                            break;
                        }
                        SuggestedDTO sugdto = new SuggestedDTO();
                        sugdto.status = "P";
                        sugdto.prefferedtimerate = prefferdtimerate;
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
                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (75.0 - 1.0);
                        totalmeetingrank = Meetings.calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate,item,_db);
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
        }

        public static List<List<Events>> returneventsfixed(List<Events> userinviteeve, List<Events> userinvitedeve, tblPreferredTime comtime)
        {
            List<Events> userinviteevefixed = new List<Events>();
            List<Events> userinvitedfixed = new List<Events>();
            foreach (Events eve in userinviteeve)
            {
                if (eve.weekday == comtime.weekDay)
                {
                    userinviteevefixed.Add(eve);
                }
            }
            foreach (Events eve2 in userinvitedeve)
            {
                if (eve2.weekday == comtime.weekDay)
                {
                    userinvitedfixed.Add(eve2);
                }
            }

            List<List<Events>> myevevntslist = new List<List<Events>>();
            myevevntslist.Add(userinviteevefixed);
            myevevntslist.Add(userinvitedfixed);
            return myevevntslist;
        }
        public static void RandomTimeandhobbiegenerator(List<Events> userinviteeve, List<Events> userinvitedeve, List<SuggestedDTO> existingsugmeetings, ExistsingUsers user1exist, tblUser usertomeeting,
          ExistsingUsers usertomeetingexist, List<RatingData> ratedhobbies, RatingData ratemax, tblFavoriteContact item, ref double totalmeetingrank, ref int numbermeetings, List<SuggestedDTO> suggestedmeet,
          double prefferdtimerate, igroup192_prodEntities _db)
        {
            bool existingperiod = false;
            DateTime dateto = DateTime.Now;
            dateto = dateto.AddHours(5);
            if (dateto.Hour > 22 || (dateto.Hour >= 00 && dateto.Hour < 09))
            {
                int hoursUntilNextMorning = (9 - dateto.Hour + 24) % 24;
                dateto = dateto.AddHours(hoursUntilNextMorning).AddMinutes(-dateto.Minute).AddSeconds(-dateto.Second).AddMilliseconds(-dateto.Millisecond);

            }

            while (numbermeetings < 5)
            {
                TimeSpan limitedhourtimespan = new TimeSpan(22, 0, 0);
                double limitedhour = limitedhourtimespan.Hours;
                existingperiod = false;
                int starth = dateto.Hour;
                DateTime endtime = dateto.AddHours(3);
                int endth = endtime.Hour;
                TimeSpan startimespan = TimeSpan.FromHours(starth);
                TimeSpan endtimespan = TimeSpan.FromHours(endth);

                int currentDayOfWeekint = (int)dateto.DayOfWeek;
                string currentDayOfWeek = currentDayOfWeekint.ToString();
                List<Events> userinviteevefixed = new List<Events>();
                List<Events> userinvitedfixed = new List<Events>();

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



                List<Tuple<TimeSpan, TimeSpan>> listmatch = Findifcollapse(new Tuple<TimeSpan, TimeSpan>(startimespan, endtimespan), userinviteevefixed, userinvitedfixed);
                foreach (var lismatchitems in listmatch)
                {
               

                    foreach (SuggestedDTO itesug in existingsugmeetings)
                    {
                        if (itesug.startTime == lismatchitems.Item1 && lismatchitems.Item2 == itesug.endTime && new DateTime(itesug.date.Year,itesug.date.Month,itesug.date.Day) == new DateTime(dateto.Year, dateto.Month, dateto.Day))
                        {

                            existingperiod = true;
                            break;
                        }
                    }
                    foreach (SuggestedDTO sugdto in suggestedmeet)
                    {
                        if (lismatchitems.Item1 == sugdto.startTime && lismatchitems.Item2 == sugdto.endTime && new DateTime(sugdto.date.Year,sugdto.date.Month,sugdto.date.Day) == new DateTime(dateto.Year,dateto.Month,dateto.Day) )
                        {
                            existingperiod = true;
                            break;
                        }
                    }
                    if (!existingperiod)
                    {
                        if (numbermeetings == 5)
                        {
                            break;
                        }

                        SuggestedDTO sugdto = new SuggestedDTO();
                        sugdto.prefferedtimerate = prefferdtimerate;
                        sugdto.status = "P";
                        sugdto.date = dateto;
                        sugdto.startTime = lismatchitems.Item1;
                        sugdto.user1 = usertomeetingexist;
                        sugdto.user2 = user1exist;
                        sugdto.endTime = lismatchitems.Item2;
                        sugdto.phoneNum1 = usertomeetingexist.phonenumbers[0];
                        sugdto.phoneNum2 = user1exist.phonenumbers[0];
                        if (lismatchitems.Item1 > lismatchitems.Item2)
                        {
                            TimeSpan oneday = TimeSpan.FromDays(1);
                            TimeSpan newitem2 = lismatchitems.Item2.Add(oneday);
                            foreach (RatingData rat in ratedhobbies)
                            {
                                if (newitem2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                {
                                    sugdto.hobbieNum = rat.HobbieNum;
                                    ratemax = rat;
                                    break;
                                }
                            }
                        }
                        else
                        {
                            foreach (RatingData rat in ratedhobbies)
                            {
                                if (lismatchitems.Item2 - lismatchitems.Item1 >= TimeSpan.FromHours(rat.Minhours))
                                {
                                    sugdto.hobbieNum = rat.HobbieNum;
                                    ratemax = rat;
                                    break;
                                }
                            }
                        }
                        sugdto.normalizehobbierank = (ratemax.Label - 1.0) / (75.0 - 1.0);
                        totalmeetingrank = calculatemeetingscore(sugdto.normalizehobbierank, sugdto.prefferedtimerate, item, _db);
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


        public static Tuple<TimeSpan, TimeSpan> FindCommonTimePeriod(TimeSpan start1, TimeSpan end1, TimeSpan start2, TimeSpan end2)
        {
            TimeSpan maxStart = start1 > start2 ? start1 : start2;
            TimeSpan minEnd = end1 < end2 ? end1 : end2;

            if (maxStart < minEnd)
            {
                //check that min end is bigger at least 1 hour than max start if not add 1 hour to min end
                if (minEnd.Subtract(maxStart).TotalHours < 1)
                {
                    minEnd = minEnd.Add(new TimeSpan(1, 0, 0));
                }
                    
                return new Tuple<TimeSpan, TimeSpan>(maxStart, minEnd);
            }
            else
            {
                return null;
            }
        }

        public static async Task<SuggestedDTO> Generateplace_ondemand (Googlecloudservices _googlecloudservices, SuggestedDTO mysuggested, igroup192_prodEntities db, LoctationDTO loc)
        {
            Dictionary<string, string> placetypes = new Dictionary<string, string>();
            placetypes.Add("Football", "bar");
            placetypes.Add("Basketball", "bar");
            placetypes.Add("Resturant", "restaurant");
            placetypes.Add("Movie", "movie_theater");
            placetypes.Add("Parties", "night_club");
            placetypes.Add("Coffee", "cafe");
            placetypes.Add("Gym", "gym");
            placetypes.Add("Tennis", "park");
            placetypes.Add("Running", "park");
            placetypes.Add("Chas", "library");
            string type = "";
            List<PlaceResult> places = new List<PlaceResult>();
            List<PlaceResult> placetorun = new List<PlaceResult>();
            List<string> typeswithoutplaces = new List<string>();
            Dictionary<string, List<string>> placeslist = new Dictionary<string, List<string>>(); 
            string hobbiename = "";
            double midlat;
            double midlon;
            bool placefound = false;
            int currentDayOfWeek = (int)mysuggested.date.DayOfWeek;

            foreach (KeyValuePair<string, string> entry in placetypes)
            {
                if (!placeslist.ContainsKey(entry.Value))
                {
                    placeslist[entry.Value] = new List<string>();
                }
            }

            if (loc.city == null)
            {
                double lat1 = Convert.ToDouble(mysuggested.user1.citylatt);
                double lon1 = Convert.ToDouble(mysuggested.user1.citylong);
                double lat2 = Convert.ToDouble(mysuggested.user2.citylatt);
                double lon2 = Convert.ToDouble(mysuggested.user2.citylong);

                ( midlat,  midlon) = FindMidpoint(lat1, lon1, lat2, lon2);

            }
            else
            {
                midlat = loc.latitude;
                midlon = loc.longitude;
            }

            double radius = 10000;
            double radiusinkm = radius / 1000;
            double northLatitude = midlat + (radiusinkm / 111.0);
            double southLatitude = midlat - (radiusinkm / 111.0);
            double eastlongitude = midlon + (radiusinkm / 111.0);
            double westlongitude = midlon - (radiusinkm / 111.0);


            hobbiename = db.tblHobbie.Where(x => x.hobbieNum == mysuggested.hobbieNum).FirstOrDefault().hobbieName;
                type = placetypes[hobbiename];

              

                    QuerySnapshot snapshot = await _googlecloudservices._firestoreDb.Collection("Places").WhereEqualTo("type", type).GetSnapshotAsync();


                    var filteredPlaces = snapshot.Documents
             .Where(placeDoc =>
         placeDoc.GetValue<double>("latitude") >= southLatitude &&
    placeDoc.GetValue<double>("latitude") <= northLatitude &&
    placeDoc.GetValue<double>("longitude") >= westlongitude &&
    placeDoc.GetValue<double>("longitude") <= eastlongitude)
    .ToList();



                    foreach (DocumentSnapshot docsnap in filteredPlaces)
                    {
                        double docLatitude = docsnap.GetValue<double>("latitude");
                        double docLongitude = docsnap.GetValue<double>("longitude");
                        double distance = Googlecloudfunctions.CalculateDistance(midlat, midlon, docLatitude, docLongitude);
                        double radiuskm = radius / 800;
                        if (distance <= radiuskm)
                        {
                            string placeid = docsnap.GetValue<string>("Placeid");

                            try
                            {
                                string placejson = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{placeid}", _googlecloudservices);
                                if (placejson != null)
                                {

                                    PlaceResult pr = new PlaceResult();
                                    pr = JsonConvert.DeserializeObject<PlaceResult>(placejson);
                                    if (pr.PlaceId == null)
                                    {
                                        SinglePlaceroot prsing = new SinglePlaceroot();
                                        prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(placejson);
                                        pr = prsing.Result;


                                    }


                                    placetorun.Add(pr);

                                }
                            }
                            catch (Exception ex)
                            {
                                Debug.WriteLine(ex.Message);
                                DocumentReference todelete = _googlecloudservices._firestoreDb.Collection("Places").Document(docsnap.Id);
                                await todelete.DeleteAsync();




                            }

                        }



                    }

                    if (placetorun.Count >= 10)
                    {
                        places = placetorun;
                    }
                    else
                    {

                        //will be request to firestore to check if there is places there according to demands

                        string response = await GetPlacesAsync(_googlecloudservices.googlemapscred, midlat, midlon, radius, type);
                        places = Extractingfromjson.ExtractPlacesFromJson(response);
                        places.Sort((x, y) => y.Rating.CompareTo(x.Rating));
                        SinglePlaceroot prsing = new SinglePlaceroot();
                        PlaceResult pr = new PlaceResult();
                        foreach (PlaceResult placeto in places)
                        {
                            string fullplace = await openinghours(_googlecloudservices.googlemapscred, placeto.PlaceId);
                            prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(fullplace);
                            pr = prsing.Result;
                            string prconverted = JsonConvert.SerializeObject(pr);
                            string ifexist = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{pr.PlaceId}", _googlecloudservices);
                            if (ifexist == null)
                            {
                                CollectionReference collection = _googlecloudservices._firestoreDb.Collection("Places");
                                GeoPoint gepoint = new GeoPoint(pr.Geometry.Location.Latitude, pr.Geometry.Location.Longitude);
                                Dictionary<string, object> docdata = new Dictionary<string, object>
                                    {
                                        {"Placeid", pr.PlaceId },
                                        {"latitude", gepoint.Latitude },
                                        {"longitude", gepoint.Longitude },
                                        {"type", type }
                                    };

                                DocumentReference docref = await collection.AddAsync(docdata);
                                await Googlecloudfunctions.UploadJsonToGoogleCloudStorage(prconverted, $"Places/{pr.PlaceId}", _googlecloudservices);
                                placetorun.Add(pr);

                            }
                            else
                            {

                                placetorun.Add(pr);

                            }
                        }
                        places = placetorun;


                    }


                
                places = calculatebaysienrank(places);
                places.Sort((x, y) => y.bayesianrank.CompareTo(x.bayesianrank));

            foreach (PlaceResult place in places)
            {
                if (placefound)
                {
                    break;
                }

                List <string> myst= placeslist[type];
                string findif = myst.Where(x => x == place.PlaceId).FirstOrDefault();
                if (findif != null)
                {
                    continue;
                }

           

                OpeningHoursDetails openingHoursDetails = place.OpeningHours;


                if (openingHoursDetails != null || type == "park")
                {

                    if (type == "park" && openingHoursDetails == null)
                    {
                        LoctationDTO dtoloc = new LoctationDTO();
                        tblLoctation loctocheck = db.tblLoctation.Where(x => x.longitude == place.Geometry.Location.Longitude && x.latitude == place.Geometry.Location.Latitude).FirstOrDefault();
                        if (loctocheck == null)
                        {
                            tblLoctation locationnew = new tblLoctation();
                            locationnew.latitude = place.Geometry.Location.Latitude;
                            locationnew.longitude = place.Geometry.Location.Longitude;
                            locationnew.city = place.Name;
                            locationnew.Placeid = place.PlaceId;
                            db.tblLoctation.Add(locationnew);
                            db.SaveChanges();
                            dtoloc.latitude = locationnew.latitude;
                            dtoloc.longitude = locationnew.longitude;
                            dtoloc.city = locationnew.city;
                            mysuggested.locatation = dtoloc;
                            mysuggested.longitude = dtoloc.longitude;
                            mysuggested.latitude = dtoloc.latitude;
                        }
                        else
                        {
                            dtoloc.latitude = loctocheck.latitude;
                            dtoloc.longitude = loctocheck.longitude;
                            dtoloc.city = loctocheck.city;
                            if (loctocheck.Placeid == null)
                            {
                                loctocheck.Placeid = place.PlaceId;
                                db.SaveChanges();
                            }
                            mysuggested.locatation = dtoloc;
                            mysuggested.latitude = loctocheck.latitude;
                            mysuggested.longitude = loctocheck.longitude;
                        }
                        mysuggested.place = place;
                        placefound = true;
                        break;

                    }
                    else
                    {


                        List<Period> opcloseday = new List<Period>();
                        foreach (Period period in openingHoursDetails.Periods)
                        {
                            if (period.Open != null && period.Close != null)
                            {
                                if (period.Open.Day == currentDayOfWeek && period.Close.Day == currentDayOfWeek)
                                {
                                    opcloseday.Add(period);
                                }
                                else if (period.Open.Day == currentDayOfWeek && period.Close.Day == currentDayOfWeek + 1 && TimeSpan.Parse(period.Open.Time) > TimeSpan.Parse(period.Close.Time))
                                {

                                    opcloseday.Add(period);


                                }

                                else if (period.Open.Day == currentDayOfWeek - 1 && period.Close.Day == currentDayOfWeek && TimeSpan.Parse(period.Close.Time) > mysuggested.endTime)
                                {
                                    opcloseday.Add(period);

                                }
                            }
                        }

                        foreach (Period period in opcloseday)
                        {
                            TimeSpan timeopen = TimeSpan.ParseExact(period.Open.Time, "hhmm", CultureInfo.InvariantCulture);
                            TimeSpan timeclose = TimeSpan.ParseExact(period.Close.Time, "hhmm", CultureInfo.InvariantCulture);
                            TimeSpan mysuggestedendfixed = mysuggested.endTime;
                            TimeSpan mysuggestedstartfixed=mysuggested.startTime;

                            if (mysuggested.startTime > mysuggested.endTime)
                            {
                                mysuggestedendfixed = mysuggestedendfixed.Add(TimeSpan.FromDays(1));
                            }

                            if (period.Open.Day == currentDayOfWeek - 1)
                            {
                                mysuggestedendfixed = mysuggestedendfixed.Add(TimeSpan.FromDays(1));
                                mysuggestedstartfixed = mysuggestedstartfixed.Add(TimeSpan.FromDays(1));


                            }

                            if (timeopen > timeclose)
                            {
                                timeclose = timeclose.Add(TimeSpan.FromDays(1));
                            }

                            if (mysuggestedstartfixed >= timeopen && mysuggestedendfixed <= timeclose)
                            {
                                LoctationDTO dtoloc = new LoctationDTO();
                                tblLoctation loctocheck = db.tblLoctation.Where(x => x.longitude == place.Geometry.Location.Longitude && x.latitude == place.Geometry.Location.Latitude).FirstOrDefault();
                                if (loctocheck == null)
                                {
                                    tblLoctation locationnew = new tblLoctation();
                                    locationnew.latitude = place.Geometry.Location.Latitude;
                                    locationnew.longitude = place.Geometry.Location.Longitude;
                                    locationnew.city = place.Name;
                                    locationnew.Placeid = place.PlaceId;
                                    db.tblLoctation.Add(locationnew);
                                    db.SaveChanges();
                                    dtoloc.latitude = locationnew.latitude;
                                    dtoloc.longitude = locationnew.longitude;
                                    dtoloc.city = locationnew.city;
                                    mysuggested.locatation = dtoloc;
                                    mysuggested.longitude = dtoloc.longitude;
                                    mysuggested.latitude = dtoloc.latitude;
                                }
                                else
                                {
                                    dtoloc.latitude = loctocheck.latitude;
                                    dtoloc.longitude = loctocheck.longitude;
                                    dtoloc.city = loctocheck.city;
                                    dtoloc.Placeid = place.PlaceId;
                                    mysuggested.locatation = dtoloc;
                                    mysuggested.latitude = loctocheck.latitude;
                                    mysuggested.longitude = loctocheck.longitude;
                                }
                                mysuggested.place = place;
                                placefound = true;
                                return mysuggested;




                            }
                        }
                    }
                }

                string place1 = placeslist[type].Where(x => x == place.PlaceId).FirstOrDefault();

                if (place1 == null)
                {
                    placeslist[type].Add(place.PlaceId);

                }



            }

            return null;




        }

        public static async Task<SuggestedDTO> Generatemeetings(Googlecloudservices _googleservices,SuggestedDTO mysuggested, igroup192_prodEntities db, List<RatingData> ratedh)
        {

            
            Dictionary<string, string> placetypes = new Dictionary<string, string>();
            placetypes.Add("Football", "bar");
            placetypes.Add("Basketball","bar");
            placetypes.Add("Resturant", "restaurant");
            placetypes.Add("Movie", "movie_theater");
            placetypes.Add("Parties", "night_club");
            placetypes.Add("Coffee", "cafe");
            placetypes.Add("Gym", "gym");
            placetypes.Add("Tennis", "park");
            placetypes.Add("Running", "park");
            placetypes.Add("Chas", "library");
            string type = "";
            string currentplacetype = "";
            List<PlaceResult> places = new List<PlaceResult>();
            List<PlaceResult> placetorun= new List<PlaceResult>();
            List<string> typeswithoutplaces= new List<string>();
            Dictionary<string, List<PlaceResult>> placeslist= new Dictionary<string, List<PlaceResult>>();
            tblFavoriteContact fav = db.tblFavoriteContact.Where(x => (x.phoneNum1 == mysuggested.phoneNum1 && x.phoneNum2 == mysuggested.phoneNum2) || (x.phoneNum2 == mysuggested.phoneNum1 && x.phoneNum1 == mysuggested.phoneNum2)).FirstOrDefault();
           
      



         
                RatingData highesthobrank = ratedh.Where(x => x.HobbieNum == mysuggested.hobbieNum).FirstOrDefault();
                List<RatingData> ratedwithouthobbie= ratedh.Where(x=> x.HobbieNum!= mysuggested.hobbieNum).ToList();
                bool placefound = false;
                int currentDayOfWeek = (int)mysuggested.date.DayOfWeek;
                bool initialrunning = true;
                placeslist= new Dictionary<string, List<PlaceResult>>();
                foreach (KeyValuePair<string, string> entry in placetypes)
                {
                    if (!placeslist.ContainsKey(entry.Value))
                    {
                        placeslist[entry.Value] = new List<PlaceResult>();
                    }
                }

                string hobbiename = "";

                double lat1 = Convert.ToDouble(mysuggested.user1.citylatt);
                double lon1 = Convert.ToDouble(mysuggested.user1.citylong);
                double lat2 = Convert.ToDouble(mysuggested.user2.citylatt);
                double lon2 = Convert.ToDouble(mysuggested.user2.citylong);

                (double midLat, double midLon) = FindMidpoint(lat1, lon1, lat2, lon2);

                double radius = 10000;
                double radiusinkm= radius/ 1000;
                double northLatitude = midLat + (radiusinkm / 111.0);
                double southLatitude = midLat - (radiusinkm / 111.0);
                double eastlongitude = midLon + (radiusinkm / 111.0);
                double westlongitude = midLon - (radiusinkm / 111.0);



                while (!placefound)
                {
                    placetorun.Clear();


                    if (initialrunning)
                    {
                         hobbiename = db.tblHobbie.Where(x => x.hobbieNum == mysuggested.hobbieNum).FirstOrDefault().hobbieName;
                         type = placetypes[hobbiename];

                        if (currentplacetype != type)
                        {

                            QuerySnapshot snapshot= await _googleservices._firestoreDb.Collection("Places").WhereEqualTo("type", type).GetSnapshotAsync();


                            var filteredPlaces = snapshot.Documents
                     .Where(placeDoc =>
                 placeDoc.GetValue<double>("latitude") >= southLatitude &&
            placeDoc.GetValue<double>("latitude") <= northLatitude &&
            placeDoc.GetValue<double>("longitude") >= westlongitude &&
            placeDoc.GetValue<double>("longitude") <= eastlongitude)
            .ToList();



                            foreach (DocumentSnapshot docsnap in filteredPlaces)
                            {
                                double docLatitude= docsnap.GetValue<double>("latitude");
                                double docLongitude= docsnap.GetValue<double>("longitude");
                                double distance= Googlecloudfunctions.CalculateDistance(midLat, midLon, docLatitude, docLongitude);
                                double radiuskm = radius / 800;
                                if(distance <= radiuskm)
                                {
                                    string placeid= docsnap.GetValue<string>("Placeid");
                                
                                try
                                {
                                    string placejson = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{placeid}", _googleservices);
                                    if (placejson != null)
                                    {

                                        PlaceResult pr = new PlaceResult();
                                        pr = JsonConvert.DeserializeObject<PlaceResult>(placejson);
                                        if (pr.PlaceId == null)
                                        {
                                            SinglePlaceroot prsing = new SinglePlaceroot();
                                            prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(placejson);
                                            pr = prsing.Result;


                                        }


                                        placetorun.Add(pr);

                                    }
                                }
                                catch(Exception ex)
                                {
                                    Debug.WriteLine(ex.Message);
                                    DocumentReference todelete = _googleservices._firestoreDb.Collection("Places").Document(docsnap.Id);
                                    await todelete.DeleteAsync();




                                }
                                   
                                }

                         
                               
                            }

                            if (placetorun.Count >= 10)
                            {
                                places = placetorun;
                            }
                            else { 

                            //will be request to firestore to check if there is places there according to demands
     
                                string response = await GetPlacesAsync(_googleservices.googlemapscred, midLat, midLon, radius, type);
                                places = Extractingfromjson.ExtractPlacesFromJson(response);
                                places.Sort((x, y) => y.Rating.CompareTo(x.Rating));
                                SinglePlaceroot prsing = new SinglePlaceroot();
                                PlaceResult pr= new PlaceResult();
                                foreach (PlaceResult placeto in places)
                                {
                                string fullplace = await openinghours(_googleservices.googlemapscred, placeto.PlaceId);
                                 prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(fullplace);
                                    pr = prsing.Result;
                                string prconverted= JsonConvert.SerializeObject(pr);
                                string ifexist = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{pr.PlaceId}",_googleservices);
                                if (ifexist== null)
                                {
                                    CollectionReference collection= _googleservices._firestoreDb.Collection("Places");
                                    GeoPoint gepoint= new GeoPoint(pr.Geometry.Location.Latitude,pr.Geometry.Location.Longitude);
                                    Dictionary<string, object> docdata = new Dictionary<string, object>
                                    {
                                        {"Placeid", pr.PlaceId },
                                        {"latitude", gepoint.Latitude },
                                        {"longitude", gepoint.Longitude },
                                        {"type", type }
                                    };

                                        DocumentReference docref = await collection.AddAsync(docdata);
                                    await Googlecloudfunctions.UploadJsonToGoogleCloudStorage(prconverted, $"Places/{pr.PlaceId}",_googleservices);
                                        placetorun.Add(pr);
                                    
                                }
                                else
                                {
                                    
                                    placetorun.Add(pr);

                                }
                            }
                                places = placetorun;


                                }
                            currentplacetype = type;
                            
                            
                        }
                    places = calculatebaysienrank(places);
                    places.Sort((x, y) => y.bayesianrank.CompareTo(x.bayesianrank));

                        
                       
                    }
                    else
                    {
                        if (ratedwithouthobbie.Count > 0)
                        {

                            while(ratedwithouthobbie.Count>0)
                            {
                                RatingData firstplacerate = ratedwithouthobbie[0];
                                int hobbienum = firstplacerate.HobbieNum;
                                ratedwithouthobbie.RemoveAt(0);
                                 hobbiename = db.tblHobbie.Where(x => x.hobbieNum == hobbienum).FirstOrDefault().hobbieName;
                                type = placetypes[hobbiename];
                                if (currentplacetype != type  && (mysuggested.endTime - mysuggested.startTime >= TimeSpan.FromHours(firstplacerate.Minhours)))
                                {
                                    double hobbierank = ratedh.Where(x => x.HobbieNum == hobbienum).FirstOrDefault().Label;
                                    mysuggested.normalizehobbierank = (hobbierank - 1.0) / (75.0 - 1.0);
                                    mysuggested.rank = calculatemeetingscore(mysuggested.normalizehobbierank, mysuggested.prefferedtimerate, fav,db);
                                    mysuggested.hobbieNum= hobbienum;
                                    if (placeslist[type].Count == 10)
                                    {
                                        places = placeslist[type];
                                    }
                                    else
                                    {
                                        places = new List<PlaceResult>();
                                        QuerySnapshot snapshot = await _googleservices._firestoreDb.Collection("Places").WhereEqualTo("type", type).GetSnapshotAsync();
                                        var filteredPlaces = snapshot.Documents
                                        .Where(placeDoc =>
                                         placeDoc.GetValue<double>("latitude") >= southLatitude &&
                                         placeDoc.GetValue<double>("latitude") <= northLatitude &&
                                         placeDoc.GetValue<double>("longitude") >= westlongitude &&
                                         placeDoc.GetValue<double>("longitude") <= eastlongitude)
                                         .ToList();

                                        //לבצע סינון לפני הרצת הלולאה לפי דירוג וכמות מדרגים

                                        foreach (DocumentSnapshot docsnap in filteredPlaces)
                                        {
                                            double docLatitude = docsnap.GetValue<double>("latitude");
                                            double docLongitude = docsnap.GetValue<double>("longitude");
                                            double distance = Googlecloudfunctions.CalculateDistance(midLat, midLon, docLatitude, docLongitude);
                                            double radiuskm = radius / 800;
                                            if (distance <= radiuskm)
                                            {
                                                string placeid = docsnap.GetValue<string>("Placeid");
                                                string placejson = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{placeid}", _googleservices);
                                                if(placejson!=null)
                                                {
                                                    PlaceResult pr = new PlaceResult();
                                                    pr = JsonConvert.DeserializeObject<PlaceResult>(placejson);
                                                    if (pr.PlaceId == null)
                                                    {
                                                        SinglePlaceroot prsing = new SinglePlaceroot();
                                                        prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(placejson);
                                                        pr = prsing.Result;


                                                    }
                                                  
                                                        placetorun.Add(pr);
                                                    
                                                }
                                               
                                            }
                                         

                                        }

                                        if (placetorun.Count >= 10)
                                        {
                                            places = placetorun;
                                        }
                                        else
                                        {
                                            string response = await GetPlacesAsync(_googleservices.googlemapscred, midLat, midLon, radius, type);
                                            places = Extractingfromjson.ExtractPlacesFromJson(response);
                                            SinglePlaceroot prsing = new SinglePlaceroot();
                                            PlaceResult pr = new PlaceResult();
                                            foreach (PlaceResult placeto in places)
                                            {
                                                string fullplace = await openinghours(_googleservices.googlemapscred, placeto.PlaceId);
                                                prsing = JsonConvert.DeserializeObject<SinglePlaceroot>(fullplace);
                                                pr = prsing.Result;
                                                string prconverted = JsonConvert.SerializeObject(pr);
                                                string ifexist = await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{pr.PlaceId}", _googleservices);
                                                if (ifexist == null)
                                                {
                                                    CollectionReference collection = _googleservices._firestoreDb.Collection("Places");
                                                    GeoPoint gepoint = new GeoPoint(pr.Geometry.Location.Latitude, pr.Geometry.Location.Longitude);
                                                    Dictionary<string, object> docdata = new Dictionary<string, object>
                                                   {
                                        {"Placeid", pr.PlaceId },
                                        {"latitude", gepoint.Latitude },
                                        {"longitude", gepoint.Longitude },
                                        {"type", type }
                                                };

                                                    DocumentReference docref = await collection.AddAsync(docdata);
                                                    await Googlecloudfunctions.UploadJsonToGoogleCloudStorage(prconverted, $"Places/{pr.PlaceId}", _googleservices);
                                                    placetorun.Add(pr);

                                                }
                                                else
                                                {

                                                    placetorun.Add(pr);

                                                }


                                            }
                                        


                                        }
                                    }

                                    places = placetorun;
                                    places = calculatebaysienrank(places);
                                    places.Sort((x, y) => y.bayesianrank.CompareTo(x.bayesianrank));
                                    currentplacetype = type;
                                    break;
                                }

                            }

                        

                          
                        }
                        else
                        {
                            placefound = true;
                            continue;
                        }


                    }



                    foreach (PlaceResult place in places)
                        {
                            if (placefound)
                            {
                                break;
                            }

                        OpeningHoursDetails openingHoursDetails = place.OpeningHours;


                            if (openingHoursDetails != null || type=="park" )
                            {

                            if (type == "park" && openingHoursDetails==null)
                            {
                                LoctationDTO dtoloc = new LoctationDTO();
                                tblLoctation loctocheck = db.tblLoctation.Where(x => x.longitude == place.Geometry.Location.Longitude && x.latitude == place.Geometry.Location.Latitude).FirstOrDefault();
                                if (loctocheck == null)
                                {
                                    tblLoctation locationnew = new tblLoctation();
                                    locationnew.latitude = place.Geometry.Location.Latitude;
                                    locationnew.longitude = place.Geometry.Location.Longitude;
                                    locationnew.city = place.Name;
                                    locationnew.Placeid= place.PlaceId;
                                    db.tblLoctation.Add(locationnew);
                                    db.SaveChanges();
                                    dtoloc.latitude = locationnew.latitude;
                                    dtoloc.longitude = locationnew.longitude;
                                    dtoloc.city = locationnew.city;
                                    mysuggested.locatation = dtoloc;
                                    mysuggested.longitude = dtoloc.longitude;
                                    mysuggested.latitude = dtoloc.latitude;
                                }
                                else
                                {
                                    dtoloc.latitude = loctocheck.latitude;
                                    dtoloc.longitude = loctocheck.longitude;
                                    dtoloc.city = loctocheck.city;
                                    if (loctocheck.Placeid == null)
                                    {
                                        loctocheck.Placeid=place.PlaceId;
                                        db.SaveChanges();
                                    }
                                    mysuggested.locatation = dtoloc;
                                    mysuggested.latitude = loctocheck.latitude;
                                    mysuggested.longitude = loctocheck.longitude;
                                }
                                mysuggested.place = place;
                                placefound = true;
                                break;

                            }
                            else
                            {
                                

                                List<Period> opcloseday = new List<Period>();
                                foreach (Period period in openingHoursDetails.Periods)
                                {
                                    if(period.Open!=null && period.Close != null)
                                    {
                                        if(period.Open.Day==currentDayOfWeek && period.Close.Day== currentDayOfWeek)
                                        {
                                            opcloseday.Add(period);
                                        }
                                        else if(period.Open.Day==currentDayOfWeek && period.Close.Day== currentDayOfWeek+1 && TimeSpan.Parse(period.Open.Time) > TimeSpan.Parse(period.Close.Time))
                                    {

                                        opcloseday.Add(period);


                                    }
                                        else if(period.Open.Day==currentDayOfWeek-1 && period.Close.Day==currentDayOfWeek && TimeSpan.Parse(period.Close.Time) > mysuggested.endTime)
                                    {
                                        opcloseday.Add(period);

                                    }
                                }
                                }

                                foreach (Period period in opcloseday)
                                {
                                    TimeSpan timeopen = TimeSpan.ParseExact(period.Open.Time, "hhmm", CultureInfo.InvariantCulture);
                                    TimeSpan timeclose = TimeSpan.ParseExact(period.Close.Time, "hhmm", CultureInfo.InvariantCulture);
                                TimeSpan mysuggestedendfixed = mysuggested.endTime;
                                TimeSpan mysuggestedstartfixed= mysuggested.startTime;

                                if (mysuggested.startTime > mysuggested.endTime )
                                {
                                    mysuggestedendfixed = mysuggestedendfixed.Add(TimeSpan.FromDays(1));
                                }

                                if(period.Open.Day == currentDayOfWeek - 1)
                                {
                                    mysuggestedendfixed = mysuggestedendfixed.Add(TimeSpan.FromDays(1));
                                    mysuggestedstartfixed= mysuggestedstartfixed.Add(TimeSpan.FromDays(1));


                                }

                                if (timeopen > timeclose)
                                {
                                    timeclose= timeclose.Add(TimeSpan.FromDays(1));
                                }

                                    if (mysuggestedstartfixed >= timeopen && mysuggestedendfixed <= timeclose)
                                    {
                                        LoctationDTO dtoloc = new LoctationDTO();
                                        tblLoctation loctocheck = db.tblLoctation.Where(x => x.longitude == place.Geometry.Location.Longitude && x.latitude == place.Geometry.Location.Latitude).FirstOrDefault();
                                        if (loctocheck == null)
                                        {
                                            tblLoctation locationnew = new tblLoctation();
                                            locationnew.latitude = place.Geometry.Location.Latitude;
                                            locationnew.longitude = place.Geometry.Location.Longitude;
                                            locationnew.city = place.Name;
                                            locationnew.Placeid = place.PlaceId;
                                            db.tblLoctation.Add(locationnew);
                                            db.SaveChanges();
                                            dtoloc.latitude = locationnew.latitude;
                                            dtoloc.longitude = locationnew.longitude;
                                            dtoloc.city = locationnew.city;
                                            mysuggested.locatation = dtoloc;
                                            mysuggested.longitude = dtoloc.longitude;
                                            mysuggested.latitude = dtoloc.latitude;
                                        }
                                        else
                                        {
                                            dtoloc.latitude = loctocheck.latitude;
                                            dtoloc.longitude = loctocheck.longitude;
                                            dtoloc.city = loctocheck.city;
                                            dtoloc.Placeid = place.PlaceId;
                                            mysuggested.locatation = dtoloc;
                                            mysuggested.latitude = loctocheck.latitude;
                                            mysuggested.longitude = loctocheck.longitude;
                                        }
                                        mysuggested.place = place;
                                        placefound = true;
                                        return mysuggested;




                                    }
                                }
                            }
                            }

                            PlaceResult place1= placeslist[type].Where(x=> x.PlaceId==place.PlaceId).FirstOrDefault();

                        if (place1==null)
                        {
                            placeslist[type].Add(place);

                        }



                    }
                    initialrunning = false;
                    
                }



               

            
            return mysuggested;


        }
        static async Task<string> GetPlacesAsync(string apiKey, double lat, double lon, double radius, string type)
        {
            string url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius={radius}&type={type}&key={apiKey}";
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
            

        }

        static async Task<string> openinghours(string apiKey, string placeid)
        {
            string url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeid}&key={apiKey}";
            HttpClient client = new HttpClient();
            HttpResponseMessage response= await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();

        }

        static (double, double) FindMidpoint(double lat1, double lon1, double lat2, double lon2)
        {
            double lat1Radians = DegreeToRadians(lat1);
            double lon1Radians = DegreeToRadians(lon1);
            double lat2Radians = DegreeToRadians(lat2);
            double lon2Radians = DegreeToRadians(lon2);

            double midLatRadians = (lat1Radians + lat2Radians) / 2;
            double midLonRadians = (lon1Radians + lon2Radians) / 2;

            double midLat = RadiansToDegrees(midLatRadians);
            double midLon = RadiansToDegrees(midLonRadians);

            return (midLat, midLon);
        }
        static double DegreeToRadians(double degree)
        {
            return degree * (Math.PI / 180);
        }

        static double RadiansToDegrees(double radians)
        {
            return radians * (180 / Math.PI);
        }
        public static List<Tuple<TimeSpan, TimeSpan>>  Findifcollapse(Tuple<TimeSpan,TimeSpan> Timecheck, List<Events> userevents, List<Events> user1events)
        {
            List<Tuple<TimeSpan, TimeSpan>> newlistspan = new List<Tuple<TimeSpan, TimeSpan>>();
            if (userevents == null) userevents = new List<Events>();
            if (user1events == null) user1events = new List<Events>();
            List<Events> combinedEvents = userevents.Concat(user1events).ToList();
            combinedEvents = combinedEvents.OrderBy(x => x.starttime).ToList();

            List<Tuple<TimeSpan, TimeSpan>> restirct = new List<Tuple<TimeSpan, TimeSpan>>();
            TimeSpan periodstarttime = Timecheck.Item1;
            TimeSpan periodendtime = Timecheck.Item2;

            if (Timecheck.Item1 > Timecheck.Item2)
            {
                TimeSpan oneday = TimeSpan.FromDays(1);
                periodendtime = periodendtime.Add(oneday);
            }
            Tuple<TimeSpan, TimeSpan> newTimecheck = new Tuple<TimeSpan, TimeSpan>(periodstarttime, periodendtime);
            List<Tuple<TimeSpan, TimeSpan>> eventstoreturn = new List<Tuple<TimeSpan, TimeSpan>>();
            List<Tuple<TimeSpan, TimeSpan>> newevreturn = new List<Tuple<TimeSpan, TimeSpan>>();

            TimeSpan currentstarttime = Timecheck.Item1;






            foreach (Events e in combinedEvents)
            {
                TimeSpan eventStartTime = e.starttime;
                TimeSpan eventEndTime = e.endtime;

                if (eventEndTime < eventStartTime) // the event ends on the next day
                {
                    eventEndTime = eventEndTime.Add(TimeSpan.FromDays(1));
                }

                if(currentstarttime>= newTimecheck.Item2)
                {
                    break;
                }



                if (eventStartTime <= newTimecheck.Item1 && eventEndTime >= newTimecheck.Item2)
                {
                    return eventstoreturn;
                }
                else if ((e.starttime - currentstarttime >= TimeSpan.FromHours(1)))
                {

                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentstarttime, eventStartTime));


                }

                currentstarttime = eventEndTime > currentstarttime ? eventEndTime : currentstarttime;


            }
            if (newTimecheck.Item2 - currentstarttime >= TimeSpan.FromHours(1))
            {
                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentstarttime, newTimecheck.Item2));
            }



            foreach (Tuple<TimeSpan, TimeSpan> e in eventstoreturn)
            {
                if (e.Item2 - e.Item1 > TimeSpan.FromHours(3))
                {

                    double j = (e.Item2 - e.Item1).TotalHours;
                    TimeSpan resultimespan = new TimeSpan();
                    TimeSpan oldstart = e.Item1;

                    while (j > 0)
                    {
                        if (j > 3)
                        {
                            TimeSpan add3hours = TimeSpan.FromHours(3);
                            resultimespan = oldstart.Add(add3hours);
                            if (resultimespan.Days > 0)
                            {
                                TimeSpan resultfixed = new TimeSpan(resultimespan.Hours, resultimespan.Minutes, resultimespan.Seconds);
                                newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(oldstart, resultfixed));


                            }
                            else
                            {
                                newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(oldstart, resultimespan));
                            }
                            oldstart = resultimespan;
                        }
                        else
                        {
                            TimeSpan addhours = TimeSpan.FromHours(j);
                            resultimespan = oldstart.Add(addhours);

                            if (resultimespan - oldstart >= TimeSpan.FromHours(1))
                            {
                                if (resultimespan.Days > 0)
                                {
                                    TimeSpan resultfixed = new TimeSpan(resultimespan.Hours, resultimespan.Minutes, resultimespan.Seconds);
                                    newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(oldstart, resultfixed));


                                }
                                else
                                {
                                    newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(oldstart, resultimespan));
                                }
                            }
                        }

                        j = j - 3;
                    }

                }
                else
                {
                    if (e.Item2.Days > 0)
                    {

                        TimeSpan resultfixed = new TimeSpan(e.Item2.Hours, e.Item2.Minutes, e.Item2.Seconds);
                        newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(e.Item1, resultfixed));


                    }
                    else
                    {
                        newevreturn.Add(new Tuple<TimeSpan, TimeSpan>(e.Item1, e.Item2));
                    }
                }
            }

            return newevreturn;


            











        }
        static public DateTime GetDateForWeekday(string dayOfWeek, TimeSpan starttime)
        {
            int dayofweekint = int.Parse(dayOfWeek);
            DateTime today = DateTime.Today;
            int currentDayOfWeek = (int)today.DayOfWeek;
            int daysUntilTargetDay;
            TimeSpan additional = new TimeSpan(5, 0, 0);
            TimeSpan newtimestart= starttime.Add(additional);
            

           
                daysUntilTargetDay = dayofweekint - currentDayOfWeek;
                if (daysUntilTargetDay < 0) // Ensure the result is positive
                {
                    daysUntilTargetDay += 7;
                }

                if(daysUntilTargetDay==0 && today.TimeOfDay<newtimestart)
            {
                    daysUntilTargetDay = 7;
                }
            

            return today.AddDays(daysUntilTargetDay);
        }

        static public double calculatemeetingscore(double hobbyranknormalized,double prefferedtimerate,tblFavoriteContact fav , igroup192_prodEntities _db)
        {

            double avaragescore = 0;
            List<tblSuggestedMeeting> actual = _db.tblSuggestedMeeting.Where(x => (x.phoneNum1 == fav.phoneNum1 && x.phoneNum2 == fav.phoneNum2) || (x.phoneNum1 == fav.phoneNum2 &&
            x.phoneNum2 == fav.phoneNum1)).ToList();

            List<tblActualMeeting> actulist = new List<tblActualMeeting>();
            foreach(tblSuggestedMeeting item in actual)
            {
                tblActualMeeting act = _db.tblActualMeeting.Where(x => x.meetingNum == item.meetingNum).FirstOrDefault();
                if (act != null)
                {
                    actulist.Add(act);
                }

            }
            if (actulist.Count>0 )
            {
                foreach(tblActualMeeting itemact in actulist)
                {
                    double rankuser1 = Convert.ToDouble(itemact.rankUser1);
                    double rankuser2= Convert.ToDouble(itemact.rankUser2);
                    double avarage = (rankuser1 + rankuser2) / 2.0;
                    avaragescore += avarage;
                }
                avaragescore = avaragescore / actulist.Count();
                avaragescore = (avaragescore - 1.0) / (5.0 - 1.0);

            }

            double sugmeetingrank = (0.3 * hobbyranknormalized) + (0.3 * prefferedtimerate) + (0.4 * avaragescore);
            return sugmeetingrank;

        }

    }


}
