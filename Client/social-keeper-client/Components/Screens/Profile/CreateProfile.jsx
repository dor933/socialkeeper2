import { View, Text, SafeAreaView, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Input } from '@rneui/themed';
import DatePickerComponent from '../../CompsToUse/DatePickerComponent';
import { Button } from '@rneui/themed';



export default function CreateProfile() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image style={styles.logo} source={require('../../../assets/Images/RandomImages/social-keeper-low-resolution-logo-color-on-transparent-background.png')} />
      <Text style={styles.text}>Create Your Profile</Text>

      {/* To insert avatar image - must use matirial UI or something equal .. */}

      {/* UserName - must use matirial UI or something equal .. */}
      <View style={styles.userName}>
        <Input
          placeholder='User name'
          leftIcon={{ type: 'font-awesome', name: 'user' }}
        />
      </View>
      {/* Birth date - must use matirial UI or something equal ..  */}
      <View style={styles.birthdayDate}>
        <DatePickerComponent></DatePickerComponent>
      </View>

      {/* Gender - must use matirial UI or something equal ..  */}
      <View style={styles.gender}>
        <Input
          placeholder='Gender'
          leftIcon={{ type: 'font-awesome', name: 'venus-mars' }}
          style={styles.icons}
        />
      </View>

      {/* Address? - to check if relevant - must use matirial UI or something equal ..  */}
      <View>
      <View style={styles.address}>
        <Input
          placeholder='Address'
          leftIcon={{ type: 'font-awesome', name: 'map' }}
          style={styles.icons}
        />
      </View>

      </View>
      <Button
        title="Confirm"
        // loading={false}
        // loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: '#E04747',
          borderRadius: 25,
          shadowOpacity: 0.05,
          shadowRadius: 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
        }}
        titleStyle={{  fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0.1}}
        containerStyle={{
          marginHorizontal: 50,
          width: 200,
          height: 60,
          marginVertical: 10,
          top:650,
          left:50
        }}
        onPress={() => Alert.alert('Confirm button pressed')}
      />
    </SafeAreaView>
  )
}


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
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    letterSpacing: 0.03,
    color: '#E04747',
  },

  //CSS for user name 
  userName: {
    position: 'absolute',
    width: 313,
    height: 61,
    left: 59,
    top: 350
  },

  //CSS for birthday date
  birthdayDate: {
    position: 'absolute',
    width: 313,
    height: 61,
    left: 56,
    top: 420
  },

  //CSS for gender 
  gender: {
    position: 'absolute',
    width: 313,
    height: 61,
    left: 56,
    top: 470
  },
  //CSS for address
  address: {
    position: 'absolute',
    width: 313,
    height: 61,
    left: 56,
    top: 530
  },
  confirmBtn: {
    width: 174,
    height: 60,
    backgroundColor: '#E04747',
  },
});