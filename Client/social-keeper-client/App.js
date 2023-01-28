import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';


import MainDashBoard from './Component/MainDashBoard';

export default function App() {

  //this section is for the contact list

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Contacts.requestPermissionsAsync();
  //     if (status === 'granted') {
  //       const { data } = await Contacts.getContactsAsync({
  //         fields: [Contacts.Fields.PhoneNumbers],
  //       });
  
  //       if (data.length > 0) {
  //         const contact = data[0];
  //         console.log(contact);
  //         alert(contact.name);
  //       }
  //     }
  //   })();
  // }, []);


  return (
    <NavigationContainer>
        <MainDashBoard />
    </NavigationContainer>

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
