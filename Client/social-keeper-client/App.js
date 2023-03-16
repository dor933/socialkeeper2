
//Dor's code

import { StatusBar } from 'expo-status-bar';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';
import MainDashBoard from './Component/MainDashBoard';
import ProfileScreen from './Component/SettingComponent/ProfileScreen';
import FavoriteContacts from './Component/SettingComponent/FavoriteContacts';
import Logincheck from './Component/SettingComponent/Logincheck';


//Tal's code

import { SafeAreaView, StyleSheet} from 'react-native';
import SignUpAPI from './Components/Screens/Login/SignUpAPI';
// import { NavigationContainer } from '@react-navigation/native';
// import FutureMeetingScreen from './Components//Screens/Meetings/FutureMeetingScreen';
// import PreviousMeetingsScreen from './/Components//Screens//Meetings///PreviousMeetingsScreen';
// import SuggestedMeetingsScreen from './/Components//Screens//Meetings///SuggestedMeetingsScreen';
// import FavoriteContacts from './/Components//Screens///Settings/FavoriteContacts';
export default function App() {


  return (
    <SafeAreaView>
      <SignUpAPI></SignUpAPI>
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
