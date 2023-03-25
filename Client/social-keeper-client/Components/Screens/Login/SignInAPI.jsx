import React from 'react'
import { SafeAreaView, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native'

function SignInAPI() {


  return (

    <SafeAreaView style={styles.safeArea}>
      <View style={styles.elipseTop}></View>

      {/* Sign In text */}
      <Text style={styles.text}>Sign In</Text>
      <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />

      {/* Login with google button - to check if put in component? */}
      <TouchableOpacity>
        <View style={styles.container}>
          <Image style={styles.googleLogo} source={require('../../../assets/Images/Logos/GoogleLogo.png')} ></Image>
          <Text style={styles.textForButton}>Use Google</Text>
        </View>
      </TouchableOpacity>

      {/* Login with outlook button - to check if put in component? */}
      <TouchableOpacity>
        <View style={styles.container2}>
          <Image style={styles.outLookLogo} source={require('../../../assets/Images/Logos/OutlookLogo.png')} ></Image>
          <Text style={styles.textForButton}>Use Outlook</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.elipseButtom}></View>
    </SafeAreaView>
  )
}

export default SignInAPI





const styles = StyleSheet.create({

  //connect text
  text: {
    position: 'absolute',
    width: 141,
    height: 28,
    left: 125,
    top: 353,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
    letterSpacing: 0.03,
    color: '#E04747',
  },

  //Container for google button
  container2: {
    position: 'absolute',
    width: 306,
    height: 64,
    left: 50,
    top: 500,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    borderRadius: 20,
  },

  //Container for outlook button
  container: {
    position: 'absolute',
    width: 306,
    height: 64,
    left: 50,
    top: 400,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    borderRadius: 20,
  },

  //Container for safe area
  safeArea: {
    position: 'relative',
    width: 430,
    height: 932,
    backgroundColor: '#FFF1F1',
    borderRadius: 50,
  },


  //Text for google button
  textForButton: {
    position: 'absolute',
    width: 127,
    height: 19,
    left: 105,
    top: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.4)',
  },

  //Text for sign up suggestion
  refToSignIn: {
    position: 'absolute',
    width: 195,
    height: 19,
    left: 110,
    top: 600,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  //CSS for logo
  logo: {
    position: 'absolute',
    width: 295,
    height: 155,
    left: 60,
    top: 126,
  },
  //CSS for elipse on buttom
  elipseButtom: {
    position: 'absolute',
    width: 505,
    height: 364,
    left: 100,
    top: 650,
    borderRadius: 200,
    backgroundColor: '#FFAEAE',
  },

  //CSS for elipse on top
  elipseTop: {
    position: 'absolute',
    width: 380,
    height: 364,
    left: -212,
    top: -227,
    borderRadius: 200,
    backgroundColor: '#FFAEAE',
  },

  //CSS for outlook logo
  outLookLogo: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 16,
    left: 16,
  },

  //CSS for google logo
  googleLogo: {
    position: 'absolute',
    width: 37,
    height: 36,
    top: 14,
    left: 14,
  }
});