import { StyleSheet, View, Text, Button, SafeAreaView,ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React,{useEffect, useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Customheader from '../../CompsToUse/Customheader'
import {
  useFonts,
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { ListItem } from '@rneui/themed';
import { Icon } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AccountSettings, Meetingtimes,  Intersets, Favoritecont,Logout} from './/PersonalComp/Account.jsx'
import { MainAppcontext } from './MainAppcontext';
import AuthContext from '../../../Authcontext';



 //import icon






//this is the navigation container for the setting dashboard
export default function SettingDashBoard({route}) {

 const isnotif = route.params?.isnotif;
  const notifobj = route.params?.notifobj;
  const {setIsnotif}= React.useContext(AuthContext);
  const {numberofnewfriends, setNumberofnewfriends} = React.useContext(AuthContext);
  const {user, setUser} = React.useContext(MainAppcontext);

  

  const [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

    useEffect(() => {
     
      console.log('isnotif', isnotif)
  //set interval of 30 seconds and then set all the states to 0
  const interval = setInterval(() => {
    setNumberofnewfriends(0);
    setIsnotif(false);
  }, 300000);
  return () => clearInterval(interval);

    },[])

  return (
    <SafeAreaView style={styles.areaviewcontainter}>

      <View style={styles.container}>
      <ScrollView>

        <Customheader ispersonalsettings={true}/>
        <View style={styles.settingsview}>
          <Text style={styles.settingstext}>Settings</Text>
        </View>

        

      <AccountSettings />
        <Meetingtimes/>
        <Intersets/>
        <Favoritecont />
        <Logout/>
        </ScrollView>

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
    flex:1,
    marginTop:40,
    backgroundColor: '#222222',
    borderRadius: 20,
    
  },

  settingsview:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    height:Dimensions.get('window').height*0.1,
    justifyContent: 'center',
    padding:0,
    gap: 3,
    paddingRight: 20,
    marginTop:5
  },

  settingstext:{
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color:'rgba(255, 255, 255, 0.9)',
    fontStyle: 'normal',
    lineHeight: 29,
    display: 'flex',
    alignItems: 'center',
    letterSpacing: 0.03,
    textAlign: 'right',
  },

  listaccordiontext:{
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color:'rgba(255, 255, 255, 0.9)',
    fontStyle: 'normal',
    lineHeight: 19,
    fontWeight:'bold',
    letterSpacing: 0.03,
    alignSelf: 'flex-end',


  }


  
})