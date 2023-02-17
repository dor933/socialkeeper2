import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import * as Contacts from 'expo-contacts';


import MainDashBoard from './Component/MainDashBoard';
import ProfileScreen from './Component/SettingComponent/ProfileScreen';

import FavoriteContacts from './Component/SettingComponent/FavoriteContacts';




export default function App() {


  return (
    <NavigationContainer> 
      <FavoriteContacts />
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
