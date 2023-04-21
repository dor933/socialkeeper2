import { View, Text, StyleSheet,SafeAreaView } from 'react-native'
import React from 'react'
import Customheader from '../../CompsToUse/Customheader'


export default function PreviousMeetingsScreen() {
  return (
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
      <Customheader/>
    </View>
    </SafeAreaView>
  )
}

const styles= StyleSheet.create({
  areaviewcontainter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  container:{
    backgroundColor: '#ffffff',
    flex:1,
    marginTop:40
  }

  
})