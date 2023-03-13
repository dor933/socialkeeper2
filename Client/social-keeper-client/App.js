import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import LogIn from './Components/Screens/Login/LogIn';
// import * as Contacts from 'expo-contacts';


export default function App() {


  return (
    <View style={styles.container}>
   <Text>This is test comp</Text>
   <LogIn></LogIn>
  
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
