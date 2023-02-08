import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet,Dimensions } from 'react-native'
import React, { useState } from 'react'


const hobbies = ['Sports', 'Music', 'Theater', 'Comedy', 'Art', 'Travel', 'Movies', 'Food', 'Fashion', 'Gaming']//temporary list of hobbies, in the future we will get this list from the server!!

export default function PreferredHoobies() {
  return (
    <View >
      <View style={styles.logoContainer} >
        {/* //social-keeper-low-resolution-logo-color-on-transparent-background.png */}
        <Image
          style={styles.logo}
          source={require('../../Images/social-keeper-low-resolution-logo-color-on-transparent-background.png')}
        />
      </View>
      <View style={styles.descContainer}>
        <Text style={styles.descText}>Choose at least 3 favorite hobbies</Text>
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
  },
  logo : {
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
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
})