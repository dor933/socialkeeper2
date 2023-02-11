import { Image, Keyboard, LayoutAnimation, View, Text, TextInput, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from './ImagePickerExample ';
import DatePicker from 'react-native-datepicker';

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
  const [date, setDate] = useState('2016-05-15');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 200,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.325 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 200,
            useNativeDriver: true,
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
    Alert.alert('User created successfully');
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
          <View />
          <View>
            <TextInput
              style={[styles.input, styles.lastNameInput]}
              placeholder="Last Name"
              onChangeText={(value) => handleInputChange('lastName', value)}
            />
          </View>
          <View style={styles.birthDateContainer}>
          <DatePicker
          style={styles.datePickerStyle}
          date={date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
          format="DD-MM-YYYY"
          minDate="01-01-2016"
          maxDate="01-01-2019"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              //display: 'none',
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
          }}
          onDateChange={(date) => {
            setDate(date);
          }}
        />


          </View>
        </View>





        <TouchableOpacity style={styles.button} onPress={handleCreateUser} >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>



    </SafeAreaView>
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
  birthDateContainer: {
    // flexDirection: 'row',
    // width: Dimensions.get('window').width * 0.85,
    // padding: 10,
    // margin: 10,
    // alignItems: 'left',
    // borderRadius: 16,
    // borderWidth: 1,
    // backgroundColor: '#F5F5F5',
    // borderColor: 'lightgray',
    // shadowColor: '#000',
    // height: 45,
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    alignItems: 'center',
    flex: 6,
  },
  imageContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').width * 0.85,
    resizeMode: 'contain',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: 10,
    margin: 10,
    alignItems: 'left',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
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
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstNameInput: {
    paddingVertical: Dimensions.get('window').height * 0.028,
    width: Dimensions.get('window').width * 0.85,
  },
  lastNameInput: {
    paddingVertical: Dimensions.get('window').height * 0.028,

    width: Dimensions.get('window').width * 0.85,
  },
});
