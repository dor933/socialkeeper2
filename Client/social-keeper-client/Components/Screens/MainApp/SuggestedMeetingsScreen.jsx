import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
// import use context
import React from 'react'
import Customheader from '../../CompsToUse/Customheader'
import { ButtonGroup } from '@rneui/themed';
import { useState,useEffect,useContext } from 'react';
import * as Calendar from 'expo-calendar';
import { MainAppcontext } from './MainAppcontext';
import firebaseInstance  from '../..//../assets/Firebase/firebaseconfig';
//import axios
import axios from 'axios';
import Sugmeet from '../../CompsToUse/Sugmeet';
import {getPlaceDetails} from '../../..//assets/Utils/places';
import { ScrollView } from 'react-native-gesture-handler';
import Loadingcomp from '../../CompsToUse/Loadingcomp';


let index=0;
let index2=0;




export default function SuggestedMeetingsScreen({navigation}) {



  const [selectedIndex, setSelectedIndex] = useState(2);
  const {user, setUser} = useContext(MainAppcontext);




  return (
    
    <SafeAreaView style={styles.areaviewcontainter}>
      <ScrollView>
    <View style={styles.container}>
    
   
      <Customheader/>
      <View style={styles.meetingview}> 
        <Text style={styles.meetingtext}> Meetings</Text>
      </View>
      <View style={styles.rectengelbuttongroup}>
        <ButtonGroup
          buttons={['Approved', 'Waiting','Suggested']}
          containerStyle={{height: 44, width:Dimensions.get('window').width-60, borderRadius: 25, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
          textStyle={{fontFamily: 'Lato_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)', textAlign:'center', fontStyle: 'normal', lineHeight: 19, letterSpacing: 0.03, fontWeight: 'normal',}}
          selectedButtonStyle={{backgroundColor: '#ffffff'}}
          selectedTextStyle={{color: 'rgba(0, 0, 0, 0.5)'}}
          innerBorderStyle={{width: 0}}
          selectedIndex={selectedIndex}
          onPress={index => setSelectedIndex(index)}

          
          />
        </View>
        <View >
          {
            console.log('this is suggestedmeetings1',user.tblSuggestedMeetings1)
          }
          {
           selectedIndex==2
           && user.tblSuggestedMeetings1 
           && user.tblSuggestedMeetings1.length > 0 ? (

           
            user.tblSuggestedMeetings1.map((each,index)=>{
            return(
              
            <Sugmeet meeting={each} key={index} navigation={navigation} invitedbyfriend={true}  />
            )

                      }
            )
         
          ) : (
            <></>
          )
                   }
                    {
            console.log('this is suggestedmeetings',user.tblSuggestedMeetings)
          }
          {
          
          
          user.tblSuggestedMeetings &&
          user.tblSuggestedMeetings.length > 0 ? (
          selectedIndex === 2 &&
          user.tblSuggestedMeetings.map((each, index2) => (
            <Sugmeet
              meeting={each}
              key={index2}
              navigation={navigation}
              invitedbyfriend={false}
            />
          ))
        
        ) : (
          <></>
        )
        }


          
        </View>
    </View>
    </ScrollView>
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
