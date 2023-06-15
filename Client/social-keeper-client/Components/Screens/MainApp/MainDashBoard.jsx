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
import MapLocationForHobbies from './/MapLocationForHobbies';
import Meetdetails from '../../CompsToUse/Meetdetails';
import PreferredHoobies from '../Settings/PreferredHoobies';
import { AccountSettings } from './PersonalComp/Account';
import PreferredMeetingTimes from '../Settings/PreferredMeetingTimes';
import { Intersets } from './PersonalComp/Account';
import {Favoritecont} from './PersonalComp/Account';
import CreateProfile from '..//Profile/CreateProfile';
import Businesspage from './Businesspage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../../Authcontext';
import { RegistContext } from '../../../RegistContext';







const Tab = createBottomTabNavigator();

const SuggestedMeetingsStack = createStackNavigator(); // Add this line
const PreviousMeetingsStack = createStackNavigator(); // Add this line
const PersonalSettingsStack = createStackNavigator(); // Add this line

function SuggestedMeetingsStackScreen({fromnotif,notifobj,navigation}) {

  
  

  console.log('from suggestedmeetingsstackscreen')
  console.log('fromnotif',fromnotif)
  console.log('notifobj',notifobj)
    return (
      <SuggestedMeetingsStack.Navigator initialRouteName="SuggestedMeetings">
        <SuggestedMeetingsStack.Screen name="SuggestedMeetings"  options={{headerShown:false}} 
                children={(props) => <SuggestedMeetingsScreen {...props} fromnotif={fromnotif} notifobj={notifobj}
                
                  />}
                />
        <SuggestedMeetingsStack.Screen name="Businesspage" component={Businesspage} options={{headerShown:false}} />
        <SuggestedMeetingsStack.Screen name="SuggestedMeetingCalender" component={Calender} options={{headerShown:false}} />
        <SuggestedMeetingsStack.Screen name="MapLocationForHobbies" component={MapLocationForHobbies} options={{headerShown:false}} />
        <SuggestedMeetingsStack.Screen name="Meetdetails" component={Meetdetails} options={{headerShown:false}} />
      </SuggestedMeetingsStack.Navigator>
    );
  }

  function PreviousMeetingsStackScreen() {
    return (
      <PreviousMeetingsStack.Navigator initialRouteName="PreviousMeetings">
        <PreviousMeetingsStack.Screen name="PreviousMeetings" component={PreviousMeetingsScreen} options={{headerShown:false}} />
        <PreviousMeetingsStack.Screen name="Meetdetails" component={Meetdetails} options={{headerShown:false}} />
      


        </PreviousMeetingsStack.Navigator>
    );

  }

 

  function PersonalSettingsStackScreen() {
    return (
      <PersonalSettingsStack.Navigator initialRouteName="SettingDashBoard">
        <PersonalSettingsStack.Screen name="SettingDashBoard" component={SettingDashBoard} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="PreferredHoobies" component={PreferredHoobies} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="AccountSettings" component={AccountSettings} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="PreferredMeetingTimes" component={PreferredMeetingTimes} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="Intersets" component={Intersets} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="Favoritecont" component={Favoritecont} options={{headerShown:false}} />
        <PersonalSettingsStack.Screen name="CreateProfile" component={CreateProfile} options={{headerShown:false}} />
        
        </PersonalSettingsStack.Navigator>
    );

  }


export default function MainDashBoard({route}) {

    const {user, setUser} = useContext(MainAppcontext);
    const {clearregistcontext} = useContext(RegistContext);
    const {clearmainappcontext} = useContext(MainAppcontext);
  const {userevents, setUserevents} = useContext(MainAppcontext);
  const [screenisready, setScreenisready] = useState(false);
  const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
  const {numberofnewfriends, setNumberofnewfriends} = useContext(AuthContext);
  const {isnotif, setIsnotif} = useContext(AuthContext);
  const fromnotif=route.params?.fromnotif;
  const notifobj=route.params?.notifobj;

  useEffect( () => {

    if(!fromnotif){
    
     rungetcalenders();
    }

    // setIsAuthenticated(false)


    return () => {
      console.log('unmounting')
      setNumberofnewfriends(0)           
            setIsnotif(false) 
            clearregistcontext()
            clearmainappcontext()
    }

   
    
  }, []);

  useEffect( () => {

    if(fromnotif){
      console.log('its from notif new 0706')
      
      if(notifobj.notiftype=='Approvedfriendrequest') {

       const possiblefriend= user.possibleFavoriteContacts_invite_DTO.find((item) => item.phonenuminvited == notifobj.phonenuminvited)
       console.log('this is possible friend',possiblefriend)
            if(possiblefriend){
        const newfavoritecontact = {
          ID: parseInt(notifobj.ID),
          phoneNum1:possiblefriend.phonenuminvite,
          phoneNum2:possiblefriend.phonenuminvited,
          hobbieNum:possiblefriend.hobbieNum,
          rank:1,
          tblUser1:possiblefriend.tblUser1,
                   tblHobbie:possiblefriend.tblHobbiedto
    }
    console.log('this is new favorite contact',newfavoritecontact)
    const newfavoritecontacts = [...user.tblFavoriteContacts,newfavoritecontact]
    console.log('this is new favorite contacts',newfavoritecontacts)

    const newpossiblefavoritecontacts = user.possibleFavoriteContacts_invite_DTO.filter((item) => item.phonenuminvited !== notifobj.phonenuminvited)
    console.log('this is new possible favorite contacts',newpossiblefavoritecontacts)
    const newuser = {
      ...user,
      tblFavoriteContacts:newfavoritecontacts,
      possibleFavoriteContacts_invite_DTO:newpossiblefavoritecontacts

    } 
    setUser(newuser)
    //increate number of new friends by 1
    setNumberofnewfriends(numberofnewfriends+1)

  }

      }
      else if (notifobj.notiftype=='newFriendrequest') {

        getrequestasync();


      }
    }
  }, [notifobj]);


  const getrequestasync = async () => {

    const response= await axios.get(`http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Getnewreq/${notifobj.ID}`)
    const newrequest = response.data;
    const newtblpossiblefavoriteinvited=user.possibleFavoriteContacts_invited_DTO
    newtblpossiblefavoriteinvited.push(newrequest)
    const newuser = {
      ...user,
      possibleFavoriteContacts_invited_DTO:newtblpossiblefavoriteinvited
    }
    setUser(newuser)
    

  }




  const rungetcalenders= async () => {
   const newevents= await getcalendars();   
   let newsugmeetings=await fetchAndProcessMeetings( newevents);
   if(newsugmeetings!='no favorite contacts'){
   if(user.tblSuggestedMeetings.length>0){

    await getplaceinfo(newsugmeetings);
    

  }
  if(user.tblSuggestedMeetings1.length>0){

    await getplaceinfo2();

  }
  if(user.tblactualmeetings.length>0){

    await getplaceinfoended(true);

  }
  if(user.tblactualmeetings1.length>0){

    await getplaceinfoended(false);

  }
    await setmeetingscorrectly(newsugmeetings);
}

AsyncStorage.setItem('isAuth','true');

    setScreenisready(true);
  }
  

  const getplaceinfo = async (newsugmeetings) => {

    for(let i=0; i<newsugmeetings.length; i++){
      const placeinfo = await getPlaceDetails(newsugmeetings[i].place.place_id);
      newsugmeetings[i].place = placeinfo;
    }

    return newsugmeetings;

  }

  const getplaceinfo2 = async () => {
    const newtblsuggest1his= user.tblSuggestedMeetings1;
    for(let i=0; i<newtblsuggest1his.length; i++){
      const placeinfo = await getPlaceDetails(newtblsuggest1his[i].place.place_id);
      newtblsuggest1his[i].place = placeinfo;
    }
    setUser({
      ...user,
      tblSuggestedMeetings1: newtblsuggest1his,
    });

  }

  const getplaceinfoended = async (isinvite) => {
    if(isinvite){
      const newtblactualmeeting= user.tblactualmeetings;
      for(let i=0; i<newtblactualmeeting.length; i++){
        const placeinfo = await getPlaceDetails(newtblactualmeeting[i].tblSuggestedMeeting.place.place_id);
        newtblactualmeeting[i].tblSuggestedMeeting.place = placeinfo;
      }
      setUser({
        ...user,
        tblactualmeetings: newtblactualmeeting,
      });
    }
    else{
      const newtblactualmeeting1= user.tblactualmeetings1;
      for(let i=0; i<newtblactualmeeting1.length; i++){
        const placeinfo = await getPlaceDetails(newtblactualmeeting1[i].tblSuggestedMeeting.place.place_id);
        newtblactualmeeting1[i].tblSuggestedMeeting.place = placeinfo;
      }
      setUser({
        ...user,
        tblactualmeetings1: newtblactualmeeting1,
      });
    }
  }






  const setmeetingscorrectly= async (newsugmeetings)=>{
    let newactualmeetings= user.tblactualmeetings;
    let newactualmeetings1= user.tblactualmeetings1;


    newsugmeetings= newsugmeetings.map((each)=>{
      if(each.place.result){
        return{
          ...each,
          place: each.place.result
        }
      }
      else{
        return each;
      }
    })

   

    let newtblsuggest1this= user.tblSuggestedMeetings1;
      newtblsuggest1this= newtblsuggest1this.map((each)=>{

        if(each.place.result){
          return{
            ...each,
            place: each.place.result
          }
        }
        else{
          return each;
        }
      }
      )

      if(user.tblactualmeetings.length>0){
      newactualmeetings= newactualmeetings.map((each)=>{
        if(each.tblSuggestedMeeting.place.result){
          return{
            ...each,
            tblSuggestedMeeting: {
              ...each.tblSuggestedMeeting,
              place: each.tblSuggestedMeeting.place.result
            }
          }
        }
        else{
          return each;
        }
      }
      )
    }
    if(user.tblactualmeetings1.length>0){
      newactualmeetings1= newactualmeetings1.map((each)=>{
        if(each.tblSuggestedMeeting.place.result){
          return{
            ...each,
            tblSuggestedMeeting: {
              ...each.tblSuggestedMeeting,
              place: each.tblSuggestedMeeting.place.result
            }
          }
        }
        else{
          return each;
        }
      }
      )
    }



   //set user with prev
     setUser({
      ...user,
      tblSuggestedMeetings: newsugmeetings,
      tblSuggestedMeetings1: newtblsuggest1this,
      tblactualmeetings: newactualmeetings,
      tblactualmeetings1: newactualmeetings1,
    })

    

  }





  

 

  

  const getcalendars = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      //get my calandar with id
      const calendars = await Calendar.getCalendarsAsync();
      console.log('Here are all your calendars:');

      console.log({ calendars });

     //get all the calendars id's and set them in an array except the data about holidays
     
      const calendarIds = calendars.map(each => each.id);
      
      //bring events from all the calendars
      


      
        
     
      console.log('this is calendar idS')
      console.log(calendarIds)

      //make a new date object and set it to today
      const startDate = new Date();
      startDate.setDate(startDate.getDate() );
      //set the end date to 1 week from now
      const endDate = new Date();
      endDate.setDate(startDate.getDate() +7);
    
      

        
      const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);
      console.log('this is events')
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
        return !( (
          EndDate.getFullYear() === StartDateplusondeday.getFullYear() &&
          EndDate.getMonth() === StartDateplusondeday.getMonth() &&
          EndDate.getDate() === StartDateplusondeday.getDate()
        ) || (StartDate.getHours() === EndDate.getHours() && StartDate.getMinutes() === EndDate.getMinutes())
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
      return newevents;

  }

}

  const fetchAndProcessMeetings = async(newevents) => {
 


  let numbermeetings= user.tblSuggestedMeetings1.length+ user.tblSuggestedMeetings.length;
  console.log('number of meetings suggesteedmeetingsuser',numbermeetings)

 
  if(numbermeetings<5){
    
  
    const eventstosend = newevents.map((each) => ({
      starttime: each.starttime,
      endtime: each.endtime,
      weekday: each.weekday,
    }));
  
    let existingsuggested = [];
    let existingsuggested1 = [];

    if (user.tblSuggestedMeetings.length > 0) {
      existingsuggested = user.tblSuggestedMeetings.map((each) => ({
        starttime: each.startTime,
        endtime: each.endTime,
        date: each.date.split('T')[0],
      }));
    }
  
    if (user.tblSuggestedMeetings1.length > 0) {
      existingsuggested1 = user.tblSuggestedMeetings1.map((each) => ({
        starttime: each.starttime,
        endtime: each.endtime,
        date: each.date.split('T')[0],
      }));
    }

    const existingsuggestedconcat = existingsuggested.concat(existingsuggested1);

  const objsend = {
    userdto: user.phoneNum1,
    userinviteeve: eventstosend,
    numberofmeetings: numbermeetings,
    existingsuggested: existingsuggestedconcat,
  };

  console.log('this is objsend', objsend);

  const responsefrommeetings = await axios.post(
    'http://cgroup92@194.90.158.74/cgroup92/prod/api/MainApp/createmeetings',
    objsend
  );
  
  const newmeetings =  responsefrommeetings.data;
  
  if(newmeetings=='no favorite contacts'){
    return 'no favorite contacts'
  }

  const newsugmeetings = [...newmeetings, ...user.tblSuggestedMeetings];

  


  newsugmeetings.forEach((each) => {
    if (each.place.result) {
      each.place = each.place.result;
    }
  });




  console.log('this is newsugmeetings', newsugmeetings);
  console.log('this is newsugmeetingsd length', newsugmeetings.length);

  //set user without prev

  return newsugmeetings;
  
}
else{
  let newsugmeetings= user.tblSuggestedMeetings;
  return newsugmeetings;
}
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
                    } else if (route.name === 'Add Friends') {
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
            initialRouteName= "Suggested Meetings"

        >
            <Tab.Screen name="Personal" component={PersonalSettingsStackScreen} options={{
                headerShown: false,
                tabBarStyle: ispersonalactiveated? styles.tabBarhidden : styles.personalmeetingbar,
                tabBarBadge: (numberofnewfriends>0 && user.possibleFavoriteContacts_invited_DTO.length==0)? '!'
                : (user.possibleFavoriteContacts_invited_DTO.length>0)? user.possibleFavoriteContacts_invited_DTO.length : null,
                 
                
            }}  />


            <Tab.Screen name="Previous Meetings" component={PreviousMeetingsStackScreen} />



            <Tab.Screen name="Add Friends" component={FutureMeetingScreen}
            options={{
                headerShown: false,
            }} />
            <Tab.Screen name="Suggested Meetings" 
            options={{
                headerShown: false,
            }}
          

            children={(props) => <SuggestedMeetingsStackScreen {...props} fromnotif={fromnotif} notifobj={notifobj}  />}
            

            />
        </Tab.Navigator>

    );
}
const styles = StyleSheet.create({
  
    tabBar: {
        backgroundColor: '#fff',
        
    },

    tabBarhidden: {
        backgroundColor: '#fff',
        display: 'none',
    },
    personalmeetingbar: {
        backgroundColor: '#222222',
        inactiveTintColor: '#ffffff',
        
      },
})

