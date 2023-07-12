import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
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
import { Icon } from '@rneui/themed';
import { RegistContext } from '../../../RegistContext';








export default function SuggestedMeetingsScreen({navigation,fromnotif,notifobj}) {


  const [selectedIndex, setSelectedIndex] = useState(2);
  const {user, setUser} = useContext(MainAppcontext);
  const {addmeetingtocalender}= useContext(MainAppcontext);
  const {screenisready, setScreenisready} = useContext(MainAppcontext);
  const [mynotife, setMynotife] = useState(notifobj);
  const {isnotif, setIsnotif} = useContext(AuthContext)
  const {removemeetingfromcalender}= useContext(MainAppcontext);
  const {selectedhobbies, setSelectedHobbies} = useContext(RegistContext);
  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const {numberofnewfriends, setNumberofnewfriends} = useContext(AuthContext);
  const {numberofnewendedmeetings, setNumberofnewendedmeetings} = useContext(AuthContext);





  const navigatetogeneratemeet= () => {
    navigation.navigate('Generatemeet')
  }



  useEffect(() => {
  
    console.log('this is userhobbiesdto', user.tblUserHobbiesDTO)
    setSelectedHobbies(user.tblUserHobbiesDTO)
    console.log('this is selectedhobbies', selectedhobbies)
    setPersonalDetails({phoneNumber:user.phoneNum1,userName:user.userName,gender:user.gender})
  

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
      
      const meetingtoapprove= user.tblSuggestedMeetings.find((item) => item.meetingNum==notifobj.meetingnum)
      addmeetingtocalender(meetingtoapprove,false)
    }

    else if(notifobj.notiftype=='Meeting Canceled'){ 

      console.log('this is userblsuggestedmeetings',user.tblSuggestedMeetings)
      const meetingnum=notifobj.meetingnum;
      let copyofmeeting= user.tblSuggestedMeetings.find ((item) => item.meetingNum==meetingnum)
      if(!copyofmeeting){

        copyofmeeting= user.tblSuggestedMeetings1.find ((item) => item.meetingNum==meetingnum)
         const newtblsuggestedmeeting1= user.tblSuggestedMeetings1.filter((item) => item.meetingNum != meetingnum)
          const newuser = {
            ...user,

          }

          newuser.tblSuggestedMeetings1=newtblsuggestedmeeting1;

          setUser(newuser)

          removemeetingfromcalender(copyofmeeting, true)

      }
      else{
        const newtblsuggestedmeeting= user.tblSuggestedMeetings.filter((item) => item.meetingNum != meetingnum)
          const newuser = {
            ...user
          }
          newuser.tblSuggestedMeetings=newtblsuggestedmeeting;
          console.log('this is newuser suggested meetings',newuser.tblSuggestedMeetings)

          setUser(newuser)
          removemeetingfromcalender(copyofmeeting, false)

      }



    }

    else if(notifobj.notiftype=='Meeting Ended'){

      const meetingnum=notifobj.meetingnum;
      getactualmeeting(meetingnum)

    }

    else if(notifobj.notiftype=='Approvedfriendrequest') {

      const possiblefriend= user.possibleFavoriteContacts_invite_DTO.find((item) => item.phonenuminvited == notifobj.phonenuminvited)
      console.log('this is possible friend',possiblefriend)
           if(possiblefriend){
       const newfavoritecontact = {
         ID: parseInt(notifobj.ID),
         phoneNum1:possiblefriend.phonenuminvite,
         phoneNum2:possiblefriend.phonenuminvited,
         hobbieNum:possiblefriend.hobbieNum,
         rank:1,
         tblUser1:possiblefriend.tblUser1,
                  tblHobbie:possiblefriend.tblHobbiedto
   }
   console.log('this is new favorite contact',newfavoritecontact)
   const newfavoritecontacts = [...user.tblFavoriteContacts,newfavoritecontact]
   console.log('this is new favorite contacts',newfavoritecontacts)

   const newpossiblefavoritecontacts = user.possibleFavoriteContacts_invite_DTO.filter((item) => item.phonenuminvited !== notifobj.phonenuminvited)
   console.log('this is new possible favorite contacts',newpossiblefavoritecontacts)
   const newuser = {
     ...user,
     tblFavoriteContacts:newfavoritecontacts,
     possibleFavoriteContacts_invite_DTO:newpossiblefavoritecontacts

   } 
   setUser(newuser)
   //increate number of new friends by 1
   setNumberofnewfriends(numberofnewfriends+1)

 }

     }
   
  
    else{
      setSelectedIndex(2)
    }

    fromnotif=false;

    
  }
  else{
    console.log('im out fromnotif')
    console.log(fromnotif)
    setSelectedIndex(2)
  }


  
   

  

  }, [fromnotif,notifobj])

  
  const getactualmeeting = async (meetingnum) => {
    console.log('im into getactualmeeting')
    let meetingtofind= user.tblactualmeetings.find ((item) => item.meetingNum==meetingnum)
    if(!meetingtofind){
      meetingtofind= user.tblactualmeetings1.find ((item) => item.meetingNum==meetingnum)
      }

      if(meetingtofind){
        console.log('this meeting is already in actualmeetings')
      }
      else{
    const newmeeting= await axios.get(`http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/getactualmeeting/${meetingnum}`);
    const meetingtoret= newmeeting.data;
    let placedetails= await getPlaceDetails(meetingtoret.tblSuggestedMeeting.place.place_id)
    if(placedetails.result){

     placedetails= placedetails.result

    }

    meetingtoret.tblSuggestedMeeting.place=placedetails


    if(meetingtoret?.tblSuggestedMeeting.phoneNum1==user.phoneNum1){

  


      

      const newtblactualmeetings= user.tblactualmeetings;
      newtblactualmeetings.push(meetingtoret)
      const Newuser={...user}
      Newuser.tblactualmeetings=newtblactualmeetings;
      setUser(Newuser);
      console.log('this is newtblactualmeetings',newtblactualmeetings)

    }
    else{
        
        const newtblactualmeetings1= user.tblactualmeetings1;
        newtblactualmeetings1.push(meetingtoret)
        const Newuser={...user}
        Newuser.tblactualmeetings1=newtblactualmeetings1;
        setUser(Newuser);

        console.log('this is newtblactualmeetings1',newtblactualmeetings1)
  
      }

      setNumberofnewendedmeetings(numberofnewendedmeetings+1)



  }
}
 

  const getmeetingfromserver = async (meetingnum) => {
    console.log('im into getmeetingfromserver')
    const newmeeting= await axios.get(`http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Getmeetnew/${meetingnum}`)
    const meetingtoret= newmeeting.data;
    //search if meeting is already in suggestedmeetings1
    const isinmeetings1= user.tblSuggestedMeetings1.find((item) => item.meetingNum==meetingnum)
    if(!isinmeetings1){
    let placedetails= await getPlaceDetails(meetingtoret.place.place_id)
    if(placedetails.result){

       placedetails=placedetails.result
    }
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
        <View style={styles.generatemeetbutton}>

          < TouchableOpacity style={{flexDirection:'row-reverse',height:"100%",alignItems:'center',justifyContent:'center'}}
          onPress={()=> {

            const concatarray= user.tblFavoriteContacts.concat(user.tblFavoriteContacts1)
            console.log('this is concatarray',concatarray)
            if(concatarray.length==0){
              Alert.alert('No Friends To invite', 'You need to add friends to generate a meeting')
            }
            else{
            navigation.navigate('Calendermeet')
            }
          }}
          >
    
         <Icon
          name='calendar-plus-o'
          type='font-awesome'
          color= '#eb6a5e'
          size={17}
          style={{padding:5}}
          />

          <Text style={styles.generatemeetingtext}>
            Generate Meeting
          </Text>

        

          </TouchableOpacity>

        </View>
      </View>
  
      <View style={styles.rectengelbuttongroup}>
        <ButtonGroup
          buttons={['Approved', 'Waiting','Suggested']}
          containerStyle={{height: 44, width:Dimensions.get('window').width-60, borderRadius: 25, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
          textStyle={{fontFamily: 'Lato_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)', textAlign:'center', fontStyle: 'normal', lineHeight: 19, letterSpacing: 0.03, fontWeight: 'normal',}}
          selectedButtonStyle={{backgroundColor: selectedIndex==2? '#f5a093' : selectedIndex==1 ? '#f5f093' : '#93f5a3'}}
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

           
            user.tblSuggestedMeetings1.map((each,index)=>{
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
          user.tblSuggestedMeetings.map((each, index2) => {
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
          user.tblSuggestedMeetings.map((each, index2) => {
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
           

           
            user.tblSuggestedMeetings1.map((each,index)=>{
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
            user.tblSuggestedMeetings1.map((each,index)=>{
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
          user.tblSuggestedMeetings.map((each, index2) => {
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
    paddingTop: 20,
    flexDirection: 'row-reverse',
    width:Dimensions.get('window').width-20,
    justifyContent: 'space-between',
    

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
    marginTop: 15,
    marginBottom: 5
    

  },

  generatemeetbutton:{
    width: 140,
    height: 50,
    borderRadius:20,
    backgroundColor: '#faf7f7',
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

  generatemeetingtext:{
    fontFamily: 'Lato_400Regular',
    fontSize: 10,
    
    color: '#eb6a5e',
    textAlign:'center',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0.03,
    paddingRight: 5,

  } 


  
})
