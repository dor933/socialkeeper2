import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  Modal,
  Alert,
} from "react-native";
import * as Contacts from "expo-contacts";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Overlay, Icon,CheckBox } from '@rneui/themed';
import * as SMS from 'expo-sms';
import call from 'react-native-phone-call'
import * as Linking from 'expo-linking';
import {RegistContext} from '..//..//..//RegistContext.jsx';
import { Button } from "@rneui/base";
import Mymodal from './/FavoriteComp//Mymodal.jsx';
import AuthContext from "../..//..//Authcontext.jsx";
import {MainAppcontext} from "..//MainApp/MainAppcontext.jsx";
import Contactdetails from "../..//CompsToUse/Contactdetails.jsx";





export default function FavoriteContacts({ isfrommainapp:propIsFromMainApp ,navigation,route }, props) {
  const {contacts, setContacts} = React.useContext(RegistContext);
  const {filteredContacts, setFilteredContacts} = React.useContext(RegistContext);
  const {alreadymembers, setAlreadyMembers} = React.useContext(RegistContext);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {possiblefavoritecontacts,setPossibleFavoriteContacts}= React.useContext(RegistContext);
  const {personaldetails,selectedImage,prefferdtimes,selectedhobbies,setPersonalDetails,imagetype}= React.useContext(RegistContext);
  const {invitedcontacts,setInvitedContacts}= React.useContext(RegistContext);
  const {filteredalreadymebers,setFilteredAlreadyMembers}= React.useContext(RegistContext);
  const [modalhobbiesvisible,setModalHobbiesVisible]=useState(false)
  const [commonhobbie,setCommonHobbie]=useState([]);
  const { setIsAuthenticated}= React.useContext(AuthContext);
  const {user,setUser} = React.useContext(MainAppcontext);
  const {expoPushToken}= React.useContext(AuthContext);
  const routeIsFromMainApp = route?.params?.isfrommainapp;
  const isfrommainapp = routeIsFromMainApp !== undefined ? routeIsFromMainApp : propIsFromMainApp;



  const handleOpen = (event,item) => {
    const { pageX, pageY } = event.nativeEvent;
    setOverlayPosition({ x: pageX+200, y: pageY-100 });
    setSelectedContact(item);
    setOverlayVisible(true);
  };

 

  useEffect(() => {

    if(isfrommainapp){
      console.log('user is changed from main app')
      loadContacts();
    }

    
  }, [user]);
  


  const handleClose = () => {
    setOverlayVisible(false);
  };



 

  useEffect(() => {

    
    loadContacts();
  }, []);

  useEffect(() => {
  }, [possiblefavoritecontacts,invitedcontacts]);

 
  async function sendsms(personalsms){

    if(!personalsms){


    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      // do your SMS stuff here
      const { result } = await SMS.sendSMSAsync(
        selectedContact.phoneNumbers[0].number,
        'You have been invited to join a group on Social Keeper'
      );

        Alert.alert(
        "Did you want to invite this contact to use Social Keeper?",
        "You can invite them to use Social Keeper by sending them an SMS",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {

              //find from filtered contacts the contact that match to selecetd contact and add it "sendsms" to true
              let newfilteredcontacts=filteredContacts.map((contact)=>{
             //iterate over the phoneNumbers array and find the number that match to the selected contact
              let returncontact=contact
              contact.phoneNumbers.map((phonenumber)=>{
                if(phonenumber.number===selectedContact.phoneNumbers[0].number){
                  returncontact.sendsms=true
                }
              })
                return contact
              })

              const timestamp = Date.now();
              const date = new Date(timestamp);

              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we need to add 1
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;
    
            
              setFilteredContacts(newfilteredcontacts)
              if(isfrommainapp){
                const userinvitetoadd={
                  phoneNum1:user.phoneNum1,
                  phoneNum2:selectedContact.phoneNumbers[0].number,
                  status:"P",
                  date:formattedDate,
                  Nickname:selectedContact.firstName
                }
                console.log("userinvitetoadd",userinvitetoadd)
              }
              else{
              setInvitedContacts([...invitedcontacts,{phoneNum1:personaldetails.phoneNumber,phoneNum2:selectedContact.phoneNumbers[0].number,status:"P",date:formattedDate,Nickname:selectedContact.firstName}])
              }
          
            }
            },
          ,

        ],
        { cancelable: false }
      );
      
    } else {
      // misfortune... there's no SMS available on this device
    }
  }else{
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      // do your SMS stuff here
      const { result } = await SMS.sendSMSAsync(
        selectedContact.phonenumbers[0],
        'Send your message here'
      );
    } else {
      // misfortune... there's no SMS available on this device
    }
  }

  }

  
    

  async function onsubmit(){

    let newprefferdtimes=[];
    prefferdtimes.map((time)=>{
      let timeobj={
        weekDay:time.day.index,
        startTime:time.startTime,
        endTime:time.endTime,

      }
      newprefferdtimes.push(timeobj)
    })


    
    



    const newuser={
      phoneNum1:personaldetails.phoneNumber,
      userName:personaldetails.userName,
      // birthDate://will be the birth date from datapickercomponent
      email:personaldetails.email, // will be saved through the authentication with google and facebook not from the form
      gender:personaldetails.gender,
      city:personaldetails.address.englishname,
      citylatt:personaldetails.address.latt,
      citylong:personaldetails.address.long,
      birthDate:personaldetails.birthDate,
      tblInvitesDTO: invitedcontacts,
      tblprefferdDTO:newprefferdtimes,
      tblUserHobbiesDTO:selectedhobbies,
      possibleFavoriteContacts_invite_DTO:possiblefavoritecontacts,

    }


    try{


    const response= await axios.post("http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/AddUser",newuser);
    if(response.data=="Phone Number already exists"){
      Alert.alert(
        "Phone Number already exists",
        "Please change your phone number and try again",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
    else if (response.data=="User name already exists"){
      Alert.alert(
        "User name already exists",
        "Please change your user name and try again",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
    else if(response.data=="User added"){
      const data = new FormData();
      data.append('img',{ 
        uri: selectedImage,
        name: `image.${imagetype}`,
        type: `image/${imagetype}`,
        
      }
        );
      data.append('identis', personaldetails.phoneNumber);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const response2 = await axios.post(
        "http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/Addimage",
        data,
        config
      );

      if(typeof response2.data.imageUri == "string") {

        setUser(response2.data)
        
        const usertopush={
          phoneNum1:response2.data.phoneNum1,
          ExpoPushToken:expoPushToken
        }
        const response3= await axios.put("http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/updpushtoken",
      usertopush);

      if(response3.status==200){

        console.log("pushtoken updated", response3.data)
      setIsAuthenticated(true)
      }

    
      

      }

      
    }
    else{
    }

  }catch(error){
    console.log(error)
    //bring all the errors to the user





  }

  }
       // String value with the number to call

  async function loadContacts() { 
 
    if((contacts.length==0 && filteredContacts.length==0) || isfrommainapp) {
    const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync();
    //add id to each contact
    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
      data[i].sendsms=false;
    }

    data.map((contact)=>{

      if(contact.phoneNumbers){
        if(contact.phoneNumbers[0]){

        }
      }
    })

    const newdata= data.filter((contact)=>{
      if(contact.phoneNumbers){
        if(contact.phoneNumbers[0]){
       



          if (contact.phoneNumbers[0].number !== undefined && contact.phoneNumbers[0].number.match(/^(972|\+972|0?5\d{1}(-?\d){7})/)) {
          



            if(!contact.firstName){
              contact.firstName="No Name"
            }

            return contact




          }




       
          //check if the contact
          
        }
      }
 
    })



    



    


    setContacts(newdata);
    setFilteredContacts(newdata);
    //create an array of contacts with a name and phone number
    const contactList =  data.map((contact) => {

      let contacttoreturnt={
        userName: contact.name,
        phoneNumbers:[]
      }

      for(const phonenumber in contact.phoneNumbers){

        if(typeof contact.phoneNumbers[phonenumber].number != 'string'){
          continue;
        }
                

        contacttoreturnt.phoneNumbers.push(contact.phoneNumbers[phonenumber].number);
        
      }
      
      
      return contacttoreturnt;
       
  }

  );

  
  const already= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/getexistingmembers', contactList);
  if(isfrommainapp){

    already.data= already.data.filter ((contact)=>{
      let isexist=false;

      user.tblFavoriteContacts.map((favoritecontact)=>{
        if(favoritecontact.phoneNum2==contact.phonenumbers[0]){
          isexist=true;
        }
      })

      user.tblFavoriteContacts1.map((favoritecontact)=>{
        if(favoritecontact.phoneNum1==contact.phonenumbers[0]){
          isexist=true;
        }
      }
      )

      if(contact.phonenumbers[0]==user.phoneNum1){
        isexist=true;
      }

      if(isexist==false){
        console.log('this is the item that im add')
        console.log(contact)
        return true
      }
      else{
        console.log('this is the item that im not add')
        console.log(contact)
        return false;
      }

      
 

  }
    )

    already.data.map((contact)=>{
      if(user.possibleFavoriteContacts_invite_DTO.length>0){
      user.possibleFavoriteContacts_invite_DTO.map((possiblecontact)=>{
        if(possiblecontact.phonenuminvited==contact.phonenumbers[0]){
          console.log('this is the contact that i added')
          console.log(contact)
          contact.addedtofav=true;
          //return contact
          
        }
      }
      )
    }
    if(user.possibleFavoriteContacts_invited_DTO.length>0){
      user.possibleFavoriteContacts_invited_DTO.map((possiblecontact)=>{
        if(possiblecontact.phonenuminvite==contact.phonenumbers[0]){
          console.log('this is the contact that i added')
          console.log(contact)
          contact.addedtofav=true;
          //return contact
          
        }
      }
      )
    }
}

    )

}



        


  setAlreadyMembers(already.data);
  setFilteredAlreadyMembers(already.data);

  // here we need to send the contactList to the backend and get back the already members
    
}
    }
  }


  const renderfavoriteItem = ({ item }) => {
    return (
      <>
        {!item.addedtofav ? (
          <View style={[styles.contactRowfavo]}>
            <Image source={{uri: item.imageUri}} style={styles.contactImage} />
            <View style={{left:20}}>
              <Text style={styles.contactName}>{item.userName}</Text>
              {item.phonenumbers && item.phonenumbers[0] && (
                <Text style={styles.contactPhone}>{item.phonenumbers[0]}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.Iconoption} onPress={(event) => handleOpen(event,item)}>
              <Icon
                name="more-horiz"
                size={28}
                color="#000000"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.contactRowfavo, {opacity:0.3}]}>
          <Image source={{uri: item.imageUri}} style={styles.contactImage} />
          <View style={{left:20}}>
            <Text style={styles.contactName}>{item.userName}</Text>
            {item.phonenumbers && item.phonenumbers[0] && (
              <Text style={styles.contactPhone}>{item.phonenumbers[0]}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.Iconoption} onPress={(event) => handleOpen(event,item)}>
            <Icon
              name="more-horiz"
              size={28}
              color="#222222"
            />
          </TouchableOpacity>
        </View>
        )}
      </>
    );
  }

  const addtofavorite = () => {

    setModalHobbiesVisible(true);

    

  };

const renderItem = ({ item }) => {
  return (
    <>
    {!item.sendsms ? (
       <View style={styles.contactRow} >
       <Text style={styles.contactName}>{item.name}</Text>
       {item.phoneNumbers && item.phoneNumbers[0] && (
         <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
       )}
 
     
 
       <TouchableOpacity style={styles.Iconoption} onPress={(event) => handleOpen(event,item)}>
           <Icon
             name="more-horiz"
             size={28}
             color="#222222"
           />
 
       
       </TouchableOpacity>
    
       
     </View>
    ) : (
      <View style={[styles.contactRow, {opacity:0.3}]} >
          <Text style={styles.contactName}>{item.name}</Text>
       {item.phoneNumbers && item.phoneNumbers[0] && (
         <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
       )}
 
     
 
       <TouchableOpacity style={styles.Iconoption} onPress={(event) => handleOpen(event,item)}>
           <Icon
             name="more-horiz"
             size={28}
             color="#000000"
           />
 
       
       </TouchableOpacity>
    
       
     </View>
    )}


       
    
    
    
   
    </>
       
  );
};








  //this is for filtering the contacts,filters by name and sorts the favorites to the top
  


  return (
    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:"#ffffff"}}>
      
        {!isfrommainapp && (
            <Image source={require('../../../assets/Images/RandomImages/SocialKeeper.png')} style={{width:180,height:180, 
            top:"3%"
            
            }} />
        )
        }

          


    <SafeAreaView style={[styles.container,{marginTop: isfrommainapp? 0 : -20}]}>
      
      <View style={styles.Title}>
        { !isfrommainapp ?
        <Text style={styles.Titleregist}> My Contacts </Text>
        :
        <View style={{flexDirection:'row-reverse',justifyContent:'space-around',width:'100%',marginBottom:20}}>
        <View style={{
          backgroundColor:'#cb595a',
          borderRadius:100,
          alignSelf:'center',
          width:Dimensions.get('window').width/2.4,
          justifyContent:'center',
          
        
        }}
         >
        <Text style={[styles.Titletext,{color:'#ffffff',fontWeight:'600'}]}> Add your Friends! </Text>

        </View>
        <View style={{justifyContent:'center'}} >
        <Image source={{uri:user.imageUri}} style={{
          width:45,
          height:45,
          borderRadius:100,
          alignSelf:'center',
          bottom:0
          
        }} />
        </View>

        </View>

  
}


{ !isfrommainapp && (

        <Image source={{uri:selectedImage}} style={styles.myimageprofile} />
        )
}
            
           
      </View>
   
      <View style={styles.headerandsearch}> 

     <View style={{ position: 'relative', width: Dimensions.get('window').width - 40}}>



     <MaterialIcons name="search" size={24} color="grey" style={{position:'absolute',left:10,top:10}}   />

      <View style={{width:"100%",height:43}}>

      <TextInput
        style={styles.textinputstyle}
        placeholder="Search"
        placeholderTextColor="black"
        onChangeText={(text) => {

          if(contacts.length>0){

          setFilteredContacts(
            contacts.filter((i) =>
              i.name.toLowerCase().includes(text.toLowerCase())
            )
          );
        }

              if(alreadymembers!='No Users'){
          setFilteredAlreadyMembers(
            alreadymembers.filter((i) =>
              i.userName.toLowerCase().includes(text.toLowerCase())
            )
            
          )
              }
            
              
        
            }}
                
      />

      </View>
       


</View>

        


      </View>

     <View style={{flex:1,marginTop:10}}>
      {
        console.log('filteredalready',filteredalreadymebers.length)
      }
      
     { alreadymembers!='No Users' && (
    <View>
      { !isfrommainapp &&
      <Text style={styles.alreadymemberscss}>Already Members</Text>
}
      <FlatList
        data={filteredalreadymebers}
        renderItem={renderfavoriteItem}
        keyExtractor={(item) => item.phonenumbers[0]}
        extraData={alreadymembers}
        style={{ marginBottom:5,height:isfrommainapp && filteredalreadymebers.length>0 ? "100%" : !isfrommainapp && filteredalreadymebers.length>0 ? Dimensions.get('window').height/4.7 : "0%"}} 
        
        //show the scroll bar all the time
        //hide the scroll bar
      
     

      />
    </View>
    

  )}
        

    { (!isfrommainapp || (isfrommainapp && alreadymembers.length==0)) && (

      <View>
        { !isfrommainapp ?
      <Text style={styles.alreadymemberscss}>Invite to join</Text>
      :
      <View style={{flexDirection:'row',justifyContent:'center',width:'100%'}}>
      <View style={{
        width:Dimensions.get('window').width - 40,
        height:20,
        backgroundColor:'#b3b2af',
        borderRadius:100,
        marginTop:10,
        shadowOffset: {
          width: 2,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        shadowColor: '#222222',
        elevation: 1,
        
      }}
        >
      <Text style={[styles.alreadymemberscss,{fontSize:10,textAlign:'center',top:0,height:20,fontFamily:'NunitoSans_400Regular',color:'#ffffff'}]}>Your Contacts are not in the app, but don't worry-invite them!</Text>
      </View>
      </View>
        }

      <FlatList 
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={filteredContacts}
      />
      </View>
    )
}

      <Overlay
    isVisible={isOverlayVisible}
    onBackdropPress={handleClose}
    overlayStyle={[
      styles.overlay,
      {
        top: overlayPosition.y + 90, // Adjust the top position
        left: overlayPosition.x - 40, // Adjust the left position
        backgroundColor:'#e6e4e1',
        
      },
    ]}
  >
    { alreadymembers.includes(selectedContact) ? (
      <>

     <View style={{flexDirection:'row-reverse',paddingRight:34,alignItems:'center',backgroundColor:'#e6e4e1',justifyContent:'space-around',width:"100%",height:"40%", borderBottomColor:'#bfbebb',borderBottomWidth:0.5}}>
      <Icon 
         name="info"
          size={15}
          type="AntDesign"
          color="black"
          
          />


        <Text style={styles.overlayText} onPress={()=> setModalVisible(true)}> Contact Details</Text>


     </View>

   <View style={{flexDirection:'row-reverse',alignItems:'center',backgroundColor:'#e6e4e1',justifyContent:'space-around',height:"40%",width:"100%"}}>
      
   <Icon
     name="favorite"
     size={15}
     type="AntDesign"
     color="red"
     opacity={selectedContact.addedtofav? 0.3 : 1}
     />



   <Text style={[styles.overlayText, { color: "#e06c85", opacity:!selectedContact.addedtofav? 1 : 0.3 }]} onPress={!selectedContact.addedtofav? ()=> addtofavorite() : null}>
     Send Favorite Request
   </Text>
   </View>



     

     
    


      </>
    ) : (
      <Text style={styles.overlayText} onPress={()=> sendsms()}>Send SMS Invitation</Text>
    )}
  </Overlay>
  {
    alreadymembers.includes(selectedContact) && (
      <Contactdetails isfrommainapp={false} sendsms={sendsms} addtofavorite={addtofavorite}  modalVisible={modalVisible} setModalVisible={setModalVisible} selectedContact={selectedContact} />
    )

  }

      <View>
        <Mymodal isfrommainapp={isfrommainapp} setSelectedContact={setSelectedContact} modalhobbiesvisible={modalhobbiesvisible} setModalHobbiesVisible={setModalHobbiesVisible} selectedContact={selectedContact} setCommonHobbie={setCommonHobbie} commonhobbie={commonhobbie} />
      </View>

      </View>

{ !isfrommainapp && (
       <View style={{paddingBottom:20}}>
      <TouchableOpacity onPress={onsubmit}>
        <Icon
          name="check-circle"
          size={70}
          type="MaterialIcons"
          color="rgba(204,89,90,255)"

        />

      </TouchableOpacity>
      <Text style={{textAlign:'center',color:"#eb6a5e",fontSize:16,fontFamily:'Pacifico_400Regular'}}>Press when you're Done</Text>
      </View>
)
}


    </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  
    flex:1,
    marginTop: -20,
  } ,
  contactRow: {
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: Dimensions.get('window').width,
  },

  textinputstyle:{
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    top: 0,
    height: 43,
    borderRadius: 20,
    paddingLeft: 40,
    paddingRight: 20,
    fontSize: 14,
    lineHeight: 19,
    borderColor: "rgba(128, 128, 128, 0.5)",
    backfaceVisibility: '#FEFEFE', // Adjust the backgroundColor color with transparency
    borderRadius: 12,
    color:'black',

  },
  headerModal:{
width: Dimensions.get('window').width,
height: 50,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-around',

  },
  informationcss:{
    width: Dimensions.get('window').width,
    height:30,

    
  },

  infromationtext:{
    fontFamily: 'NunitoSans_300Light',
    fontStyle: 'normal',
    fontsize: 14,
    lineHeight: 19,
    color: '#333333',
    textAlign:'center',

  },


  imagemodelview:{
    width:Dimensions.get('window').width,
    height:150,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  contactimagemodal:{
    width: 100,
    height: 100,
    borderRadius: 100,
    
  },

  headerandsearch:{
    width: Dimensions.get('window').width,
        height: 43,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        lineHeight: 19,
        opacity: 0.4,
        borderRadius: 12,
        shadowColor: '#b8b4ad',
        
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 5,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        top: 0,
        flexDirection: 'row',
        justifyContent:'flex-end',
        color:'black',
        right:10

  },

  contactRowfavo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: Dimensions.get('window').width,
    flexDirection: 'row',
  },

  gradient: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
  },
  contactName: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontStyle:'normal',
    fontWeight:"600",
    fontsize:14,
    lineHeight:19,
    color:'#333333',
    marginBottom: 5,
    fontFamily: "NunitoSans_400Regular",
  },
  
  alreadymemberscss: {
    fontFamily:"Pacifico_400Regular",
    fontStyle:"normal",
    fontWeight:"600",
    fontSize:14,
    lineHeight:19,
    color:"#eb6a5e",
    textShadowColor:  'rgba(0, 0, 0, 0.25)',
    textShadowRadius: 2,
    top:10,
    marginBottom: 15,
    textAlign: 'left',
    marginLeft: 20,
    
    
  },

//restore the overlay style
  overlay: {
    position: 'absolute',
    width: 170,
    height: 50,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  overlayText: {
   alignSelf: 'center',
      fontSize: 12,
      fontFamily: 'NunitoSans_200ExtraLight',
      lineHeight: 19,
      
  },



  searchIcon:{
    left:40
    
  },
  contactPhone: {
    fontSize: 12,
    color:'#333333',
    opacity: 0.5,
    textAlign: 'left',
    fontWeight:"600",
    lineHeight:16,
    fontFamily: "NunitoSans_300Light",
  },
  Iconoption: {
    position: 'absolute',
    width: 30,
    height: 20,
    left: 330,
    top: 30,
    opacity: 0.3,

    
  },

  contactImage : {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 0,
    top: 0,
    right: 0,
  },

  myimageprofile: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 0,
    top: 0,
    right: 10,
  },


  Title: {
    width: Dimensions.get('window').width,
    height: 80,
    top:24,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 15,
    
    
 
  },

  

  Titletext: {
    fontSize: 15,
    fontweight: "800",
    color: "#333333",
    lineHeight: 33,
    fontFamily: "NunitoSans_400Regular",
    textAlign:'center'
},

Titleregist:{
  fontSize: 24,
  fontweight: "800",
  color: "#eb6a5e",
  lineHeight: 33,
  textAlign: 'right',
  marginRight: 10,
  fontFamily: "Pacifico_400Regular",
  top:10
}
}
);
  