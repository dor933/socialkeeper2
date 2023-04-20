using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers;
using Microsoft.SqlServer.Server;

namespace ClassLibrary_SocialKeeper
{
    public class RatingData
    {
         public float UserId;
         public int HobbieNum;
        public int Label;
    }

  
    public class Meetings
    {
        static public Dictionary<string,string> SuggestMeetingTimes(List<RatingData> data, int numSuggestions)
        {
            int[,] combinedPreferences = new int[7, 3];
            for (int i = 0; i < 21; i++)
            {
                int day = i / 3;
                int time = i % 3;

                int user1Preference = data[i].Label;
                int user2Preference = data[i + 21].Label;

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
                        return null;
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
                        restirct.Add(new Tuple<TimeSpan, TimeSpan>(tempspan, newTimecheck.Item2));
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
                                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(resultimespan, Timecheck.Item2));
                            }

                            j = j - 3;
                        }
                    return eventstoreturn;
                    }
                else
                {
                    eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(Timecheck.Item1, Timecheck.Item2));
                }
                
               
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

            if(Timecheck.Item2-currentStartTime> TimeSpan.FromHours(1))
            {
                eventstoreturn.Add(new Tuple<TimeSpan, TimeSpan>(currentStartTime,Timecheck.Item2));
            }

            


            return eventstoreturn;


            
            

            
        }
        static public DateTime GetDateForWeekday(string dayOfWeek)
        {
            int dayofweekint = int.Parse(dayOfWeek);
            DateTime today = DateTime.Today;
            int currentDayOfWeek = (int)today.DayOfWeek;
            int daysUntilTargetDay;

           
                daysUntilTargetDay = dayofweekint - currentDayOfWeek;
                if (daysUntilTargetDay < 0) // Ensure the result is positive
                {
                    daysUntilTargetDay += 7;
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
