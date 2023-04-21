import { SafeAreaView, StyleSheet} from 'react-native';
import CreateProfile from './Components/Screens/Profile/CreateProfile';
<<<<<<< Updated upstream
=======
import PreferredMeetingTimes from './Components/Screens/Settings/PreferredMeetingTimes';
import PrefferedHobbies from './/Components/Screens/Settings//PreferredHoobies';
import MainDashBoard from './Components/Screens//MainApp/MainDashBoard';
import FutureMeetingScreen from './Components/Screens//MainApp/FutureMeetingScreen';
import PreviousMeetingsScreen from './Components/Screens//MainApp/PreviousMeetingsScreen';
import MainAppcontext from './Components/Screens/MainApp/MainAppcontext';
import { Text, View } from 'react-native';
import MapLocationForHobbies from './Components/Screens/MainApp/MapLocationForHobbies';
const Registrationstack = createStackNavigator();
const Mainappstack = createStackNavigator();
>>>>>>> Stashed changes


<<<<<<< Updated upstream

//Imports to use :
// import SignInAPI from './Components/Screens/Login/SignInAPI';
// import SignUpAPI from './Components/Screens/Login/SignUpAPI';

// import { NavigationContainer } from '@react-navigation/native';
// import FutureMeetingScreen from './Components//Screens/Meetings/FutureMeetingScreen';
// import PreviousMeetingsScreen from './/Components//Screens//Meetings///PreviousMeetingsScreen';
// import SuggestedMeetingsScreen from './/Components//Screens//Meetings///SuggestedMeetingsScreen';
// import FavoriteContacts from './/Components//Screens///Settings/FavoriteContacts';
=======
    <Registrationstack.Navigator initialRouteName="SignIn">

      <Registrationstack.Screen name="SignIn" component={SignInAPI} options={{ headerShown: false }} />
      <Registrationstack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }} />
      <Registrationstack.Screen name="PreferredMeetingTimes" component={PreferredMeetingTimes} options={{ headerShown: false }} />
      <Registrationstack.Screen name="FavoriteContacts" component={FavoriteContacts} options={{ headerShown: false }} />
      <Registrationstack.Screen name="PreferredHoobies" component={PrefferedHobbies} options={{ headerShown: false }} />

    </Registrationstack.Navigator>
>>>>>>> Stashed changes


<<<<<<< Updated upstream
=======
const MainAppStackScreen = () => {
  return (
    <Mainappstack.Navigator initialRouteName="MainDashBoard" >
      <Mainappstack.Screen name="MainDashBoard" component={MainDashBoard} options={{ headerShown: false }} />
      <Mainappstack.Screen name="FutureMeetingScreen" component={FutureMeetingScreen} options={{ headerShown: false }} />
      <Mainappstack.Screen name="PreviousMeetingsScreen" component={PreviousMeetingsScreen} options={{ headerShown: false }} />

    </Mainappstack.Navigator>
  )
}
>>>>>>> Stashed changes


export default function App() {


  return (
<<<<<<< Updated upstream
    <SafeAreaView>
      <CreateProfile />
    </SafeAreaView>
=======

    // <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    // <RegistrationContext>
    //   <MainAppcontext>

    //   <NavigationContainer>
    //     {isAuthenticated ?  <MainAppStackScreen />  : ( <RegistrationStackScreen /> ) }
    //   </NavigationContainer>
    //   </MainAppcontext>

    // </RegistrationContext>
    // </AuthContext.Provider>
    <MapLocationForHobbies></MapLocationForHobbies>


>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logIn: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
