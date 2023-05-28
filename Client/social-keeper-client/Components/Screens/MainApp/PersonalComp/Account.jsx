import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native'
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



//create functional component

function AccountSettings() {

  const {user, setUser} = useContext(MainAppcontext);
  const {personaldetails,setPersonalDetails} = useContext(RegistContext);
  const {selectedImage,setSelectedImage}= useContext(RegistContext);
  const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
  const navigation = useNavigation();

 


  useEffect(() => {
    console.log(user)
    const persondet={
      phoneNumber:user.phoneNum1,
      email:user.email,
      gender: user.gender,
      userName: user.userName,

    }
    setPersonalDetails(persondet)
    setSelectedImage(user.imageUri)
    console.log('this is navigation',navigation)
    console.log('this is personal details',personaldetails)
    console.log('this is selected image',selectedImage)
    
  }, [])



  const [fontsLoaded] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });
  const [expanded, setExpanded] = React.useState(false);

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
    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);
        const navigation = useNavigation();
        const {prefferdtimes,setPrefferdTimes} = useContext(RegistContext);
        const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
        const {user, setUser} = useContext(MainAppcontext);

        useEffect(() => {

          console.log(user.tblprefferdDTO)
          const prefferdtimesdto=user.tblprefferdDTO;
          setPrefferdTimes(prefferdtimesdto)
          console.log('this is preffered times',prefferdtimes)
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
    name="calendar-clock"
    size={26}
    color="rgba(255, 255, 255, 0.5)"
  />

  <ListItem.Content>
  <TouchableOpacity onPress={() => {
    
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


    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);

        useEffect(() => {
          console.log(user.tblUserHobbiesDTO)
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

function Favoritecont ({user}) {
    const [fontsLoaded] = useFonts({
        Lato_100Thin,
        Lato_300Light,
        Lato_400Regular,
        Lato_700Bold,
        Lato_900Black,
        });
        const [expanded, setExpanded] = React.useState(false);
        const [friendrequestexpanded, setFriendrequestexpanded] = React.useState(false);
        const [friendexpanded, setFriendexpanded] = React.useState(false);
        const [modalVisible, setModalVisible] = useState(false);

        const removefriend = (friendid) => {
          console.log('this is friend id',friendid)
          console.log('will remove friend from favorite in the future')
          
        }

        const sendsms=()=>{
          console.log('will send sms')
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
            {console.log(user.possibleFavoriteContacts_invite_DTO.length)}
        
            <ListItem.Title style={styles.listaccordiontext}>Favorite Contacts
                  
            </ListItem.Title>
            {user.possibleFavoriteContacts_invited_DTO.length > 0 && 
            <Badge
            status="error"
            value={user.possibleFavoriteContacts_invited_DTO.length}
            containerStyle={{ position: 'absolute', top: 0, right: 150 }}
            
            />}  
          </ListItem.Content>
          </>
        }
        //make the container style to start from left to right
        containerStyle={{flexDirection: 'row-reverse',
        backgroundColor:'rgba(255, 255, 255, 0.05)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}
      icon={() => {
        if(!expanded){
        return <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color="rgba(255, 255, 255, 0.5)"

        />
        }else{
            return <MaterialCommunityIcons
            name="chevron-up"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />

            }
      }}
      isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
      

    
              
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
        icon={() => {
            if(!friendrequestexpanded){
            return <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />
            }else{
                return <MaterialCommunityIcons
                name="chevron-up"
                size={24}
                color="rgba(255, 255, 255, 0.5)"

                />

                }
            }}
            isExpanded={friendrequestexpanded}
            onPress={() => setFriendrequestexpanded(!friendrequestexpanded)}

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
                    {console.log('this is the item')}
                    {console.log(item.hobbieNum)}
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser.userName} </ListItem.Title>
                    {console.log('this is tbluser',item.tblUser)}
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                  <TouchableOpacity style={[styles.buttondecline,{ marginRight: 10 }]}>
                    <Text style={styles.buttondeclinetext}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonapprove}>
                    <Text style={styles.approvebuttontext}>Approve</Text>
                  </TouchableOpacity>
                </View>
                
                
                   
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}


             
        </ListItem.Accordion>
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
            name="account"
            size={26}
            color="rgba(255, 255, 255, 0.5)"
            style={{paddingRight:15}}

            />
            <ListItem.Content>
            <ListItem.Title style={styles.listaccordiontext}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={[styles.listaccordiontext]}>My Friends</Text>
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
        icon={() => {
            if(!friendexpanded){
            return <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="rgba(255, 255, 255, 0.5)"

            />
            }else{
                return <MaterialCommunityIcons
                name="chevron-up"
                size={24}
                color="rgba(255, 255, 255, 0.5)"

                />

                }
            }}
            isExpanded={friendexpanded}
            onPress={() => setFriendexpanded(!friendexpanded)}

         >
           
         
         <ScrollView>
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
                    {console.log('this is the item')}
                    {console.log(item.hobbieNum)}
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser1.userName} </ListItem.Title>
                    {console.log('this is tbluser',item.tblUser)}
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser1.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                
                  <TouchableOpacity style={[styles.buttondecline,{marginLeft:15,width:110,backgroundColor:'#898f8b'}]} onPress={
                    () => {
                      setModalVisible(true);

                    }
                  }>
                    <Text style={styles.approvebuttontext}>Show Profile</Text>
                  </TouchableOpacity>
                </View>
                
                <Contactdetails addtofavorite={removefriend} modalVisible={modalVisible} setModalVisible={setModalVisible} selectedContact={item.tblUser1} isfrommainapp={true}
                sendsms={sendsms}
                 />
                

                
                
                   
                  
                    
             
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
                    {console.log('this is the item')}
                    {console.log(item.hobbieNum)}
                    <View style={{ flex: 1, justifyContent: 'center' }}>

                    <ListItem.Title
                    style={styles.listaccordiontext}
                    >{item.tblUser1.userName} </ListItem.Title>
                    {console.log('this is tbluser',item.tblUser)}
                    <ListItem.Subtitle style={styles.listaccordionsubtext}>{item.tblUser1.email}</ListItem.Subtitle>
                    </View>

                  
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                
                  <TouchableOpacity style={[styles.buttondecline,{marginLeft:15,width:110}]} onPress={
                    ()=>{
                      setModalVisible(true)
                      console.log('this is modal visible')
                      console.log(modalVisible)

                    }
                  
                  }>
                    <Text style={styles.approvebuttontext}>Show Profile</Text>
                  </TouchableOpacity>
                </View>

                <Contactdetails addtofavorite={removefriend} modalVisible={modalVisible} setModalVisible={setModalVisible} selectedContact={item.tblUser1} isfrommainapp={true}
                sendsms={sendsms}
                 />
                
                
                   
                  
                    
             
                </ListItem.Content>
           
             
            
                </ListItem>
            ))}
            </ScrollView>

           
            


             
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



export {AccountSettings, Meetingtimes, Intersets, Favoritecont}