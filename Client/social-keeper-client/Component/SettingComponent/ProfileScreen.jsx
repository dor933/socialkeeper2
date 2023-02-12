import { Image, Keyboard, LayoutAnimation, View, Text, TextInput, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from './ImagePickerExample ';
import DatePicker from 'react-native-datepicker';
import { Picker } from '@react-native-picker/picker';
import GenderDropdown from '../HelpComponent/GenderDropdown';

export default function ProfileScreen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
  const [animation, setAnimation] = useState({});
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    dateOfbirth: '',
    gender: '',
    city: '',
    profilePicture: '',

  })
  const [date, setDate] = useState();
  const [gender, setGender] = useState(null)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 160,
            useNativeDriver: 'true',
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.15 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 160,
            useNativeDriver: 'true',
          },
        });
        setAnimation({ marginBottom: 0 });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }

  }, []);

  const handleCreateUser = () => {
    //check all fields are filled
    
    if (user.firstName === '') {
      Alert.alert('First Name is required');
      return;
    }
    if (user.lastName === '') {
      Alert.alert('Last Name is required');
      return;
    }
    if (user.dateOfbirth === '') {
      Alert.alert('Date of Birth is required');
      return;
    }
      if (user.city === '') {
      Alert.alert('City is required');
      return;
    }
    if (gender==null){
      Alert.alert("You have to be a man or women becuse of the new goverment law")
      //מעניין אם מישהו ישים לב לזה וישנה את הטקסט? 
    }
    //here we will call api to create user..
    //or to update user profile if user already exist
    
    Alert.alert('User Created');//just for testing


      
    
    
  }

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImagePickerExample style={styles.image} />
      </View>
      <View style={[styles.inputContainer, animation]}>
        <View >
          <TextInput
            style={[styles.input, styles.firstNameInput]}
            placeholder="First Name"
            onChangeText={(value) => handleInputChange('firstName', value)}
          />
        </View >
        <View>
          <TextInput
            style={[styles.input, styles.lastNameInput]}
            placeholder="Last Name"
            onChangeText={(value) => handleInputChange('lastName', value)}
          />
        </View>
        <View>
          <TextInput
            style={[styles.input, styles.lastNameInput]}
            placeholder="City"
            onChangeText={(value) => handleInputChange('city', value)}
          />
        </View>
        <View style={styles.birthDateContainer}>
          <DatePicker
            style={styles.datePickerStyle}
            useNativeDriver={true}
            date={date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="Date of birth"
            format="DD-MM-YYYY"
            minDate="01-01-1940"
            maxDate="01-01-2003"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 2,
                top: 4,
                marginLeft: 0.2,
              },
              dateInput: {
                marginLeft: 0,
                borderWidth: 0,
              },
            }}
            onDateChange={(date) => {
              setDate(date);
            }}
          />
        </View>
      </View>
      <Text style={styles.genderTxt}> im a:</Text>
      <View style={styles.genderPickContainer}>
        
        <TouchableOpacity
          onPress={() => setGender('men')}>
          <View style={styles.allGender}>
            <Image
              source={require('../../Images/superhero.png')}
              style={[gender == 'men' ? styles.selectedGander : {}, styles.genderImage]}

            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setGender('women')}>
          <View style={styles.allGender}>
            <Image
              source={require('../../Images/wonder-woman.png')}
              style={[gender == 'women' ? styles.selectedGander : {},styles.genderImage]}
            />
          </View>
        </TouchableOpacity>

      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateUser} >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView >
  )
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
  },
  selectedGander:
  {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 28,
  

  },
  allGender:
  {
    flex: 1,
    paddingTop: Dimensions.get('window').width * 0.08,
  },
  genderTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: Dimensions.get('window').height * 0.05,

  },
  imageContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    alignItems: 'center',
    flex: 3,
  },
  genderPickContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    //backgroundColor:'red',
    width: Dimensions.get('window').width * 0.85,
  },
  genderImage: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').width * 0.3,
    resizeMode: 'contain',
    // marginHorizontal: Dimensions.get('window').width * 0.06,
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,

  },
  datePickerStyle: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').width * 0.14,
    justifyContent: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 16,
    
    
    alignItems: 'center',
    alignItems: 'left',

  },

  birthDateContainer: {
    marginTop: Dimensions.get('window').width * 0.012,
    

  },

  image: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').width * 0.85,
    resizeMode: 'contain',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: Dimensions.get('window').width * 0.03,
    margin: Dimensions.get('window').width * 0.02,
    alignItems: 'left',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: Dimensions.get('window').width * 0.13,
  },
  button: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 15,
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  firstNameInput: {

    width: Dimensions.get('window').width * 0.85,
  },
  lastNameInput: {


    width: Dimensions.get('window').width * 0.85,
  },
});
