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
import {
  useFonts,
  NunitoSans_200ExtraLight,
  NunitoSans_300Light,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans";
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









//import popover from metarial ui





export default function FavoriteContacts({ navigation }, props) {
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
  const {setUser} = React.useContext(MainAppcontext);



  const handleOpen = (event,item) => {
    const { pageX, pageY } = event.nativeEvent;
    setOverlayPosition({ x: pageX+200, y: pageY-100 });
    setSelectedContact(item);
    setOverlayVisible(true);
  };

 

  


  const handleClose = () => {
    setOverlayVisible(false);
  };

  let [fontsLoaded] = useFonts({
    NunitoSans_200ExtraLight,
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });





  //this is for loading the contacts from the phone and setting them to the contacts state

  useEffect(() => {

    
    loadContacts();
  }, []);

  useEffect(() => {
    console.log("possiblefavoritecontacts",possiblefavoritecontacts)
    console.log("invitedcontacts",invitedcontacts)
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
              console.log("im here");

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
              setInvitedContacts([...invitedcontacts,{phoneNum1:personaldetails.phoneNumber,phoneNum2:selectedContact.phoneNumbers[0].number,status:"P",date:formattedDate,Nickname:selectedContact.firstName}])
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

  
    

  async function whatsappcontact(){

    let url = `whatsapp://send?text=You have been invited to be my friend on Social Keeper&phone=972${selectedContact.phonenumbers[0]}`;

    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure WhatsApp installed on your device');
    });
  }

  async function telegramcontact(){

    let url = `tg://msg?text=You have been invited to be my friend on Social Keeper&phone=972${selectedContact.phonenumbers[0]}`;


    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure Telegram installed on your device');
    });
  }
  
  async function mailcomposer(){

  
    let url = `mailto:doratzabi1@gmail.com?subject=You have been invited to be my friend on Social Keeper&body=You have been invited to be my friend on Social Keeper`;
    //send the email
    Linking.openURL(url).then((data) => {
    }).catch(() => {
      alert('Make sure Mail installed on your device');
    });

  }

  async function callnumber(){
 
    const args = {
      number: selectedContact.phonenumbers[0],
      prompt: true,
    }
    call(args).catch(console.error)
  }

  async function onsubmit(){

    let newprefferdtimes=[];
    prefferdtimes.map((time)=>{
      let timeobj={
        weekDay:time.day.index,
        startTime:time.startTime,
        endTime:time.endTime,
        rank:time.rank

      }
      newprefferdtimes.push(timeobj)
    })


    
    



    const newuser={
      phoneNum1:personaldetails.phoneNumber,
      userName:personaldetails.userName,
      // birthDate://will be the birth date from datapickercomponent
      email:personaldetails.email, // will be saved through the authentication with google and facebook not from the form
      gender:personaldetails.gender,
      city:personaldetails.address,
      birthDate:personaldetails.birthDate,
      tblInvitesDTO: invitedcontacts,
      tblprefferdDTO:newprefferdtimes,
      tblUserHobbiesDTO:selectedhobbies,
      possibleFavoriteContacts_invite_DTO:possiblefavoritecontacts,

    }

    console.log(newuser)
    console.log(selectedImage)

    try{

      console.log("im here to add user")

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
      console.log("im here the user added")
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

      Alert.alert(
        "User created successfully",
        "Moving to the App...",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );


      setIsAuthenticated(true)
      }

      
    }
    else{
      console.log("im here the user not added")
      console.log(response.data)
    }

  }catch(error){
    console.log(error)
    //bring all the errors to the user

    console.log(error.response.data)




  }

  }
       // String value with the number to call

  async function loadContacts() {  
    if(contacts.length==0 && filteredContacts.length==0) {
    const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync();
    //add id to each contact
    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
      data[i].sendsms=false;
    }

    const newdata= data.filter((contact)=>{
      if(contact.phoneNumbers){
        if(contact.phoneNumbers[0]){
          //check if phoneNumbers[0] start with 972 or 0 or +972 or 5 and the second number is between 0-9 regex 5[0-9] 

          if (contact.phoneNumbers[0].number!== undefined && contact.phoneNumbers[0].number.match(/^(972|\+972|0-?5\d(-?\d){7}|5(-?\d){8})$/)) {



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
              color="#000000"
            />
          </TouchableOpacity>
        </View>
        )}
      </>
    );
  }

  const addtofavorite = () => {

    setModalHobbiesVisible(true);

    console.log("selectedContact",selectedContact)
    console.log("alreadymembers",alreadymembers)

    const updatedAlreadyMembers = filteredalreadymebers.map((contact) => {
      console.log('contact is',contact)
      if (contact.phonenumbers[0] === selectedContact.phonenumbers[0]) {

        return { ...contact, addedtofav: true };
      }
      return contact;
    });


  
    setFilteredAlreadyMembers(updatedAlreadyMembers);
    setAlreadyMembers(updatedAlreadyMembers);
    const newselected= updatedAlreadyMembers.find((contact) => contact.phonenumbers[0] === selectedContact.phonenumbers[0]);
    setSelectedContact(newselected);
    const possiblefavorite={
      phonenuminvite: personaldetails.phoneNumber,
      phonenuminvited:newselected.phonenumbers[0],
      // hobbieNum:selectedhobbies[0].hobbienumber
      //will be after the hobbie screen
    }

    setPossibleFavoriteContacts([...possiblefavoritecontacts,possiblefavorite]);

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
             color="#000000"
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

    <SafeAreaView style={styles.container}>
      <View style={styles.Title}>
        <Text style={styles.Titletext}> My Contacts </Text>
       
        <Image source={{uri:selectedImage}} style={styles.myimageprofile} />
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
          setFilteredContacts(
            contacts.filter((i) =>
              i.name.toLowerCase().includes(text.toLowerCase())
            )
          );

          setFilteredAlreadyMembers(
            alreadymembers.filter((i) =>
              i.userName.toLowerCase().includes(text.toLowerCase())
            )
            
          )
        }}
                
      />

      </View>
       


</View>

        


      </View>

     <View style={{flex:1,marginTop:10}}>
      
     { alreadymembers!='No Users' && (
    <View>
      <Text style={styles.alreadymemberscss}>Already Members</Text>
      <FlatList
        data={filteredalreadymebers}
        renderItem={renderfavoriteItem}
        keyExtractor={(item) => item.phonenumbers[0]}
        extraData={alreadymembers}
      />
    </View>
    

  )}
        

    

      <View>
      <Text style={styles.alreadymemberscss}>Invite to join</Text>

      <FlatList 
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={filteredContacts}
      />
      </View>

      <Overlay
    isVisible={isOverlayVisible}
    onBackdropPress={handleClose}
    overlayStyle={[
      styles.overlay,
      {
        top: overlayPosition.y + 90, // Adjust the top position
        left: overlayPosition.x - 40, // Adjust the left position
      },
    ]}
  >
    { alreadymembers.includes(selectedContact) ? (
      <>

     <View style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-around',width:"100%"}}>
      <Icon 
         name="info"
          size={15}
          type="AntDesign"
          color="black"
          
          />


        <Text style={styles.overlayText} onPress={()=> setModalVisible(true)}>Show contact details</Text>


     </View>

{!selectedContact.addedtofav && (
   <View style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-around',width:"100%"}}>
      
   <Icon
     name="favorite"
     size={15}
     type="AntDesign"
     color="red"
     />



   <Text style={[styles.overlayText, { color: "#e06c85" }]} onPress={()=> addtofavorite()}>
     Send favorite request
   </Text>
   </View>


)}
     

     
    


      </>
    ) : (
      <Text style={styles.overlayText} onPress={()=> sendsms()}>Send SMS invitation</Text>
    )}
  </Overlay>
  <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}
      >
              <SafeAreaView style={{top:45}} >
                <View >
        <View style={styles.headerModal}>
          <View style={{paddingLeft:45}}>
        <Text style={{ fontFamily: 'NunitoSans_700Bold', fontStyle: 'normal', fontWeight:'600', fontSize: 24, lineHeight: 33, color: '#333333'}}>
            Contact Details
            </Text>
            </View>
          <View style={{filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'}}>
          <TouchableOpacity onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Image source={require('../../../assets/Images/Contacts/modalback.png')}  />
          </TouchableOpacity>
       
            </View>
         
          </View>
        
            { alreadymembers.includes(selectedContact) && (
              
              <View>
                        <View style={styles.imagemodelview}>
                         


          <Image source={{uri: selectedContact.imageUri}} style={styles.contactimagemodal} />
          </View>
          <View style={styles.informationcss}>
            <Text style={styles.infromationtext}> {selectedContact.city}</Text>
            <Text style={[styles.infromationtext,{fontFamily:"NunitoSans_400Regular",fontSize:20,paddingTop:10}]}> {selectedContact.userName}</Text>
          </View>
          <View style={{marginTop:40,height:'100%',borderTopColor: '#C4C4C4',borderTopWidth: 1,backgroundColor:"rgba(154, 173, 190, 0.2)"}}>
                    <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

                      <View>

                      <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Mobile</Text>
                        <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
                          {selectedContact.phonenumbers[0]}
                      
                        </Text>
                      </View>
                      <View style={{marginTop:10,right:15,flexDirection:'row'}}>
                        <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center',marginRight:10}}>
                          <TouchableOpacity onPress={()=>sendsms(true)}>
                          <Icon 
                          name="sms"
                          size={17}
                          color="#333333"
                          />
                          </TouchableOpacity>
                          </View>
                          <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>callnumber()}>
                          <Icon 
                          name="phone"
                          size={17}
                          color="#333333"
                          type="Entypo"
                          />
                          </TouchableOpacity>
                          </View>
                          
                        
                        </View>
                      
                    </View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Email</Text>
  <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
    {selectedContact.email}
  </Text>
</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:26,width:26,backgroundColor:"#FFFFFF",borderRadius:100,alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={()=>mailcomposer()}>
    <Icon 
    name="email"
    size={17}
    color="#333333"
    type="MaterialCommunityIcons"
    />
    </TouchableOpacity>
    </View>
    
  
  </View>

</View>
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333"}}>Hobbies</Text>
  <Text style={{fontFamily:"NunitoSans_300Light",fontStyle:"normal",fontSize:12,marginTop:5,lineHeight:16,color:"#333333",opacity:0.5}}>
    {selectedContact.tblUserHobbiesDTO.map((hobbie,index)=>{
      if(index==selectedContact.tblUserHobbiesDTO.length-1){
      return(
        <Text key={index}>{hobbie.hobbiename}</Text>
      )
      }
      else{
        return(
          <Text key={index}>{hobbie.hobbiename},</Text>
        )
      }
    })
    }
  </Text>
</View>


</View>
<View style={{height:55,width:Dimensions.get('window').width,backgroundColor:"#FFFFFF",flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
  <Text style={{height:22,fontFamily:'NunitoSans_700Bold',fontSize:16,lineHeight:22,fontStyle:'normal'}}>Account Linked</Text>
     </View>
     <TouchableOpacity onPress={()=> whatsappcontact()}>

     <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>WhatsApp</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

<View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#25D366',borderWidth:2,borderColor:"#25D366"}}>
 
      <Image source={require('../../../assets/Images/Contacts/whatstrans.png')}
        resizeMode="contain"
        style={{
          width: 16, // Set the icon width
          height: 16, // Set the icon height
        }}
      
     />

    </View>
    
    
  
  </View>

</View>
</TouchableOpacity>

<TouchableOpacity onPress={()=> telegramcontact()}>

<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>

<View>

<Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Telegram</Text>

</View>
<View style={{marginTop:10,right:15,flexDirection:'row'}}>

    <View style={{height:26,width:26,borderRadius:100,alignItems:'center',justifyContent:'center',borderRadius:100,backgroundColor:'#039BE5',borderWidth:2,borderColor:"#039BE5"}}>
 
      <Image source={require('../../../assets/Images/Contacts/telegram.png')}
        resizeMode="contain"
        style={{
          width: 16, // Set the icon width
          height: 16, // Set the icon height
        }}
      
     />

    </View>
    
    
  
  </View>

</View>
</TouchableOpacity>

{selectedContact.addedtofav == false ? (
  <TouchableOpacity onPress={()=> addtofavorite()}>

  <View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse'}}>
  
  <View>
  
  <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Send favorite request</Text>
  
  </View>
  <View style={{marginTop:10,right:15,flexDirection:'row'}}>
  
  <View style={{height:26,width:26,alignItems:'center',justifyContent:'center'}}>
  
  <Icon
            name="favorite"
            size={24}
            type="AntDesign"
            color="red"
            />
  
  </View>
  
  
  
  </View>
  
  </View>
  </TouchableOpacity>

) : (
<View style={{height:60,width:Dimensions.get('window').width-20,marginTop:10,justifyContent:'space-between',flexDirection:'row-reverse',opacity:0.3}}>
  
  <View>
  
  <Text style={{fontFamily:"NunitoSans_600SemiBold",fontStyle:"normal",fontSize:14,lineHeight:19,color:"#333333",marginTop:10}}>Send favorite request</Text>
  
  </View>
  <View style={{marginTop:10,right:15,flexDirection:'row'}}>
  
  <View style={{height:26,width:26,alignItems:'center',justifyContent:'center'}}>
  
  <Icon
            name="favorite"
            size={24}
            type="AntDesign"
            color="red"
            />
  
  </View>
  
  
  
  </View>
  
  </View>
)
  
}





 </View>

          </View>

        ) 
            }
               
    
          </View>
          
                </SafeAreaView>
      </Modal>
      <View>
        <Mymodal modalhobbiesvisible={modalhobbiesvisible} setModalHobbiesVisible={setModalHobbiesVisible} selectedContact={selectedContact} setCommonHobbie={setCommonHobbie} commonhobbie={commonhobbie} />
      </View>

      </View>

      <Button title="Submit" onPress={onsubmit} />
    </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  
    flex:1,
    marginTop: 40,
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
    fontFamily:"NunitoSans_600SemiBold",
    fontStyle:"normal",
    fontWeight:"600",
    fontSize:14,
    lineHeight:19,
    color:"#333333",
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
    borderRadius: 10,
  },

  overlayText: {
   alignSelf: 'center',
      fontSize: 12,
      fontFamily: 'NunitoSans_200ExtraLight',
      lineHeight: 19,
      textShadowColor: 'rgba(0, 0, 0, 0.25)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 0.5,
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
    fontSize: 24,
    fontweight: "800",
    color: "#333333",
    lineHeight: 33,
    textAlign: 'right',
    marginRight: 5,
    fontFamily: "NunitoSans_400Regular",
    top:10
}
}
);
  