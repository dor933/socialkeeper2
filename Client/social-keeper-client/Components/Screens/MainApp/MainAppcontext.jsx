import React, { useState, createContext } from 'react'
import uuid from 'uuid';
import * as Calendar from 'expo-calendar';
import axios from 'axios';

export const MainAppcontext  = createContext();

export default function MainAppcontextfunc(props) {

    const [user, setUser] = useState({});
    const [ispersonalactiveated, setIspersonalactiveated] = useState(false);
    const [userevents, setUserevents] = useState([]);
    const [firebaseuser, setFirebaseuser] = useState({});
    const [screenisready, setScreenisready] = useState(false);

    const timeZoneOffset = new Date().toLocaleTimeString('en-us', { timeZone: 'Asia/Jerusalem', timeZoneName: 'short' }).split(' ')[2];

    const addmeetingtocalender = async (meetingtochange,invitedbyfriend) => {

        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  
        let mystartdate=new Date(meetingtochange.date);
        mystartdate.setHours('00','00','00','00')
        mystartdate.setHours(parseInt(meetingtochange.startTime.substring(0,2)));
           mystartdate.setMinutes(parseInt(meetingtochange.startTime.substring(3,5)));
           mystartdate.setSeconds(0);
           let myenddate=new Date(meetingtochange.date);
              myenddate.setHours('00','00','00','00')
           myenddate.setHours(parseInt(meetingtochange.endTime.substring(0,2)));
           myenddate.setMinutes(parseInt(meetingtochange.endTime.substring(3,5)));
           myenddate.setSeconds(0);

        console.log('this is my start date',mystartdate)
        console.log('this is my end date',myenddate)

        let startdatetocompare= new Date(mystartdate);
        let enddatetocompare= new Date(myenddate);


     
        if(startdatetocompare>enddatetocompare){
         
         // add one day to myenddate
            myenddate.setDate(myenddate.getDate()+1);   
        }
        else{
            console.log('start date is smaller than end date')
        }

               const eventobjecttoadd={
            title: invitedbyfriend? 'Meeting with '+meetingtochange.user1.userName : "Meeting with "+meetingtochange.user2.userName ,
            startDate: mystartdate,
            endDate: myenddate,
            location: meetingtochange.place.name,
            notes: invitedbyfriend? 'Meeting with '+meetingtochange.user1.userName: "Meeting with "+meetingtochange.user2.userName ,
            timeZone: timeZoneOffset, 
            
            
            
          }

              try {
                const eventId = await Calendar.createEventAsync(calendars[0].id, eventobjecttoadd);
                
                const sugtoupdate= invitedbyfriend? {
                    meetingNum:meetingtochange.meetingNum,
                    event_id_user2:eventId,
                } : {
                    meetingNum:meetingtochange.meetingNum,
                    event_id:eventId,
                }
                
                const response= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/updateeventid', sugtoupdate)
                console.log('this is the response from updateeventid',response)
                if(invitedbyfriend){
                    let copyofmeetingtochange= user.tblSuggestedMeetings1.find (meeting => meeting.meetingNum === meetingtochange.meetingNum)
                    copyofmeetingtochange.event_id_user2=eventId;
                 
                }
                else{
                   let copyofmeetingtochange= user.tblSuggestedMeetings.find (meeting => meeting.meetingNum === meetingtochange.meetingNum)
                     copyofmeetingtochange.event_id=eventId;
                        const newtblsuggestedmeetings= user.tblSuggestedMeetings.map((item) => {
                            if(item.meetingNum==meetingtochange.meetingNum){
                              return {...item,status:'A',event_id:eventId};
                            }
                            return item;
                          }
                            );  
                            const Newuser={...user}
                            Newuser.tblSuggestedMeetings=newtblsuggestedmeetings;
                            setUser(Newuser)

                 
                }


                if(Calendar.DEFAULT?.id!=undefined){
                const eventId2 = await Calendar.createEventAsync(Calendar.DEFAULT, eventobjecttoadd)
                const sugtoupdate= invitedbyfriend? {
                    meetingNum:meetingtochange.meetingNum,
                    event_id_default_calender_user2:eventId2,
                } : {
                    meetingNum:meetingtochange.meetingNum,
                    event_id_default_calender:eventId2,
                }

                const response2= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/updateeventiddefcal', sugtoupdate)
                console.log('this is the response from updateeventiddefcal',response2)

                if(invitedbyfriend){

                    let copyofmeetingtochange= user.tblSuggestedMeetings1.find (meeting => meeting.meetingNum === meetingtochange.meetingNum)
                    copyofmeetingtochange.event_id_default_calender_user2=eventId2;
              

                }
                else{
                    const newtblsuggestedmeetings= user.tblSuggestedMeetings.map((item) => {
                        if(item.meetingNum==meetingtochange.meetingNum){
                          return {...item,status:'A',event_id_default_calender:eventId2};
                        }
                        return item;
                      });
                      const Newuser={...user}
                        Newuser.tblSuggestedMeetings=newtblsuggestedmeetings;
                    console.log('this is usrtblsuggestedmeetings',user.tblSuggestedMeetings)
                    setUser(Newuser)

                }
                

                }
                
                console.log(`Created event with id: ${eventId} in calendar: ${calendars[0].title}`);
              } catch(error) {
                console.log('this is the error', error)
              }
      
    
     
     
    }


   
   
 

    const removemeetingfromcalender = async (meetingtoremove,invitedbyfriend) => {

        console.log('this is the meeting to remove',meetingtoremove)
        console.log('thisis invited by friend',invitedbyfriend)
        if(invitedbyfriend){

            if(meetingtoremove.event_id_user2!=null){


                

            Calendar.deleteEventAsync(meetingtoremove.event_id_user2, { futureEvents: true })
            }
            if(meetingtoremove.event_id_default_calender_user2!=null){


                Calendar.deleteEventAsync(meetingtoremove.event_id_default_calender_user2, { futureEvents: true })
            }

        }
        else{

            if(meetingtoremove.event_id!=null){

                console.log('this is the event id to remove',meetingtoremove.event_id)

            Calendar.deleteEventAsync(meetingtoremove.event_id, { futureEvents: true })
            }
            if(meetingtoremove.event_id_default_calender!=null){
                
                Calendar.deleteEventAsync( meetingtoremove.event_id_default_calender, { futureEvents: true })
            }


       
    }
}



    const [isappready, setIsappready] = useState(false);
    const [hobbienumtypes, setHobbienumtypes] = useState([
        {
            hobbienum:1,
            hobbie:'bar'
        },
        {
            hobbienum:2,
            hobbie:'bar'
        },
        {
            hobbienum:3,
            hobbie:'gym'
        },
        {
            hobbienum:4,
            hobbie:'movie_theater'
        },
        {
            hobbienum:5,
            hobbie:'restaurant'
        },
        {
            hobbienum:6,
            hobbie:'cafe'
        },
        {
            hobbienum:7,
            hobbie:'library'
        },
        {
            hobbienum:8,
            hobbie:'park'
        },
        {
            hobbienum:9,
            hobbie:'park'
        },
        {
            hobbienum:10,
            hobbie:'night_club'
        },
        {
            hobbienum:1,
            hobbie:'other'
        },

                

    ]);

    const clearmainappcontext = () => {
        setUser({});
        setIspersonalactiveated(false);
        setUserevents([]);
        setFirebaseuser({});
        setScreenisready(false);
        setIsappready(false);

    }
        

   
    
    return (
        <MainAppcontext.Provider value={{ user,removemeetingfromcalender,addmeetingtocalender,clearmainappcontext,setUser,screenisready,setScreenisready, ispersonalactiveated,setIspersonalactiveated, userevents,setUserevents, firebaseuser, setFirebaseuser, hobbienumtypes,isappready,setIsappready }}>
            {props.children}
        </MainAppcontext.Provider>
    )

}