
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useState } from 'react'

const hobbiesAndImages = [
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },
  {
    "Basketball": require('../../Images/Hoobies/Basketballl.jpeg')
  }
  ,
  { "Gym": require('../../Images/Hoobies/Gym.jpeg') },
  { "Coffie": require('../../Images/Hoobies/Coffie.jpeg') },

]//temporarily for testing purposes only, will be replaced with a call to the server

export default function PreferredHoobies() {
  const [selectedHobbies, setSelectedHobbies] = useState({})

  const onHobbyPress = hobby => {
    setSelectedHobbies({
      ...selectedHobbies,
      [hobby]: !selectedHobbies[hobby],
    })
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
            <TouchableOpacity
              style={styles.hobbyButton}
              onPress={() => onHobbyPress(Object.keys(item)[0])}
            >
              <View style={styles.hobbyView}>
                <Text style={styles.hobbieTxt}>{Object.keys(item)[0]}</Text>
                <Image
                  style={styles.hobbyImage}
                  source={Object.values(item)[0]}
                />
              </View>
            </TouchableOpacity>

          )}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
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
    width: Dimensions.get('window').width * 0.63,
    height: Dimensions.get('window').height * 0.2,
    resizeMode: 'contain',
  },
  logoContainer: {
    flex: 1.65,
    alignItems: 'center',
  },
  logoText: {
    fontSize: Dimensions.get('window').height * 0.022,
    color: 'black',
    textAlign: 'center',
    marginVertical: Dimensions.get('window').width * 0.05,
  },

  descContainer: {
    flex: 1,
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
  contentContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 1,
    justifyContent: 'space-between',

  },


  hobbyView: {
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

