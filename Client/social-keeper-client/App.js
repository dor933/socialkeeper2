import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect,useState } from 'react';
import * as Contacts from 'expo-contacts';


import MainDashBoard from './Component/MainDashBoard';

export default function App() {
  const [allContacts, setAllContacts] = useState(null);


  //this section is for the contact list
//there is more work to be done here to get the contact list to work
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
  
        if (data.length > 0) {
          setAllContacts(data);




 
        }
      }
    })();
  }, [console.log(allContacts)]);


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
