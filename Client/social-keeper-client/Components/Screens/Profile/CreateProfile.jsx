import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Input } from "@rneui/themed";
import DatePickerComponent from "../../CompsToUse/DatePickerComponent";
import { Button } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../../CompsToUse/ImageViewer";
//import the use context component
import {RegistContext} from "../../../RegistContext";
import cities from '../../../assets/cities.json'
// import picker
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

let keyid=0;




export default function CreateProfile({navigation}) {
  
  const {selectedImage, setSelectedImage} = useContext(RegistContext);
  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const {setImageType} = useContext(RegistContext);
  
  const placeHolderImage = require("..//..///../assets//Images///RandomImages/avatar-user.png");
  const placeHolderImageuri= Image.resolveAssetSource(placeHolderImage).uri;
  //get the uri of the selected image
  

  useEffect (() => {
    //set the placeholder image as the selected image
    setSelectedImage(placeHolderImageuri);

  },[]);



  //Pick image from gallery function (expo)
  const Choosefunctionalty = () => {
   


    Alert.alert(
      "Select Image",
      "Choose an image from your gallery",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "destructive",
          


        },
       
        {
          text: "Choose from gallery",
          onPress: async () => takeimagefromgallery(),
          style: "default",
        },
      ],
      { cancelable: false }
    );

 
  };


  const handleSelectItem = (item) => {
    setPersonalDetails({ ...personaldetails, address: item });
    console.log(item)
  };

  const takeimagefromgallery = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true,
    });

    if (result.canceled) {
      Alert.alert("Image upload canceled");
    } else {
      setSelectedImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
      //find if the image is a png or a jpg or a jpeg
      let imageType = result.assets[0].uri.split(".").pop();
      console.log(imageType);
      setImageType(imageType);
      
    }
  };

  const hasUndefinedOrNullField = (personalobj) => {

    console.log("checking if object is undefined or null");
    console.log(personalobj);

    if(typeof personalobj == 'undefined' || typeof personalobj == 'null'|| Object.keys(personalobj).length === 0){
      console.log("object is undefined or null");
      return true;
    }

    //run through the personal details object
  
    if(personalobj.userName == undefined || personalobj.phoneNumber == undefined || personalobj.birthDate == undefined || personalobj.gender == undefined || personalobj.address==undefined){
      console.log("object is undefined or null");
      return true;
    }

   
    return false;
  };

 

  


  return (
    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center'}}>

    <SafeAreaView style={styles.safeArea}>
      {/* Logo image */}
      <Image
        style={styles.logo}
        source={require("../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png")}
      />

      {/* Title */}
      <Text style={styles.text}>Create Your Profile</Text>

      {/* Photo viewer component */}
      <ImageViewer placeholderImageSource={placeHolderImage} selectedImage={selectedImage}
      />

      {/* Button to chnoose image from gallery */}
      <Button
        theme="primary"
        title="+"
        buttonStyle={{
          backgroundColor: "grey",
          borderRadius: 25,
          shadowOpacity: 0.05,
          shadowRadius: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        titleStyle={{
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 16,
          lineHeight: 19,
          letterSpacing: 0.1,
        }}
        containerStyle={{
          marginHorizontal: 50,
          width: 35,
          height: 35,
          marginVertical: 10,
          top: 200,
          left: 165,
        }}
        onPress={Choosefunctionalty}
      />
      
      <View style={styles.phoneNumber}>
        <Input
          onChangeText={(text) => setPersonalDetails({...personaldetails, phoneNumber: text})}
          placeholder="Phone number"
          keyboardType="numeric"
          value={personaldetails.phoneNumber || ''}
          maxLength={10}
          leftIcon={{ type: "font-awesome", name: "phone" }}
          style={styles.icons} />
      </View>

      {/* UserName - must use matirial UI or something equal .. */}
      <View style={styles.userName}>
        <Input
         onChangeText={(text) => setPersonalDetails({...personaldetails, userName: text})}
          placeholder="User name"
          maxLength={8}
          value={personaldetails.userName || ''}
          leftIcon={{ type: "font-awesome", name: "user" }} />
      </View>
      {/* Birth date - must use matirial UI or something equal ..  */}
      <View style={styles.birthdayDate}>
      <Input
          onChangeText={(text) => setPersonalDetails({...personaldetails, gender:text})}
          //need to be only one char allowed
          placeholder= "gender"
          value={personaldetails.gender || ''}
          keyboardType="default"
          maxLength={1}
          leftIcon={{ type: "font-awesome", name: "venus-mars" }}
          style={styles.icons}
        />



      </View>

   
      

      {/* Gender - must use matirial UI or something equal ..  */}
      <View style={styles.gender}>

      <DatePickerComponent />

      </View>

  
      

      {/* Address? - to check if relevant - must use matirial UI or something equal ..  */}
      <View>
        <View style={styles.address}>
          <AutocompleteDropdown
            //make dataSet as the cities list where title is the city name and id is the city id
            dataSet={cities.map
              (city => ({ title: `${city.english_name}, ${city.name}` , englishname:city.english_name, latt: city.latt, long: city.long, id:keyid++ }))}
            
            onSelectItem={handleSelectItem}
            placeholder="Address"
            initialValue={personaldetails.address || ''}
            value={personaldetails.address || ''}
            leftIcon={{ type: "font-awesome", name: "map" }}
            textInputProps={{
              placeholder:'City',
              autoCapitalize:'none',

              style: {
                fontSize: 16,
                fontWeight: "normal",
                fontStyle: "normal",
                lineHeight: 19,
                letterSpacing: 0.1,
                textAlign: "left",
                
              },
              
              
            }

            }
            inputContainerStyle={{
              backgroundColor: "#fff",
              borderBottomWidth:1,
              width:300,
              left: 6,
              borderBottomColor:'#000000',
              //make the border color like the input bottom border
              
              shadowOpacity: 0.05,
              shadowRadius: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
            }}
            
          />

   
 

    
            
        </View>
      </View>
      <Button
        title="Confirm"
        // loading={false}
        // loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: "#E04747",
          borderRadius: 25,
          shadowOpacity: 0.05,
          shadowRadius: 50,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        titleStyle={{
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 16,
          lineHeight: 19,
          letterSpacing: 0.1,
        }}
        containerStyle={{
          marginHorizontal: 50,
          width: 200,
          height: 60,
          marginVertical: 10,
          top: 530,
          left: 50,
        }}
        onPress={() => {
          if(hasUndefinedOrNullField(personaldetails)===true){
            Alert.alert("Please fill all the fields");
            return;
          }
          else{
          if(personaldetails.phoneNumber.length < 10 || personaldetails.phoneNumber[0] != '0' || personaldetails.phoneNumber[1] != '5'){
            Alert.alert("Please enter a valid phone number");
            return;
          }

          if(personaldetails.userName.length < 3){
            Alert.alert("Please enter a valid user name");
            return;
          }

          if(personaldetails.gender!='M' && personaldetails.gender!='F'){

            Alert.alert('Gender must be M or F')
            return;

          }

          if(personaldetails.address.length < 3){
            Alert.alert("Please enter a valid address");
            return;
          }
          

          console.log(personaldetails);
          navigation.navigate("PreferredHoobies");
        }}
      }
      />
    </SafeAreaView>
    </SafeAreaView>
  );
}

//Styles for the CreateProfile screen
const styles = StyleSheet.create({
  //CSS for the SafeAreaView
  safeArea: {
    flex:1,
    width: 430,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    top:30
  },
  //CSS for the logo image
  logo: {
    position: "absolute",
    width: 295,
    height: 155,
    left: 60,
    top: 35,
  },
  //CSS for the title text
  text: {
    position: "absolute",
    width: 220,
    height: 29,
    left: 95,
    top: 200,
    fontStyle: "normal",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.03,
    color: "#E04747",
  },

  //CSS for user name
  userName: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 59,
    top: 410,
  },

  //CSS for birthday date
  birthdayDate: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 470,
  },

  phoneNumber: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 352,
  },


  //CSS for gender
  gender: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 520,
  },
  //CSS for address
  address: {
    position: "absolute",
    width: 313,
    height: 61,
    left: 56,
    top: 430,
  },
  confirmBtn: {
    width: 174,
    height: 60,
    backgroundColor: "#E04747",
  },
  //CSS for imagePicker
  imagePicker: {
    position: "absolute",
    width: 200,
    height: 200,
    left: 100,
    top: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
});
