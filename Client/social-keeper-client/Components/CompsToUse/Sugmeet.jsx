//create react function component
import React, { useEffect,useState,useContext } from "react";
//import react native components
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Button, Image } from "react-native";
//import icons
import { ListItem } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";
import {MainAppcontext} from "../Screens/MainApp/MainAppcontext";
import axios from "axios";
//import lato font




//create function component
export default function Sugmeet({ meeting, navigation, invitedbyfriend, meetingtype}) {

  //re rub the function when the meeting changes
  
    //load lato font
    const [hobbietype, sethobbietype] = useState('');
    const {user, setUser} = useContext(MainAppcontext);
    const datetime= meeting.date;
    const {hobbienumtypes} = useContext(MainAppcontext);

    useEffect(() => {
      const hobbietype= hobbienumtypes.find((each)=>{
        return each.hobbienum===meeting.hobbieNum
      })
      sethobbietype(hobbietype.hobbie)
      console.log('this is my meeting', meeting)
    }, [meeting])



    const changemeetingstatus = async (meetingNum, status) => {
      try{
      parseInt(meetingNum);
      console.log('this is the meetingstatus', status)
      const url = `http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Updmeeting/${meetingNum}/${status}`;
      console.log('this is the url', url)
  
      const response = await axios.put(url);
      console.log('this is the response', response.data)
      if (response.data) {
          console.log('this is the response', response.data)
          return response.data;
      }
  }
  catch (error) {
      console.log('this is the error', error)
  
  }
  }
  
  const cancelmeeting = async () => {
      const meetingNum = meeting.meetingNum;
      console.log('this is the meetingNum', meetingNum)
      const tblsuggestedcopy= user.tblSuggestedMeetings;
          const tblsuggested1copy= user.tblSuggestedMeetings1;
          let meetingcopy={};
          meetingcopy= user.tblSuggestedMeetings.find(meeting => meeting.meetingNum === meetingNum);
          let data={};
          if(meetingcopy==undefined){
              let meetingtochange=tblsuggested1copy.find(meeting => meeting.meetingNum === meetingNum);
              meetingtochange.status="R";
              setUser({...user,tblSuggestedMeetings1:tblsuggested1copy});
              data=await changemeetingstatus(meetingNum,"R");
  
          }
          else{
              let meetingtochange=tblsuggestedcopy.find(meeting => meeting.meetingNum === meetingNum);
              meetingtochange.status="R";
              setUser({...user,tblSuggestedMeetings:tblsuggestedcopy});
              data=await changemeetingstatus(meetingNum,"R");
  
          }
      }
  

    

    

    //convert datatime to show only the date without the time
    const date = datetime.split('T')[0];

      return (
        <View>
          <ListItem.Swipeable
            rightContent={() => (
                //make info button
                <TouchableOpacity
                style={styles.deleteButton}
                onPress={cancelmeeting}
                >
                <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
             


            )   
            }
            leftContent={() => (
                <TouchableOpacity
                style={styles.infoButton}
                
                onPress={() => {
                  {
                    meetingtype==='suggested' && 
                    navigation.navigate('SuggestedMeetingCalender', {meeting:meeting,invitedbyfriend:invitedbyfriend})
    
                  }
                 {
                  meetingtype==='waiting' && invitedbyfriend &&
                  navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
                 }
                  {
                    meetingtype==='waiting' && !invitedbyfriend &&
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})
                  }
                  {
                    meetingtype==='approved' && invitedbyfriend &&
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
                  }
                  {
                    meetingtype==='approved' && !invitedbyfriend &&
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})
                  }
                  {
                    meetingtype==='Ended' && invitedbyfriend &&
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
                  }
                  {
                    meetingtype==='Ended' && !invitedbyfriend &&
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})
                  }
                

                   
                }}
                >
                <Ionicons name="information-circle" size={24} color="white" />

                </TouchableOpacity>
            )
            }
            containerStyle={styles.container}
           
            rightWidth={Dimensions.get('window').width/3}
            leftWidth={Dimensions.get('window').width/3}
            

            
          >
            <View style={styles.rectengle} >

               {invitedbyfriend ? (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        width: Dimensions.get("window").width - 20,
        height: 65,
      }}
    >
      {console.log("this is meeting", meeting)}

      <Image style={styles.imagestyle} source={{ uri: meeting.user1.imageUri }} />

      <View style={{ marginLeft: 10 }}>
        <Text style={styles.textstyle}>{meeting.user1.userName}</Text>
        <Text style={styles.subtextstyle}>{date}</Text>
      </View>

      <View>
      <Text style={[styles.subtextstyle, { fontWeight:'800', color:'#d99199' }]}>Invited by {meeting.user1.userName}!</Text>

        <Text style={styles.subtextstyle}>
          {meeting.startTime}/ {meeting.endTime}
        </Text>
        <Text style={styles.subtextstyle}>{meeting.place.name}</Text>
      </View>
      
    </View>
  ) : (  <View
    style={{
      flexDirection: "row-reverse",
      alignItems: "center",
      width: Dimensions.get("window").width - 20,
      height: 65,
    }}
  >
    {console.log("this is meeting", meeting)}

    <Image style={styles.imagestyle} source={{ uri: meeting.user2.imageUri }} />

    <View style={{ marginLeft: 10 }}>
      <Text style={styles.textstyle}>{meeting.user2.userName}</Text>
      <Text style={styles.subtextstyle}>{date}</Text>
    </View>

    <View>
      <Text style={styles.subtextstyle}>
        -{meeting.startTime}/ {meeting.endTime}
      </Text>
      <Text style={styles.subtextstyle}>{meeting.place.name}</Text>
    </View>
  </View>
                )}


                
               



                
            </View>
          </ListItem.Swipeable>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        
        height:65,
        width:Dimensions.get('window').width-20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor:'rgba(0, 0, 0, 0.25)',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:4,
        alignSelf:'center',
        flexDirection:'row',
        borderRadius: 25,
        marginTop:10
        
        
    },

    rectengle:{
        backgroundColor:'rgba(0, 0, 0, 0.05)',
        borderRadius: 25,
        width:Dimensions.get('window').width-20,
        height:65,
        

    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        width:"100%",
        borderRadius: 25,
        marginTop:10,
        
      },
      imagestyle:{
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
        marginLeft: 10,
        borderwidth: 3,
        borderColor: '#ffffff'
        },
        textstyle:{
            fontFamily: 'Lato_700Bold',
            fontSize: 14,
            color:'rgba(0, 0, 0, 0.7)',
            fontStyle: 'normal',
            lineHeight: 19,
            letterSpacing: 0.03,
            fontWeight: 'bold',
        
        },
        subtextstyle:{
            fontFamily: 'Lato_400Regular',
            fontSize: 12,
            color:'rgba(0, 0, 0, 0.7)',
            fontStyle: 'normal',
            lineHeight: 16,
            letterSpacing: 0.03,
            fontWeight: 'normal',
        },
        infoButton: {
            backgroundColor: '#00ADEF',
            justifyContent: 'center',
            alignItems: 'center',
            height: 65,
            width:"100%",
            borderRadius: 25,
            marginTop:10,
            

            },

});
