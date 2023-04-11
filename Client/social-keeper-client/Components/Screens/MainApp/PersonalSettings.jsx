import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React,{useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Customheader from '../../CompsToUse/Customheader'



//this is the navigation container for the setting dashboard
export default function SettingDashBoard(props) {
  return (
    <SafeAreaView style={styles.areaviewcontainter}>
      <View style={styles.container}>
        <Customheader/>
    </View>
    </SafeAreaView>

  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40,
    backgroundColor: '#222222',
    borderRadius: 20,
    
  }

  
})