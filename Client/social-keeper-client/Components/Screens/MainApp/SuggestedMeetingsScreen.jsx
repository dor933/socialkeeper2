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







export default function SuggestedMeetingsScreen({navigation}) {


  const [selectedIndex, setSelectedIndex] = useState(2);
  const {user, setUser} = useContext(MainAppcontext);
  const [newtblsuggesthis, setnewtblsuggesthis] = useState([]);
  const [newtblsuggest1this, setnewtblsuggest1this] = useState([]);
  const {screenisready, setScreenisready} = useContext(MainAppcontext);

  useEffect(() => {
    if(user.tblSuggestedMeetings){
      setnewtblsuggesthis(user.tblSuggestedMeetings)
    }
    if(user.tblSuggestedMeetings1){
      setnewtblsuggest1this(user.tblSuggestedMeetings1)
    }

   

  }, [user])


 



  return (
    
    <SafeAreaView style={styles.areaviewcontainter}>
      <ScrollView>
    <View style={styles.container}>
    
   
      <Customheader/>
      <View style={styles.meetingview}> 
        <Text style={styles.meetingtext}>My Meetings</Text>
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
           selectedIndex==2
           && user.tblSuggestedMeetings1 
           && user.tblSuggestedMeetings1.length > 0 && 

           
            newtblsuggest1this.map((each,index)=>{
              if(each.status=='P'){
            return(
              
            <Sugmeet meeting={each} key={index} navigation={navigation} invitedbyfriend={true} meetingtype="suggested"  />
            )
              }

                      }
            )
         
                   }
            
          {
          user.tblSuggestedMeetings &&
          user.tblSuggestedMeetings.length > 0 &&
          selectedIndex === 2 &&
          newtblsuggesthis.map((each, index2) => {
            if(each.status=="P"){

              console.log("each",each.place)

            return(


            <Sugmeet
              meeting={each}
              key={index2}
              navigation={navigation}
              invitedbyfriend={false}
              meetingtype="suggested"
            />
            )
            }
})
          
        }

{
          user.tblSuggestedMeetings &&
          user.tblSuggestedMeetings.length > 0 &&
          selectedIndex === 1 &&
          newtblsuggesthis.map((each, index2) => {
            if(each.status=="W"){


            return(

            <Sugmeet
              meeting={each}
              key={index2}
              navigation={navigation}
              invitedbyfriend={false}
              meetingtype="waiting"
            />
            )
            }
})
          
        }
              {
           selectedIndex==2
           && user.tblSuggestedMeetings1 
           && user.tblSuggestedMeetings1.length > 0 && 

           
            newtblsuggest1this.map((each,index)=>{
              if(each.status=='W'){
            return(
              
            <Sugmeet meeting={each}
             key={index}
              navigation={navigation} 
              invitedbyfriend={true}
               meetingtype="suggested"  />
            )
              }

                      }
            )
         
                   }
                   {
            selectedIndex==0
            && user.tblSuggestedMeetings1
            && user.tblSuggestedMeetings1.length > 0 &&
            newtblsuggest1this.map((each,index)=>{
              if(each.status=='A'){
            return(
              <Sugmeet
              meeting={each}
              key={index}
              navigation={navigation}
              invitedbyfriend={true}
              meetingtype="approved"
            />
            )
                   }
            })
          }
          {
          user.tblSuggestedMeetings &&
          user.tblSuggestedMeetings.length > 0 &&
          selectedIndex === 0 &&
          newtblsuggesthis.map((each, index2) => {
            if(each.status=="A"){
            return(

            <Sugmeet     
              meeting={each}
              key={index2}
              navigation={navigation}
              invitedbyfriend={false}
              meetingtype="approved"
            />
            )
            }
})

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
    marginTop:40,
    alignItems:'center',

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
    //move it to left
    paddingRight:180
    

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
