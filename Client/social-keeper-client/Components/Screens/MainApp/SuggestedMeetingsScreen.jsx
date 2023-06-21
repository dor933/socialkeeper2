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
import AuthContext from '../../../Authcontext';







export default function SuggestedMeetingsScreen({navigation,fromnotif,notifobj}) {


  const [selectedIndex, setSelectedIndex] = useState(2);
  const {user, setUser} = useContext(MainAppcontext);
  const [newtblsuggesthis, setnewtblsuggesthis] = useState([]);
  const [newtblsuggest1this, setnewtblsuggest1this] = useState([]);
  const {screenisready, setScreenisready} = useContext(MainAppcontext);
  const [mynotife, setMynotife] = useState(notifobj);
  const {isnotif, setIsnotif} = useContext(AuthContext)



  useEffect(() => {
    console.log('is notif is '+isnotif)
    console.log('my notif is '+mynotife)
  

  },[])

  useEffect(() => {

    console.log('this is tblsuggested1',user.tblSuggestedMeetings1)
    if(fromnotif){
      console.log('im into fromnotif')
    setMynotife(notifobj)
    console.log(notifobj)
    setIsnotif(true)
    

    if(notifobj.notiftype=='Suggestedmeeting'){
      console.log('im into suggestedmeeting')
      setSelectedIndex(2)

      getmeetingfromserver(notifobj.meetingnum)
    
    }
    else if(notifobj.notiftype=='Approvedmeeting'){
      setSelectedIndex(0)
      const newtblsuggestedmeetings= user.tblSuggestedMeetings.map((item) => {
        if(item.meetingNum==notifobj.meetingnum){
          return {...item,status:'A'};
        }
        return item;
      });
      const Newuser={...user}
      Newuser.tblSuggestedMeetings=newtblsuggestedmeetings;
      setUser(Newuser);
    }
    // else if(notifobj.notiftype=='Approvedfriendrequest') {

    //   const possiblefriend= user.possibleFavoriteContacts_invite_DTO.find((item) => item.phonenuminvited == notifobj.phonenuminvited)
    //   console.log('this is possible friend',possiblefriend)
  //     if(possiblefriend){
  //       const newfavoritecontact = {
  //         ID:notifobj.ID,
  //         phoneNum1:possiblefriend.phonenuminvite,
  //         phoneNum2:possiblefriend.phonenuminvited,
  //         hobbieNum:possiblefriend.hobbienum,
  //         rank:1,
  //         tblUser1:possiblefriend.tblUser1,
  //                  tblHobbie:possiblefriend.tblHobbiedto
  //   }
  //   console.log('this is new favorite contact',newfavoritecontact)
  //   const newfavoritecontacts = [...user.tblFavoriteContacts,newfavoritecontact]

  //   const newpossiblefavoritecontacts = user.possibleFavoriteContacts_invite_DTO.filter((item) => item.phonenuminvited !== notifobj.phonenuminvited)
  //   console.log('this is new possible favorite contacts',newpossiblefavoritecontacts)
  //   const newuser = {
  //     ...user,
  //     tblFavoriteContacts:newfavoritecontacts,
  //     possibleFavoriteContacts_invite_DTO:newpossiblefavoritecontacts

  //   } 
  //   setUser(newuser)
  

  //  }
   
  // }
    else{
      setSelectedIndex(2)
    }

    
  }
  else{
    console.log('im out fromnotif')
    console.log(fromnotif)
    setSelectedIndex(2)
  }


  
   

  

  }, [fromnotif,notifobj])

  useEffect(() => {
   
    if(user.tblSuggestedMeetings){
      setnewtblsuggesthis(user.tblSuggestedMeetings)
    }
    if(user.tblSuggestedMeetings1){
      setnewtblsuggest1this(user.tblSuggestedMeetings1)
    }
  
  
  
  }, [user])

  const getmeetingfromserver = async (meetingnum) => {
    console.log('im into getmeetingfromserver')
    const newmeeting= await axios.get(`http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Getmeetnew/${meetingnum}`)
    const meetingtoret= newmeeting.data;
    console.log('this is meeting to ret',meetingtoret)
    //search if meeting is already in suggestedmeetings1
    const isinmeetings1= user.tblSuggestedMeetings1.find((item) => item.meetingNum==meetingnum)
    console.log('this is isinmeetings1',isinmeetings1)
    if( isinmeetings1==undefined ){
    const placedetails= await getPlaceDetails(meetingtoret.place.place_id)
    meetingtoret.place=placedetails;
    const newtblsuggested1meetings= user.tblSuggestedMeetings1;
    newtblsuggested1meetings.push(meetingtoret)
    const Newuser={...user}
    Newuser.tblSuggestedMeetings1=newtblsuggested1meetings;
    setUser(Newuser);
    }
    else{
      console.log('this meeting is already in suggestedmeetings1')
      setIsnotif(false)
    }
   
    
  }




  


 



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
              
            <Sugmeet meeting={each} setisnotif={setIsnotif} key={index} navigation={navigation} invitedbyfriend={true} meetingtype="suggested"  />
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
               meetingtype="suggested"
               meetingnumnew={isnotif && notifobj.notiftype=='Suggestedmeeting'? mynotife.meetingnum : null} 
                />
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
              meetingnumnew={isnotif && notifobj.notiftype=='Approvedmeeting'? mynotife.meetingnum : null}
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
              meetingnumnew={isnotif && notifobj.notiftype=='Approvedmeeting' ? mynotife.meetingnum: null}


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
    fontFamily: 'Pacifico_400Regular',
    fontSize: 33,
    color: '#eb6a5e',
    textAlign:'center',
    fontStyle: 'normal',
    lineHeight: 54,
  
    letterSpacing: 0.03,
    //move it to left
    paddingRight:170,
    marginTop: 15,
    marginBottom: 5
    

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
