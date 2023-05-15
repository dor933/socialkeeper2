import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'; // Add this import
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PreviousMeetingsScreen from './PreviousMeetingsScreen';
import FutureMeetingScreen from './FutureMeetingScreen';
import SettingDashBoard from './PersonalSettings';
import SuggestedMeetingsScreen from './SuggestedMeetingsScreen';
import Calender from '..//..//CompsToUse/Calender.tsx';
import { MainAppcontext } from './MainAppcontext';
import * as Calendar from 'expo-calendar';
import firebaseInstance  from '../..//../assets/Firebase/firebaseconfig';
import {getPlaceDetails} from '../../..//assets/Utils/places';
import { useState,useEffect,useContext } from 'react';
import Loadingcomp from '../../CompsToUse/Loadingcomp';
import axios from 'axios';




const Tab = createBottomTabNavigator();

const SuggestedMeetingsStack = createStackNavigator(); // Add this line

function SuggestedMeetingsStackScreen() {
    return (
      <SuggestedMeetingsStack.Navigator initialRouteName="SuggestedMeetings">
        <SuggestedMeetingsStack.Screen name="SuggestedMeetings" component={SuggestedMeetingsScreen} options={{headerShown:false}} />
        <SuggestedMeetingsStack.Screen name="SuggestedMeetingCalender" component={Calender} options={{headerShown:false}} />
      </SuggestedMeetingsStack.Navigator>
    );
  }
export default function MainDashBoard() {

    const {user, setUser} = useContext(MainAppcontext);
  const {userevents, setUserevents} = useContext(MainAppcontext);
  const [screenisready, setScreenisready] = useState(false);

  useEffect( () => {

    console.log('this is the user')
    console.log(user)
    
     rungetcalenders();
    
  }, []);


  const rungetcalenders= async () => {
    await getcalendars();
  }

 

  

  const getcalendars = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      console.log('granted')
      //get my calandar with id
      const calendars = await Calendar.getCalendarsAsync();
      console.log('Here are all your calendars:');

      console.log({ calendars });

     //get all the calendars id's and set them in an array except the data about holidays
     
      const calendarIds = calendars.map(each => each.id);
      const cal= [];
      cal.push(4)
      console.log('this is calendar id')
      console.log(calendarIds)

      //make a new date object and set it to today
      const startDate = new Date();
      startDate.setDate(startDate.getDate() );
      //set the end date to 1 week from now
      const endDate = new Date();
      endDate.setDate(startDate.getDate() +7);
    
      

        
      const events = await Calendar.getEventsAsync(cal, startDate, endDate);
      console.log({ events });
      //create a new object which contain the events date, weekday of the date, starttime, endtime, and drop the events
      //that last exactly one day and their starttime and endtime are the same


      const newevents = events
      .filter((each) => {
        const StartDate = new Date(each.startDate);
        const EndDate = new Date(each.endDate);
    
        const StartDateplusondeday = new Date(StartDate);
        StartDateplusondeday.setDate(StartDateplusondeday.getDate() + 7);
    
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

      const eventobject= newevents.reduce((acc, event,index) => {
        const date = event.date.toISOString().split('T')[0];
        if (!acc[date]) {
    acc[date] = [];
  }

  acc[date].push({
    id: index + 1,
    name: event.title,
    height: 80,
    day: date,
    starttime: event.starttime,
    endtime: event.endtime
  });

  return acc;
}, {});

console.log('this is event object')
console.log(eventobject)

      setUserevents(eventobject);
   
  

      if(newevents.length>0){
        const collectionname= user.phoneNum1;
        console.log(collectionname);
        const collectionRef = firebaseInstance.collection(firebaseInstance.firestore, collectionname);

        firebaseInstance.getDocs(collectionRef).then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            // Collection exists, delete all documents
            console.log('Collection exists, deleting all documents...');
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

      if(user.tblSuggestedMeetings.length>0){

        //run on tblsuggestedmeetings

        await getplaceinfo();


      }
      if(user.tblSuggestedMeetings1.length>0){

        await getplaceinfo2();
        


      }

 

  
    let numbermeetings= user.tblSuggestedMeetings1.length+ user.tblSuggestedMeetings.length;
    console.log('number of meetings suggesteedmeetingsuser')
    console.log(user.tblSuggestedMeetings.length)
    console.log(numbermeetings);

    let missingmeetings= 5-numbermeetings;
    console.log('missing meetings')
    console.log(missingmeetings);
    if(missingmeetings>0){
         const eventstosend= newevents.map((each)=>{
        return{
          starttime: each.starttime,
          endtime: each.endtime,
          weekday: each.weekday,

        }
      })

    

      const existingsuggested=[];
      const existingsuggested1=[];

      if(user.tblSuggestedMeetings.length>0){

      existingsuggested=user.tblSuggestedMeetings.map((each)=>{
        return{
          starttime: each.startTime,
          endtime: each.endTime,
          //made date without time 
          date: each.date.split('T')[0],
        }
      })
    }
   
    if(user.tblSuggestedMeetings1.length>0){
       existingsuggested1=user.tblSuggestedMeetings1.map((each)=>{
        return{
          starttime: each.starttime,
          endtime: each.endtime,
          //made date without time
          date: each.date.toISOString().split('T')[0],
        }
      })
    }

      //concat the two arrays
      const existingsuggestedconcat= existingsuggested.concat(existingsuggested1);

      const objsend={
        userdto: user.phoneNum1,
        userinviteeve: eventstosend,
        numberofmeetings: numbermeetings,
        existingsuggested: existingsuggestedconcat,
       }

       console.log('this is objsend')
        console.log(objsend)



      const responsefrommeetings= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainApp/createmeetings',objsend);
      const newmeetings= responsefrommeetings.data;
      //add the new meetings in addition to the old ones in suugessted meetings state
      const newsugmeetings= newmeetings.concat(user.tblSuggestedMeetings);
      newsugmeetings.concat(newmeetings);
      
      setUser({...user, tblSuggestedMeetings: newsugmeetings});



    }


      
    }

    setScreenisready(true);
  };

  const getplaceinfo = async () => {

    
    const mysuggestedmeeting = [...user.tblSuggestedMeetings]; // Create a shallow copy of the array

    for (let i = 0; i < mysuggestedmeeting.length; i++) {
      const placeinfo = await getPlaceDetails(mysuggestedmeeting[i].place.place_id);
      mysuggestedmeeting[i].place = placeinfo;
    }
  
    setUser({ ...user, tblSuggestedMeetings: mysuggestedmeeting })
  }

  const getplaceinfo2 = async () => {

    const mysuggestedmeeting1 = [...user.tblSuggestedMeetings1]; // Create a shallow copy of the array

    for (let i = 0; i < mysuggestedmeeting1.length; i++) {
      const placeinfo = await getPlaceDetails(mysuggestedmeeting1[i].place.place_id);
      mysuggestedmeeting1[i].place = placeinfo;
    }
  
    setUser({ ...user, tblSuggestedMeetings1: mysuggestedmeeting1 })
  }

  if(!screenisready){
    return(

        <Loadingcomp />
    )
    }




    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Previous Meetings') {
                        iconName = focused ? 'ios-timer-outline' : 'ios-timer-outline';
                    } else if (route.name === 'Random Meeting') {
                        iconName = focused ? 'person-add' : 'person-add-outline';
                    } else if (route.name === 'Personal') {
                        //sliders icon for settings
                        iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                    } else if (route.name === 'Suggested Meetings') {
                        iconName = focused ? 'ios-home' : 'ios-home-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,

            })}
            tabBarOptions={{
                activeTintColor: '#783131',
                inactiveTintColor: 'gray',
                style: styles.tabBar,
                headerShown: false,
                labelStyle: {
                    fontSize: 10,
                },
                tabStyle: {
                    width: Dimensions.get('window').width / 4,
                },
                //do not show header


            }}
            initialRouteName="Suggested Meetings"

        >
            <Tab.Screen name="Personal" component={SettingDashBoard} options={{
                headerShown: false,
                tabBarStyle: styles.personalmeetingbar,
                
            }}  />


            <Tab.Screen name="Previous Meetings" component={PreviousMeetingsScreen} />



            <Tab.Screen name="Random Meeting" component={FutureMeetingScreen}
            options={{
                headerShown: false,
            }} />
            <Tab.Screen name="Suggested Meetings" component={SuggestedMeetingsStackScreen} 
            options={{
                headerShown: false,
            }} />
        </Tab.Navigator>

    );
}
const styles = StyleSheet.create({
  
    tabBar: {
        backgroundColor: '#fff',
    },
    personalmeetingbar: {
        backgroundColor: '#222222',
        inactiveTintColor: '#ffffff',
        
      },
});
