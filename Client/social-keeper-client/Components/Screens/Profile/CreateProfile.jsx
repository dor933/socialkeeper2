import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native'
import React from 'react'
import Box from '@mui/material/Box';




const CreateProfile = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />
      <Text style={styles.text}>Create Your Profile</Text>

      {/* To insert avatar image - must use matirial UI or something equal .. */}



      
      {/* UserName - must use matirial UI or something equal .. */}
      <View>
      </View>
      {/* Birthday date - must use matirial UI or something equal ..  */}
      <View></View>
      {/* Gender - must use matirial UI or something equal ..  */}
      <View></View>
      {/* Address? - to check if relevant - must use matirial UI or something equal ..  */}
      <View></View>
    </SafeAreaView>
  )
}

export default CreateProfile



const styles = StyleSheet.create({
  //CSS for the SafeAreaView
  safeArea: {
    position: 'relative',
    width: 430,
    height: 932,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  //CSS for the logo image
  logo: {
    position: 'absolute',
    width: 295,
    height: 155,
    left: 60,
    top: 126,
  },
  //CSS for the title text
  text: {
    position: 'absolute',
    width: 220,
    height: 29,
    left: 95,
    top: 299,
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    letterSpacing: 0.03,
    color: '#E04747',
  },
});