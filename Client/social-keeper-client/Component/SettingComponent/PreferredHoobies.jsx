
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, LayoutAnimation,Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import StarsRatingComp from '../HelpComponent/StarsRatingComp'

const hobbiesAndImages = [
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },
  {
    "Movie": require('../../Images/Hoobies/Movie.jpeg')
  }
  ,
  { "Resturant": require('../../Images/Hoobies/Resturant.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Resturant": require('../../Images/Hoobies/Resturant.jpeg') },
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Movie": require('../../Images/Hoobies/Movie.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },

]//temporarily for testing purposes only, will be replaced with a call to the server

export default function PreferredHoobies({ navigation}, props) {
  //will be an array of hobbies and the rate that the user selecte for each one of them (1-5),example: [{Basketball: 3}, {Gym: 5}, {Coffie: 1}],
  //it will came from the server if the user already exist in the DB, or will be empty if it is a new user
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [selectCurrentHobby, setSelectCurrentHobby] = useState(null)//will be the hobby that the user pressed on
  const [rate, setRate] = useState(0)//will be the rate that the user selected for the current hobby

  const [animation, setAnimation] = useState({});

  const onHobbyPress = (hobby) => {
    setSelectCurrentHobby(hobby)
    const selectedRate = selectedHobbies.find(selectedHobby => Object.keys(selectedHobby)[0] === hobby)?.[hobby];
  }
  const onRateHobby = (rate) => {
    setRate(rate)

    //check if the hobby is already in the array, if so, replace the rate
    for (let i = 0; i < selectedHobbies.length; i++) {
      if (Object.keys(selectedHobbies[i])[0] == selectCurrentHobby) {
        selectedHobbies[i] = { [selectCurrentHobby]: rate }
        return
      }
    }
    //if the hobby is not in the array, add it
    selectedHobbies.push({ [selectCurrentHobby]: rate })
    console.log(selectedHobbies)
  }
  //function for save the selected hobbies to the DB
  const PreferredHoobies = () => {
    console.log('save to db');
    //ask the user if he wants to save the data or not
    Alert.alert(
        'Save the preferred hobbies?',
        'Are you sure you want to save the preferred hobbies?',
        [
            {
                text: 'Yes', onPress: () => {
                    //send selectedDays array to the server to save it in the database
                    //after saving the data, we will navigate to the settings screen or to the next setting screen if it is a new user
                    navigation.navigate('Personal');//כרגע מנווט חזרה רק למסך הגדרות, כשנבנה את תהליך ההרשמה נעבור למסך הבא בתהליך ההרשמה
                }
            },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
        ],
        { cancelable: false },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer} >
        <Image
          style={styles.logo}
          source={require('../../Images/social-keeper-low-resolution-logo-color-on-transparent-background.png')}
        />
      </View>
      <View style={styles.descContainer}>
        <Text style={styles.descText}>Choose at least 4 favorite hobbies</Text>
      </View>
      <View style={styles.hobbiesContainer}>
        <FlatList
          data={hobbiesAndImages}
          numColumns={2}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => (
            <View >
              <TouchableOpacity
                style={styles.hobbyButton}
                onPress={() => onHobbyPress(Object.keys(item)[0])}
              >
                <View style={selectedHobbies.find(hobby => Object.keys(hobby)[0] === Object.keys(item)[0]) ? styles.sellectedHobbyView : selectCurrentHobby == Object.keys(item)[0] ? styles.sellectedHobbyView :
                  styles.hobbyView}
                >
                  <Text style={styles.hobbieTxt}>{Object.keys(item)[0]}</Text>
                  <Image
                    style={styles.hobbyImage}
                    source={Object.values(item)[0]}
                  />
                </View>
              </TouchableOpacity>
              {
                //if the user selected the current hobby, show the stars rating component to rate it, and if he already rated it, show the rating 
                selectCurrentHobby == Object.keys(item)[0] ?
                  <StarsRatingComp
                    rate={selectedHobbies.find(hobby => Object.keys(hobby)[0] === Object.keys(item)[0])?.[Object.keys(item)[0]]}
                    onRateHobby={onRateHobby}
                  /> : selectedHobbies.find(hobby => Object.keys(hobby)[0] === Object.keys(item)[0]) ?
                    <StarsRatingComp rate={selectedHobbies.find(hobby => Object.keys(hobby)[0] === Object.keys(item)[0])?.[Object.keys(item)[0]]} />
                    : null
              }
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {selectedHobbies.length >= 3 ?
        //in the future, we will slide this view when it appears   
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={PreferredHoobies}
          >
            <Text style={styles.nextButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').height * 0.2,
    resizeMode: 'contain',
  },
  logoContainer: {
    flex: 1.6,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: Dimensions.get('window').height * 0.018,
  },
  logoText: {
    fontSize: Dimensions.get('window').height * 0.022,
    color: 'black',
    textAlign: 'center',
    marginVertical: Dimensions.get('window').width * 0.05,
  },
  descContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descText: {
    fontSize: Dimensions.get('window').height * 0.022,
    color: 'black',
    textAlign: 'center',
    marginVertical: Dimensions.get('window').width * 0.05,
  },
  hobbiesContainer: {
    flex: 6,
    //alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 1,
  },
  nextButtonContainer: {
    //slide the view up
    flex: 0.79,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#F95F6B',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.058,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: Dimensions.get('window').height * 0.022,
  },
  contentContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 1,
    justifyContent: 'space-between',
  },
  hobbyView: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').height * 0.13,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    marginVertical: Dimensions.get('window').height * 0.04,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Dimensions.get('window').width * 0.06,
    shadowColor: '#000000',
    shadowOffset: { width: 0.8, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1.8,
  },
  sellectedHobbyView: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').height * 0.13,
    backgroundColor: '#BB3F3F',
    borderRadius: 10,
    marginVertical: Dimensions.get('window').height * 0.04,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Dimensions.get('window').width * 0.06,
    shadowColor: '#000000',
    shadowOffset: { width: 0.8, height: 2.5 },
    shadowOpacity: 0.8,
    shadowRadius: 1.8,
  },
  hobbyButton: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').height * 0.09,
    borderRadius: 10,
    marginVertical: Dimensions.get('window').height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Dimensions.get('window').width * 0.06,
  },
  hobbyImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  hobbieTxt: {
    fontSize: Dimensions.get('window').height * 0.02,
    fontWeight: 'bold',
    marginTop: Dimensions.get('window').height * 0.004,
    textAlign: 'center',
  },
})

