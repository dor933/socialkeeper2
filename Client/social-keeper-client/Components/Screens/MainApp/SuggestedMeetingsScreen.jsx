import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Customheader from '../../CompsToUse/Customheader'
import {
  useFonts,
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { ButtonGroup } from '@rneui/themed';
import { useState,useEffect,useContext } from 'react';
import * as Calendar from 'expo-calendar';
import { MainAppcontext } from './MainAppcontext';
import firebaseInstance  from '../..//../assets/Firebase/firebaseconfig';
//import axios
import axios from 'axios';
import {getPlaceDetails} from '..//..//..//assets//Utils/places.js';




export default function SuggestedMeetingsScreen() {

  const {user, setUser} = useContext(MainAppcontext);

  const {userevents, setUserevents} = useContext(MainAppcontext);
  const {suggestedmeeting, setSuggestedmeeting} = useContext(MainAppcontext);
  const {suggestedmeeting1, setSuggestedmeeting1} = useContext(MainAppcontext);

  useEffect(() => {

    console.log('this is the user')
    console.log(user)
    
    getcalendars();
    
  }, []);

  

  const getcalendars = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      //get my calandar with id
      const calendars = await Calendar.getCalendarsAsync();
      console.log('Here are all your calendars:');

      console.log({ calendars });

     //get all the calendars id's and set them in an array except the data about holidays
     
      const calendarIds = calendars.map(each => each.id);

      //make a new date object and set it to today
      const startDate = new Date();
      //set the end date to 1 week from now
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 7);
    
      console.log('Getting events between ' + startDate + ' and ' + endDate);
      


      const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);
      console.log('Here are all your events:');
      console.log({ events });
      //create a new object which contain the events date, weekday of the date, starttime, endtime, and drop the events
      //that last exactly one day and their starttime and endtime are the same


      const newevents = events
      .filter((each) => {
        const StartDate = new Date(each.startDate);
        const EndDate = new Date(each.endDate);
    
        const StartDateplusondeday = new Date(StartDate);
        StartDateplusondeday.setDate(StartDateplusondeday.getDate() + 1);
    
        // Return false if the condition is met, which removes the item from the array
        return !(
          EndDate.getFullYear() === StartDateplusondeday.getFullYear() &&
          EndDate.getMonth() === StartDateplusondeday.getMonth() &&
          EndDate.getDate() === StartDateplusondeday.getDate()
        );
      })
      .map((each) => {
        const StartDate = new Date(each.startDate);
        const EndDate = new Date(each.endDate);

    
        return {
          title: each.title,
          starttime: StartDate.getHours().toString().padStart(2, '0') + ':' + StartDate.getMinutes().toString().padStart(2, '0'),
          endtime: EndDate.getHours().toString().padStart(2, '0') + ':' + EndDate.getMinutes().toString().padStart(2, '0'),
          //convert start and end date to date object that shows hours and minutes
          
          date: StartDate,
          weekday: StartDate.getDay(),
        };
      });

      setUserevents(newevents);
      console.log(newevents);

      if(newevents.length>0){
        const collectionname= user.phoneNum1;
        console.log(collectionname);
        const collectionRef = firebaseInstance.collection(firebaseInstance.firestore, collectionname);

        firebaseInstance.getDocs(collectionRef).then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            // Collection exists, delete all documents
            const batch = firebaseInstance.writeBatch(firebaseInstance.firestore);
            querySnapshot.docs.forEach((docSnapshot) => {
              batch.delete(docSnapshot.ref);
            });
            await batch.commit();
          }
      
          // Insert new events
          const writeBatchInstance = firebaseInstance.writeBatch(firebaseInstance.firestore);
          newevents.forEach((event) => {
            const newDocRef = firebaseInstance.doc(collectionRef);
            writeBatchInstance.set(newDocRef, event);
          });
          await writeBatchInstance.commit();
        });
  
  
      }

    //   const eventstosend= newevents.map((each)=>{
    //     return{
    //       starttime: each.starttime,
    //       endtime: each.endtime,
    //       weekday: each.weekday,

    //     }
    //   })

    //  const objsend={
    //   userdto: user.phoneNum1,
    //   userinviteeve: eventstosend,
    //   numberofmeetings: 0
    //  }

    //   const responsefrommeetings= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainApp/createmeetings',objsend);
    //   console.log(responsefrommeetings);

  

    setSuggestedmeeting(user.tblSuggestedMeetings);
    setSuggestedmeeting1(user.tblSuggestedMeetings1);
    let numbermeetings= user.tblSuggestedMeetings1.length+ user.tblSuggestedMeetings.length;
    console.log(numbermeetings);

    let missingmeetings= 5-numbermeetings;
    if(missingmeetings>0){
         const eventstosend= newevents.map((each)=>{
        return{
          starttime: each.starttime,
          endtime: each.endtime,
          weekday: each.weekday,

        }
      })

     const objsend={
      userdto: user.phoneNum1,
      userinviteeve: eventstosend,
      numberofmeetings: missingmeetings
     }

      const responsefrommeetings= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainApp/createmeetings',objsend);
      const newmeetings= responsefrommeetings.data;
      //add the new meetings in addition to the old ones in suugessted meetings state
      setSuggestedmeeting([...suggestedmeeting,...newmeetings]);
      console.log(responsefrommeetings);



    }

    console.log('this is suggestedmeetings1 foreach loop')



    user.tblSuggestedMeetings1.forEach(async (each)=>{
     if(each.place.Name==null){
      console.log(each.place);
      const placedetails= await getPlaceDetails(each.place.PlaceId,'AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow');
      console.log('this is place details')
      console.log(each);
      if(placedetails!=null){
        each.placedetails= placedetails;
      }

     }
    })

    
      




      //get weekday for each event date

      //set the user events array to the new events array


  


      
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(2);

  let [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  return (
    
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
   
      <Customheader/>
      <View style={styles.meetingview}> 
        <Text style={styles.meetingtext}> Meetings</Text>
      </View>
      <View style={styles.rectengelbuttongroup}>
        <ButtonGroup
          buttons={['Approved', 'Waiting','Suggested']}
          containerStyle={{height: 44, width:Dimensions.get('window').width-60, borderRadius: 25, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
          textStyle={{fontFamily: 'Lato_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)', textAlign:'center', fontStyle: 'normal', lineHeight: 19, letterSpacing: 0.03, fontWeight: 'normal',}}
          selectedButtonStyle={{backgroundColor: '#ffffff'}}
          selectedTextStyle={{color: 'rgba(0, 0, 0, 0.5)'}}
          innerBorderStyle={{width: 0}}
          selectedIndex={selectedIndex}
          onPress={index => setSelectedIndex(index)}

          //make the Suggested button selected by default
          
    
          //make the Suggested button selected by default
      




          
          />
        </View>
    </View>
    </SafeAreaView>
  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40
  },

  meetingview:{
    backgroundColor: '#ffffff',
    alignItems:'flex-end',
    paddingRight: 20,
    paddingTop: 20,

  },

  meetingtext:{
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: '#000000',
    textAlign:'center',
    fontStyle: 'normal',
    lineHeight: 29,
    letterSpacing: 0.03,
    fontWeight: 'bold',

  },
  rectengelbuttongroup:{
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 25,
    width:Dimensions.get('window').width-60,
    height: 44,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,


  },


  
})