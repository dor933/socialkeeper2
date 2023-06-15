import { StyleSheet, View, Text, Button, SafeAreaView,Animated, TouchableOpacity, Dimensions, Image, ScrollView, Alert } from 'react-native'
import React,{useState,useContext, useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { duration } from 'moment';
import { Avatar, Badge, withBadge } from 'react-native-elements'
import { List } from 'react-native-paper';
import { MainAppcontext } from '../MainAppcontext';
import { RegistContext } from '../../../../RegistContext';
import { useNavigation } from '@react-navigation/native';
import Contactdetails from '../../../CompsToUse/Contactdetails';
import AnimatedIcon from '../../../CompsToUse/AnimatedIcon';
import axios from 'axios';
import AuthContext from '../../../../Authcontext';




//create functional component
function Logout(props) {
  const {user, setUser} = useContext(MainAppcontext);
  const {clearregistcontext} = useContext(RegistContext);
  const {clearmainappcontext} = useContext(MainAppcontext);
  const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const {setIsnotif,setNumberofnewfriends,numberofnewfriends}= useContext(AuthContext);

  const navigation = useNavigation();

  return (

<ListItem
  style={{backgroundColor: '#222222', borderRadius: 20}}
  containerStyle={{
    flexDirection: 'row-reverse',
    backgroundColor:'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  }}
>
  <MaterialCommunityIcons
    name="logout"
    
    
    size={26}
    color="rgba(255, 255, 255, 0.5)"
    style={{paddingLeft: 5,color:'red'}}
  />

  <ListItem.Content>
  <TouchableOpacity onPress={() => {
    
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Logout", onPress: () => {
         
           setIsAuthenticated(false);
          }
        }
      ],
    );


 

  }} style={styles.listaccordiontext} >
    <ListItem.Title style={[styles.listaccordiontext]}>Logout</ListItem.Title>
    </TouchableOpacity>
  </ListItem.Content>
</ListItem>

  );

}

function AccountSettings() {

  const {user, setUser} = useContext(MainAppcontext);
  const {personaldetails,setPersonalDetails} = useContext(RegistContext);
  const {selectedImage,setSelectedImage}= useContext(RegistContext);
  const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);

  const navigation = useNavigation();

 



  return (
    
<ListItem 
  style={{backgroundColor: '#222222', borderRadius: 20}}
  containerStyle={{
    flexDirection: 'row-reverse',
    backgroundColor:'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  }}
>
  <MaterialCommunityIcons
    name="account-cog"
    size={26}
    color="rgba(255, 255, 255, 0.5)"
  />

   
  <ListItem.Content>
  <TouchableOpacity onPress={() => { 
      const persondet={
        phoneNumber:user.phoneNum1,
        email:user.email,
        gender: user.gender,
        userName: user.userName,
  
      }
      setPersonalDetails(persondet)
      setSelectedImage(user.imageUri)
            setIspersonalactiveated(true)
            navigation.navigate('CreateProfile', {isfrommainapp: true})} 

            
            } style={styles.listaccordiontext} >
    <ListItem.Title style={styles.listaccordiontext}>Profile</ListItem.Title>
    </TouchableOpacity>
  </ListItem.Content>
</ListItem>

  );
}

function Meetingtimes(props) {
 
        const navigation = useNavigation();
        const {prefferdtimes,setPrefferdTimes} = useContext(RegistContext);
        const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
        const {user, setUser} = useContext(MainAppcontext);

 




    return (
      <ListItem 
  style={{backgroundColor: '#222222', borderRadius: 20}}
  containerStyle={{
    flexDirection: 'row-reverse',
    backgroundColor:'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  }}
>
  <MaterialCommunityIcons
    name="calendar-clock"
    size={26}
    color="rgba(255, 255, 255, 0.5)"
  />

  <ListItem.Content>
  <TouchableOpacity onPress={() => {
       const prefferdtimesdto=user.tblprefferdDTO;
       setPrefferdTimes(prefferdtimesdto)
    setIspersonalactiveated(true)
    navigation.navigate('PreferredMeetingTimes', {isfrommainapp:true})}} style={styles.listaccordiontext} >
    <ListItem.Title style={styles.listaccordiontext}>Meeting Times</ListItem.Title>
    </TouchableOpacity>
  </ListItem.Content>
</ListItem>
    );
}

function Intersets(props) {
  const {user, setUser} = useContext(MainAppcontext);
  const {personaldetails,setPersonalDetails} = useContext(RegistContext);
  const {selectedhobbies,setSelectedHobbies}= useContext(RegistContext);
  const navigation=useNavigation()
  const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);


  

        useEffect(() => {
          const hobbiesdto=user.tblUserHobbiesDTO;
          setSelectedHobbies(hobbiesdto)

          

        }, [])


    return (
      <ListItem 
      style={{backgroundColor: '#222222', borderRadius: 20}}
      containerStyle={{
        flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <MaterialCommunityIcons
        name="heart"
        size={26}
        color="rgba(255, 255, 255, 0.5)"
      />
    
    
      <ListItem.Content>
        <TouchableOpacity onPress={() => {
          setIspersonalactiveated(true)
          navigation.navigate('PreferredHoobies', {ifinapp: true})
        }} style={styles.listaccordiontext} >
          
        <ListItem.Title style={styles.listaccordiontext}>Interests</ListItem.Title>
        </TouchableOpacity>
      </ListItem.Content>
    </ListItem>
    );
}

function Favoritecont () {
   
        const [expanded, setExpanded] = React.useState(false);
        const [isnewfriendaction, setIsnewfriendaction] = React.useState(true);
        const [friendrequestexpanded, setFriendrequestexpanded] = React.useState(false);
        const [friendexpanded, setFriendexpanded] = React.useState(false);
        const [modalVisible, setModalVisible] = useState(false);
        const [selectedcontact, setSelectedcontact] = useState(null);
        const [friendid,setFriendid]=useState(null)
        const {user, setUser} = React.useContext(MainAppcontext);
        const {isnotif, setIsnotif} = React.useContext(AuthContext);
        const {numberofnewfriendrequest, setNumberofnewfriendrequest} = React.useContext(AuthContext);
        const {numberofnewfriends, setNumberofnewfriends} = React.useContext(AuthContext);

     
     
        

        const navigation=useNavigation()

        

    

        const sendsms=()=>{
          console.log('will send sms')
        }

        const handlefreindrequest = async (friendid,ifapproved) => {
          const item={
            requestid:friendid,
            isAccepted:ifapproved
          }


          if(ifapproved==true){

          const response= await axios.put('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Updfriendrequest',item)
          if(response.status==200){
            //remove response.data from possibleFavoriteContacts_invited_DTO
            const newtblpossibleinvited1=user.possibleFavoriteContacts_invited_DTO.filter((item)=>item.id!=friendid)
            const newtblFavoriteContacts1=[...user.tblFavoriteContacts1,response.data]
            setUser({...user,tblFavoriteContacts1:newtblFavoriteContacts1,possibleFavoriteContacts_invited_DTO:newtblpossibleinvited1})
          }
        }
          else{
            const response= await axios.put('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Updfriendrequest',item)
            if(response.status==200){
              //remove response.data from possibleFavoriteContacts_invited_DTO
              const newtblpossibleinvited1=user.possibleFavoriteContacts_invited_DTO.filter((item)=>item.id!=friendid)
              setUser({...user,possibleFavoriteContacts_invited_DTO:newtblpossibleinvited1})

            }
            



          }

        }
        const removefriend= async()=>{
            
          //make an alert to confirm
          Alert.alert(
            "Did you want to remove this friend?",
            "Press Remove to remove this friend from your list",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { 
                text: "Remove", 
                onPress: async() => {
                  console.log('this is friend id',friendid)
                  //chcek the type of friendid if its a number or a string

                  
            
                   
                  const response=await axios.delete(`http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/deletefriendship/${friendid}`)
          
                  if(response.status==200){
                    console.log('friend deleted')
                    const newtblFavoriteContacts1=user.tblFavoriteContacts1.filter((item)=>item.ID!=friendid)
                    const newtblFavoriteContacts=user.tblFavoriteContacts.filter((item)=>item.ID!=friendid)
                    const suggestedeltenumbers= response.data;
                    //run on tblsuggestedmeetings and delete rows if the number is in the array
                    const newtblsuggestedmeetings=user.tblSuggestedMeetings.filter((item)=>!suggestedeltenumbers.includes(item.meetingNum))
                    const newtblsuggestedmeetings1=user.tblSuggestedMeetings1.filter((item)=>!suggestedeltenumbers.includes(item.meetingNum))
                    setUser({...user,tblSuggestedMeetings:newtblsuggestedmeetings,tblSuggestedMeetings1:newtblsuggestedmeetings1,tblFavoriteContacts1:newtblFavoriteContacts1,tblFavoriteContacts:newtblFavoriteContacts})
                    setModalVisible(false)

                    
                  }
                }
              }
            ]
          );
      

        }
        
          


    return (
        <ListItem.Accordion
        title="Favorite Contacts"
        style={{backgroundColor: '#222222', borderRadius: 20}}
     
        content={
          <>

         <MaterialCommunityIcons
          name="star"
          size={26}
          color="rgba(255, 255, 255, 0.5)"
          style={{paddingRight:15}}

        />

          <ListItem.Content>
        
            <ListItem.Title style={styles.listaccordiontext}>Favorite Contacts
                  
            </ListItem.Title>
            {user.possibleFavoriteContacts_invited_DTO.length > 0 && 
            <Badge
            status="error"
            value={user.possibleFavoriteContacts_invited_DTO.length}
            containerStyle={{ position: 'absolute', top: 0, right: 138 }}
            
            />}  
            {
              isnotif && (user.possibleFavoriteContacts_invited_DTO.length==0 && numberofnewfriends>0 )&& (
                <Badge
                status="error"
                value='!'
                containerStyle={{ position: 'absolute', top: 0, right: 155 }}
                />

              )

            }
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={
        <AnimatedIcon 
        isExpanded={expanded}
        toggle={setExpanded}

        />
      }
      isExpanded={expanded}
    
      

    
              
        >
        <ListItem.Accordion title="Friend requests"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',

        }}
       
        content={
            <>
            <MaterialCommunityIcons
            name="account-plus"
            size={26}
            color="rgba(255, 255, 255, 0.5)"
            style={{paddingRight:15}}

            />
            <ListItem.Content>
            <ListItem.Title style={styles.listaccordiontext}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={[styles.listaccordiontext]}>Friend requests</Text>
    {user.possibleFavoriteContacts_invited_DTO.length > 0 && (
      <View style={{ paddingLeft: 10 }}>
        <Badge
          status="error"
          value={user.possibleFavoriteContacts_invited_DTO.length}
          containerStyle={{ position: 'relative' }}
        />
      </View>
    )}

  </View>
         
            
            </ListItem.Title>
            </ListItem.Content>
            </>
        }
        icon={
            <AnimatedIcon
            isExpanded={friendrequestexpanded}
            toggle={setFriendrequestexpanded}
            
            />
        }
        isExpanded={friendrequestexpanded}
     

         >
           
         
            {user.possibleFavoriteContacts_invited_DTO.map((item, i) => (
                <ListItem key={i} bottomDivider

                containerStyle={{backgroundColor:'rgba(255, 255, 255, 0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)', flexDirection:'row-reverse',
                
            
            }}
                >
                <Avatar source={{uri: item.tblUser.imageUri}}
                rounded
                size="medium"
                />
  <ListItem.Content
    style={{
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >                    
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser.userName} </ListItem.Title>
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser.email}</ListItem.Subtitle>
                    </View>
                  

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                  <TouchableOpacity style={[styles.buttondecline,{ marginRight: 10 }]} onPress={()=> {handlefreindrequest(item.id,false)}}>
                    <Text style={styles.buttondeclinetext}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonapprove} onPress={()=>  {

                    handlefreindrequest(item.id,true)
                  }}>
                    <Text style={styles.approvebuttontext}>Approve</Text>
                  </TouchableOpacity>
                </View>
                
                
                   
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}


             
        </ListItem.Accordion>

        <ListItem.Accordion title="My Friends"
        style={{backgroundColor: '#222222', borderRadius: 20}}
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',

        }}
     
        content={
            <>
            <MaterialCommunityIcons
            name="account"
            size={26}
            color="rgba(255, 255, 255, 0.5)"
            style={{paddingRight:15}}

            />
            <ListItem.Content>
            <ListItem.Title style={styles.listaccordiontext}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={[styles.listaccordiontext]}>My Friends</Text>
    {isnotif && numberofnewfriends>0 && (
      <View style={{ paddingLeft: 10 }}>
        <Badge
          status="error"
          value='!'
          containerStyle={{ position: 'relative' }}
        />

  </View>
    )}
  </View>

         
            
            </ListItem.Title>
            </ListItem.Content>
            </>
        }
        icon={<AnimatedIcon isExpanded={friendexpanded} toggle={setFriendexpanded}

        
        />}
            isExpanded={friendexpanded}

            

         >
           
         
            {user.tblFavoriteContacts1.length>0 && user.tblFavoriteContacts1.map((item, i) => (
                <ListItem key={i} bottomDivider

                containerStyle={{backgroundColor:'rgba(255, 255, 255, 0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)', flexDirection:'row-reverse',
                
            
            }}
                >
                <Avatar source={{uri: item.tblUser1.imageUri}}
                rounded
                size="medium"
                />
  <ListItem.Content
    style={{
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >                    
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser1.userName} </ListItem.Title>
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser1.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                
                  <TouchableOpacity style={[styles.buttondecline,{marginLeft:15,width:110,backgroundColor:'#898f8b'}]} onPress={
                    () => {
                      setSelectedcontact(item.tblUser1)
                      setFriendid(item.ID)
                      setModalVisible(true);

                    }
                  }>
                    <Text style={styles.approvebuttontext}>Show Profile</Text>
                  </TouchableOpacity>
                </View>
                
               
                

                         
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}
            
            {user.tblFavoriteContacts.length>0 && user.tblFavoriteContacts.map((item, i) => (
                <ListItem key={i} bottomDivider

                containerStyle={{backgroundColor:'rgba(255, 255, 255, 0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)', flexDirection:'row-reverse',
                
            
            }}
                >
                <Avatar source={{uri: item.tblUser1.imageUri}}
                rounded
                size="medium"
                />
  <ListItem.Content
    style={{
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >                    
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser1.userName} </ListItem.Title>
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser1.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                
                  <TouchableOpacity style={[styles.buttondecline,{marginLeft:15,width:110,backgroundColor:'#898f8b'}]} onPress={
                    ()=>{
                      setSelectedcontact(item.tblUser1)
                      setFriendid(item.ID)
                      setModalVisible(true)
                      console.log(modalVisible)

                    }
                  
                  }>
                    <Text style={styles.approvebuttontext}>Show Profile</Text>
                  </TouchableOpacity>
                </View>

            
                
                
                   
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}

            {selectedcontact &&

<Contactdetails addtofavorite={removefriend} modalVisible={modalVisible} setModalVisible={setModalVisible} selectedContact={selectedcontact} isfrommainapp={true}
                sendsms={sendsms} friendid={friendid} 
                 />
            }

           
            


             
        </ListItem.Accordion>
        
        
        </ListItem.Accordion>
    );
}
        
       
const styles = StyleSheet.create({
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
    
    
      },
      listaccordionsubtext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 12,
            color:'rgba(255, 255, 255, 0.7)',
            fontStyle: 'normal',
            lineHeight: 19,
            fontWeight:'bold',
            letterSpacing: 0.03,
            alignSelf: 'flex-end',
            
            marginTop: 3,


      },

      listaccordionbuttons:{
        fontFamily: 'Lato_700Bold',
        fontSize: 5,
        color:'rgba(255, 255, 255, 0.9)',
        fontStyle: 'normal',
        lineHeight: 19,
        fontWeight:'bold',
        letterSpacing: 0.03,
        alignSelf: 'flex-start',
        height:5,
        


        },
        buttonapprove:{
            backgroundColor:"#056DFA",
            borderRadius: 20,
            width:60,
            height:29
        },
        buttondecline:{
            backgroundColor:"#FF2849",
            borderRadius: 20,
            width:60,
            height:29
        },
        buttondeclinetext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color:"#FFFFFF",
            fontStyle: 'normal',
            lineHeight: 27,
            textAlign: 'center',

        },
        approvebuttontext:{
            fontFamily: 'Lato_400Regular',
            fontSize: 14,
            color:"#FFFFFF",
            fontStyle: 'normal',
            lineHeight: 27,
            textAlign: 'center',
            
        },

 

})



export {AccountSettings, Meetingtimes,Logout, Intersets, Favoritecont}