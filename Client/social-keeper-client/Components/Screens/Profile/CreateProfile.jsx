import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Keyboard,
FlatList,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Input } from "@rneui/themed";
import DatePickerComponent from "../../CompsToUse/DatePickerComponent";
import { Button } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../../CompsToUse/ImageViewer";
//import the use context component
import {RegistContext} from "../../../RegistContext";
import { MainAppcontext } from "../MainApp/MainAppcontext";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";



export default function CreateProfile({navigation,route}) {
  
  const {selectedImage, setSelectedImage} = useContext(RegistContext);
  const {personaldetails, setPersonalDetails} = useContext(RegistContext);
  const {user, setUser} = useContext(MainAppcontext);
  const {imagetype,setImageType} = useContext(RegistContext);
  const [imagehaschanged, setImageHasChanged] = useState(false);
  const [keyboardvisible, setKeyboardvisible] = useState(false);
  const [addressbeenselected, setAddressbeenselected] = useState(false);
      const isfrommainapp=route.params.isfrommainapp;
      console.log(route)
      console.log(isfrommainapp)
      const {ispersonalactiveated, setIspersonalactiveated} = useContext(MainAppcontext);
     

  
  
  const placeHolderImage = require("..//..///../assets//Images///RandomImages/istockphoto-878942932-170667a.jpg");
  const placeHolderImageuri= Image.resolveAssetSource(placeHolderImage).uri;
  //get the uri of the selected image
  

  useEffect (() => {
    //set the placeholder image as the selected image
    if(!isfrommainapp){
    setSelectedImage(placeHolderImageuri);
    }


    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardvisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardvisible(false); // or some other action
      }
    );

    return () => {
      if(isfrommainapp){
        setIspersonalactiveated(false);
      }
      
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();

     
    }

  },[]);

  const userupdate = async () => {
    const userobject = {
     phoneNum1: personaldetails.phoneNumber,
      userName: personaldetails.userName,
      city: personaldetails.address.englishname,
      citylatt: personaldetails.address.latt,
      citylong: personaldetails.address.long,
      birthDate: personaldetails.birthDate,


    };
    console.log('this is the user object')
    console.log(userobject);
    try{
    const res = await axios.put(
      "http://cgroup92@194.90.158.74/cgroup92/prod/api/MainAppaction/Upduser",
      userobject
    );
    console.log(res);
    if (res.status == 200) {
      if(imagehaschanged){
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
          console.log("image uploaded");
          setUser(response2.data);


        }
      }
      else{
        setUser(res.data);
      }

      Alert.alert("User updated successfully");





    }

  }
  catch(err){
    console.log(err);

  }


  };

  const checkproperties = () => {
    
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
    
    if(!isfrommainapp){

    console.log(personaldetails);
    navigation.navigate("PreferredHoobies",{ifinapp:false});
    }
    else{
      return true;
  }

    }

  };



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


  const handleSelectItem = (data,details) => {
    const myadder= {
      englishname: data.structured_formatting.main_text,
      long: details.geometry.location.lng,
      latt: details.geometry.location.lat,
    }
    setPersonalDetails({ ...personaldetails, address: myadder });
    setAddressbeenselected(true);
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
      console.log('this is imnage uri',result.assets[0].uri);
      //find if the image is a png or a jpg or a jpeg
      let imageType = result.assets[0].uri.split(".").pop();
      console.log(imageType);
      setImageType(imageType);
      setImageHasChanged(true);
      
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
    
    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>

    <SafeAreaView style={styles.safeArea}>
      
      {/* Logo image */}
      <Image
        style={styles.logo}
        source={require("../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png")}
      />

      {/* Title */}
      {
        !isfrommainapp? 
      <Text style={styles.text}>Create Your Profile</Text>
      :
      <Text style={styles.text}>Update Your Profile</Text>
}

      {/* Photo viewer component */}

      <View style={styles.imageViewer}>
      
      <ImageViewer placeholderImageSource={placeHolderImage} selectedImage={selectedImage} 
      />
      </View>

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
          width: 35,
          height: 35,
          marginVertical: 10,
          alignSelf: "center",
          left:-40,
          top:50
        }}
        onPress={Choosefunctionalty}
      />
      
      <View style={styles.form}>
      <View style={styles.phoneNumber}>
        <Input
          onChangeText={(text) => setPersonalDetails({...personaldetails, phoneNumber: text})}
          placeholder="Phone number"
          keyboardType="numeric"
          value={personaldetails.phoneNumber || ''}
          maxLength={10}
          leftIcon={{ type: "font-awesome", name: "phone" }}
          disabled={isfrommainapp}
           />
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
          placeholder= "Gender"
          value={personaldetails.gender || ''}
          keyboardType="default"
          maxLength={1}
          leftIcon={{ type: "font-awesome", name: "venus-mars" }}
          style={{borderBottomColor:'#b4b8b6'}}
                  />



      </View>

   
      

      <View style={styles.gender}>

        { keyboardvisible == false ? 

      <DatePickerComponent keyboardshow={false}  />

      : 
      <DatePickerComponent keyboardshow={true}  />
        }

      </View>
        


  
      

      {/* Address? - to check if relevant - must use matirial UI or something equal ..  */}
      <View>
        <View style={styles.address}>
        <GooglePlacesAutocomplete
  placeholder='City'
  
  fetchDetails={true}
  onPress={(data, details = null) => {
    // 'details' is provided when fetchDetails = true
    handleSelectItem(data,details);
    console.log(data);
    console.log(details);
  }}
  //check if autocomplete window is open
  
  
  query={{
    key: 'AIzaSyDCCbpFYxI2jGqyWacOIokLnXONGUCUmow',
    language: 'en',
    types: '(cities)',
    components: 'country:il',
  }}
  
  styles={{

   


    textInput: {
      fontSize: 16,
      fontWeight: "normal",
      fontStyle: "normal",
      color: addressbeenselected? '#000000': '#8d97a0',
      height: 30,
      lineHeight: 19,
      letterSpacing: 0.1,
      textAlign: "left",
      backgroundColor: "#ffffff",
      left:4,
    },
    textInputContainer: {
      backgroundColor: "#ffffff",
      borderBottomWidth: 1,
      borderRadius: 0,
      width: 277,
      left: 8.5,
      borderBottomColor: "#9098a1",
      shadowOpacity: 0.05,
      shadowRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
  }}
  
/>

   
 

    
            
        </View>
      </View>
      {
        !isfrommainapp ?
        
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
          height: 50,
          marginVertical: 0,
          paddingTop: 3,
          alignSelf: "center",
        }}
        onPress={() => {
   
          checkproperties();
      }
      }
      />
      : 
      <TouchableOpacity style={[styles.rectengalconfirm]} onPress={
        async () => {
          const res=checkproperties();
          if(res)
          {
            await userupdate();
          }
          else
          {
            alert('Please fill all the details')
          }


        }
      }>
        <Text style={styles.textconfirm}>Update Details</Text>
        <View style={styles.icon} >

          <Ionicons
            name="checkmark-outline"
            size={14}
            color="#E04747"
            style={{alignSelf:'center'}}
          
            
          />
    

        </View>

        </TouchableOpacity>

     

    }
      </View>
      
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
    backgroundColor: "#ffffff",
    borderRadius: 50,
    top:55,
    
  },


  //CSS for the ScrollView

  //CSS for the logo image
  logo: {
    width: 295,
    height: 155,
    left: 60,
  },
  textconfirm:{
    fontSize: 15,
    fontFamily:'Lato_700Bold',
    letterSpacing:0.03,
    lineHeight:16,
    color: '#ffffff',
    paddingLeft: 30,
    
  },
  icon: {
    width: 18,
    height: 18,
    backgroundColor:'#ffffff',
  
    position:'absolute',
    marginTop: 50,
    marginLeft:8,
    alignContent:'center',
    justifyContent:'center',
    borderRadius: 15,
    
  },
  //CSS for the title text
  text: {
    height: 29,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    letterSpacing: 0.03,
    color: "#E04747",
    marginTop: 20,
  },
  rectengalconfirm: {
    borderRadius: 25,
    backgroundColor: '#E04747',
    height:40,
    width: 180,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 1,
    alignSelf:'center',

    justifyContent:'center',
    bottom: 4,


  

    


  
  },
 
  imageViewer: {
    position: "absolute",
    borderRadius: 50,
    width: Dimensions.get("window").width,
    height: 100,
    alignSelf: "center",
    top:-50,
    right:35,
    marginTop: 15,
    
    
    
  },

  //CSS for user name
  userName: {
    width:Dimensions.get('window').width-100,
    
    justifyContent:'center',
    alignSelf:'center',
  },

  //CSS for birthday date
  birthdayDate: {
    width:Dimensions.get('window').width-100,
    justifyContent:'center',
    alignSelf:'center',
  },
  form: {
    width:Dimensions.get('window').width-100,
    marginTop: 45,
    alignSelf:'center',
  },

  phoneNumber: {
    width:Dimensions.get('window').width-100,
    justifyContent:'center',
    alignSelf:'center',
  },


  //CSS for gender
  gender: {
    width:Dimensions.get('window').width-100,
    justifyContent:'center',
    alignSelf:'center',
  },
  //CSS for address
  address: {
    width:Dimensions.get('window').width-100,
    justifyContent:'center',
    alignSelf:'center',
    height: 120,


  },
  confirmBtn: {
    width: 174,
    backgroundColor: "#E04747",
  },
  //CSS for imagePicker
  
});
