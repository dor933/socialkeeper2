import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
//import usestate
import { useState, useEffect,useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocationPhotos from './Locationphotos';
import Customheader from './Customheader';
import StarRating from 'react-native-star-rating-widget';
import AuthContext from '../../Authcontext';
import axios from 'axios';
import { MainAppcontext } from '../Screens/MainApp/MainAppcontext';
//import deep link
import { Linking } from 'react-native';
//import FontAwsome



//icons
const calendarIcon = <Icon name="calendar" size={20} color="#900" style={{ right: 1 }} />;
const clockIcon = <Icon name="clock-o" size={20} color="#900" style={{ right: 1 }} />;
const locationIcon = <Icon name="map-marker" size={20} color="#900" style={{ right: -2 }} />;
const meetingTypeIcon = <Icon name="users" size={20} color="#900" style={{ right: 2 }} />;
const homeicon= <Icon name="home" size={20} color="#900" style={{ right: 2 }} />;
const waze= <Icon name="car" size={20} color="#91b3ff" style={{ right: 2 }} />;
//Upper component
const Details = ({route,navigation}) => {


   

    const meeting=route.params.meeting;
    const usertomeeting=route.params.usertomeet;
    const invitedbyfriend=meeting.user1.phonenumbers[0]==usertomeeting.phonenumbers[0] ? true : false; 
    const type=route.params.type;
    const meetingtype= route.params.meetingtype;
    const {isnotif, setIsnotif} = useContext(AuthContext)
    const setisnotif=route.params?.setisnotif;
    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const {user, setUser} = useContext(MainAppcontext);

    useEffect(() => {
        console.log('this is meeting',meeting);
        console.log('this is type',type);
        setIsnotif(false)
        if(meetingtype=='Ended') {

     
            if(invitedbyfriend){
                const firstmeetcopy= user.tblactualmeetings1.find(meet => meet.meetingNum === meeting.meetingNum);
                setRating1(firstmeetcopy.rankUser2);
            }
            else {
                const firstmeetcopy= user.tblactualmeetings.find(meet => meet.meetingNum === meeting.meetingNum);
                setRating1(firstmeetcopy.rankUser1);
            }


        }

       

    }, [])

    const rateendmeeting = async (meetingid) => {
 
        let updateobj={};

    

        if(invitedbyfriend){
  
           updateobj={
            rankUser2:rating1,
            meetingNum:meetingid
          }
  
        }
        else {
  
           updateobj={
            rankUser1:rating1,
            meetingNum:meetingid
        }
      }
  
      const response= await axios.put('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/updateactrank',updateobj)
      if(response.data='rating updated'){
  
        console.log('this is the response', response.data)
  
        if(invitedbyfriend){
  
          const meetingcopy= user.tblactualmeetings1.find(meeting => meeting.meetingNum === meetingid);
          meetingcopy.rankUser2=rating1;
  
        }
        else {
  
          const meetingcopy= user.tblactualmeetings.find(meeting => meeting.meetingNum === meetingid);
          meetingcopy.rankUser1=rating1;
  
        }
      }
  
      
  
  
    }
  

    function getDayOfWeek(dateString) {
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[date.getDay()];
        return dayName;
    }

    function handlerating1 (rating) {
        const roundedrating=Math.round(rating);
        setRating1(roundedrating);
    }

    function handlerating2 (rating) {
        const roundedrating=Math.round(rating);
        setRating2(roundedrating);
    }

    const day = getDayOfWeek(meeting.date);
    const starthour=meeting.startTime.split(":").slice(0,2).join(":");
    const endhour=meeting.endTime.split(":").slice(0,2).join(":");

    return (
        <SafeAreaView style={styles.areaviewcontainter}>

        <FlatList
            data={[1]}
            keyExtractor={() => 'dummy-key'}
            renderItem={() => (
                <View style={styles.container}>
                    <View style={{alignItems:'center'}}>

                    <Customheader />
                    {console.log('this is meetingtype',meetingtype)}

                    </View>

                        <View style={{paddingHorizontal:15}} >
                        <View style={styles.meetingNameContainer}>
                            {
                                meetingtype==='approved' ? 
                                <Text style={styles.header1}>Meeting Approved! </Text>

                                : 
                                meetingtype==='suggested' && meeting.status=='W' ?
                                <Text style={styles.header1}>Approve Meeting!</Text>
                                :
                                meetingtype==='suggested' && meeting.status=='P' ?
                               
                                <Text style={styles.header1}>Suggest Meeting!</Text> :
                                meetingtype==='Ended' ?
                                <Text style={styles.header1}>Meeting Completed!</Text> :
                                
                                
                                <Text style={styles.header1}>Pending Meeting!</Text>

                            }
                            <TouchableOpacity style={styles.personBtn} onPress={() => { alert('Meetings with Shlomit') }}>
                                        <Text style={styles.personBtnText}>Meeting With {usertomeeting.userName}  </Text>
                                        <Image source={{uri:usertomeeting.imageUri}} style={styles.womanIcon} />
                                        <View style={styles.greenDot}></View>


                            </TouchableOpacity>

                        </View>
                        {
                            meetingtype==='suggested' && meeting.status=='W' &&
                            <Text style={styles.bottonHeader1}>The meeting is waiting for your approve!</Text>
                        }
                        {
                            meetingtype==='suggested' && meeting.status=='P' &&
                            <Text style={styles.bottonHeader1}>Send meeting invitation to {usertomeeting.userName} ! </Text>

                        }
                        {
                            meetingtype==='waiting' && meeting.status=='W' &&
                            <Text style={styles.bottonHeader1}>The meeting is waiting for {usertomeeting.userName} approve!</Text>
                        }
                        {
                            meetingtype==='approved' &&
                            <Text style={styles.bottonHeader1}>The meeting with {usertomeeting.userName} has been approved!</Text>
                        }
                        {
                            meetingtype==='Ended' &&
                            <Text style={styles.bottonHeader1}>The meeting with {usertomeeting.userName} has ended!</Text>
                        }

                    <View style={styles.line} />
                    <View style={styles.headerRow}>
                        <Text style={styles.header2}>Meeting Details</Text>
                        <TouchableOpacity onPress={() => { alert('The meeting is on hold and waiting for the other party\'s confirmation') }}>
                                { ((meetingtype === 'suggested') || (meetingtype=='waiting')) &&
                                <View style={styles.statusBtn}>
                                  <Text style={styles.statusBtnText}>Pending</Text>
                                  </View>
                                }
                                {meetingtype === 'approved' &&
                                <View style={[styles.statusBtn, {backgroundColor:"#1f6e34"}]}>
                                    <Text style={styles.statusBtnText}>Approved</Text>
                                </View>
                                }
                                {
                                    meetingtype==='Ended' &&
                                    <View style={[styles.statusBtn, {backgroundColor:"rgba(0,0,0,0.5)"}]}>
                                    <Text style={styles.statusBtnText}>Completed</Text>
                                </View>
                                }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.item}>
                        {homeicon}
                        <Text style={styles.text}>{meeting.place.name}</Text>
                    </View>
                    <View style={styles.item}>
                        {calendarIcon}
                        <Text style={styles.text}>{day}, {meeting.date.split("T")[0]}</Text>
                    </View>
                    <View style={styles.item}>
                        {clockIcon}
                        <Text style={styles.text}> 
                        
                        
                        {starthour}- {endhour}
                        
                        </Text>
                    </View>
                    <View style={styles.item}>
                        {locationIcon}
                        <Text style={styles.text}>

                            
                             {meeting.place.vicinity}
                             
                             </Text>
                    </View>
                   
                    <View style={styles.item}>
                        {meetingTypeIcon}
                        <Text style={styles.text}>Meeting Type: {type}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => { Linking.openURL(`https://www.waze.com/ul?ll=${meeting.place.geometry.location.lat},${meeting.place.geometry.location.lng}&navigate=yes`) }}>
                    <View style={[styles.item]}>
                    {waze}

                        <Text style={[styles.text,{color:'#91b3ff',fontWeight:'bold'}]}>


                           
                            Navigate with Waze


                            
                             
                             </Text>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.line} />
                    <LocationPhotos navigation={navigation} photosarray={meeting.place.photos} typeofmeeting={meetingtype} meeting={meeting} />
                    {  meetingtype=='Ended' && 
                    <View>
                    <Text style={styles.feedBack}>Feedback </Text> 
            <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>Meeting satisfaction</Text>
                    <StarRating
          starSize={20}
          maxStars={5}
          rating={rating1}
          onChange={handlerating1}
        />

     
            </View>
         
            <View style={styles.buttonsviews}>
            <TouchableOpacity style={styles.submitbox} onPress={async() => rateendmeeting(meeting.meetingNum)}>
                <Text style={styles.submittext}>Submit</Text>
            </TouchableOpacity>
            </View>

            </View>
            }
                </View>
                </View>
            )}
            contentContainerStyle={styles.content}
        />
                

    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 40,
        width: Dimensions.get('window').width
        
    },
    areaviewcontainter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        

        
      },
      buttonsviews:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.05,
        top: Dimensions.get('window').height * 0.005,
        alignItems:'center',
        justifyContent:'center',
        
    },
    submittext:{
        color: '#ffffff',
        fontSize: 15,
        fontFamily:'Lato_400Regular',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        
    
      
        
    },

    feedBack:{
        fontSize: 20,
        textAlign: 'center',
        fontFamily:'Lato_400Regular',

    },

    personBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        paddingVertical: 3,
        
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        borderRadius: 15,
        paddingLeft: 15
        
    },
    personBtnText: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 10,

    },

    submitbox:{

        backgroundColor: "#1976D2",
        boxShadow: '0px 0px 40px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        justifyContent:'center',
        alignItems:'center',
        width:"48%",
        height:"100%",


    },
    womanIcon: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 25,
        
    },
    greenDot: {
        width: 7,
        height: 7,
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 25,
        alignSelf: 'flex-end',
        right: 7
       
    },
    item: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginVertical: 8,
        backgroundColor: '#f2f2f2',
        borderRadius: 15,
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    text: {
        fontSize: 14,
        marginLeft: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10,
        color: 'rgba(0, 0, 0, 0.7)'
    },
    header1: {
        fontSize: 20,
        paddingVertical: 10,
        fontFamily:'Lato_700Bold',
        
        
        
    },
    header2: {
        fontSize: 12,
        paddingVertical: 10,
        fontFamily:'Lato_400Regular',
        fontWeight:'700',
    },
    line: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        marginVertical: 25,
    },
    ratingContainer: {
        flexDirection: 'row-reverse',

        justifyContent: 'space-around',
        paddingVertical: 0,
        
        alignItems: 'center',
        height: 70
        
    },
    bottonHeader1: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 14,
        fontFamily:'Lato_400Regular',
        justifyContent: 'center',
        paddingLeft: 7,
        paddingTop: 5,
        height: 30,
        
        
    },
    headerRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    ratingText: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily:'Lato_400Regular',
        height: 30,
        paddingTop: 5,
        
    },
    statusBtn: {
        backgroundColor: 'rgba(255, 122, 0, 0.4);',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    statusBtnText: {
        color: 'white',
    },
    meetingNameContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
       marginTop: 30,
       
    },
});

export default Details;
