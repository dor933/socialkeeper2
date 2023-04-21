import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Customheader from '../../CompsToUse/Customheader'
import {
  useFonts,
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  
  Lato_900Black,
} from '@expo-google-fonts/lato';
import { ButtonGroup } from '@rneui/themed';
import { useState,useEffect,useContext } from 'react';
import * as Calendar from 'expo-calendar';
import { MainAppcontext } from './MainAppcontext';



export default function SuggestedMeetingsScreen() {

  const {userevents, setUserevents} = useContext(MainAppcontext);

  useEffect(() => {
    getcalendars();
  }, []);

  

  const getcalendars = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      //get my calandar with id
      const calendars = await Calendar.getCalendarsAsync();
      console.log('Here are all your calendars:');

      console.log({ calendars });

     //get all the calendars id's and set them in an array except the data about holidays
     
      const calendarIds = calendars.map(each => each.id);

      //make a new date object and set it to today
      const startDate = new Date();
      //set the end date to 1 year from now
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      console.log('Getting events between ' + startDate + ' and ' + endDate);
      


      const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);
      console.log('Here are all your events:');
      console.log({ events });
      //create a new object which contain the events titles and dates and end dates if there is any and location if there is any and add them to the user events array
      const newevents = events.map(each => {
        return {
          title: each.title,
          startDate: each.startDate,
          endDate: each.endDate,
          location: each.location,
        };
        
      });

      setUserevents(newevents);
      console.log(newevents);
      //set the user events array to the new events array


  


      
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  let [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  return (
    
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
   
      <Customheader/>
      <View style={styles.meetingview}> 
        <Text style={styles.meetingtext}> Meetings</Text>
      </View>
      <View style={styles.rectengelbuttongroup}>
        <ButtonGroup
          buttons={['Approved', 'Waiting','All']}
          containerStyle={{height: 44, width:Dimensions.get('window').width-60, borderRadius: 25, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
          textStyle={{fontFamily: 'Lato_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)', textAlign:'center', fontStyle: 'normal', lineHeight: 19, letterSpacing: 0.03, fontWeight: 'normal',}}
          selectedButtonStyle={{backgroundColor: '#ffffff'}}
          selectedTextStyle={{color: 'rgba(0, 0, 0, 0.5)'}}
          innerBorderStyle={{width: 0}}
          selectedIndex={selectedIndex}
          onPress={index => setSelectedIndex(index)}
          />
        </View>
    </View>
    </SafeAreaView>
  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40
  },

  meetingview:{
    backgroundColor: '#ffffff',
    alignItems:'flex-end',
    paddingRight: 20,
    paddingTop: 20,

  },

  meetingtext:{
    fontFamily: 'Lato_700Bold',
    fontSize: 24,
    color: '#000000',
    textAlign:'center',
    fontStyle: 'normal',
    lineHeight: 29,
    letterSpacing: 0.03,
    fontWeight: 'bold',

  },
  rectengelbuttongroup:{
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 25,
    width:Dimensions.get('window').width-60,
    height: 44,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,


  },


  
})