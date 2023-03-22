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
  Animated,
} from "react-native";
import * as Contacts from "expo-contacts";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
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
//import popover from metarial ui





export default function FavoriteContacts({ navigation }, props) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [alreadymembers, setAlreadyMembers] = useState([]);
  

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

 
  

  async function loadContacts() {  
    const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync();
    setContacts(data);
    setFilteredContacts(data);
    console.log(contacts);
    //create an array of contacts with a name and phone number
    const contactList =  data.map((contact) => {

      let contacttoreturnt={
        userName: contact.name,
        phonenumbers:[]
      }

      for(const phonenumber in contact.phoneNumbers){

        if(typeof contact.phoneNumbers[phonenumber].number != 'string'){
          continue;
        }
                

        contacttoreturnt.phonenumbers.push(contact.phoneNumbers[phonenumber].number);
        
      }
      
      
      return contacttoreturnt;
       
  }
  
  
  );

  console.log(contactList);

  
  const already= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/getexistingmembers', contactList);
  console.log(already.data);
  setAlreadyMembers(already.data);
  console.log(alreadymembers.length);

  // here we need to send the contactList to the backend and get back the already members
    
}
  }


  const renderfavoriteItem = ({ item }) => {
    return (
      <View style={[styles.contactRowfavo]}>
        <Image source={{uri: item.imageUri}} style={styles.contactImage} />
        <View style={{left:20}}>
        <Text style={styles.contactName}>{item.userName}</Text>
      {item.phonenumbers && item.phonenumbers[0] && (
        <Text style={styles.contactPhone}>{item.phonenumbers[0]}</Text>
      )}
      </View>

        {/* <TouchableOpacity style={styles.Iconoption} onPress={() => navigation.navigate('AddContact', {id: item.id})}> */}
      {/* above is an example for tochable opactiy with function */}

      <TouchableOpacity style={styles.Iconoption} >
      <Image source={require('../../../assets/Images/Contacts/Iconopt.png')}  />
      </TouchableOpacity>

      </View> 
    ) 
  }

const renderItem = ({ item }) => {
  return (
    <View style={styles.contactRow}>
      <Text style={styles.contactName}>{item.name}</Text>
      {item.phoneNumbers && item.phoneNumbers[0] && (
        <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
      )}

    

      <TouchableOpacity style={styles.Iconoption} >
      <Image source={require('../../../assets/Images/Contacts/Iconopt.png')}  />
      </TouchableOpacity>
      
    </View>
  );
};








  //this is for filtering the contacts,filters by name and sorts the favorites to the top
  


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Title}>
        <Text style={styles.Titletext}> Your Contacts </Text>
      </View>
      <View style={{
        width: Dimensions.get('window').width - 40,
        height: 43,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 14,
        lineHeight: 19,
        opacity: 0.5,
        borderRadius: 12,
        shadowColor: '#FFFFFF',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 40,
        elevation: 5,
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color:'black',
      }}> 
      <MaterialIcons name="search" size={24} color="grey" style={styles.searchIcon}  />
      
        <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: Dimensions.get('window').width - 40,
          top: 0,
          height: 43,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          paddingLeft: 40,
          paddingRight: 20,
          fontSize: 14,
          lineHeight: 19,
          borderColor: "rgba(128, 128, 128, 0.5)",
          backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the backgroundColor color with transparency
          borderRadius: 12,
          color:'black',
   
          


       

        }}
        placeholder="Search"
        onChangeText={(text) => {
          setFilteredContacts(
            contacts.filter((i) =>
              i.name.toLowerCase().includes(text.toLowerCase())
            )
          );
        }}
        
          
  
      />


      </View>

     <View style={{flex:1}}>
      
     { alreadymembers.length > 0 && (
    <View>
      <Text style={styles.alreadymemberscss}>Already Members</Text>
      <FlatList
        data={alreadymembers}
        renderItem={renderfavoriteItem}
        keyExtractor={(item) => item.id}
        extraData={alreadymembers}
      />
    </View>
  )}
        

    

      <View style={{marginTop:15}}>
      <Text style={styles.alreadymemberscss}>Invite to join</Text>

      <FlatList 
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={filteredContacts}
      />
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  
    flex:1,
    marginTop: 40,
  } ,
  contactRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: Dimensions.get('window').width,
  },
  contactRowfavo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    width: Dimensions.get('window').width,
    flexDirection: 'row',
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

  searchIcon:{
    position: 'absolute',
    left: 30,
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
    width: 24,
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

  Title: {
    width: Dimensions.get('window').width,
    height: 80,
    top:24,
 
  },

  Titletext: {
    fontSize: 24,
    fontweight: "800",
    color: "#333333",
    lineHeight: 33,
    textAlign: 'right',
    marginRight: 5,
    fontFamily: "NunitoSans_600SemiBold",
    //should be "nunito"
}
}
);
  