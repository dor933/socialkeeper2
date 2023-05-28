import { View, Text,StyleSheet,SafeAreaView } from 'react-native'
import { useState,useContext,useEffect } from 'react';
import Customheader from '../../CompsToUse/Customheader'
import FavoriteContacts from '..//Settings/FavoriteContacts'
import { RegistContext } from '../../../RegistContext'
import { MainAppcontext } from '..//MainApp/MainAppcontext'



export default function FutureMeetingScreen() {
  const {user, setUser} = useContext(MainAppcontext);
  const {selectedhobbies, setSelectedHobbies} = useContext(RegistContext);
  const {personalDetails, setPersonalDetails} = useContext(RegistContext);

  useEffect(() => {
    setSelectedHobbies(user.tblUserHobbiesDTO)
    //set personal details phoneNum1 field
    setPersonalDetails({...personalDetails, phoneNumber: user.phoneNum1})
  }, [])
  return (
    <SafeAreaView style={styles.areaviewcontainter}>
    <View style={styles.container}>
      <Customheader/>
      <FavoriteContacts isfrommainapp={true} />
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
    marginTop:40,
    alignContent:'center',
    alignItems:'center',
  }

  
})