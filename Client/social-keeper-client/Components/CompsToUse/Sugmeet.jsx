//create react function component
import React, { useEffect,useState,useRef,useContext } from "react";
//import react native components
import { View, Text, StyleSheet, ScrollView,TouchableOpacity, SafeAreaView, Dimensions,Animated ,Button, Image } from "react-native";
//import icons
import { ListItem } from '@rneui/themed';
import { Ionicons } from "@expo/vector-icons";
import {MainAppcontext} from "../Screens/MainApp/MainAppcontext";
import axios from "axios";
import * as Calendar from 'expo-calendar';

//import lato font




//create function component
export default function Sugmeet({ meeting, navigation,meetingnumnew, invitedbyfriend, meetingtype}) {

  //re rub the function when the meeting changes
  
    //load lato font
    const [hobbietype, sethobbietype] = useState('');
    const {user, setUser} = useContext(MainAppcontext);
    const [images, setImages] = useState([]);
    const datetime= meeting.date;
    const {hobbienumtypes} = useContext(MainAppcontext);
    const {removemeetingfromcalender,addmeetingtocalender}= useContext(MainAppcontext);
    const [photoindex, setphotoindex] = useState(0);
    const apikey='AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow'
    const fadeAnim = useRef(new Animated.Value(1)).current;  // Initial value for opacity


 

  useEffect(() => {

 

    const interval = setInterval(() => {
      let newindex=photoindex+1;
      if(newindex>images.length-1){
        newindex=0;
      }
      Animated.timing(fadeAnim, {
        toValue: 0, // The final opacity value
        duration: 2000, // Duration of the animation in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => {
        setphotoindex(newindex); // Set the new index here
    
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1, // The final opacity value
          duration: 2000, // Duration of the animation in milliseconds
          useNativeDriver: true, // Use native driver for better performance
        }).start();
      });
    
    }, 4000);  // Change image every 3 seconds
  
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [photoindex,images]);

    useEffect(() => {
      const hobbietype= hobbienumtypes.find((each)=>{
        return each.hobbienum===meeting.hobbieNum
      })
      sethobbietype(hobbietype.hobbie)

      console.log('this is meetingnumnew', meetingnumnew)
      console.log('this is meeting', meeting.meetingNum)

      const newImages = [];
      if (meeting.place.photos.length > 0) {
          for (let i = 0; i < meeting.place.photos.length; i++) {
              const photoref = meeting.place.photos[i].photo_reference;
              const photorequest = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoref}&key=${apikey}`;
              newImages.push({ uri: photorequest });
              if (i > 5) {
                  break;
              }
          }
      }
      setImages(newImages);
      console.log('this is meeting22', meeting)

  

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
              let currentmeetingstatus=meetingtochange.status;
              meetingtochange.status="R";
              setUser({...user,tblSuggestedMeetings1:tblsuggested1copy});
              data=await changemeetingstatus(meetingNum,"R");
              if(currentmeetingstatus=="A"){
                await removemeetingfromcalender(meeting,invitedbyfriend? true:false);
                const url=  `http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/sendcancelnotif/${meetingNum}/${meetingtochange.phoneNum1}`;
                console.log('this is the url new', url)

                const notifyfriend= await axios.post(url);

                }

  
          }
          else{
              let meetingtochange=tblsuggestedcopy.find(meeting => meeting.meetingNum === meetingNum);
              let currentmeetingstatus=meetingtochange.status;
              meetingtochange.status="R";
              setUser({...user,tblSuggestedMeetings:tblsuggestedcopy});
              data=await changemeetingstatus(meetingNum,"R");

              if(currentmeetingstatus=="A"){
                await removemeetingfromcalender(meeting,false);
                const url= `http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/sendcancelnotif/${meetingNum}/${meetingtochange.phoneNum2}`
                console.log('this is the url', url)
                const notifyfriend= await axios.post(url);


                }
  
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
                style={[styles.infoButton, {  backgroundColor: meetingtype=='suggested'? '#2ecc71' : '#00ADEF'}]}
                
                onPress={async () => {
                  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
                  const tblsuggestedcopy= user.tblSuggestedMeetings;
                  const tblsuggested1copy= user.tblSuggestedMeetings1;

                  
                   if( meetingtype==='suggested' &&  !invitedbyfriend){

                    const meetingNum = meeting.meetingNum;
                    let meetingnumparsed=parseInt(meetingNum);
                    let meetingtochange=tblsuggestedcopy.find(meeting => meeting.meetingNum === meetingNum);
                    meetingtochange.status="W";
                    setUser({...user,tblSuggestedMeetings:tblsuggestedcopy});
                    let data=await changemeetingstatus(meetingnumparsed,"W");

                   

                  }

                  else if(meetingtype==='suggested' && invitedbyfriend){
                    const meetingNum = meeting.meetingNum;
                    let meetingnumparsed=parseInt(meetingNum);
                    let meetingtochange=tblsuggested1copy.find(meeting => meeting.meetingNum === meetingNum);
                    meetingtochange.status="A";
               

            setUser({...user,tblSuggestedMeetings1:tblsuggested1copy});
                    let data=await changemeetingstatus(meetingnumparsed,"A");
                    await addmeetingtocalender(meeting,true);
                           

                  }
              
                  
                    else if (meetingtype==='waiting'){
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})
                  }
                  
                  
                    else if(meetingtype==='approved' && invitedbyfriend){
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
                  }
                  
                  else if(meetingtype==='approved' && !invitedbyfriend) {

                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})
                  }
                  
                  
                    else if(meetingtype==='Ended' && invitedbyfriend){
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
                    }

                  
                  else if(  meetingtype==='Ended' && !invitedbyfriend) {
                    navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user2, meetingtype:meetingtype, type:hobbietype})

                  }
                

                   
                }}
                >
                  {
                    (meetingtype==='waiting' || meetingtype==='approved'  || meetingtype==='Ended') &&
                    <Ionicons name="information-circle" size={24} color="white" />

                  }
                  {
                    meetingtype==='suggested' &&
                    <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="white"
                  />
                  }

                </TouchableOpacity>
            )
            }
            containerStyle={styles.container}
           
            rightWidth={Dimensions.get('window').width/3}
            leftWidth={Dimensions.get('window').width/3}
            

            
          >
            <TouchableOpacity style={styles.rectengle} onPress={()=> {
               {
                meetingtype==='suggested' &&  !invitedbyfriend &&
                navigation.navigate('SuggestedMeetingCalender', {meeting:meeting,invitedbyfriend:invitedbyfriend})

              }
             {
              meetingtype==='suggested' && invitedbyfriend &&
              navigation.navigate('Meetdetails', {meeting:meeting, usertomeet:meeting.user1, meetingtype:meetingtype, type:hobbietype})
             }
              {
                meetingtype==='waiting' &&
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
              
            }} >

               {invitedbyfriend ? (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        width: Dimensions.get("window").width - 20,
        height: 100,
      }}
    >

      <Image style={styles.imagestyle} source={{ uri: meeting.user1.imageUri }} />

      <View style={{ marginLeft: 10 }}>
        <Text style={styles.textstyle}>{meeting.user1.userName}</Text>
        <Text style={styles.subtextstyle}>{date}</Text>
      </View>

      <View >
      <View style={{width:Dimensions.get('window').width-250,padding:10}}>

      <Text style={[styles.subtextstyle, { fontWeight:'800', color:'#d99199' }]}>Invited by {meeting.user1.userName}!</Text>

        <Text style={styles.subtextstyle}>
         



          {meeting.startTime}/ {meeting.endTime}
        </Text>
        <Text style={styles.subtextstyle}>{meeting.place.name} </Text>

    
     
     
        {
          meetingnumnew==meeting.meetingNum &&
          
          
          <Text style={[styles.subtextstyle, { fontWeight:'800', color:'red', fontSize:10 }]}>New Activity!

          {console.log('im here')}
          
          
          </Text>
       
          
        }

        </View>

        


        
     
      </View>
      {
    photoindex!= undefined  && images[photoindex]?.uri!=undefined &&
    // <Image source={{uri:images[photoindex].uri} }
    //       style={{height:70,width:70, borderRadius:20}} />
    <Animated.Image source={{uri:images[photoindex].uri} }
          style={{height:70,width:70,marginLeft:5, borderRadius:20, opacity:fadeAnim}} />
  }  
      
    </View>
  ) : (  <View
    style={{
      flexDirection: "row-reverse",
      alignItems: "center",
      width: Dimensions.get("window").width - 20,
      justifyContent: "space-between",
      height: 100,

    }}
  >

    <Image style={styles.imagestyle} source={{ uri: meeting.user2.imageUri }} />

    <View style={{ marginLeft: 10 }}>
      <Text style={styles.textstyle}>{meeting.user2.userName}</Text>
      <Text style={styles.subtextstyle}>{date}</Text>
    </View>

    <View style={{width:Dimensions.get('window').width-250,padding:10}} >
      <Text style={styles.subtextstyle}>
        -{meeting.startTime}/ {meeting.endTime}
      </Text>
      <Text style={styles.subtextstyle}>{meeting.place.name}</Text>
      {
          meetingnumnew==meeting.meetingNum &&
          
          <Text style={[styles.subtextstyle, { fontFamily:'Pacifico_400Regular',marginRight:14, color:'#eb6a5e', fontSize:12,lineHeight:20 }]}>New Activity!

          {console.log('im here')}
          
          
          </Text>
          
        }
  

    </View>


  {
    photoindex!= undefined  && images[photoindex]?.uri!=undefined &&
    // <Image source={{uri:images[photoindex].uri} }
    //       style={{height:70,width:70, borderRadius:20}} />
    <Animated.Image source={{uri:images[photoindex].uri} }
          style={{height:70,width:70,marginLeft:5, borderRadius:20, opacity:fadeAnim}} />
  }   

 
                  
      
 
  
  </View>

  
                )}




                
               



                
            </TouchableOpacity>
          </ListItem.Swipeable>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        
        height:100,
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
        height:100,
        

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
            textAlign:'left',
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
