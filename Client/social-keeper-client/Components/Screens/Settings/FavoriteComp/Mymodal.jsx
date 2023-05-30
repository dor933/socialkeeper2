import React from 'react';
import { SafeAreaView, Image, Text, StyleSheet, View, TouchableOpacity, Dimensions, Modal,FlatList,Alert} from 'react-native';
import { RegistContext } from '..//../..//../RegistContext.jsx';
import { CheckBox } from '@rneui/themed';
import { useEffect } from 'react';
//import axios
import axios from 'axios';
//import flatlist


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
import { Button } from 'react-native-paper';
import { common } from '@mui/material/colors';



export default function Mymodal({modalhobbiesvisible,isfrommainapp, setSelectedContact, setModalHobbiesVisible,selectedContact, commonhobbie, setCommonHobbie}) {

  const {selectedhobbies, setSelectedHobbies} = React.useContext(RegistContext);
  const [commonhobbies, setCommonHobbies] = React.useState([]);
  const [allhobbies, setAllHobbies] = React.useState([]);
  const {personaldetails} = React.useContext(RegistContext);
  const {possiblefavoritecontacts,setPossibleFavoriteContacts}= React.useContext(RegistContext);
  const {alreadymembers, setAlreadyMembers} = React.useContext(RegistContext);
  const {filteredalreadymebers,setFilteredAlreadyMembers}= React.useContext(RegistContext);



  useEffect(() => {

    if(selectedContact===undefined || selectedContact===null || selectedContact?.tblUserHobbiesDTO===undefined || selectedContact?.tblUserHobbiesDTO===null) {
      return;
    }

    findcommonhobbies();
    setallhobbies();
  }, [selectedContact]);
    
  const setallhobbies= async () => {
    const response = await axios.get('http://cgroup92@194.90.158.74/cgroup92/prod/api/Default/getallhobbies');
    setAllHobbies(response.data);
    console.log(response.data);
  };

  const findcommonhobbies = () => {

    const temparray = [];
    setCommonHobbies(temparray);
    console.log(selectedContact);
    console.log('this is the hobbies:')
    console.log(selectedhobbies);
    console.log('this is the contact hobbies')
    console.log(selectedContact.tblUserHobbiesDTO);

    return selectedhobbies.map((hobby) => {

      selectedContact.tblUserHobbiesDTO.map((contacthobby) => {

        console.log('this is the client hobbie')
        console.log(hobby.hobbieNum);
        console.log('this is the contact hobbie')
        console.log(contacthobby.hobbieNum);

        if (hobby.hobbieNum === contacthobby.hobbieNum) {

          //find if the hobby is already in the array
          const found = temparray.some(el => el.hobbieNum === hobby.hobbieNum);
          if (!found) {
            temparray.push(contacthobby);
            setCommonHobbies(temparray);
            console.log('this is the common hobbies')
            console.log(commonhobbies);
          }

       
        }
        
      }
    );
    });
  };

  const hidemodaladdhobbies = async () => {

   


    const updatedAlreadyMembers = filteredalreadymebers.map((contact) => {
      if (contact.phonenumbers[0] === selectedContact.phonenumbers[0]) {
        console.log('contact is',contact)
        console.log('selectedContact is',selectedContact)

        return { ...contact, addedtofav: true };
      }
      return contact;
    });

    console.log('this is the updated already members')
    console.log(updatedAlreadyMembers);
    
    setFilteredAlreadyMembers(updatedAlreadyMembers);
    setAlreadyMembers(updatedAlreadyMembers);
    const newselected= updatedAlreadyMembers.find((contact) => contact.phonenumbers[0] == selectedContact.phonenumbers[0]);
    console.log('this is the new selected')
    console.log(newselected);
    setSelectedContact(newselected);
    const possiblefavorite={
      phonenuminvite: personaldetails.phoneNumber,
      phonenuminvited:newselected.phonenumbers[0],
      hobbieNum:commonhobbie.hobbieNum
      
    }
    



    setPossibleFavoriteContacts([...possiblefavoritecontacts,possiblefavorite]);

    if(isfrommainapp){

      const response= await axios.post('http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/addfriendrequest',
      possiblefavorite
      );

      if(response.status==200){
        Alert.alert('Friend request sent')
      
    
      }

    }

    setModalHobbiesVisible(!modalhobbiesvisible);
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

  

    return (
        <View>
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalhobbiesvisible}
        onRequestClose={() => {

          setModalHobbiesVisible(!modalhobbiesvisible);
        }}
      >
          <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',

          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 25, borderRadius: 30,height:"95%" }}>
        {selectedContact?.userName ? (
    commonhobbies.length > 0 ? (
      <View>
        <Text style={styles.textchoice}>
         Found {commonhobbies.length} common hobbies with {selectedContact.userName}
        </Text>
        <Text style={styles.textdescript}>
          Choose a hobby to add to your favorites
        </Text>
      <FlatList
        data={commonhobbies}
        renderItem={({ item }) => (
          
          <TouchableOpacity onPress={() => setCommonHobbie(item)}>
          <View style={[styles.hobbieview, {backgroundColor: commonhobbie==item? "rgba(224, 71, 71, 0.85)" : "rgba(0, 0, 0, 0.05)" }]}>
            {/* <CheckBox
             checked={commonhobbie?.hobbieNum === item.hobbieNum}
             onChange={() => {
               setCommonHobbie(item);
             }}
             onPress={() => {
                if(commonhobbie?.hobbieNum === item.hobbieNum){
                  setCommonHobbie(null);

                }
                else{
                setCommonHobbie(item);
                }
              }}
            
            /> */}

            {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {item.hobbieName}
            </Text> */}
            <Image source={{uri: item.hobbieimage}} style={[styles.hobbieimage]}/>
            <Text style={[styles.hobbietext, {color: commonhobbie==item? "#FFFFFF" : "rgba(0, 0, 0, 0.9)"}]}>
              {item.hobbiename}
            </Text>
          </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.hobbieNum}
        numColumns={2}
      />
          {commonhobbie?.hobbieNum ? (
                    <View style={{alignSelf:'center',marginTop:15}}>
                    <Button
                    mode="contained"
                    onPress={ () =>  hidemodaladdhobbies()}
                    buttonColor="#194169"
                  >
                    <Text> Submit </Text>
                  </Button>
                  </View>
          ) : <View style={{alignSelf:'center',marginTop:15,opacity:0.5}}>
          <Button
          mode="contained"
          buttonColor="#194169"
        >
          <Text> Submit </Text>
        </Button>
        </View>
          
          
          }
      
      </View>

      
    ) : (
      <View>
        <Text style={styles.textchoice}>
          No common hobbies with {selectedContact.userName}
        </Text>
      <Text style={styles.textdescript}>
        Unfortunetly, you don't have common hobbies with {selectedContact.userName}. Pick one from the hobbies below!
      </Text>
          <FlatList
          data={allhobbies}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setCommonHobbie(item)}>
            <View style={[styles.hobbieview, {backgroundColor: commonhobbie==item? "rgba(224, 71, 71, 0.85)" : "rgba(0, 0, 0, 0.05)" }]}>
              {/* <CheckBox
               checked={commonhobbie?.hobbieNum === item.hobbieNum}
               onChange={() => {
                 setCommonHobbie(item);
               }}
               onPress={() => {
                  if(commonhobbie?.hobbieNum === item.hobbieNum){
                    setCommonHobbie(null);

                  }
                  else{
                  setCommonHobbie(item);
                  }
                }}
              
              /> */}

              {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {item.hobbieName}
              </Text> */}
              <Image source={{uri: item.imageuri}} style={[styles.hobbieimage]}/>
              <Text style={[styles.hobbietext, {color: commonhobbie==item? "#FFFFFF" : "rgba(0, 0, 0, 0.9)"}]}>
                {item.hobbieName}
              </Text>
            </View>
            </TouchableOpacity>
          )}

         
          keyExtractor={(item) => item.hobbieNum}
          numColumns={2}
        />
          {commonhobbie?.hobbieNum ? (
                    <View style={{alignSelf:'center',marginTop:15}}>
                    <Button
                    mode="contained"
                    onPress={() => hidemodaladdhobbies()}
                    buttonColor="#194169"
                  >
                    <Text> Submit </Text>
                  </Button>
                  </View>
          ) : <View style={{alignSelf:'center',marginTop:15,opacity:0.5}}>
          <Button
          mode="contained"
          buttonColor="#194169"
        >
          <Text> Submit </Text>
        </Button>
        </View>
          
          
          }
        
        </View>
    
  
    

    )
  ) : (
    <View>
      </View>
  )}


          
     
        
       
        </View>
      </View>
           
      </Modal>
      </View>
   
    );
    }

    const styles = StyleSheet.create({
      hobbieview: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 25,
        width:150,
        height: 170,
        margin:5
        
      },

      hobbieimage: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 40,
          borderRadius: 15,
          height:120,
          width:122,
          alignSelf:'center',
          marginTop:10
        },

        hobbietext: {
          fontFamily: 'NunitoSans_700Bold',
          fontStyle: 'normal',
          fontSize: 11,
          lineHeight: 13,
          letterSpacing: 0.05,
          color: 'rgba(0, 0, 0, 0.9)',
          alignSelf:'center',
          marginTop:10
        },

        textchoice:{
          fontFamily: 'NunitoSans_700Bold',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 18,
          lineHeight: 29,
          textAlign: 'right',
          letterSpacing: -0.005,
          color: '#000B23',
          display: 'flex',
          alignItems: 'center',
        },
        textdescript:{
          fontFamily: 'NunitoSans_400Regular',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: 14,
          lineHeight: 19,
          letterSpacing: 0.03,
          color: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          marginTop:10,
          marginBottom:10,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          borderBottomWidth: 1,
          paddingBottom:10,
        },

       
    });