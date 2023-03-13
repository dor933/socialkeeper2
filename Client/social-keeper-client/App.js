import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import FutureMeetingScreen from './Components/Screens/Meetings/FutureMeetingScreen';
// import * as Contacts from 'expo-contacts';
import MainDashBoard from './/Components//Screens///Meetings///MainDashBoard';

export default function App() {


  return (
    <View style={styles.container}>
   <Text>This is test comp</Text>
  </View>
  
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
