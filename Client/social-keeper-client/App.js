
//Dor's code

import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
//import me the favorite contacts screen
import FavoriteContacts from './Components/Screens/Settings/FavoriteContacts';


//Tal's code

import SignInAPI from './Components/Screens/Login/SignInAPI';
// import { NavigationContainer } from '@react-navigation/native';
// import FutureMeetingScreen from './Components//Screens/Meetings/FutureMeetingScreen';
// import PreviousMeetingsScreen from './/Components//Screens//Meetings///PreviousMeetingsScreen';
// import SuggestedMeetingsScreen from './/Components//Screens//Meetings///SuggestedMeetingsScreen';
// import FavoriteContacts from './/Components//Screens///Settings/FavoriteContacts';
export default function App() {


  return (
    <SafeAreaView style={styles.container}>
      <FavoriteContacts/>
    </SafeAreaView>
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
