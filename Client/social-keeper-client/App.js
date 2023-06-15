
//Dor's code
// import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState , useRef,useContext } from 'react';
//import usefonts
import { useFonts } from 'expo-font';
//import fonts
import { Lato_100Thin, Lato_300Light, Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import {
  NunitoSans_200ExtraLight,
  NunitoSans_300Light,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans";
//import expo-google-fonts pacifico
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
//import me the favorite contacts screen
import FavoriteContacts from './Components/Screens/Settings/FavoriteContacts';
import RegistrationContext from './RegistContext';
import AuthContext from './/Authcontext.jsx'
import SignInAPI from './Components/Screens/Login/SignInAPI';
import CreateProfile from './Components/Screens/Profile/CreateProfile';
import PreferredMeetingTimes from './Components/Screens/Settings/PreferredMeetingTimes';
import PrefferedHobbies from './/Components/Screens/Settings//PreferredHoobies';
import MainDashBoard from './Components/Screens//MainApp/MainDashBoard';
import FutureMeetingScreen from './Components/Screens//MainApp/FutureMeetingScreen';
import PreviousMeetingsScreen from './Components/Screens//MainApp/PreviousMeetingsScreen';
import MainAppcontext from './Components/Screens/MainApp/MainAppcontext';
import SettingDashBoard from './Components/Screens/MainApp/PersonalSettings';
import SuggestedMeetingsScreen from './Components/Screens/MainApp/SuggestedMeetingsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
//For notifications
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';



//Notification configure
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//Get permission for notification


async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


const Registrationstack = createStackNavigator();
const Mainappstack = createStackNavigator();



// SplashScreen.preventAutoHideAsync();



const RegistrationStackScreen = () => {
  return (

    <Registrationstack.Navigator initialRouteName="SignIn">

      <Registrationstack.Screen name="SignIn" component={SignInAPI} options={{ headerShown: false }} />
      <Registrationstack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }} />
      <Registrationstack.Screen name="PreferredMeetingTimes" component={PreferredMeetingTimes} options={{ headerShown: false }} />
      <Registrationstack.Screen name="FavoriteContacts" component={FavoriteContacts} options={{ headerShown: false }} />
      <Registrationstack.Screen name="PreferredHoobies" component={PrefferedHobbies} options={{ headerShown: false }} />

    </Registrationstack.Navigator>

  )
}

const MainAppStackScreen = () => {
  return (
    <Mainappstack.Navigator initialRouteName="MainDashBoard" >
      <Mainappstack.Screen name="MainDashBoard" component={MainDashBoard} options={{ headerShown: false }} />
      <Mainappstack.Screen name="FutureMeetingScreen" component={FutureMeetingScreen} options={{ headerShown: false }} />
      <Mainappstack.Screen name="PreviousMeetingsScreen" component={PreviousMeetingsScreen} options={{ headerShown: false }} />
      <Mainappstack.Screen name="SuggestedMeetingsScreen" component={SuggestedMeetingsScreen} options={{ headerShown: false }} />
      <Mainappstack.Screen name="SettingDashBoard" component={SettingDashBoard} options={{ headerShown: false }} />
    </Mainappstack.Navigator>
  )
}


export default function App() {

  //Notifications listener

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const [isnotif, setIsnotif] = useState(false);
  const [numberofnewfriends, setNumberofnewfriends] = useState(0);
  const responseListener = useRef();
  const navigationRef = useRef();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [userissubmitted, setUserissubmitted] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  let [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
    Pacifico_400Regular
  });
  //useEFfect getting expo push token from user device and save it in the database when user log in and component did mount
  useEffect( () => {

    setIsAuthenticated(false);
    console.log("useEffect first");

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log("notification");
      console.log(notification);
      const notifobj=notification.request.content.data
      await handlenotifcations(notifobj)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log("response");
      console.log(response);
      const notifobj=response.notification.request.content.data;
      await handlenotifcations(notifobj)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {

    console.log("isAuthenticated");
    console.log(isAuthenticated);

  }, [isAuthenticated]);





  

  const handlenotifcations = async (notifobj) => {
    console.log("notifobj");
    console.log(notifobj);
    setNotification(notifobj)

     const storedauthentication=await AsyncStorage.getItem('isAuth');
        if(storedauthentication!=null){ 
          console.log("storedauthentication");
          console.log(storedauthentication);
          setIsAuthenticated(storedauthentication)

        }
        if(!storedauthentication){
          console.log("not authenticated");
        }
        else{
          console.log("authenticated is auth222");
          //navigate to main dashboard and refresh the data
          navigationRef.current?.navigate('MainDashBoard', { fromnotif: true, notifobj: notifobj })


        
      }
        

  

    
  }


  useEffect(() => {
    if (fontsLoaded) {
      setAppIsReady(true)
    }
  }, [fontsLoaded])

  if (!appIsReady) {
    return null;
  }

  return (



    <AuthContext.Provider value={{ isAuthenticated,notification,numberofnewfriends,setNumberofnewfriends,isnotif,setIsnotif,setIsAuthenticated,expoPushToken,setExpoPushToken }}>
      <RegistrationContext>
        <MainAppcontext>

          <NavigationContainer ref={navigationRef} >

            {isAuthenticated ? <MainAppStackScreen /> : (<RegistrationStackScreen />)}



          </NavigationContainer>
        </MainAppcontext>

      </RegistrationContext>
    </AuthContext.Provider>


  );
}



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logIn: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });