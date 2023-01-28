import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import MainDashBoard from './Component/MainDashBoard';

import { NavigationContainer } from '@react-navigation/native';

export default function App() {
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
