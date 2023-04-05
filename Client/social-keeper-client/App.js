
//Dor's code

import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
//import me the favorite contacts screen
import FavoriteContacts from './Components/Screens/Settings/FavoriteContacts';
import RegistrationContext from './RegistContext';
import AuthContext from './/Authcontext.jsx'
import SignInAPI from './Components/Screens/Login/SignInAPI';
import CreateProfile from './Components/Screens/Profile/CreateProfile';
import PreferredMeetingTimes from './Components/Screens/Settings/PreferredMeetingTimes';
import PrefferedHobbies from './/Components/Screens/Settings//PreferredHoobies';

const Registrationstack = createStackNavigator();
const Mainappstack = createStackNavigator();

const RegistrationStackScreen = () => {
  return (

  <Registrationstack.Navigator initialRouteName="SignIn">

    <Registrationstack.Screen name="SignIn" component={SignInAPI} options={{headerShown:false}} />
    <Registrationstack.Screen name="CreateProfile" component={CreateProfile} options={{headerShown:false}} />
    <Registrationstack.Screen name="PreferredMeetingTimes" component={PreferredMeetingTimes} options={{headerShown:false}} />
    <Registrationstack.Screen name="FavoriteContacts" component={FavoriteContacts} options={{headerShown:false}} />
    <Registrationstack.Screen name="PreferredHoobies" component={PrefferedHobbies} options={{headerShown:false}} />

  </Registrationstack.Navigator>

  )
}


export default function App() {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);



  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    <RegistrationContext>

      <NavigationContainer>

        {isAuthenticated ?  <Mainappstack.Navigator initialRouteName="FutureMeetingScreen" />  : ( <RegistrationStackScreen /> ) }



      </NavigationContainer>

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
