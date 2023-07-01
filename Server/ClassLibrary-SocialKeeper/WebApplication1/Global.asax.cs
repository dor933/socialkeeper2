using ClassLibrary_SocialKeeper;
using FirebaseAdmin.Messaging;
using Hangfire;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.UI.WebControls;
using WebApplication1;


namespace WebApplication1
{
    public class WebApiApplication : System.Web.HttpApplication
    {



        private IEnumerable<IDisposable> GetHangfireServers()
        {
            Hangfire.GlobalConfiguration.Configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage("data source=media.ruppin.ac.il;initial catalog=igroup192_prod;user id=igroup192;password=igroup192_88856;MultipleActiveResultSets=True;App=EntityFramework;TrustServerCertificate=True"
);



            yield return new BackgroundJobServer();
        }
        protected void Application_Start()
        {

            AreaRegistration.RegisterAllAreas();
            System.Web.Http.GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            HangfireAspNet.Use(GetHangfireServers);


            RecurringJob.AddOrUpdate("notifmaker", () => NotificationsChecker(), Cron.Minutely);







        }


      



        public async Task<string> NotificationsChecker()
        {
            using (var _db = new igroup192_prodEntities())
            {
                try
                {

                    System.Diagnostics.Debug.WriteLine("Hello world from Hangfire!");
                    DateTime now = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
                    DateTime tommorrow = now.AddDays(1);
                    TimeSpan timenow = new TimeSpan(now.Hour, now.Minute, now.Second);

                    TimeSpan onehour = new TimeSpan(1, 30, 0);
                    List<tblSuggestedMeeting> suggestedcheck = _db.tblSuggestedMeeting.Where(x => (x.date == now || x.date == tommorrow) && x.status == "A").ToList();

                    foreach (tblSuggestedMeeting sug in suggestedcheck)
                    {
                        //לטפל במקרה של פגישות שמתחילות בין השעה 00 לשעה 01 מבחינת ההתראות
                        DateTime relevanttime = now;
                        TimeSpan endtime = sug.endTime;
                        TimeSpan starttime = sug.startTime;
                        

                        if (sug.startTime >= new TimeSpan(00,00,00) && sug.startTime< new TimeSpan(01,00,00))
                        {
                            starttime.Add(new TimeSpan(1, 0, 0, 0));

                        }

                        if (timenow.Add(onehour) >= starttime && sug.date == relevanttime && sug.isremindersend != true)
                        {
                            NotificationDTO notifyupcoming = new NotificationDTO();
                            notifyupcoming.Notificationtype = "Suggested meeting";
                            notifyupcoming.senderphonenum = sug.phoneNum1;
                            notifyupcoming.targetuserphonenum = sug.phoneNum1;
                            notifyupcoming.Title = $"Meeting Alert! ";
                            notifyupcoming.Body = $"Your meeting with {sug.tblUser1.userName} is starting soon! ";
                            notifyupcoming.Data = new Dictionary<string, string>
                    {
                        {"meetingnum", $"{sug.meetingNum}" },
                        {"notiftype", "Upcomingmeeting" },

                    };
                            NotificationDTO notifyupcoming2 = new NotificationDTO();
                            notifyupcoming2.Notificationtype = "Suggested meeting";
                            notifyupcoming2.senderphonenum = sug.phoneNum2;
                            notifyupcoming2.targetuserphonenum = sug.phoneNum2;
                            notifyupcoming2.Title = $"Meeting Alert! ";
                            notifyupcoming2.Body = $"Your meeting with {sug.tblUser.userName} is starting soon! ";
                            notifyupcoming2.Data = new Dictionary<string, string>
                    {
                        {"meetingnum", $"{sug.meetingNum}" },
                        {"notiftype", "Upcomingmeeting" },

                    };

                            Debug.WriteLine(notifyupcoming.Body);
                            Debug.WriteLine(sug.phoneNum1);
                            Debug.WriteLine(sug.phoneNum2);

                            await Notificationsmaker.Notify(notifyupcoming);

                            await Notificationsmaker.Notify(notifyupcoming2);

                            sug.isremindersend = true;
                            _db.SaveChanges();


                        }

                    }

                    Debug.WriteLine("Success");
                    await CreateActualmeeting();
                    return "Success";
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Failed", ex.Message);
                    return "Falied";
                }
            }

        }





        public async Task<string> CreateActualmeeting()
        {
            using (var _db = new igroup192_prodEntities())
            {
                try
                {
                    Debug.WriteLine("Into actual meeting creator!");
                    DateTime now = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
                    DateTime yestarday= now.AddDays(-1);
                    TimeSpan timenow = new TimeSpan(now.Hour, now.Minute, now.Second);

                    TimeSpan onehour = new TimeSpan(1, 0, 0);
                    List<tblSuggestedMeeting> suggestedcheck = _db.tblSuggestedMeeting.Where(x => (x.date == now || x.date == yestarday) && x.status == "A").ToList();
                    foreach (tblSuggestedMeeting sug in suggestedcheck)
                    {
                        DateTime relevanttime = now;
                        TimeSpan endtime = sug.endTime;
                        TimeSpan starttime = sug.startTime;

                        if (sug.startTime > sug.endTime)
                        {
                            timenow.Add(new TimeSpan(1, 0, 0, 0));
                            relevanttime = yestarday;

                        }

                        if (sug.endTime.Add(onehour) <= timenow && sug.date == relevanttime && sug.isaskforranknotif != true)
                        {

                            tblActualMeeting actmeeting = new tblActualMeeting();
                            actmeeting.meetingNum = sug.meetingNum;
                            actmeeting.latitude = sug.latitude;
                            actmeeting.longitude = sug.longitude;
                            actmeeting.rankUser1 = 1.ToString();
                            actmeeting.rankUser2 = 1.ToString();
                            actmeeting.hobbieNum = int.Parse(sug.hobbieNum.ToString());
                            _db.tblActualMeeting.Add(actmeeting);
                            _db.SaveChanges();

                            SuggestedDTO suggestedDTO = new SuggestedDTO();
                            string placeid = _db.tblLoctation.Where(x => x.latitude == sug.latitude && x.longitude == sug.longitude).FirstOrDefault().Placeid;
                            suggestedDTO.place.PlaceId = placeid;
                            suggestedDTO.phoneNum1 = sug.phoneNum1;
                            suggestedDTO.date = sug.date;
                            suggestedDTO.phoneNum2 = sug.phoneNum2;
                            suggestedDTO.meetingNum = sug.meetingNum;
                            suggestedDTO.startTime = sug.startTime;
                            suggestedDTO.endTime = sug.endTime;
                            suggestedDTO.rank = Convert.ToDouble(sug.rank);
                            suggestedDTO.hobbieNum = int.Parse(sug.hobbieNum.ToString());
                            suggestedDTO.longitude = sug.longitude;
                            suggestedDTO.latitude = sug.latitude;
                            suggestedDTO.status = sug.status;
                            tblUser user1 = _db.tblUser.Where(x => x.phoneNum1 == sug.phoneNum1).FirstOrDefault();
                            tblUser user2 = _db.tblUser.Where(x => x.phoneNum1 == sug.phoneNum2).FirstOrDefault();
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
                            suggestedDTO.user1 = userexist;
                            suggestedDTO.user2 = userexist2;


                            Actualmeetingdto actdto = new Actualmeetingdto();
                            actdto.meetingNum = actmeeting.meetingNum;
                            actdto.latitude = actmeeting.latitude;
                            actdto.longitude = actmeeting.longitude;
                            actdto.rankUser1 = actdto.rankUser1;
                            actdto.rankUser2 = actdto.rankUser2;
                            actdto.hobbieNum = actdto.hobbieNum;
                            actdto.tblSuggestedMeeting = suggestedDTO;
                            await Notifyendmeet(actdto);
                            sug.isaskforranknotif = true;
                            _db.SaveChanges();
                        }
                        else
                        {
                            Debug.WriteLine("Not relevant meeting");
                        }
                    }
                    return "Created and sended";

                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.Message);
                    Debug.WriteLine("Error");
                    return "Error actual";
                }



            }




        }

        public async Task<string> Notifyendmeet(Actualmeetingdto actdto)
        {
            NotificationDTO notifendmeet = new NotificationDTO();
            notifendmeet.Notificationtype = "Meeting Ended";
            notifendmeet.senderphonenum = actdto.tblSuggestedMeeting.phoneNum1;
            notifendmeet.targetuserphonenum = actdto.tblSuggestedMeeting.phoneNum1;
            notifendmeet.Title = $"How was your Meeting with {actdto.tblSuggestedMeeting.user2.userName}?";
            notifendmeet.Body = $"Rate your meeting now!";
            notifendmeet.Data = new Dictionary<string, string>
            {
             {"meetingnum", $"{actdto.meetingNum}" },
             {"notiftype", "Upcomingmeeting" },
            };

            await Notificationsmaker.Notify(notifendmeet);

            NotificationDTO notifendmeet2 = new NotificationDTO();
            notifendmeet2.Notificationtype = "Meeting Ended";
            notifendmeet2.senderphonenum = actdto.tblSuggestedMeeting.phoneNum2;
            notifendmeet2.targetuserphonenum = actdto.tblSuggestedMeeting.phoneNum2;
            notifendmeet2.Title = $"How was your Meeting with {actdto.tblSuggestedMeeting.user1.userName}?";
            notifendmeet2.Body = $"Rate your meeting now!";
            notifendmeet2.Data = new Dictionary<string, string>
            {
             {"meetingnum", $"{actdto.meetingNum}" },
             {"notiftype", "Upcomingmeeting" },
            };

            await Notificationsmaker.Notify(notifendmeet2);

            Debug.WriteLine("Notified successfully");
            Debug.WriteLine(notifendmeet.targetuserphonenum.ToString());
            Debug.WriteLine(notifendmeet2.targetuserphonenum.ToString());

            return "Notifications sended";

        }
    }
}