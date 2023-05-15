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
         
        static public Dictionary<string,string> SuggestMeetingTimes(List<RatingData> data, int numSuggestions)
        {
           
            double[,] combinedPreferences = new double[7, 3];
            for (int i = 0; i < 21; i++)
            {
                int day = i / 3;
                int time = i % 3;

                double user1Preference = data[i].Label;
                double user2Preference = data[i + 21].Label;

                combinedPreferences[day, time] = user1Preference * user2Preference;
            }

            List<Tuple<int, int>> sortedIndices = new List<Tuple<int, int>>();
            for (int i = 0; i < 7; i++)
            {
                for (int j = 0; j < 3; j++)
                {
                    sortedIndices.Add(new Tuple<int, int>(i, j));
                }
            }

            sortedIndices.Sort((a, b) => combinedPreferences[b.Item1, b.Item2].CompareTo(combinedPreferences[a.Item1, a.Item2]));
            Dictionary<string,string> bestMeetingTimes = new Dictionary<string, string>();
            string[] times = { "morning", "evening", "night" };

            for (int i = 0; i < numSuggestions; i++)
            {
                int day = sortedIndices[i].Item1;
                string daystring= day.ToString();
                int time = sortedIndices[i].Item2;
                string timestring= times[time].ToString();
                bestMeetingTimes.Add(daystring, timestring);
            }

            return bestMeetingTimes;


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

        public static async Task<List<SuggestedDTO>> Generatemeetings(Googlecloudservices _googleservices,List<SuggestedDTO> mysuggested, igroup192_prodEntities db, List<RatingData> ratedh)
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
           
      



            foreach (SuggestedDTO sugitem in mysuggested)
            {
                RatingData highesthobrank = ratedh.Where(x => x.HobbieNum == sugitem.hobbieNum).FirstOrDefault();
                List<RatingData> ratedwithouthobbie= ratedh.Where(x=> x.HobbieNum!= sugitem.hobbieNum).ToList();
                bool placefound = false;
                int currentDayOfWeek = (int)sugitem.date.DayOfWeek;
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

                double lat1 = Convert.ToDouble(sugitem.user1.citylatt);
                double lon1 = Convert.ToDouble(sugitem.user1.citylong);
                double lat2 = Convert.ToDouble(sugitem.user2.citylatt);
                double lon2 = Convert.ToDouble(sugitem.user2.citylong);

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
                         hobbiename = db.tblHobbie.Where(x => x.hobbieNum == sugitem.hobbieNum).FirstOrDefault().hobbieName;
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
                                    string placejson= await Googlecloudfunctions.Getfilefromcloudstorage($"Places/{placeid}",_googleservices);
                                    if(placejson!=null)
                                    {

                                        PlaceResult pr = new PlaceResult();
                                         pr= JsonConvert.DeserializeObject<PlaceResult>(placejson);
                                        if (pr.PlaceId == null)
                                        {
                                            SinglePlaceroot prsing = new SinglePlaceroot();
                                            prsing= JsonConvert.DeserializeObject<SinglePlaceroot>(placejson);
                                            pr = prsing.Result;


                                        }

                                        if (pr.UserRatingsTotal >= 10 && pr.Rating>4)
                                        {
                                            placetorun.Add(pr);
                                        }
                                    }
                                   
                                }

                                if (placetorun.Count > 20)
                                {
                                    break;
                                }
                               
                            }

                            if (placetorun.Count >= 13)
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
                                    
                                     pr = JsonConvert.DeserializeObject<PlaceResult>(ifexist);
                                    placetorun.Add(pr);

                                }
                            }
                                places = placetorun;


                                }
                            currentplacetype = type;
                            
                            
                        }
                        places= places.Where(x=> x.UserRatingsTotal>=5).ToList();
                        places.Sort((x, y) => y.Rating.CompareTo(x.Rating));
                        //filter if total rating is less than 5

                        
                       
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
                                if (currentplacetype != type  && (sugitem.endTime - sugitem.startTime >= TimeSpan.FromHours(firstplacerate.Minhours)))
                                {
                                    double hobbierank = ratedh.Where(x => x.HobbieNum == hobbienum).FirstOrDefault().Label;
                                    sugitem.normalizehobbierank = (hobbierank - 1.0) / (25.0 - 1.0);
                                    sugitem.rank = calculatemeetingscore(sugitem.normalizehobbierank, sugitem.prefferedtimerate, sugitem.normalizeuserrank);
                                    sugitem.hobbieNum= hobbienum;
                                    if (placeslist[type].Count == 20)
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
                                                    if (pr.UserRatingsTotal >= 10 && pr.Rating>4)
                                                    {
                                                        placetorun.Add(pr);
                                                    }
                                                }
                                               
                                            }

                                        }

                                        if (placetorun.Count >= 13)
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

                                                    pr = JsonConvert.DeserializeObject<PlaceResult>(ifexist);
                                                    placetorun.Add(pr);

                                                }


                                            }
                                        


                                        }
                                    }

                                    places = placetorun;
                                    places = places.Where(x => x.UserRatingsTotal >= 5).ToList();
                                    places.Sort((x, y) => y.Rating.CompareTo(x.Rating));
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

                            if (openingHoursDetails != null || type=="park")
                            {

                            if (type == "park")
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
                                    sugitem.locatation = dtoloc;
                                    sugitem.longitude = dtoloc.longitude;
                                    sugitem.latitude = dtoloc.latitude;
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
                                    sugitem.locatation = dtoloc;
                                    sugitem.latitude = loctocheck.latitude;
                                    sugitem.longitude = loctocheck.longitude;
                                }
                                sugitem.place = place;
                                placefound = true;
                                break;

                            }
                            else
                            {

                                List<Period> opcloseday = openingHoursDetails.Periods.Where(x => x.Open.Day == currentDayOfWeek && x.Close.Day == currentDayOfWeek).ToList();

                                foreach (Period period in opcloseday)
                                {
                                    TimeSpan timeopen = TimeSpan.ParseExact(period.Open.Time, "hhmm", CultureInfo.InvariantCulture);
                                    TimeSpan timeclose = TimeSpan.ParseExact(period.Close.Time, "hhmm", CultureInfo.InvariantCulture);

                                    if (sugitem.startTime >= timeopen && sugitem.endTime <= timeclose)
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
                                            sugitem.locatation = dtoloc;
                                            sugitem.longitude = dtoloc.longitude;
                                            sugitem.latitude = dtoloc.latitude;
                                        }
                                        else
                                        {
                                            dtoloc.latitude = loctocheck.latitude;
                                            dtoloc.longitude = loctocheck.longitude;
                                            dtoloc.city = loctocheck.city;
                                            dtoloc.Placeid = place.PlaceId;
                                            sugitem.locatation = dtoloc;
                                            sugitem.latitude = loctocheck.latitude;
                                            sugitem.longitude = loctocheck.longitude;
                                        }
                                        sugitem.place = place;
                                        placefound = true;
                                        break;




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
            List<Tuple<TimeSpan, TimeSpan>> restirct = new List<Tuple<TimeSpan, TimeSpan>>();
            Tuple<TimeSpan, TimeSpan> newTimecheck = new Tuple<TimeSpan, TimeSpan>(Timecheck.Item1, Timecheck.Item2);
            List<Tuple<TimeSpan, TimeSpan>> eventstoreturn = new List<Tuple<TimeSpan, TimeSpan>>();
            bool haschanged = false;



            foreach (Events e in combinedEvents)
                {
                    if (e.starttime <= newTimecheck.Item1 && e.endtime >= newTimecheck.Item2)
                    {
                    return eventstoreturn;
                    }
                    else if ((e.starttime >= newTimecheck.Item1 && e.endtime <= newTimecheck.Item2))
                    {
                       newTimecheck= new Tuple<TimeSpan, TimeSpan>(e.starttime, e.endtime);
                    haschanged = true;

                   
                    }
                    else if (e.starttime >= newTimecheck.Item1 && e.endtime >= newTimecheck.Item2 && e.starttime<=newTimecheck.Item2)
                    {

                    if (e.endtime > Timecheck.Item2)
                    {
                        TimeSpan tempspan = Timecheck.Item2;
                        newTimecheck = new Tuple<TimeSpan, TimeSpan>(newTimecheck.Item1, tempspan);
                    }
                    else
                    {
                        newTimecheck = new Tuple<TimeSpan, TimeSpan>(newTimecheck.Item1, e.starttime);
                    }

                    haschanged = true;



                }
                else if (e.starttime <= newTimecheck.Item1 && e.endtime <= newTimecheck.Item2 && e.endtime>=newTimecheck.Item1)
                    {
                    if (e.starttime < Timecheck.Item1)
                    {
                        TimeSpan tempspan = Timecheck.Item1;
                        newTimecheck = new Tuple<TimeSpan, TimeSpan>(tempspan, e.endtime);
                    }
                    else
                    {
                        newTimecheck = new Tuple<TimeSpan, TimeSpan>(e.starttime, newTimecheck.Item2);
                    }
                    haschanged = true;

                }
                else if(e.starttime<= newTimecheck.Item1 && e.endtime <= newTimecheck.Item1)
                    {
                    if (e.starttime < Timecheck.Item1)
                    {
                        TimeSpan tempspan = Timecheck.Item1;
                        restirct.Add(new Tuple<TimeSpan, TimeSpan>(tempspan, e.endtime));
                    }
                    else
                    {
                        restirct.Add(new Tuple<TimeSpan, TimeSpan>(e.starttime,e.endtime));
                    }
                    haschanged = true;

                }
                else if(e.starttime>= newTimecheck.Item2 && e.starttime<Timecheck.Item2)
                {
                    if (e.endtime > Timecheck.Item2)
                    {
                        TimeSpan tempspan = Timecheck.Item2;
                        restirct.Add(new Tuple<TimeSpan, TimeSpan>(e.starttime, tempspan));
                    }
                    else
                    {

                        restirct.Add(new Tuple<TimeSpan, TimeSpan>(e.starttime, e.endtime));
                    }
                    haschanged = true;


                }
            }

            if(Timecheck.Item1>Timecheck.Item2)
            {
                TimeSpan tempspan = Timecheck.Item2.Add(TimeSpan.FromDays(1));
                Timecheck= new Tuple<TimeSpan, TimeSpan>(Timecheck.Item1, tempspan);
                
            }

              if(!haschanged)
            {
                TimeSpan currentstat = Timecheck.Item1;

                
                    if (Timecheck.Item2 - Timecheck.Item1 > TimeSpan.FromHours(3))
                    {
                        double j = int.Parse((Timecheck.Item2 - Timecheck.Item1).ToString());
                        TimeSpan resultimespan = new TimeSpan();

                        while (j > 0)
                        {
                            if (j > 3)
                            {
                                TimeSpan add3hours = TimeSpan.FromHours(3);
                                resultimespan = currentstat.Add(add3hours);
                                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentstat, resultimespan));
                            }
                            else
                            {
                                TimeSpan addhours = TimeSpan.FromHours(j);
                                resultimespan.Add(addhours);
                            if (Timecheck.Item2 - resultimespan > TimeSpan.FromHours(1))
                            {
                                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(resultimespan, Timecheck.Item2));
                            }
                            }

                            j = j - 3;
                        }
                  
                    }
                else
                {
                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(Timecheck.Item1, Timecheck.Item2));
                }
                return eventstoreturn;


            }

                 
                  List<Tuple<TimeSpan,TimeSpan>> firstres= restirct.Where(x=> x.Item2<=newTimecheck.Item1).ToList();
                  List<Tuple<TimeSpan, TimeSpan>> lastres = restirct.Where(x => x.Item1 >= newTimecheck.Item2).ToList();
                  lastres.Sort((x, y) => x.Item1.CompareTo(y.Item1));
                  firstres.Sort((x, y) => x.Item1.CompareTo(y.Item1));
 

            TimeSpan currentStartTime = newTimecheck.Item2;
                  TimeSpan currenttimebefore = Timecheck.Item1;


            foreach (Tuple<TimeSpan,TimeSpan> restrictedperiod in firstres)
            {

                if (currenttimebefore > restrictedperiod.Item1 && currenttimebefore < restrictedperiod.Item2)
                {
                    currenttimebefore = restrictedperiod.Item2;
                }
                else if (currenttimebefore > restrictedperiod.Item2)
                {
                    break;
                }
                else if (currenttimebefore < restrictedperiod.Item1)
                {
                    if (restrictedperiod.Item1 - currenttimebefore >= TimeSpan.FromHours(1))
                    {
                        if (restrictedperiod.Item1 - currentStartTime > TimeSpan.FromHours(3))
                        {
                            double j = int.Parse((restrictedperiod.Item1 - currentStartTime).ToString());
                            TimeSpan resultimespan = new TimeSpan();

                            while (j > 0)
                            {
                                if (j > 3)
                                {
                                    TimeSpan add3hours = TimeSpan.FromHours(3);
                                    resultimespan = currentStartTime.Add(add3hours);
                                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime, resultimespan));
                                }
                                else
                                {
                                    TimeSpan addhours = TimeSpan.FromHours(j);
                                    resultimespan.Add(addhours);
                                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(resultimespan, restrictedperiod.Item1));
                                }

                                j = j - 3;
                            }
                        }
                        else
                        {
                             eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime, restrictedperiod.Item1));
                        }
                        return eventstoreturn;
                    }

                }
                currenttimebefore = restrictedperiod.Item2;

            }

                  if(newTimecheck.Item1- currenttimebefore> TimeSpan.FromHours(1))
            {
                Tuple<TimeSpan, TimeSpan> timetoreturn = new Tuple<TimeSpan, TimeSpan>(Timecheck.Item1, newTimecheck.Item1);
                eventstoreturn.Add(timetoreturn);
            }

            foreach (var restrictedPeriod in lastres)
            {

                if(currentStartTime> restrictedPeriod.Item1 && currentStartTime < restrictedPeriod.Item2)
                {
                    currentStartTime= restrictedPeriod.Item2;
                }
                else if ( currentStartTime> restrictedPeriod.Item2)
                {
                    break;
                }
                else if (currentStartTime < restrictedPeriod.Item1)
                {
                    if (restrictedPeriod.Item1 - currentStartTime >= TimeSpan.FromHours(1))
                    {
                        if (restrictedPeriod.Item1 - currentStartTime > TimeSpan.FromHours(3))
                        {
                            double j = int.Parse((restrictedPeriod.Item1 - currentStartTime).ToString());
                            TimeSpan resultimespan = new TimeSpan();

                            while (j > 0)
                            {
                                if (j > 3)
                                {
                                    TimeSpan add3hours = TimeSpan.FromHours(3);
                                    resultimespan = currentStartTime.Add(add3hours);
                                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime, resultimespan));
                                }
                                else
                                {
                                    TimeSpan addhours = TimeSpan.FromHours(j);
                                    resultimespan.Add(addhours);
                                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(resultimespan, restrictedPeriod.Item1));
                                }

                                j = j - 3;
                            }
                        }
                        else
                        {
                            eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime, restrictedPeriod.Item1));
                        }
                    }

                }
                currentStartTime = restrictedPeriod.Item2;
            }

            if(Timecheck.Item2-currentStartTime >= TimeSpan.FromHours(1))
            {
                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime,Timecheck.Item2));
            }

            


            return eventstoreturn;


            
            

            
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

        static public double calculatemeetingscore(double hobbyranknormalized,double prefferedtimerate,double normalizedfriendrank)
        {
      

            double sugmeetingrank = (0.4 * hobbyranknormalized) + (0.2 * normalizedfriendrank) + (0.4 * prefferedtimerate);
            return sugmeetingrank;

        }

    }


}
